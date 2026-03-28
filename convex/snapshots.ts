import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireOwnedScenario } from "./lib/auth";
import {
  buildSnapshotDiagnosticsResponse,
  buildSnapshotOverviewResponse,
  buildSnapshotStatementsResponse,
} from "./lib/scenario_snapshot_queries";

export const getOverview = query({
  args: {
    scenarioId: v.id("scenarios"),
  },
  handler: async (ctx, args) => {
    const { scenario } = await requireOwnedScenario(ctx, args.scenarioId);
    const [metaDocs, summaryDocs] = await Promise.all([
      ctx.db
        .query("scenario_snapshot_meta")
        .withIndex("by_scenario_version", (q) =>
          q.eq("scenarioId", args.scenarioId).eq("versionNumber", scenario.currentVersion),
        )
        .collect(),
      ctx.db
        .query("scenario_snapshot_summary")
        .withIndex("by_scenario_version", (q) =>
          q.eq("scenarioId", args.scenarioId).eq("versionNumber", scenario.currentVersion),
        )
        .collect(),
    ]);

    return {
      scenarioId: args.scenarioId,
      versionNumber: scenario.currentVersion,
      ...buildSnapshotOverviewResponse({
        metaDocs,
        summaryDocs,
      }),
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
    const [metaDocs, annualDocs, monthlyDocs, ratioDocs] = await Promise.all([
      ctx.db
        .query("scenario_snapshot_meta")
        .withIndex("by_scenario_version", (q) =>
          q.eq("scenarioId", args.scenarioId).eq("versionNumber", scenario.currentVersion),
        )
        .collect(),
      ctx.db
        .query("scenario_snapshot_annual")
        .withIndex("by_scenario_version", (q) =>
          q.eq("scenarioId", args.scenarioId).eq("versionNumber", scenario.currentVersion),
        )
        .collect(),
      ctx.db
        .query("scenario_snapshot_monthly")
        .withIndex("by_scenario_version", (q) =>
          q.eq("scenarioId", args.scenarioId).eq("versionNumber", scenario.currentVersion),
        )
        .collect(),
      ctx.db
        .query("scenario_snapshot_ratios")
        .withIndex("by_scenario_version", (q) =>
          q.eq("scenarioId", args.scenarioId).eq("versionNumber", scenario.currentVersion),
        )
        .collect(),
    ]);

    return {
      scenarioId: args.scenarioId,
      versionNumber: scenario.currentVersion,
      ...buildSnapshotStatementsResponse({
        metaDocs,
        monthlyDocs,
        annualDocs,
        ratioDocs,
        sectionKey: args.sectionKey,
      }),
    };
  },
});

export const getDiagnostics = query({
  args: {
    scenarioId: v.id("scenarios"),
  },
  handler: async (ctx, args) => {
    const { scenario } = await requireOwnedScenario(ctx, args.scenarioId);
    const [metaDocs, diagnosticsDocs] = await Promise.all([
      ctx.db
        .query("scenario_snapshot_meta")
        .withIndex("by_scenario_version", (q) =>
          q.eq("scenarioId", args.scenarioId).eq("versionNumber", scenario.currentVersion),
        )
        .collect(),
      ctx.db
        .query("scenario_snapshot_diagnostics")
        .withIndex("by_scenario_version", (q) =>
          q.eq("scenarioId", args.scenarioId).eq("versionNumber", scenario.currentVersion),
        )
        .collect(),
    ]);

    return {
      scenarioId: args.scenarioId,
      versionNumber: scenario.currentVersion,
      ...buildSnapshotDiagnosticsResponse({
        metaDocs,
        diagnosticsDocs,
      }),
    };
  },
});
