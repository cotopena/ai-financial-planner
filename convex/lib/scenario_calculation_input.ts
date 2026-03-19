import type { Doc } from "../_generated/dataModel";
import type { NormalizedScenarioInput } from "../../src/engine/schemas/input-schema";

type RecalcInputRecords = {
  business: Doc<"businesses">;
  scenario: Doc<"scenarios">;
  openingBalances: Doc<"opening_balances"> | null;
  revenueLines: Doc<"revenue_lines">[];
  revenueOverrides: Doc<"revenue_overrides">[];
};

export function buildScenarioCalculationInput(
  records: RecalcInputRecords,
): Partial<NormalizedScenarioInput> {
  return {
    business: {
      name: records.business.name,
      companyName: records.business.companyName,
      preparerName: records.business.preparerName,
      businessProfile: records.business.businessProfile,
      businessStage: records.business.businessStage,
      startMonth: records.business.startMonth,
      startYear: records.business.startYear,
      currencyCode: records.business.currencyCode,
      countryRegion: records.business.countryRegion,
      notes: records.business.notes,
    },
    scenario: {
      name: records.scenario.name,
      notes: records.scenario.notes,
      isBase: records.scenario.isBase,
      currentVersion: records.scenario.currentVersion,
    },
    openingBalances: records.openingBalances
      ? {
          cash: records.openingBalances.cash,
          accountsReceivable: records.openingBalances.accountsReceivable,
          prepaidExpenses: records.openingBalances.prepaidExpenses,
          accountsPayable: records.openingBalances.accountsPayable,
          accruedExpenses: records.openingBalances.accruedExpenses,
        }
      : {
          cash: 0,
          accountsReceivable: 0,
          prepaidExpenses: 0,
          accountsPayable: 0,
          accruedExpenses: 0,
        },
    revenueLines: records.revenueLines.map((line) => ({
      lineKey: String(line._id),
      sortOrder: line.sortOrder,
      name: line.name,
      unitLabel: line.unitLabel,
      month1Units: line.month1Units,
      pricePerUnit: line.pricePerUnit,
      cogsPerUnit: line.cogsPerUnit,
      q1MonthlyGrowth: line.q1MonthlyGrowth,
      q2MonthlyGrowth: line.q2MonthlyGrowth,
      q3MonthlyGrowth: line.q3MonthlyGrowth,
      q4MonthlyGrowth: line.q4MonthlyGrowth,
      year2MonthlyGrowth: line.year2MonthlyGrowth,
      year3MonthlyGrowth: line.year3MonthlyGrowth,
      startMonthIndex: line.startMonthIndex,
      endMonthIndex: line.endMonthIndex,
      isActive: line.isActive,
    })),
    revenueOverrides: records.revenueOverrides.map((override) => ({
      lineKey: String(override.revenueLineId),
      overrideKey: String(override._id),
      monthIndex: override.monthIndex,
      metric: override.metric as "units" | "sales" | "cogs" | "margin",
      overrideValue: override.overrideValue,
      reason: override.reason,
      source: override.source as "manual" | "ai_approved",
      isActive: override.isActive,
    })),
  };
}
