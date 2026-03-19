import type { PeriodAxis } from "../core/period-axis";
import type {
  RevenueLine,
  RevenueMetric,
  RevenueOverride,
} from "../schemas/input-schema";
import type {
  AnnualValue,
  AppliedRevenueOverride,
  MonthlyValue,
  RevenueLineAnnualValue,
  RevenueLineItem,
  RevenueLineMonthlyValue,
  RevenueMetricSeries,
} from "../schemas/output-schema";

export type ResolvedRevenueLine = RevenueLine & {
  lineKey: string;
};

export type ResolvedRevenueOverride = RevenueOverride & {
  lineKey: string;
  overrideKey: string;
};

export function resolveRevenueInputs(
  lines: RevenueLine[],
  overrides: RevenueOverride[],
) {
  const resolvedLines = lines.map((line, index) => ({
    ...line,
    lineKey: line.lineKey ?? `revenue-line-${line.sortOrder}-${index + 1}`,
  }));
  const lineKeys = new Set(resolvedLines.map((line) => line.lineKey));

  const resolvedOverrides = overrides.flatMap((override, index) => {
    const inferredLineKey =
      override.lineKey ?? (resolvedLines.length === 1 ? resolvedLines[0]?.lineKey : undefined);

    if (!inferredLineKey || !lineKeys.has(inferredLineKey)) {
      return [];
    }

    return [
      {
        ...override,
        lineKey: inferredLineKey,
        overrideKey:
          override.overrideKey ??
          `${inferredLineKey}:${override.monthIndex}:${override.metric}:${index + 1}`,
      },
    ];
  });

  return { resolvedLines, resolvedOverrides };
}

export function isRevenueLineActive(
  line: RevenueLine,
  monthIndex: number,
) {
  const effectiveEndMonth = line.endMonthIndex ?? 36;

  return (
    line.isActive &&
    monthIndex >= line.startMonthIndex &&
    monthIndex <= effectiveEndMonth
  );
}

export function getRevenueGrowthRate(
  line: RevenueLine,
  monthIndex: number,
) {
  if (monthIndex <= 12) {
    const quarter = Math.floor((monthIndex - 1) / 3) + 1;

    switch (quarter) {
      case 1:
        return line.q1MonthlyGrowth;
      case 2:
        return line.q2MonthlyGrowth;
      case 3:
        return line.q3MonthlyGrowth;
      default:
        return line.q4MonthlyGrowth;
    }
  }

  if (monthIndex <= 24) {
    return line.year2MonthlyGrowth;
  }

  return line.year3MonthlyGrowth;
}

export function createRevenueOverrideLookup(
  overrides: ResolvedRevenueOverride[],
) {
  return new Map(
    overrides
      .filter((override) => override.isActive)
      .map((override) => [
        getRevenueOverrideMapKey(
          override.lineKey,
          override.monthIndex,
          override.metric,
        ),
        override,
      ]),
  );
}

export function getRevenueOverrideMapKey(
  lineKey: string,
  monthIndex: number,
  metric: RevenueMetric,
) {
  return `${lineKey}:${monthIndex}:${metric}`;
}

export function buildMonthlyValueSeries(
  axis: PeriodAxis,
  values: number[],
): MonthlyValue[] {
  return axis.periods.map((period, index) => ({
    monthIndex: period.monthIndex,
    label: period.label,
    value: values[index] ?? 0,
  }));
}

export function buildAnnualValueSeries(
  axis: PeriodAxis,
  values: number[],
): AnnualValue[] {
  return [1, 2, 3].map((yearBucket) => ({
    yearBucket,
    label: `Year ${yearBucket}`,
    value: axis.periods.reduce((total, period, index) => {
      if (period.yearBucket !== yearBucket) {
        return total;
      }

      return total + (values[index] ?? 0);
    }, 0),
  }));
}

export function buildRevenueMetricSeries(
  axis: PeriodAxis,
  values: number[],
): RevenueMetricSeries {
  return {
    monthly: buildMonthlyValueSeries(axis, values),
    annual: buildAnnualValueSeries(axis, values),
  };
}

export function buildRevenueLineAnnualValues(
  axis: PeriodAxis,
  monthly: RevenueLineMonthlyValue[],
): RevenueLineAnnualValue[] {
  return [1, 2, 3].map((yearBucket) => {
    const months = monthly.filter(
      (_month, index) => axis.periods[index]?.yearBucket === yearBucket,
    );

    return {
      yearBucket,
      label: `Year ${yearBucket}`,
      units: months.reduce((total, month) => total + month.units, 0),
      sales: months.reduce((total, month) => total + month.sales, 0),
      cogs: months.reduce((total, month) => total + month.cogs, 0),
      margin: months.reduce((total, month) => total + month.margin, 0),
    };
  });
}

export function buildZeroRevenueMonth(
  monthIndex: number,
  label: string,
): RevenueLineMonthlyValue {
  return {
    monthIndex,
    label,
    units: 0,
    sales: 0,
    cogs: 0,
    margin: 0,
    appliedOverrides: [],
  };
}

export function createAppliedRevenueOverride(
  override: ResolvedRevenueOverride,
  line: ResolvedRevenueLine,
  label: string,
): AppliedRevenueOverride {
  return {
    overrideKey: override.overrideKey,
    lineKey: line.lineKey,
    lineName: line.name,
    monthIndex: override.monthIndex,
    label,
    metric: override.metric,
    overrideValue: override.overrideValue,
    reason: override.reason,
    source: override.source,
  };
}

export function collectRevenueMetricValues(
  lineItems: RevenueLineItem[],
  metric: RevenueMetric,
) {
  return Array.from({ length: 36 }, (_unused, index) =>
    lineItems.reduce((total, line) => total + line.monthly[index][metric], 0),
  );
}
