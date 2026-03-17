import { v } from "convex/values";
import { action, mutation } from "./_generated/server";
import { requireOwnedScenario } from "./lib/auth";

export const respond = action({
  args: {
    scenarioId: v.id("scenarios"),
    screenContext: v.string(),
    message: v.string(),
  },
  handler: async (_ctx, args) => {
    return {
      scenarioId: args.scenarioId,
      screenContext: args.screenContext,
      reply:
        "AI response scaffolding is in place. Structured suggestions and approval flows land in Sprint 6.",
      suggestions: [],
      inputEcho: args.message,
    };
  },
});

export const approveSuggestion = mutation({
  args: {
    suggestionId: v.id("ai_suggestions"),
  },
  handler: async (ctx, args) => {
    const suggestion = await ctx.db.get(args.suggestionId);

    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    await requireOwnedScenario(ctx, suggestion.scenarioId);
    await ctx.db.patch(args.suggestionId, {
      status: "approved",
      approvedAt: Date.now(),
    });

    return {
      suggestionId: args.suggestionId,
      appliedChanges: false,
      status: "approved",
    };
  },
});

export const rejectSuggestion = mutation({
  args: {
    suggestionId: v.id("ai_suggestions"),
  },
  handler: async (ctx, args) => {
    const suggestion = await ctx.db.get(args.suggestionId);

    if (!suggestion) {
      throw new Error("Suggestion not found");
    }

    await requireOwnedScenario(ctx, suggestion.scenarioId);
    await ctx.db.patch(args.suggestionId, {
      status: "rejected",
      rejectedAt: Date.now(),
    });

    return {
      suggestionId: args.suggestionId,
      status: "rejected",
    };
  },
});
