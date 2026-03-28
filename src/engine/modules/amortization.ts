import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import type {
  AmortizationAnnualValue,
  AmortizationItem,
  AmortizationMonthlyValue,
  AmortizationSectionPayload,
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

function buildAnnualRows(
  axis: PeriodAxis,
  monthly: AmortizationMonthlyValue[],
): AmortizationAnnualValue[] {
  return buildYearBucketRows({
    axis,
    createRow: ({ yearBucket, label, monthIndexes }) => {
      const bucketRows = monthIndexes.map((monthIndex) => monthly[monthIndex - 1]);
      const finalMonthIndex = monthIndexes[monthIndexes.length - 1] ?? 1;

      return {
        yearBucket,
        label,
        expense: sumBy(bucketRows, (row) => row?.expense ?? 0),
        endingBalance: sanitizeNumber(
          monthly[finalMonthIndex - 1]?.endingBalance ?? 0,
        ),
      };
    },
  });
}

export function calculateAmortization(
  input: NormalizedScenarioInput,
  axis: PeriodAxis,
): AmortizationSectionPayload {
  const amortizationYears = input.taxSettings.amortizationYears;
  const notes = [];
  const items: AmortizationItem[] = input.startupCosts
    .map((cost, index) => {
      if (cost.amount <= 0) {
        return null;
      }

      const schedule = buildStraightLineSchedule({
        axis,
        lifeMonths: amortizationYears * 12,
        basisEntries: [
          {
            monthIndex: 1,
            amount: cost.amount,
          } satisfies StraightLineBasisEntry,
        ],
      });
      const monthly = axis.periods.map<AmortizationMonthlyValue>(
        (period, monthIndex) => ({
          monthIndex: period.monthIndex,
          label: period.label,
          expense: schedule.expenseValues[monthIndex] ?? 0,
          endingBalance: schedule.endingBalanceValues[monthIndex] ?? 0,
        }),
      );

      return {
        itemKey: cost.costKey ?? `startup-cost-${index + 1}`,
        sortOrder: index + 1,
        category: cost.category,
        originalAmount: cost.amount,
        amortizationYears,
        monthly,
        annual: buildAnnualRows(axis, monthly),
      };
    })
    .filter((item): item is AmortizationItem => item !== null);

  if (items.length === 0) {
    notes.push("No startup costs are configured for amortization.");
  } else {
    notes.push(
      `Startup costs are amortized over ${sanitizeNumber(
        amortizationYears,
      )} year(s).`,
    );
  }

  const expenseValues = axis.periods.map((period) =>
    sumBy(items, (item) => item.monthly[period.monthIndex - 1]?.expense ?? 0),
  );
  const endingBalanceValues = axis.periods.map((period) =>
    sumBy(
      items,
      (item) => item.monthly[period.monthIndex - 1]?.endingBalance ?? 0,
    ),
  );
  const expenseSeries = buildValueSeries(axis, expenseValues);

  return {
    sectionKey: "amortization",
    monthly: expenseSeries.monthly,
    annual: expenseSeries.annual,
    notes,
    items,
    totals: {
      expense: expenseSeries,
      endingBalance: {
        monthly: buildMonthlyValueSeries(axis, endingBalanceValues),
        annual: buildYearBucketRows({
          axis,
          createRow: ({ yearBucket, label, monthIndexes }) => ({
            yearBucket,
            label,
            value: sanitizeNumber(
              endingBalanceValues[
                (monthIndexes[monthIndexes.length - 1] ?? 1) - 1
              ] ?? 0,
            ),
          }),
        }),
      },
    },
  };
}
