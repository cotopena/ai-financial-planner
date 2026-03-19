import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  ensureCurrentUser,
  requireOwnedBusiness,
  requireOwnedScenario,
} from "./lib/auth";
import { appendScenarioVersion, sortScenarios } from "./lib/scenario_records";

export const listByBusiness = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    await requireOwnedBusiness(ctx, args.businessId);

    return sortScenarios(
      await ctx.db
        .query("scenarios")
        .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
        .collect(),
    );
  },
});

export const get = query({
  args: {
    scenarioId: v.id("scenarios"),
  },
  handler: async (ctx, args) => {
    const { business, scenario } = await requireOwnedScenario(ctx, args.scenarioId);
    const siblingScenarios = sortScenarios(
      await ctx.db
        .query("scenarios")
        .withIndex("by_business", (q) => q.eq("businessId", business._id))
        .collect(),
    );

    return {
      business,
      scenario,
      siblingScenarios,
    };
  },
});

export const create = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.string(),
    notes: v.optional(v.string()),
    isBase: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await ensureCurrentUser(ctx);
    const { business } = await requireOwnedBusiness(ctx, args.businessId);
    const existing = await ctx.db
      .query("scenarios")
      .withIndex("by_business", (q) => q.eq("businessId", business._id))
      .collect();

    const shouldBeBase = args.isBase ?? existing.length === 0;

    if (shouldBeBase) {
      await Promise.all(
        existing
          .filter((scenario) => scenario.isBase)
          .map((scenario) => ctx.db.patch(scenario._id, { isBase: false })),
      );
    }

    const scenarioId = await ctx.db.insert("scenarios", {
      businessId: business._id,
      name: args.name,
      notes: args.notes,
      isBase: shouldBeBase,
      status: "draft",
      currentVersion: 1,
    });

    await appendScenarioVersion(ctx, {
      scenarioId,
      versionNumber: 1,
      createdByUserId: user._id,
      changeSource: "manual",
      summary: "Scenario created",
    });

    return scenarioId;
  },
});

export const clone = mutation({
  args: {
    scenarioId: v.id("scenarios"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const { scenario, user } = await requireOwnedScenario(ctx, args.scenarioId);

    const clonedScenarioId = await ctx.db.insert("scenarios", {
      businessId: scenario.businessId,
      name: args.name,
      notes: scenario.notes,
      isBase: false,
      status: "draft",
      currentVersion: 1,
    });

    await appendScenarioVersion(ctx, {
      scenarioId: clonedScenarioId,
      versionNumber: 1,
      createdByUserId: user._id,
      changeSource: "system",
      summary: "Scenario shell cloned; assumption copy remains a later sprint task.",
    });

    return {
      scenarioId: clonedScenarioId,
      clonedAssumptions: false,
    };
  },
});

export const updateMeta = mutation({
  args: {
    scenarioId: v.id("scenarios"),
    name: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("draft"), v.literal("ready"), v.literal("archived")),
    ),
    isBase: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { scenario, user } = await requireOwnedScenario(ctx, args.scenarioId);

    if (args.isBase === true) {
      const siblings = await ctx.db
        .query("scenarios")
        .withIndex("by_business", (q) => q.eq("businessId", scenario.businessId))
        .collect();

      await Promise.all(
        siblings
          .filter((sibling) => sibling._id !== scenario._id && sibling.isBase)
          .map((sibling) => ctx.db.patch(sibling._id, { isBase: false })),
      );
    }

    const nextVersion = scenario.currentVersion + 1;

    await ctx.db.patch(args.scenarioId, {
      ...(args.name ? { name: args.name } : {}),
      ...(args.notes ? { notes: args.notes } : {}),
      ...(args.status ? { status: args.status } : {}),
      ...(args.isBase !== undefined ? { isBase: args.isBase } : {}),
      currentVersion: nextVersion,
    });

    await appendScenarioVersion(ctx, {
      scenarioId: args.scenarioId,
      versionNumber: nextVersion,
      createdByUserId: user._id,
      changeSource: "manual",
      summary: "Scenario metadata updated",
    });

    return args.scenarioId;
  },
});
