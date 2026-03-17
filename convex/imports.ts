import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { requireOwnedScenario } from "./lib/auth";

export const uploadCsv = action({
  args: {
    scenarioId: v.id("scenarios"),
    uploadName: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    return {
      scenarioId: args.scenarioId,
      status: "stubbed",
      uploadName: args.uploadName ?? "uploaded.csv",
      note: "CSV parsing, mapping, and validation land in Sprint 7.",
    };
  },
});

export const saveMapping = mutation({
  args: {
    importId: v.id("historical_actual_imports"),
    mappingJson: v.any(),
  },
  handler: async (ctx, args) => {
    const importDoc = await ctx.db.get(args.importId);

    if (!importDoc) {
      throw new Error("Import not found");
    }

    await requireOwnedScenario(ctx, importDoc.scenarioId);
    await ctx.db.patch(args.importId, {
      mappingJson: args.mappingJson,
      importStatus: "mapped",
    });

    return args.importId;
  },
});

export const applyActuals = action({
  args: {
    importId: v.id("historical_actual_imports"),
  },
  handler: async (_ctx, args) => {
    return {
      importId: args.importId,
      status: "stubbed",
      note: "Normalization and actuals application land in Sprint 7.",
    };
  },
});
