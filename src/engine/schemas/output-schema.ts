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

export const RevenueMetricSeriesSchema = z.object({
  monthly: z.array(MonthlyValueSchema),
  annual: z.array(AnnualValueSchema),
});

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
    openingPosition: SectionPayloadSchema,
    debtSchedules: SectionPayloadSchema,
    depreciation: SectionPayloadSchema,
    amortization: SectionPayloadSchema,
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
export type RevenueMetricSeries = z.infer<typeof RevenueMetricSeriesSchema>;
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
export type DiagnosticCard = z.infer<typeof DiagnosticCardSchema>;
export type ScenarioOutput = z.infer<typeof ScenarioOutputSchema>;

export function createEmptyScenarioOutput(): ScenarioOutput {
  const emptySection = (sectionKey: string): SectionPayload => ({
    sectionKey,
    monthly: [],
    annual: [],
    notes: [],
  });

  const emptyRevenueSeries = (): RevenueMetricSeries => ({
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
      units: emptyRevenueSeries(),
      sales: emptyRevenueSeries(),
      cogs: emptyRevenueSeries(),
      margin: emptyRevenueSeries(),
    },
    appliedOverrides: [],
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
      openingPosition: emptySection("opening-position"),
      debtSchedules: emptySection("debt-schedules"),
      depreciation: emptySection("depreciation"),
      amortization: emptySection("amortization"),
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
