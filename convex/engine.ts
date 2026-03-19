import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { calculateScenario } from "../src/engine/orchestrator/calculate-scenario";
import { buildScenarioCalculationInput } from "./lib/scenario_calculation_input";

export const recalculateScenario = action({
  args: {
    scenarioId: v.id("scenarios"),
  },
  handler: async (ctx, args) => {
    const [scenarioView, openingFundingWorkspace, revenueWorkspace] =
      await Promise.all([
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
      ]);
    const output = calculateScenario(
      buildScenarioCalculationInput({
        business: scenarioView.business,
        scenario: scenarioView.scenario,
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
      }),
    );

    return {
      scenarioId: args.scenarioId,
      status: "calculated",
      generatedAt: output.generatedAt,
      summary: output.summary,
      revenueSection: output.sections.revenue,
      note: "Snapshot persistence is still pending, but this action now calculates revenue from persisted scenario assumptions.",
    };
  },
});
