import { v } from "convex/values";
import { action } from "./_generated/server";

export const generatePdf = action({
  args: {
    scenarioId: v.id("scenarios"),
    optionsJson: v.optional(v.any()),
  },
  handler: async (_ctx, args) => {
    return {
      scenarioId: args.scenarioId,
      exportType: "pdf",
      status: "stubbed",
      options: args.optionsJson ?? {},
      note: "PDF generation lands in Sprint 7.",
    };
  },
});

export const generateCsv = action({
  args: {
    scenarioId: v.id("scenarios"),
    optionsJson: v.optional(v.any()),
  },
  handler: async (_ctx, args) => {
    return {
      scenarioId: args.scenarioId,
      exportType: "csv",
      status: "stubbed",
      options: args.optionsJson ?? {},
      note: "CSV bundle generation lands in Sprint 7.",
    };
  },
});
