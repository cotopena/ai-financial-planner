import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireOwnedScenario } from "./lib/auth";

const screenKey = v.union(
  v.literal("setup"),
  v.literal("opening-funding"),
  v.literal("revenue"),
  v.literal("payroll"),
  v.literal("expenses"),
  v.literal("cash-financing"),
);

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

export const getWorkspace = query({
  args: {
    scenarioId: v.id("scenarios"),
    screenKey,
  },
  handler: async (ctx, args) => {
    const { business, scenario } = await requireOwnedScenario(ctx, args.scenarioId);

    switch (args.screenKey) {
      case "setup":
        return { business, scenario };
      case "opening-funding":
        return {
          business,
          scenario,
          openingAssets: await ctx.db
            .query("opening_assets")
            .withIndex("by_scenario", (q) => q.eq("scenarioId", args.scenarioId))
            .collect(),
          startupCosts: await ctx.db
            .query("startup_costs")
            .withIndex("by_scenario", (q) => q.eq("scenarioId", args.scenarioId))
            .collect(),
          fundingSources: await ctx.db
            .query("funding_sources")
            .withIndex("by_scenario", (q) => q.eq("scenarioId", args.scenarioId))
            .collect(),
          openingBalances: await ctx.db
            .query("opening_balances")
            .withIndex("by_scenario", (q) => q.eq("scenarioId", args.scenarioId))
            .unique(),
        };
      case "revenue":
        return {
          scenario,
          revenueLines: await ctx.db
            .query("revenue_lines")
            .withIndex("by_scenario_sort_order", (q) =>
              q.eq("scenarioId", args.scenarioId),
            )
            .collect(),
          revenueOverrides: await ctx.db
            .query("revenue_overrides")
            .withIndex("by_scenario", (q) => q.eq("scenarioId", args.scenarioId))
            .collect(),
        };
      case "payroll":
        return {
          scenario,
          payrollRoles: await ctx.db
            .query("payroll_roles")
            .withIndex("by_scenario_sort_order", (q) =>
              q.eq("scenarioId", args.scenarioId),
            )
            .collect(),
          payrollAssumptions: await ctx.db
            .query("payroll_assumptions")
            .withIndex("by_scenario", (q) => q.eq("scenarioId", args.scenarioId))
            .unique(),
          payrollOverrides: await ctx.db
            .query("payroll_overrides")
            .withIndex("by_scenario", (q) => q.eq("scenarioId", args.scenarioId))
            .collect(),
        };
      case "expenses":
        return {
          scenario,
          operatingExpenseLines: await ctx.db
            .query("operating_expense_lines")
            .withIndex("by_scenario_sort_order", (q) =>
              q.eq("scenarioId", args.scenarioId),
            )
            .collect(),
        };
      case "cash-financing":
        return {
          scenario,
          workingCapitalSettings: await ctx.db
            .query("working_capital_settings")
            .withIndex("by_scenario", (q) => q.eq("scenarioId", args.scenarioId))
            .unique(),
          capexLines: await ctx.db
            .query("capex_lines")
            .withIndex("by_scenario", (q) => q.eq("scenarioId", args.scenarioId))
            .collect(),
          taxSettings: await ctx.db
            .query("tax_settings")
            .withIndex("by_scenario", (q) => q.eq("scenarioId", args.scenarioId))
            .unique(),
          cashAdjustmentMonths: await ctx.db
            .query("cash_adjustment_months")
            .withIndex("by_scenario", (q) => q.eq("scenarioId", args.scenarioId))
            .collect(),
        };
    }
  },
});

export const upsertSetup = mutation({
  args: {
    scenarioId: v.id("scenarios"),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    const { business, scenario, user } = await requireOwnedScenario(ctx, args.scenarioId);
    const payload = asRecord(args.payload);
    const businessPatch: Record<string, unknown> = {};
    const scenarioPatch: Record<string, unknown> = {};

    if (typeof payload.name === "string") businessPatch.name = payload.name;
    if (typeof payload.companyName === "string") {
      businessPatch.companyName = payload.companyName;
    }
    if (typeof payload.preparerName === "string") {
      businessPatch.preparerName = payload.preparerName;
    }
    if (typeof payload.businessProfile === "string") {
      businessPatch.businessProfile = payload.businessProfile;
    }
    if (typeof payload.businessStage === "string") {
      businessPatch.businessStage = payload.businessStage;
    }
    if (typeof payload.startMonth === "number") {
      businessPatch.startMonth = payload.startMonth;
    }
    if (typeof payload.startYear === "number") {
      businessPatch.startYear = payload.startYear;
    }
    if (typeof payload.notes === "string") {
      businessPatch.notes = payload.notes;
    }
    if (typeof payload.scenarioName === "string") {
      scenarioPatch.name = payload.scenarioName;
    }
    if (typeof payload.scenarioNotes === "string") {
      scenarioPatch.notes = payload.scenarioNotes;
    }

    if (Object.keys(businessPatch).length > 0) {
      await ctx.db.patch(business._id, businessPatch);
    }

    const nextVersion = scenario.currentVersion + 1;

    await ctx.db.patch(scenario._id, {
      ...scenarioPatch,
      currentVersion: nextVersion,
    });

    await ctx.db.insert("scenario_versions", {
      scenarioId: scenario._id,
      versionNumber: nextVersion,
      changeSource: "manual",
      summary: "Setup workspace updated",
      createdByUserId: user._id,
    });

    return {
      scenarioId: scenario._id,
      versionNumber: nextVersion,
    };
  },
});

export const upsertOpeningFunding = mutation({
  args: {
    scenarioId: v.id("scenarios"),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    await requireOwnedScenario(ctx, args.scenarioId);

    return {
      scenarioId: args.scenarioId,
      status: "stubbed",
      persistedTables: [
        "opening_assets",
        "startup_costs",
        "funding_sources",
        "opening_balances",
      ],
      payloadPreview: asRecord(args.payload),
    };
  },
});

export const upsertRevenue = mutation({
  args: {
    scenarioId: v.id("scenarios"),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    await requireOwnedScenario(ctx, args.scenarioId);

    return {
      scenarioId: args.scenarioId,
      status: "stubbed",
      persistedTables: ["revenue_lines", "revenue_overrides"],
      payloadPreview: asRecord(args.payload),
    };
  },
});

export const upsertPayroll = mutation({
  args: {
    scenarioId: v.id("scenarios"),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    await requireOwnedScenario(ctx, args.scenarioId);

    return {
      scenarioId: args.scenarioId,
      status: "stubbed",
      persistedTables: [
        "payroll_roles",
        "payroll_assumptions",
        "payroll_overrides",
      ],
      payloadPreview: asRecord(args.payload),
    };
  },
});

export const upsertExpenses = mutation({
  args: {
    scenarioId: v.id("scenarios"),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    await requireOwnedScenario(ctx, args.scenarioId);

    return {
      scenarioId: args.scenarioId,
      status: "stubbed",
      persistedTables: ["operating_expense_lines", "operating_expense_months"],
      payloadPreview: asRecord(args.payload),
    };
  },
});

export const upsertCashFinancing = mutation({
  args: {
    scenarioId: v.id("scenarios"),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    await requireOwnedScenario(ctx, args.scenarioId);

    return {
      scenarioId: args.scenarioId,
      status: "stubbed",
      persistedTables: [
        "working_capital_settings",
        "capex_lines",
        "capex_months",
        "tax_settings",
        "cash_adjustment_months",
      ],
      payloadPreview: asRecord(args.payload),
    };
  },
});
