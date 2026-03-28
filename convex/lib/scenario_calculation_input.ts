import type { Doc } from "../_generated/dataModel";
import {
  createEmptyScenarioInput,
  type NormalizedScenarioInput,
} from "../../src/engine/schemas/input-schema";

type RecalcInputRecords = {
  business: Doc<"businesses">;
  scenario: Doc<"scenarios">;
  openingAssets: Doc<"opening_assets">[];
  startupCosts: Doc<"startup_costs">[];
  fundingSources: Doc<"funding_sources">[];
  openingBalances: Doc<"opening_balances"> | null;
  revenueLines: Doc<"revenue_lines">[];
  revenueOverrides: Doc<"revenue_overrides">[];
  payrollRoles: Doc<"payroll_roles">[];
  payrollAssumptions: Doc<"payroll_assumptions"> | null;
  payrollOverrides: Doc<"payroll_overrides">[];
  operatingExpenseLines: Doc<"operating_expense_lines">[];
  operatingExpenseMonths: Record<string, Doc<"operating_expense_months">[]>;
  workingCapitalSettings: Doc<"working_capital_settings"> | null;
  capexLines: Doc<"capex_lines">[];
  capexMonths: Record<string, Doc<"capex_months">[]>;
  taxSettings: Doc<"tax_settings"> | null;
  cashAdjustmentMonths: Doc<"cash_adjustment_months">[];
  ratioNorms: Doc<"ratio_norms">[];
};

export function buildScenarioCalculationInput(
  records: RecalcInputRecords,
): Partial<NormalizedScenarioInput> {
  const defaults = createEmptyScenarioInput();

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
    openingAssets: records.openingAssets.map((asset) => ({
      category: asset.category,
      amount: asset.amount,
      depreciationYears: asset.depreciationYears,
      notes: asset.notes,
    })),
    startupCosts: records.startupCosts.map((cost) => ({
      category: cost.category,
      amount: cost.amount,
      notes: cost.notes,
    })),
    fundingSources: records.fundingSources.map((source) => ({
      category: source.category,
      amount: source.amount,
      interestRate: source.interestRate,
      termMonths: source.termMonths,
      monthlyPaymentOverride: source.monthlyPaymentOverride,
      notes: source.notes,
    })),
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
    payrollRoles: records.payrollRoles.map((role) => ({
      sortOrder: role.sortOrder,
      roleName: role.roleName,
      roleType: role.roleType,
      compensationMode: role.compensationMode,
      headcount: role.headcount,
      hourlyRate: role.hourlyRate,
      monthlyPay: role.monthlyPay,
      hoursPerWeek: role.hoursPerWeek,
      startMonthIndex: role.startMonthIndex,
      endMonthIndex: role.endMonthIndex,
      year2Growth: role.year2Growth,
      year3Growth: role.year3Growth,
      isActive: role.isActive,
    })),
    payrollAssumptions: records.payrollAssumptions
      ? {
          socialSecurityRate: records.payrollAssumptions.socialSecurityRate,
          medicareRate: records.payrollAssumptions.medicareRate,
          futaRate: records.payrollAssumptions.futaRate,
          futaWageBase: records.payrollAssumptions.futaWageBase,
          sutaRate: records.payrollAssumptions.sutaRate,
          sutaWageBase: records.payrollAssumptions.sutaWageBase,
          pensionRate: records.payrollAssumptions.pensionRate,
          workersCompRate: records.payrollAssumptions.workersCompRate,
          healthInsuranceRate: records.payrollAssumptions.healthInsuranceRate,
          otherBenefitsRate: records.payrollAssumptions.otherBenefitsRate,
        }
      : defaults.payrollAssumptions,
    payrollOverrides: records.payrollOverrides.map((override) => ({
      monthIndex: override.monthIndex,
      metric: override.metric,
      overrideValue: override.overrideValue,
      reason: override.reason,
      source: override.source,
      isActive: override.isActive,
    })),
    operatingExpenseLines: records.operatingExpenseLines.map((line) => ({
      sortOrder: line.sortOrder,
      categoryKey: line.categoryKey,
      label: line.label,
      isCustom: line.isCustom,
      year2GrowthRate: line.year2GrowthRate,
      year3GrowthRate: line.year3GrowthRate,
      isActive: line.isActive,
    })),
    operatingExpenseMonths: Object.fromEntries(
      Object.entries(records.operatingExpenseMonths).map(([lineKey, months]) => [
        lineKey,
        months.map((month) => ({
          monthIndex: month.monthIndex,
          amount: month.amount,
        })),
      ]),
    ),
    workingCapitalSettings: records.workingCapitalSettings
      ? {
          arWithin30: records.workingCapitalSettings.arWithin30,
          ar30To60: records.workingCapitalSettings.ar30To60,
          arOver60: records.workingCapitalSettings.arOver60,
          badDebtAllowance: records.workingCapitalSettings.badDebtAllowance,
          apWithin30: records.workingCapitalSettings.apWithin30,
          ap30To60: records.workingCapitalSettings.ap30To60,
          apOver60: records.workingCapitalSettings.apOver60,
          desiredMinCash: records.workingCapitalSettings.desiredMinCash,
          locInterestRate: records.workingCapitalSettings.locInterestRate,
          financingBehavior: records.workingCapitalSettings.financingBehavior,
        }
      : defaults.workingCapitalSettings,
    capexLines: records.capexLines.map((line) => ({
      category: line.category,
      depreciationYears: line.depreciationYears,
      year2AnnualAmount: line.year2AnnualAmount,
      year3AnnualAmount: line.year3AnnualAmount,
    })),
    capexMonths: Object.fromEntries(
      Object.entries(records.capexMonths).map(([lineKey, months]) => [
        lineKey,
        months.map((month) => ({
          monthIndex: month.monthIndex,
          amount: month.amount,
        })),
      ]),
    ),
    taxSettings: records.taxSettings
      ? {
          year1TaxRate: records.taxSettings.year1TaxRate,
          year2TaxRate: records.taxSettings.year2TaxRate,
          year3TaxRate: records.taxSettings.year3TaxRate,
          amortizationYears: records.taxSettings.amortizationYears,
        }
      : defaults.taxSettings,
    cashAdjustmentMonths: records.cashAdjustmentMonths.map((month) => ({
      monthIndex: month.monthIndex,
      taxesPaid: month.taxesPaid,
      ownerDraws: month.ownerDraws,
      dividends: month.dividends,
      additionalInventory: month.additionalInventory,
      manualLocRepayment: month.manualLocRepayment,
    })),
    ratioNorms: records.ratioNorms.map((norm) => ({
      ratioKey: norm.ratioKey,
      year1Norm: norm.year1Norm,
      year2Norm: norm.year2Norm,
      year3Norm: norm.year3Norm,
      notes: norm.notes,
    })),
  };
}
