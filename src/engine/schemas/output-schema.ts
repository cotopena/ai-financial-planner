import { z } from "zod";
import {
  RevenueMetricSchema,
  RevenueOverrideSourceSchema,
} from "./input-schema";

export const EnginePeriodSchema = z.object({
  monthIndex: z.number().int().min(1).max(36),
  month: z.number().int().min(1).max(12),
  year: z.number().int(),
  quarter: z.number().int().min(1).max(4),
  yearBucket: z.number().int().min(1).max(3),
  label: z.string(),
});

export const MonthlyValueSchema = z.object({
  monthIndex: z.number().int().min(1).max(36),
  label: z.string(),
  value: z.number(),
});

export const AnnualValueSchema = z.object({
  yearBucket: z.number().int().min(1).max(3),
  label: z.string(),
  value: z.number(),
});

export const SectionPayloadSchema = z.object({
  sectionKey: z.string(),
  monthly: z.array(MonthlyValueSchema),
  annual: z.array(AnnualValueSchema),
  notes: z.array(z.string()),
});

export const ValueSeriesSchema = z.object({
  monthly: z.array(MonthlyValueSchema),
  annual: z.array(AnnualValueSchema),
});

export const RevenueMetricSeriesSchema = ValueSeriesSchema;

export const AppliedRevenueOverrideSchema = z.object({
  overrideKey: z.string(),
  lineKey: z.string(),
  lineName: z.string(),
  monthIndex: z.number().int().min(1).max(36),
  label: z.string(),
  metric: RevenueMetricSchema,
  overrideValue: z.number(),
  reason: z.string(),
  source: RevenueOverrideSourceSchema,
});

export const RevenueLineMonthlyValueSchema = z.object({
  monthIndex: z.number().int().min(1).max(36),
  label: z.string(),
  units: z.number(),
  sales: z.number(),
  cogs: z.number(),
  margin: z.number(),
  appliedOverrides: z.array(AppliedRevenueOverrideSchema),
});

export const RevenueLineAnnualValueSchema = z.object({
  yearBucket: z.number().int().min(1).max(3),
  label: z.string(),
  units: z.number(),
  sales: z.number(),
  cogs: z.number(),
  margin: z.number(),
});

export const RevenueLineItemSchema = z.object({
  lineKey: z.string(),
  sortOrder: z.number().int(),
  name: z.string(),
  unitLabel: z.string(),
  pricePerUnit: z.number(),
  cogsPerUnit: z.number(),
  startMonthIndex: z.number().int().min(1).max(36),
  endMonthIndex: z.number().int().min(1).max(36).optional(),
  isActive: z.boolean(),
  monthly: z.array(RevenueLineMonthlyValueSchema),
  annual: z.array(RevenueLineAnnualValueSchema),
});

export const RevenueTotalsSchema = z.object({
  units: RevenueMetricSeriesSchema,
  sales: RevenueMetricSeriesSchema,
  cogs: RevenueMetricSeriesSchema,
  margin: RevenueMetricSeriesSchema,
});

export const RevenueSectionPayloadSchema = SectionPayloadSchema.extend({
  lineItems: z.array(RevenueLineItemSchema),
  totals: RevenueTotalsSchema,
  appliedOverrides: z.array(AppliedRevenueOverrideSchema),
});

export const OpeningPositionTotalsSchema = z.object({
  totalFixedAssets: z.number(),
  totalStartupCosts: z.number(),
  totalRequiredFunds: z.number(),
  totalFundingSources: z.number(),
  fundingGap: z.number(),
  fundingSurplus: z.number(),
  netFundingDifference: z.number(),
  isBalanced: z.boolean(),
  openingCash: z.number(),
  accountsReceivable: z.number(),
  prepaidExpenses: z.number(),
  accountsPayable: z.number(),
  accruedExpenses: z.number(),
  openingCashPosition: z.number(),
});

export const OpeningPositionSectionPayloadSchema = SectionPayloadSchema.extend({
  totals: OpeningPositionTotalsSchema,
});

export const DebtScheduleMonthlyValueSchema = z.object({
  monthIndex: z.number().int().min(1).max(36),
  label: z.string(),
  payment: z.number(),
  interest: z.number(),
  principal: z.number(),
  endingBalance: z.number(),
});

export const DebtScheduleAnnualValueSchema = z.object({
  yearBucket: z.number().int().min(1).max(3),
  label: z.string(),
  payment: z.number(),
  interest: z.number(),
  principal: z.number(),
  endingBalance: z.number(),
});

export const DebtScheduleItemSchema = z.object({
  debtKey: z.string(),
  sortOrder: z.number().int(),
  category: z.string(),
  originalAmount: z.number(),
  interestRate: z.number(),
  termMonths: z.number().int(),
  standardPayment: z.number(),
  monthlyPaymentOverride: z.number().optional(),
  notes: z.array(z.string()),
  monthly: z.array(DebtScheduleMonthlyValueSchema),
  annual: z.array(DebtScheduleAnnualValueSchema),
});

export const DebtSchedulesTotalsSchema = z.object({
  payment: ValueSeriesSchema,
  interest: ValueSeriesSchema,
  principal: ValueSeriesSchema,
  endingBalance: ValueSeriesSchema,
});

export const DebtSchedulesSectionPayloadSchema = SectionPayloadSchema.extend({
  loans: z.array(DebtScheduleItemSchema),
  totals: DebtSchedulesTotalsSchema,
});

export const DepreciationBasisEntrySchema = z.object({
  monthIndex: z.number().int().min(1).max(36),
  label: z.string(),
  amount: z.number(),
  source: z.enum([
    "opening-balance",
    "explicit-month",
    "year2-fallback",
    "year3-fallback",
  ]),
});

export const DepreciationMonthlyValueSchema = z.object({
  monthIndex: z.number().int().min(1).max(36),
  label: z.string(),
  expense: z.number(),
  endingBookValue: z.number(),
});

export const DepreciationAnnualValueSchema = z.object({
  yearBucket: z.number().int().min(1).max(3),
  label: z.string(),
  expense: z.number(),
  endingBookValue: z.number(),
});

export const DepreciationItemSchema = z.object({
  itemKey: z.string(),
  sortOrder: z.number().int(),
  sourceType: z.enum(["opening-asset", "capex"]),
  category: z.string(),
  originalAmount: z.number(),
  depreciationYears: z.number(),
  acquisitionSchedule: z.array(DepreciationBasisEntrySchema),
  monthly: z.array(DepreciationMonthlyValueSchema),
  annual: z.array(DepreciationAnnualValueSchema),
});

export const DepreciationTotalsSchema = z.object({
  expense: ValueSeriesSchema,
  endingBookValue: ValueSeriesSchema,
});

export const DepreciationSectionPayloadSchema = SectionPayloadSchema.extend({
  items: z.array(DepreciationItemSchema),
  totals: DepreciationTotalsSchema,
});

export const AmortizationMonthlyValueSchema = z.object({
  monthIndex: z.number().int().min(1).max(36),
  label: z.string(),
  expense: z.number(),
  endingBalance: z.number(),
});

export const AmortizationAnnualValueSchema = z.object({
  yearBucket: z.number().int().min(1).max(3),
  label: z.string(),
  expense: z.number(),
  endingBalance: z.number(),
});

export const AmortizationItemSchema = z.object({
  itemKey: z.string(),
  sortOrder: z.number().int(),
  category: z.string(),
  originalAmount: z.number(),
  amortizationYears: z.number(),
  monthly: z.array(AmortizationMonthlyValueSchema),
  annual: z.array(AmortizationAnnualValueSchema),
});

export const AmortizationTotalsSchema = z.object({
  expense: ValueSeriesSchema,
  endingBalance: ValueSeriesSchema,
});

export const AmortizationSectionPayloadSchema = SectionPayloadSchema.extend({
  items: z.array(AmortizationItemSchema),
  totals: AmortizationTotalsSchema,
});

export const DiagnosticCardSchema = z.object({
  severity: z.enum(["info", "warning", "critical"]),
  title: z.string(),
  message: z.string(),
  recommendation: z.string().optional(),
});

export const ScenarioSummarySchema = z.object({
  revenue: z.number(),
  grossMarginPct: z.number(),
  netIncome: z.number(),
  endingCash: z.number(),
  maxLoc: z.number(),
  dscr: z.number(),
});

export const ScenarioOutputSchema = z.object({
  generatedAt: z.string(),
  periods: z.array(EnginePeriodSchema),
  summary: ScenarioSummarySchema,
  sections: z.object({
    openingPosition: OpeningPositionSectionPayloadSchema,
    debtSchedules: DebtSchedulesSectionPayloadSchema,
    depreciation: DepreciationSectionPayloadSchema,
    amortization: AmortizationSectionPayloadSchema,
    revenue: RevenueSectionPayloadSchema,
    payroll: SectionPayloadSchema,
    operatingExpenses: SectionPayloadSchema,
    workingCapital: SectionPayloadSchema,
    cashFlow: SectionPayloadSchema,
    incomeStatement: SectionPayloadSchema,
    balanceSheet: SectionPayloadSchema,
    breakEven: SectionPayloadSchema,
    ratios: SectionPayloadSchema,
    scenarioComparison: SectionPayloadSchema,
  }),
  diagnostics: z.array(DiagnosticCardSchema),
});

export type EnginePeriod = z.infer<typeof EnginePeriodSchema>;
export type MonthlyValue = z.infer<typeof MonthlyValueSchema>;
export type AnnualValue = z.infer<typeof AnnualValueSchema>;
export type SectionPayload = z.infer<typeof SectionPayloadSchema>;
export type ValueSeries = z.infer<typeof ValueSeriesSchema>;
export type RevenueMetricSeries = ValueSeries;
export type AppliedRevenueOverride = z.infer<
  typeof AppliedRevenueOverrideSchema
>;
export type RevenueLineMonthlyValue = z.infer<
  typeof RevenueLineMonthlyValueSchema
>;
export type RevenueLineAnnualValue = z.infer<
  typeof RevenueLineAnnualValueSchema
>;
export type RevenueLineItem = z.infer<typeof RevenueLineItemSchema>;
export type RevenueTotals = z.infer<typeof RevenueTotalsSchema>;
export type RevenueSectionPayload = z.infer<
  typeof RevenueSectionPayloadSchema
>;
export type OpeningPositionTotals = z.infer<typeof OpeningPositionTotalsSchema>;
export type OpeningPositionSectionPayload = z.infer<
  typeof OpeningPositionSectionPayloadSchema
>;
export type DebtScheduleMonthlyValue = z.infer<
  typeof DebtScheduleMonthlyValueSchema
>;
export type DebtScheduleAnnualValue = z.infer<
  typeof DebtScheduleAnnualValueSchema
>;
export type DebtScheduleItem = z.infer<typeof DebtScheduleItemSchema>;
export type DebtSchedulesTotals = z.infer<typeof DebtSchedulesTotalsSchema>;
export type DebtSchedulesSectionPayload = z.infer<
  typeof DebtSchedulesSectionPayloadSchema
>;
export type DepreciationBasisEntry = z.infer<
  typeof DepreciationBasisEntrySchema
>;
export type DepreciationMonthlyValue = z.infer<
  typeof DepreciationMonthlyValueSchema
>;
export type DepreciationAnnualValue = z.infer<
  typeof DepreciationAnnualValueSchema
>;
export type DepreciationItem = z.infer<typeof DepreciationItemSchema>;
export type DepreciationTotals = z.infer<typeof DepreciationTotalsSchema>;
export type DepreciationSectionPayload = z.infer<
  typeof DepreciationSectionPayloadSchema
>;
export type AmortizationMonthlyValue = z.infer<
  typeof AmortizationMonthlyValueSchema
>;
export type AmortizationAnnualValue = z.infer<
  typeof AmortizationAnnualValueSchema
>;
export type AmortizationItem = z.infer<typeof AmortizationItemSchema>;
export type AmortizationTotals = z.infer<typeof AmortizationTotalsSchema>;
export type AmortizationSectionPayload = z.infer<
  typeof AmortizationSectionPayloadSchema
>;
export type DiagnosticCard = z.infer<typeof DiagnosticCardSchema>;
export type ScenarioOutput = z.infer<typeof ScenarioOutputSchema>;

export function createEmptyScenarioOutput(): ScenarioOutput {
  const emptySection = (sectionKey: string): SectionPayload => ({
    sectionKey,
    monthly: [],
    annual: [],
    notes: [],
  });

  const emptyValueSeries = (): ValueSeries => ({
    monthly: [],
    annual: [],
  });

  const emptyRevenueSection = (): RevenueSectionPayload => ({
    sectionKey: "revenue",
    monthly: [],
    annual: [],
    notes: [],
    lineItems: [],
    totals: {
      units: emptyValueSeries(),
      sales: emptyValueSeries(),
      cogs: emptyValueSeries(),
      margin: emptyValueSeries(),
    },
    appliedOverrides: [],
  });

  const emptyOpeningPositionSection =
    (): OpeningPositionSectionPayload => ({
      sectionKey: "opening-position",
      monthly: [],
      annual: [],
      notes: [],
      totals: {
        totalFixedAssets: 0,
        totalStartupCosts: 0,
        totalRequiredFunds: 0,
        totalFundingSources: 0,
        fundingGap: 0,
        fundingSurplus: 0,
        netFundingDifference: 0,
        isBalanced: true,
        openingCash: 0,
        accountsReceivable: 0,
        prepaidExpenses: 0,
        accountsPayable: 0,
        accruedExpenses: 0,
        openingCashPosition: 0,
      },
    });

  const emptyDebtSchedulesSection =
    (): DebtSchedulesSectionPayload => ({
      sectionKey: "debt-schedules",
      monthly: [],
      annual: [],
      notes: [],
      loans: [],
      totals: {
        payment: emptyValueSeries(),
        interest: emptyValueSeries(),
        principal: emptyValueSeries(),
        endingBalance: emptyValueSeries(),
      },
    });

  const emptyDepreciationSection =
    (): DepreciationSectionPayload => ({
      sectionKey: "depreciation",
      monthly: [],
      annual: [],
      notes: [],
      items: [],
      totals: {
        expense: emptyValueSeries(),
        endingBookValue: emptyValueSeries(),
      },
    });

  const emptyAmortizationSection =
    (): AmortizationSectionPayload => ({
      sectionKey: "amortization",
      monthly: [],
      annual: [],
      notes: [],
      items: [],
      totals: {
        expense: emptyValueSeries(),
        endingBalance: emptyValueSeries(),
      },
    });

  return {
    generatedAt: new Date(0).toISOString(),
    periods: [],
    summary: {
      revenue: 0,
      grossMarginPct: 0,
      netIncome: 0,
      endingCash: 0,
      maxLoc: 0,
      dscr: 0,
    },
    sections: {
      openingPosition: emptyOpeningPositionSection(),
      debtSchedules: emptyDebtSchedulesSection(),
      depreciation: emptyDepreciationSection(),
      amortization: emptyAmortizationSection(),
      revenue: emptyRevenueSection(),
      payroll: emptySection("payroll"),
      operatingExpenses: emptySection("operating-expenses"),
      workingCapital: emptySection("working-capital"),
      cashFlow: emptySection("cash-flow"),
      incomeStatement: emptySection("income-statement"),
      balanceSheet: emptySection("balance-sheet"),
      breakEven: emptySection("break-even"),
      ratios: emptySection("ratios"),
      scenarioComparison: emptySection("scenario-comparison"),
    },
    diagnostics: [],
  };
}
