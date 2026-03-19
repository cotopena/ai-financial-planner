import { buildPeriodAxis } from "../core/period-axis";
import { normalizeScenarioInput } from "../core/normalize-inputs";
import { calculateAmortization } from "../modules/amortization";
import { calculateBalanceSheet } from "../modules/balance-sheet";
import { calculateBreakEven } from "../modules/break-even";
import { calculateCashFlow } from "../modules/cash-flow";
import { calculateDebtSchedules } from "../modules/debt-schedules";
import { calculateDepreciation } from "../modules/depreciation";
import { calculateDiagnostics } from "../modules/diagnostics";
import { calculateIncomeStatement } from "../modules/income-statement";
import { calculateOpeningPosition } from "../modules/opening-position";
import { calculateOperatingExpenses } from "../modules/operating-expenses";
import { calculatePayroll } from "../modules/payroll";
import { calculateRatios } from "../modules/ratios";
import { calculateRevenue } from "../modules/revenue";
import { calculateScenarioComparison } from "../modules/scenario-comparison";
import { calculateWorkingCapital } from "../modules/working-capital";
import {
  ScenarioOutputSchema,
  createEmptyScenarioOutput,
  type ScenarioOutput,
} from "../schemas/output-schema";
import type { NormalizedScenarioInput } from "../schemas/input-schema";

export function calculateScenario(
  rawInput: Partial<NormalizedScenarioInput> = {},
): ScenarioOutput {
  const input = normalizeScenarioInput(rawInput);
  const axis = buildPeriodAxis({
    startMonth: input.business.startMonth,
    startYear: input.business.startYear,
  });
  const baseline = createEmptyScenarioOutput();
  const revenue = calculateRevenue(input, axis);
  const year1Revenue = revenue.totals.sales.annual[0]?.value ?? 0;
  const year1Margin = revenue.totals.margin.annual[0]?.value ?? 0;

  return ScenarioOutputSchema.parse({
    ...baseline,
    generatedAt: new Date().toISOString(),
    periods: axis.periods,
    sections: {
      openingPosition: calculateOpeningPosition(input, axis),
      debtSchedules: calculateDebtSchedules(input, axis),
      depreciation: calculateDepreciation(input, axis),
      amortization: calculateAmortization(input, axis),
      revenue,
      payroll: calculatePayroll(input, axis),
      operatingExpenses: calculateOperatingExpenses(input, axis),
      workingCapital: calculateWorkingCapital(input, axis),
      cashFlow: calculateCashFlow(input, axis),
      incomeStatement: calculateIncomeStatement(input, axis),
      balanceSheet: calculateBalanceSheet(input, axis),
      breakEven: calculateBreakEven(input, axis),
      ratios: calculateRatios(input, axis),
      scenarioComparison: calculateScenarioComparison(axis),
    },
    diagnostics: calculateDiagnostics(input),
    summary: {
      revenue: year1Revenue,
      grossMarginPct: year1Revenue === 0 ? 0 : (year1Margin / year1Revenue) * 100,
      netIncome: 0,
      endingCash: input.openingBalances.cash,
      maxLoc: 0,
      dscr: 0,
    },
  });
}
