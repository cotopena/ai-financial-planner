import { z } from "zod";

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
    revenue: SectionPayloadSchema,
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
export type DiagnosticCard = z.infer<typeof DiagnosticCardSchema>;
export type ScenarioOutput = z.infer<typeof ScenarioOutputSchema>;

export function createEmptyScenarioOutput(): ScenarioOutput {
  const emptySection = (sectionKey: string): SectionPayload => ({
    sectionKey,
    monthly: [],
    annual: [],
    notes: [],
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
      revenue: emptySection("revenue"),
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
