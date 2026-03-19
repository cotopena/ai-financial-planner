import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import type { RevenueSectionPayload } from "../schemas/output-schema";
import {
  buildRevenueLineAnnualValues,
  buildRevenueMetricSeries,
  buildZeroRevenueMonth,
  collectRevenueMetricValues,
  createAppliedRevenueOverride,
  createRevenueOverrideLookup,
  getRevenueGrowthRate,
  getRevenueOverrideMapKey,
  isRevenueLineActive,
  resolveRevenueInputs,
} from "./revenue-helpers";

export function calculateRevenue(
  input: NormalizedScenarioInput,
  axis: PeriodAxis,
): RevenueSectionPayload {
  const { resolvedLines, resolvedOverrides } = resolveRevenueInputs(
    input.revenueLines,
    input.revenueOverrides,
  );
  const overrideLookup = createRevenueOverrideLookup(resolvedOverrides);

  const lineItems = resolvedLines.map((line) => {
    let previousUnits: number | null = null;

    const monthly = axis.periods.map((period) => {
      if (!isRevenueLineActive(line, period.monthIndex)) {
        return buildZeroRevenueMonth(period.monthIndex, period.label);
      }

      let units =
        previousUnits === null
          ? line.month1Units
          : period.monthIndex === 13 || period.monthIndex === 25
            ? previousUnits
            : previousUnits * (1 + getRevenueGrowthRate(line, period.monthIndex));
      const appliedOverrides = [];

      const unitsOverride = overrideLookup.get(
        getRevenueOverrideMapKey(line.lineKey, period.monthIndex, "units"),
      );

      if (unitsOverride) {
        units = unitsOverride.overrideValue;
        appliedOverrides.push(
          createAppliedRevenueOverride(unitsOverride, line, period.label),
        );
      }

      let sales = units * line.pricePerUnit;
      const salesOverride = overrideLookup.get(
        getRevenueOverrideMapKey(line.lineKey, period.monthIndex, "sales"),
      );

      if (salesOverride) {
        sales = salesOverride.overrideValue;
        appliedOverrides.push(
          createAppliedRevenueOverride(salesOverride, line, period.label),
        );
      }

      let cogs = units * line.cogsPerUnit;
      const cogsOverride = overrideLookup.get(
        getRevenueOverrideMapKey(line.lineKey, period.monthIndex, "cogs"),
      );

      if (cogsOverride) {
        cogs = cogsOverride.overrideValue;
        appliedOverrides.push(
          createAppliedRevenueOverride(cogsOverride, line, period.label),
        );
      }

      let margin = sales - cogs;
      const marginOverride = overrideLookup.get(
        getRevenueOverrideMapKey(line.lineKey, period.monthIndex, "margin"),
      );

      if (marginOverride) {
        margin = marginOverride.overrideValue;
        appliedOverrides.push(
          createAppliedRevenueOverride(marginOverride, line, period.label),
        );
      }

      previousUnits = units;

      return {
        monthIndex: period.monthIndex,
        label: period.label,
        units,
        sales,
        cogs,
        margin,
        appliedOverrides,
      };
    });

    return {
      lineKey: line.lineKey,
      sortOrder: line.sortOrder,
      name: line.name,
      unitLabel: line.unitLabel,
      pricePerUnit: line.pricePerUnit,
      cogsPerUnit: line.cogsPerUnit,
      startMonthIndex: line.startMonthIndex,
      endMonthIndex: line.endMonthIndex,
      isActive: line.isActive,
      monthly,
      annual: buildRevenueLineAnnualValues(axis, monthly),
    };
  });

  const totals = {
    units: buildRevenueMetricSeries(
      axis,
      collectRevenueMetricValues(lineItems, "units"),
    ),
    sales: buildRevenueMetricSeries(
      axis,
      collectRevenueMetricValues(lineItems, "sales"),
    ),
    cogs: buildRevenueMetricSeries(
      axis,
      collectRevenueMetricValues(lineItems, "cogs"),
    ),
    margin: buildRevenueMetricSeries(
      axis,
      collectRevenueMetricValues(lineItems, "margin"),
    ),
  };
  const appliedOverrides = lineItems.flatMap((line) =>
    line.monthly.flatMap((month) => month.appliedOverrides),
  );
  const notes = [];

  if (lineItems.length === 0) {
    notes.push("No revenue lines are configured for this scenario.");
  }

  if (appliedOverrides.length > 0) {
    notes.push(`${appliedOverrides.length} revenue override(s) applied.`);
  }

  return {
    sectionKey: "revenue",
    monthly: totals.sales.monthly,
    annual: totals.sales.annual,
    notes,
    lineItems,
    totals,
    appliedOverrides,
  };
}
