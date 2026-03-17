/* eslint-disable @typescript-eslint/no-explicit-any */

import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireOwnedScenario } from "./lib/auth";

export const getOverview = query({
  args: {
    scenarioId: v.id("scenarios"),
  },
  handler: async (ctx, args) => {
    const { scenario } = await requireOwnedScenario(ctx, args.scenarioId);
    const summary = await (ctx.db
      .query("scenario_snapshot_summary")
      .withIndex("by_scenario_version", (q: any) =>
        q.eq("scenarioId", args.scenarioId).eq("versionNumber", scenario.currentVersion),
      )
      .unique() as any);

    return {
      scenarioId: args.scenarioId,
      versionNumber: scenario.currentVersion,
      summary:
        summary?.summaryJson ??
        {
          status: "stubbed",
          message: "Run engine.recalculateScenario once engine math is implemented.",
        },
    };
  },
});

export const getStatements = query({
  args: {
    scenarioId: v.id("scenarios"),
    sectionKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { scenario } = await requireOwnedScenario(ctx, args.scenarioId);
    const annual = (await ctx.db
      .query("scenario_snapshot_annual")
      .withIndex("by_scenario_version", (q: any) =>
        q.eq("scenarioId", args.scenarioId).eq("versionNumber", scenario.currentVersion),
      )
      .collect()) as any[];
    const monthly = (await ctx.db
      .query("scenario_snapshot_monthly")
      .withIndex("by_scenario_version", (q: any) =>
        q.eq("scenarioId", args.scenarioId).eq("versionNumber", scenario.currentVersion),
      )
      .collect()) as any[];

    return {
      scenarioId: args.scenarioId,
      versionNumber: scenario.currentVersion,
      annual:
        args.sectionKey !== undefined
          ? annual.filter((item) => item.sectionKey === args.sectionKey)
          : annual,
      monthly:
        args.sectionKey !== undefined
          ? monthly.filter((item) => item.sectionKey === args.sectionKey)
          : monthly,
    };
  },
});

export const getDiagnostics = query({
  args: {
    scenarioId: v.id("scenarios"),
  },
  handler: async (ctx, args) => {
    const { scenario } = await requireOwnedScenario(ctx, args.scenarioId);
    const diagnostics = await (ctx.db
      .query("scenario_snapshot_diagnostics")
      .withIndex("by_scenario_version", (q: any) =>
        q.eq("scenarioId", args.scenarioId).eq("versionNumber", scenario.currentVersion),
      )
      .unique() as any);

    return {
      scenarioId: args.scenarioId,
      versionNumber: scenario.currentVersion,
      diagnostics:
        diagnostics?.cardsJson ??
        [
          {
            severity: "info",
            title: "Diagnostics placeholder",
            message:
              "Scenario diagnostics will populate after the engine modules are implemented.",
          },
        ],
    };
  },
});
