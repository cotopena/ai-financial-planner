import { v } from "convex/values";
import { action } from "./_generated/server";
import { calculateScenario } from "../src/engine/orchestrator/calculate-scenario";
import { createEmptyScenarioInput } from "../src/engine/schemas/input-schema";

export const recalculateScenario = action({
  args: {
    scenarioId: v.id("scenarios"),
  },
  handler: async (_ctx, args) => {
    const output = calculateScenario(createEmptyScenarioInput());

    return {
      scenarioId: args.scenarioId,
      status: "stubbed",
      generatedAt: Date.now(),
      summary: output.summary,
      note: "Full snapshot persistence lands once the engine is connected to real Convex reads.",
    };
  },
});
