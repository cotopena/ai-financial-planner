import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ensureCurrentUser, getCurrentUser, requireOwnedBusiness } from "./lib/auth";
import { appendScenarioVersion, sortScenarios } from "./lib/scenario_records";

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return [];
    }

    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const businessesWithScenarioMeta = await Promise.all(
      businesses
        .filter((business) => !business.archivedAt)
        .map(async (business) => {
          const scenarios = sortScenarios(
            await ctx.db
              .query("scenarios")
              .withIndex("by_business", (q) => q.eq("businessId", business._id))
              .collect(),
          );
          const activeScenarios = scenarios.filter(
            (scenario) => scenario.status !== "archived",
          );
          const baseScenario =
            activeScenarios.find((scenario) => scenario.isBase) ??
            activeScenarios[0] ??
            scenarios[0] ??
            null;

          return {
            ...business,
            scenarioCount: scenarios.length,
            activeScenarioCount: activeScenarios.length,
            baseScenarioId: baseScenario?._id ?? null,
            baseScenarioName: baseScenario?.name ?? null,
            baseScenarioStatus: baseScenario?.status ?? null,
          };
        }),
    );

    return businessesWithScenarioMeta.sort(
      (left, right) => right._creationTime - left._creationTime,
    );
  },
});

export const get = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const { business } = await requireOwnedBusiness(ctx, args.businessId);
    const scenarios = sortScenarios(
      await ctx.db
        .query("scenarios")
        .withIndex("by_business", (q) => q.eq("businessId", business._id))
        .collect(),
    );

    return {
      ...business,
      scenarios,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    companyName: v.string(),
    preparerName: v.optional(v.string()),
    businessProfile: v.string(),
    businessStage: v.string(),
    startMonth: v.number(),
    startYear: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ensureCurrentUser(ctx);

    return ctx.db.insert("businesses", {
      userId: user._id,
      name: args.name,
      companyName: args.companyName,
      preparerName: args.preparerName,
      businessProfile: args.businessProfile,
      businessStage: args.businessStage,
      startMonth: args.startMonth,
      startYear: args.startYear,
      currencyCode: "USD",
      countryRegion: "US",
      notes: args.notes,
    });
  },
});

export const createWithBaseScenario = mutation({
  args: {
    name: v.string(),
    companyName: v.string(),
    preparerName: v.optional(v.string()),
    businessProfile: v.string(),
    businessStage: v.string(),
    startMonth: v.number(),
    startYear: v.number(),
    notes: v.optional(v.string()),
    scenarioName: v.string(),
    scenarioNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ensureCurrentUser(ctx);

    const businessId = await ctx.db.insert("businesses", {
      userId: user._id,
      name: args.name,
      companyName: args.companyName,
      preparerName: args.preparerName,
      businessProfile: args.businessProfile,
      businessStage: args.businessStage,
      startMonth: args.startMonth,
      startYear: args.startYear,
      currencyCode: "USD",
      countryRegion: "US",
      notes: args.notes,
    });

    const scenarioId = await ctx.db.insert("scenarios", {
      businessId,
      name: args.scenarioName,
      notes: args.scenarioNotes,
      isBase: true,
      status: "draft",
      currentVersion: 1,
    });

    await appendScenarioVersion(ctx, {
      scenarioId,
      versionNumber: 1,
      createdByUserId: user._id,
      changeSource: "manual",
      summary: "Scenario created alongside business shell",
    });

    return {
      businessId,
      scenarioId,
    };
  },
});

export const updateMeta = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.optional(v.string()),
    companyName: v.optional(v.string()),
    preparerName: v.optional(v.string()),
    businessProfile: v.optional(v.string()),
    businessStage: v.optional(v.string()),
    startMonth: v.optional(v.number()),
    startYear: v.optional(v.number()),
    notes: v.optional(v.string()),
    archive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { business } = await requireOwnedBusiness(ctx, args.businessId);

    const replacement = {
      userId: business.userId,
      name: args.name ?? business.name,
      companyName: args.companyName ?? business.companyName,
      preparerName: args.preparerName ?? business.preparerName,
      businessProfile: args.businessProfile ?? business.businessProfile,
      businessStage: args.businessStage ?? business.businessStage,
      startMonth: args.startMonth ?? business.startMonth,
      startYear: args.startYear ?? business.startYear,
      currencyCode: business.currencyCode,
      countryRegion: business.countryRegion,
      notes: args.notes ?? business.notes,
      ...(args.archive === true
        ? { archivedAt: Date.now() }
        : args.archive === false
          ? {}
          : business.archivedAt
            ? { archivedAt: business.archivedAt }
            : {}),
    };

    await ctx.db.replace(args.businessId, replacement);

    return args.businessId;
  },
});
