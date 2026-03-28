import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { calculateScenario } from "../src/engine/orchestrator/calculate-scenario";
import { buildScenarioCalculationInput } from "./lib/scenario_calculation_input";
import type { ScenarioOutput } from "../src/engine/schemas/output-schema";

type RecalculateScenarioResult = {
  scenarioId: Id<"scenarios">;
  versionNumber: number;
  status: "calculated_and_persisted";
  generatedAt: string;
  summary: ScenarioOutput["summary"];
  revenueSection: ScenarioOutput["sections"]["revenue"];
  snapshot: {
    scenarioId: Id<"scenarios">;
    versionNumber: number;
    generatedAt: number;
    replaced: number;
    inserted: number;
    monthlySections: string[];
    annualSections: string[];
    diagnosticsCount: number;
  };
};

export const recalculateScenario = action({
  args: {
    scenarioId: v.id("scenarios"),
  },
  handler: async (ctx, args): Promise<RecalculateScenarioResult> => {
    const [
      scenarioView,
      openingFundingWorkspace,
      revenueWorkspace,
      payrollWorkspace,
      expensesWorkspace,
      cashFinancingWorkspace,
    ] = await Promise.all([
      ctx.runQuery(api.scenarios.get, {
        scenarioId: args.scenarioId,
      }),
      ctx.runQuery(api.assumptions.getWorkspace, {
        scenarioId: args.scenarioId,
        screenKey: "opening-funding",
      }),
      ctx.runQuery(api.assumptions.getWorkspace, {
        scenarioId: args.scenarioId,
        screenKey: "revenue",
      }),
      ctx.runQuery(api.assumptions.getWorkspace, {
        scenarioId: args.scenarioId,
        screenKey: "payroll",
      }),
      ctx.runQuery(api.assumptions.getWorkspace, {
        scenarioId: args.scenarioId,
        screenKey: "expenses",
      }),
      ctx.runQuery(api.assumptions.getWorkspace, {
        scenarioId: args.scenarioId,
        screenKey: "cash-financing",
      }),
    ]);
    const input = buildScenarioCalculationInput({
      business: scenarioView.business,
      scenario: scenarioView.scenario,
      openingAssets:
        "openingAssets" in openingFundingWorkspace
          ? (openingFundingWorkspace.openingAssets ?? [])
          : [],
      startupCosts:
        "startupCosts" in openingFundingWorkspace
          ? (openingFundingWorkspace.startupCosts ?? [])
          : [],
      fundingSources:
        "fundingSources" in openingFundingWorkspace
          ? (openingFundingWorkspace.fundingSources ?? [])
          : [],
      openingBalances:
        "openingBalances" in openingFundingWorkspace
          ? (openingFundingWorkspace.openingBalances ?? null)
          : null,
      revenueLines:
        "revenueLines" in revenueWorkspace
          ? (revenueWorkspace.revenueLines ?? [])
          : [],
      revenueOverrides:
        "revenueOverrides" in revenueWorkspace
          ? (revenueWorkspace.revenueOverrides ?? [])
          : [],
      payrollRoles:
        "payrollRoles" in payrollWorkspace ? (payrollWorkspace.payrollRoles ?? []) : [],
      payrollAssumptions:
        "payrollAssumptions" in payrollWorkspace
          ? (payrollWorkspace.payrollAssumptions ?? null)
          : null,
      payrollOverrides:
        "payrollOverrides" in payrollWorkspace
          ? (payrollWorkspace.payrollOverrides ?? [])
          : [],
      operatingExpenseLines:
        "operatingExpenseLines" in expensesWorkspace
          ? (expensesWorkspace.operatingExpenseLines ?? [])
          : [],
      operatingExpenseMonths:
        "operatingExpenseMonths" in expensesWorkspace
          ? (expensesWorkspace.operatingExpenseMonths ?? {})
          : {},
      workingCapitalSettings:
        "workingCapitalSettings" in cashFinancingWorkspace
          ? (cashFinancingWorkspace.workingCapitalSettings ?? null)
          : null,
      capexLines:
        "capexLines" in cashFinancingWorkspace
          ? (cashFinancingWorkspace.capexLines ?? [])
          : [],
      capexMonths:
        "capexMonths" in cashFinancingWorkspace
          ? (cashFinancingWorkspace.capexMonths ?? {})
          : {},
      taxSettings:
        "taxSettings" in cashFinancingWorkspace
          ? (cashFinancingWorkspace.taxSettings ?? null)
          : null,
      cashAdjustmentMonths:
        "cashAdjustmentMonths" in cashFinancingWorkspace
          ? (cashFinancingWorkspace.cashAdjustmentMonths ?? [])
          : [],
      ratioNorms:
        "ratioNorms" in cashFinancingWorkspace
          ? (cashFinancingWorkspace.ratioNorms ?? [])
          : [],
    });
    const output = calculateScenario(input);
    const snapshotWrite = await ctx.runMutation(
      internal.snapshot_writes.persistScenarioSnapshot,
      {
        scenarioId: args.scenarioId,
        versionNumber: scenarioView.scenario.currentVersion,
        output,
        ratioNorms: input.ratioNorms ?? [],
      },
    );

    return {
      scenarioId: args.scenarioId,
      versionNumber: scenarioView.scenario.currentVersion,
      status: "calculated_and_persisted",
      generatedAt: output.generatedAt,
      summary: output.summary,
      revenueSection: output.sections.revenue,
      snapshot: snapshotWrite,
    };
  },
});
