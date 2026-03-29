import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import type {
  DepreciationAnnualValue,
  DepreciationBasisEntry,
  DepreciationItem,
  DepreciationMonthlyValue,
  DepreciationSectionPayload,
} from "../schemas/output-schema";
import {
  buildMonthlyValueSeries,
  buildStraightLineSchedule,
  buildValueSeries,
  buildYearBucketRows,
  sanitizeNumber,
  sumBy,
  type StraightLineBasisEntry,
} from "./helpers";

type OpeningAsset = NormalizedScenarioInput["openingAssets"][number];
type CapexLine = NormalizedScenarioInput["capexLines"][number];
type CapexMonth = NormalizedScenarioInput["capexMonths"][string][number];

function resolveCapexMonths(
  input: NormalizedScenarioInput,
  line: CapexLine,
  index: number,
): CapexMonth[] {
  if (line.lineKey && input.capexMonths[line.lineKey]) {
    return input.capexMonths[line.lineKey] ?? [];
  }

  const fallbackKey = Object.keys(input.capexMonths)[index];

  return fallbackKey ? (input.capexMonths[fallbackKey] ?? []) : [];
}

function buildOpeningAssetBasisEntries(
  axis: PeriodAxis,
  asset: OpeningAsset,
): DepreciationBasisEntry[] {
  return asset.amount > 0
    ? [
        {
          monthIndex: 1,
          label: axis.periods[0]?.label ?? "Month 1",
          amount: asset.amount,
          source: "opening-balance",
        },
      ]
    : [];
}

function buildCapexBasisEntries({
  axis,
  line,
  monthRows,
}: {
  axis: PeriodAxis;
  line: CapexLine;
  monthRows: CapexMonth[];
}): DepreciationBasisEntry[] {
  const explicitByMonth = new Map<number, number>();

  for (const month of monthRows) {
    explicitByMonth.set(
      month.monthIndex,
      (explicitByMonth.get(month.monthIndex) ?? 0) + month.amount,
    );
  }

  const explicitEntries: DepreciationBasisEntry[] = axis.periods
    .filter((period) => explicitByMonth.has(period.monthIndex))
    .map((period) => ({
      monthIndex: period.monthIndex,
      label: period.label,
      amount: sanitizeNumber(explicitByMonth.get(period.monthIndex) ?? 0),
      source: "explicit-month",
    }));

  // Explicit month rows take precedence for a year bucket. The fallback only
  // applies when that year has no explicit month timing at all.
  const buildFallbackEntries = (
    yearBucket: 2 | 3,
    annualAmount: number,
    source: "year2-fallback" | "year3-fallback",
  ) => {
    if (annualAmount <= 0) {
      return [];
    }

    const hasExplicitMonth = explicitEntries.some(
      (entry) =>
        axis.periods[entry.monthIndex - 1]?.yearBucket === yearBucket,
    );

    if (hasExplicitMonth) {
      return [];
    }

    const yearPeriods = axis.periods.filter(
      (period) => period.yearBucket === yearBucket,
    );
    const monthlyAmount = annualAmount / yearPeriods.length;

    return yearPeriods.map((period) => ({
      monthIndex: period.monthIndex,
      label: period.label,
      amount: sanitizeNumber(monthlyAmount),
      source,
    }));
  };

  return explicitEntries
    .concat(buildFallbackEntries(2, line.year2AnnualAmount, "year2-fallback"))
    .concat(buildFallbackEntries(3, line.year3AnnualAmount, "year3-fallback"))
    .sort((left, right) => left.monthIndex - right.monthIndex);
}

function buildAnnualRows(
  axis: PeriodAxis,
  monthly: DepreciationMonthlyValue[],
): DepreciationAnnualValue[] {
  return buildYearBucketRows({
    axis,
    createRow: ({ yearBucket, label, monthIndexes }) => {
      const bucketRows = monthIndexes.map((monthIndex) => monthly[monthIndex - 1]);
      const finalMonthIndex = monthIndexes[monthIndexes.length - 1] ?? 1;

      return {
        yearBucket,
        label,
        expense: sumBy(bucketRows, (row) => row?.expense ?? 0),
        endingBookValue: sanitizeNumber(
          monthly[finalMonthIndex - 1]?.endingBookValue ?? 0,
        ),
      };
    },
  });
}

function buildDepreciationItem({
  axis,
  itemKey,
  sortOrder,
  sourceType,
  category,
  originalAmount,
  depreciationYears,
  acquisitionSchedule,
}: {
  axis: PeriodAxis;
  itemKey: string;
  sortOrder: number;
  sourceType: "opening-asset" | "capex";
  category: string;
  originalAmount: number;
  depreciationYears: number;
  acquisitionSchedule: DepreciationBasisEntry[];
}): DepreciationItem {
  const schedule = buildStraightLineSchedule({
    axis,
    lifeMonths: depreciationYears * 12,
    basisEntries: acquisitionSchedule.map<StraightLineBasisEntry>((entry) => ({
      monthIndex: entry.monthIndex,
      amount: entry.amount,
    })),
  });
  const monthly = axis.periods.map<DepreciationMonthlyValue>((period, index) => ({
    monthIndex: period.monthIndex,
    label: period.label,
    expense: schedule.expenseValues[index] ?? 0,
    endingBookValue: schedule.endingBalanceValues[index] ?? 0,
  }));

  return {
    itemKey,
    sortOrder,
    sourceType,
    category,
    originalAmount,
    depreciationYears,
    acquisitionSchedule,
    monthly,
    annual: buildAnnualRows(axis, monthly),
  };
}

export function calculateDepreciation(
  input: NormalizedScenarioInput,
  axis: PeriodAxis,
): DepreciationSectionPayload {
  const notes = [];
  const items: DepreciationItem[] = [];

  for (const [index, asset] of input.openingAssets.entries()) {
    if (
      asset.amount <= 0 ||
      asset.category === "land" ||
      asset.depreciationYears === undefined ||
      asset.depreciationYears <= 0
    ) {
      continue;
    }

    const acquisitionSchedule = buildOpeningAssetBasisEntries(axis, asset);

    items.push(
      buildDepreciationItem({
        axis,
        itemKey: asset.assetKey ?? `opening-asset-${index + 1}`,
        sortOrder: index + 1,
        sourceType: "opening-asset",
        category: asset.category,
        originalAmount: asset.amount,
        depreciationYears: asset.depreciationYears,
        acquisitionSchedule,
      }),
    );
  }

  for (const [index, line] of input.capexLines.entries()) {
    const acquisitionSchedule = buildCapexBasisEntries({
      axis,
      line,
      monthRows: resolveCapexMonths(input, line, index),
    });
    const originalAmount = sumBy(acquisitionSchedule, (entry) => entry.amount);

    if (originalAmount <= 0 || line.depreciationYears <= 0) {
      continue;
    }

    items.push(
      buildDepreciationItem({
        axis,
        itemKey: line.lineKey ?? `capex-line-${index + 1}`,
        sortOrder: input.openingAssets.length + index + 1,
        sourceType: "capex",
        category: line.category,
        originalAmount,
        depreciationYears: line.depreciationYears,
        acquisitionSchedule,
      }),
    );
  }

  if (
    input.openingAssets.some(
      (asset) => asset.amount > 0 && asset.category === "land",
    )
  ) {
    notes.push("Land is excluded from depreciation schedules.");
  }

  if (
    items.some((item) =>
      item.acquisitionSchedule.some(
        (entry) =>
          entry.source === "year2-fallback" || entry.source === "year3-fallback",
      ),
    )
  ) {
    notes.push(
      "CapEx annual fallback timing was used where Year 2 or Year 3 month rows were absent.",
    );
  }

  if (items.length === 0) {
    notes.push("No depreciable opening assets or CapEx rows are configured.");
  }

  const expenseValues = axis.periods.map((period) =>
    sumBy(items, (item) => item.monthly[period.monthIndex - 1]?.expense ?? 0),
  );
  const endingBookValueValues = axis.periods.map((period) =>
    sumBy(
      items,
      (item) => item.monthly[period.monthIndex - 1]?.endingBookValue ?? 0,
    ),
  );
  const expenseSeries = buildValueSeries(axis, expenseValues);

  return {
    sectionKey: "depreciation",
    monthly: expenseSeries.monthly,
    annual: expenseSeries.annual,
    notes,
    items,
    totals: {
      expense: expenseSeries,
      endingBookValue: {
        monthly: buildMonthlyValueSeries(axis, endingBookValueValues),
        annual: buildYearBucketRows({
          axis,
          createRow: ({ yearBucket, label, monthIndexes }) => ({
            yearBucket,
            label,
            value: sanitizeNumber(
              endingBookValueValues[
                (monthIndexes[monthIndexes.length - 1] ?? 1) - 1
              ] ?? 0,
            ),
          }),
        }),
      },
    },
  };
}
