import { z } from "zod";

export const RevenueMetricSchema = z.enum(["units", "sales", "cogs", "margin"]);
export const RevenueOverrideSourceSchema = z.enum(["manual", "ai_approved"]);

export const BusinessMetadataSchema = z.object({
  name: z.string(),
  companyName: z.string(),
  preparerName: z.string().optional(),
  businessProfile: z.string(),
  businessStage: z.string(),
  startMonth: z.number().int().min(1).max(12),
  startYear: z.number().int(),
  currencyCode: z.literal("USD"),
  countryRegion: z.literal("US"),
  notes: z.string().optional(),
});

export const ScenarioMetadataSchema = z.object({
  name: z.string(),
  notes: z.string().optional(),
  isBase: z.boolean(),
  currentVersion: z.number().int().min(1),
});

export const OpeningAssetSchema = z.object({
  assetKey: z.string().optional(),
  category: z.string(),
  amount: z.number(),
  depreciationYears: z.number().optional(),
  notes: z.string().optional(),
});

export const StartupCostSchema = z.object({
  costKey: z.string().optional(),
  category: z.string(),
  amount: z.number(),
  notes: z.string().optional(),
});

export const FundingSourceSchema = z.object({
  sourceKey: z.string().optional(),
  category: z.string(),
  amount: z.number(),
  interestRate: z.number().optional(),
  termMonths: z.number().optional(),
  monthlyPaymentOverride: z.number().optional(),
  notes: z.string().optional(),
});

export const OpeningBalanceSchema = z.object({
  cash: z.number(),
  accountsReceivable: z.number(),
  prepaidExpenses: z.number(),
  accountsPayable: z.number(),
  accruedExpenses: z.number(),
});

export const RevenueLineSchema = z.object({
  lineKey: z.string().optional(),
  sortOrder: z.number().int(),
  name: z.string(),
  unitLabel: z.string(),
  month1Units: z.number(),
  pricePerUnit: z.number(),
  cogsPerUnit: z.number(),
  q1MonthlyGrowth: z.number(),
  q2MonthlyGrowth: z.number(),
  q3MonthlyGrowth: z.number(),
  q4MonthlyGrowth: z.number(),
  year2MonthlyGrowth: z.number(),
  year3MonthlyGrowth: z.number(),
  startMonthIndex: z.number().int().min(1).max(36),
  endMonthIndex: z.number().int().min(1).max(36).optional(),
  isActive: z.boolean(),
});

export const RevenueOverrideSchema = z.object({
  lineKey: z.string().optional(),
  overrideKey: z.string().optional(),
  monthIndex: z.number().int().min(1).max(36),
  metric: RevenueMetricSchema,
  overrideValue: z.number(),
  reason: z.string(),
  source: RevenueOverrideSourceSchema,
  isActive: z.boolean(),
});

export const PayrollRoleSchema = z.object({
  sortOrder: z.number().int(),
  roleName: z.string(),
  roleType: z.string(),
  compensationMode: z.string(),
  headcount: z.number(),
  hourlyRate: z.number().optional(),
  monthlyPay: z.number().optional(),
  hoursPerWeek: z.number().optional(),
  startMonthIndex: z.number().int().min(1).max(36),
  endMonthIndex: z.number().int().min(1).max(36).optional(),
  year2Growth: z.number(),
  year3Growth: z.number(),
  isActive: z.boolean(),
});

export const PayrollAssumptionsSchema = z.object({
  socialSecurityRate: z.number(),
  medicareRate: z.number(),
  futaRate: z.number(),
  futaWageBase: z.number(),
  sutaRate: z.number(),
  sutaWageBase: z.number(),
  pensionRate: z.number(),
  workersCompRate: z.number(),
  healthInsuranceRate: z.number(),
  otherBenefitsRate: z.number(),
});

export const PayrollOverrideSchema = z.object({
  monthIndex: z.number().int().min(1).max(36),
  metric: z.string(),
  overrideValue: z.number(),
  reason: z.string(),
  source: z.string(),
  isActive: z.boolean(),
});

export const OperatingExpenseLineSchema = z.object({
  sortOrder: z.number().int(),
  categoryKey: z.string(),
  label: z.string(),
  isCustom: z.boolean(),
  year2GrowthRate: z.number(),
  year3GrowthRate: z.number(),
  isActive: z.boolean(),
});

export const OperatingExpenseMonthSchema = z.object({
  monthIndex: z.number().int().min(1).max(12),
  amount: z.number(),
});

export const WorkingCapitalSettingsSchema = z.object({
  arWithin30: z.number(),
  ar30To60: z.number(),
  arOver60: z.number(),
  badDebtAllowance: z.number(),
  apWithin30: z.number(),
  ap30To60: z.number(),
  apOver60: z.number(),
  desiredMinCash: z.number(),
  locInterestRate: z.number(),
  financingBehavior: z.string(),
});

export const CapexLineSchema = z.object({
  lineKey: z.string().optional(),
  category: z.string(),
  depreciationYears: z.number(),
  year2AnnualAmount: z.number(),
  year3AnnualAmount: z.number(),
});

export const CapexMonthSchema = z.object({
  monthIndex: z.number().int().min(1).max(36),
  amount: z.number(),
});

export const TaxSettingsSchema = z.object({
  year1TaxRate: z.number(),
  year2TaxRate: z.number(),
  year3TaxRate: z.number(),
  amortizationYears: z.number(),
});

export const CashAdjustmentMonthSchema = z.object({
  monthIndex: z.number().int().min(1).max(36),
  taxesPaid: z.number(),
  ownerDraws: z.number(),
  dividends: z.number(),
  additionalInventory: z.number(),
  manualLocRepayment: z.number(),
});

export const RatioNormSchema = z.object({
  ratioKey: z.string(),
  year1Norm: z.number().optional(),
  year2Norm: z.number().optional(),
  year3Norm: z.number().optional(),
  notes: z.string().optional(),
});

export const NormalizedScenarioInputSchema = z.object({
  business: BusinessMetadataSchema,
  scenario: ScenarioMetadataSchema,
  openingAssets: z.array(OpeningAssetSchema),
  startupCosts: z.array(StartupCostSchema),
  fundingSources: z.array(FundingSourceSchema),
  openingBalances: OpeningBalanceSchema,
  revenueLines: z.array(RevenueLineSchema),
  revenueOverrides: z.array(RevenueOverrideSchema),
  payrollRoles: z.array(PayrollRoleSchema),
  payrollAssumptions: PayrollAssumptionsSchema,
  payrollOverrides: z.array(PayrollOverrideSchema),
  operatingExpenseLines: z.array(OperatingExpenseLineSchema),
  operatingExpenseMonths: z.record(z.string(), z.array(OperatingExpenseMonthSchema)),
  workingCapitalSettings: WorkingCapitalSettingsSchema,
  capexLines: z.array(CapexLineSchema),
  capexMonths: z.record(z.string(), z.array(CapexMonthSchema)),
  taxSettings: TaxSettingsSchema,
  cashAdjustmentMonths: z.array(CashAdjustmentMonthSchema),
  ratioNorms: z.array(RatioNormSchema),
});

export type NormalizedScenarioInput = z.infer<typeof NormalizedScenarioInputSchema>;
export type RevenueMetric = z.infer<typeof RevenueMetricSchema>;
export type RevenueOverrideSource = z.infer<typeof RevenueOverrideSourceSchema>;
export type RevenueLine = z.infer<typeof RevenueLineSchema>;
export type RevenueOverride = z.infer<typeof RevenueOverrideSchema>;
export type RatioNorm = z.infer<typeof RatioNormSchema>;

export function createEmptyScenarioInput(): NormalizedScenarioInput {
  return {
    business: {
      name: "Base business",
      companyName: "Base business",
      businessProfile: "general_small_business",
      businessStage: "startup",
      startMonth: 1,
      startYear: new Date().getFullYear(),
      currencyCode: "USD",
      countryRegion: "US",
    },
    scenario: {
      name: "Base scenario",
      isBase: true,
      currentVersion: 1,
    },
    openingAssets: [],
    startupCosts: [],
    fundingSources: [],
    openingBalances: {
      cash: 0,
      accountsReceivable: 0,
      prepaidExpenses: 0,
      accountsPayable: 0,
      accruedExpenses: 0,
    },
    revenueLines: [],
    revenueOverrides: [],
    payrollRoles: [],
    payrollAssumptions: {
      socialSecurityRate: 0,
      medicareRate: 0,
      futaRate: 0,
      futaWageBase: 0,
      sutaRate: 0,
      sutaWageBase: 0,
      pensionRate: 0,
      workersCompRate: 0,
      healthInsuranceRate: 0,
      otherBenefitsRate: 0,
    },
    payrollOverrides: [],
    operatingExpenseLines: [],
    operatingExpenseMonths: {},
    workingCapitalSettings: {
      arWithin30: 1,
      ar30To60: 0,
      arOver60: 0,
      badDebtAllowance: 0,
      apWithin30: 1,
      ap30To60: 0,
      apOver60: 0,
      desiredMinCash: 0,
      locInterestRate: 0,
      financingBehavior: "auto_loc",
    },
    capexLines: [],
    capexMonths: {},
    taxSettings: {
      year1TaxRate: 0,
      year2TaxRate: 0,
      year3TaxRate: 0,
      amortizationYears: 5,
    },
    cashAdjustmentMonths: [],
    ratioNorms: [],
  };
}
