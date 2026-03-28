import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import {
  planScenarioSnapshotReplacement,
  serializeScenarioSnapshotRows,
} from "./lib/scenario_snapshot_rows";
import { ScenarioOutputSchema } from "../src/engine/schemas/output-schema";
import { RatioNormSchema } from "../src/engine/schemas/input-schema";

export const persistScenarioSnapshot = internalMutation({
  args: {
    scenarioId: v.id("scenarios"),
    versionNumber: v.number(),
    output: v.any(),
    ratioNorms: v.any(),
  },
  handler: async (ctx, args) => {
    const output = ScenarioOutputSchema.parse(args.output);
    const ratioNorms = RatioNormSchema.array().parse(args.ratioNorms ?? []);
    const existing = await Promise.all([
      ctx.db
        .query("scenario_snapshot_meta")
        .withIndex("by_scenario_version", (q) =>
          q.eq("scenarioId", args.scenarioId).eq("versionNumber", args.versionNumber),
        )
        .collect(),
      ctx.db
        .query("scenario_snapshot_summary")
        .withIndex("by_scenario_version", (q) =>
          q.eq("scenarioId", args.scenarioId).eq("versionNumber", args.versionNumber),
        )
        .collect(),
      ctx.db
        .query("scenario_snapshot_diagnostics")
        .withIndex("by_scenario_version", (q) =>
          q.eq("scenarioId", args.scenarioId).eq("versionNumber", args.versionNumber),
        )
        .collect(),
      ctx.db
        .query("scenario_snapshot_ratios")
        .withIndex("by_scenario_version", (q) =>
          q.eq("scenarioId", args.scenarioId).eq("versionNumber", args.versionNumber),
        )
        .collect(),
      ctx.db
        .query("scenario_snapshot_monthly")
        .withIndex("by_scenario_version", (q) =>
          q.eq("scenarioId", args.scenarioId).eq("versionNumber", args.versionNumber),
        )
        .collect(),
      ctx.db
        .query("scenario_snapshot_annual")
        .withIndex("by_scenario_version", (q) =>
          q.eq("scenarioId", args.scenarioId).eq("versionNumber", args.versionNumber),
        )
        .collect(),
    ]);
    const rows = serializeScenarioSnapshotRows({
      output,
      ratioNorms,
    });
    const plan = planScenarioSnapshotReplacement({
      existing: {
        meta: existing[0],
        summary: existing[1],
        diagnostics: existing[2],
        ratios: existing[3],
        monthly: existing[4],
        annual: existing[5],
      },
      next: rows,
    });

    for (const id of plan.deleteIds.meta) {
      await ctx.db.delete(id);
    }
    for (const id of plan.deleteIds.summary) {
      await ctx.db.delete(id);
    }
    for (const id of plan.deleteIds.diagnostics) {
      await ctx.db.delete(id);
    }
    for (const id of plan.deleteIds.ratios) {
      await ctx.db.delete(id);
    }
    for (const id of plan.deleteIds.monthly) {
      await ctx.db.delete(id);
    }
    for (const id of plan.deleteIds.annual) {
      await ctx.db.delete(id);
    }

    await ctx.db.insert("scenario_snapshot_meta", {
      scenarioId: args.scenarioId,
      versionNumber: args.versionNumber,
      ...plan.inserts.meta,
    });
    await ctx.db.insert("scenario_snapshot_summary", {
      scenarioId: args.scenarioId,
      versionNumber: args.versionNumber,
      ...plan.inserts.summary,
    });
    await ctx.db.insert("scenario_snapshot_diagnostics", {
      scenarioId: args.scenarioId,
      versionNumber: args.versionNumber,
      ...plan.inserts.diagnostics,
    });
    await ctx.db.insert("scenario_snapshot_ratios", {
      scenarioId: args.scenarioId,
      versionNumber: args.versionNumber,
      ...plan.inserts.ratios,
    });

    for (const row of plan.inserts.monthly) {
      await ctx.db.insert("scenario_snapshot_monthly", {
        scenarioId: args.scenarioId,
        versionNumber: args.versionNumber,
        ...row,
      });
    }
    for (const row of plan.inserts.annual) {
      await ctx.db.insert("scenario_snapshot_annual", {
        scenarioId: args.scenarioId,
        versionNumber: args.versionNumber,
        ...row,
      });
    }

    return {
      scenarioId: args.scenarioId,
      versionNumber: args.versionNumber,
      generatedAt: plan.inserts.meta.generatedAt,
      replaced: plan.deleteCount,
      inserted: plan.insertCount,
      monthlySections: plan.inserts.monthly.map((row) => row.sectionKey),
      annualSections: plan.inserts.annual.map((row) => row.sectionKey),
      diagnosticsCount: plan.inserts.diagnostics.cardsJson.length,
    };
  },
});
