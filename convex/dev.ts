import type { Doc, Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { ensureCurrentUser } from "./lib/auth";
import { appendScenarioVersion } from "./lib/scenario_records";

const seedBusinessName = "PLAN-1003 Reporting Verification Seed";
const seedScenarioName = "Snapshot-backed reporting seed";
const businessMarker = "dev-seed:plan-1003-reporting-business";
const scenarioMarker = "dev-seed:plan-1003-reporting-scenario";

async function deleteScenarioRecords<TableName extends keyof DocMap>({
  ctx,
  rows,
}: {
  ctx: MutationCtx;
  rows: Array<{ _id: Id<TableName> }>;
}) {
  for (const row of rows) {
    await ctx.db.delete(row._id);
  }
}

type DocMap = {
  opening_assets: Doc<"opening_assets">;
  startup_costs: Doc<"startup_costs">;
  funding_sources: Doc<"funding_sources">;
  opening_balances: Doc<"opening_balances">;
  revenue_lines: Doc<"revenue_lines">;
  revenue_overrides: Doc<"revenue_overrides">;
  payroll_roles: Doc<"payroll_roles">;
  payroll_assumptions: Doc<"payroll_assumptions">;
  payroll_overrides: Doc<"payroll_overrides">;
  operating_expense_lines: Doc<"operating_expense_lines">;
  operating_expense_months: Doc<"operating_expense_months">;
  working_capital_settings: Doc<"working_capital_settings">;
  capex_lines: Doc<"capex_lines">;
  capex_months: Doc<"capex_months">;
  tax_settings: Doc<"tax_settings">;
  cash_adjustment_months: Doc<"cash_adjustment_months">;
  ratio_norms: Doc<"ratio_norms">;
};

export const seedScenarioReporting = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ensureCurrentUser(ctx);
    const existingBusinesses = await ctx.db
      .query("businesses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    const activeSeedBusiness = existingBusinesses
      .filter((business) => !business.archivedAt)
      .find(
        (business) =>
          business.notes === businessMarker || business.name === seedBusinessName,
      );

    const businessId =
      activeSeedBusiness?._id ??
      (await ctx.db.insert("businesses", {
        userId: user._id,
        name: seedBusinessName,
        companyName: "PLAN-1003 Verification LLC",
        preparerName: user.fullName,
        businessProfile: "services",
        businessStage: "startup",
        startMonth: 1,
        startYear: 2026,
        currencyCode: "USD",
        countryRegion: "US",
        notes: businessMarker,
      }));

    if (activeSeedBusiness) {
      await ctx.db.patch(activeSeedBusiness._id, {
        name: seedBusinessName,
        companyName: "PLAN-1003 Verification LLC",
        preparerName: user.fullName,
        businessProfile: "services",
        businessStage: "startup",
        startMonth: 1,
        startYear: 2026,
        notes: businessMarker,
      });
    }

    const scenarios = await ctx.db
      .query("scenarios")
      .withIndex("by_business", (q) => q.eq("businessId", businessId))
      .collect();
    const existingSeedScenario = scenarios.find(
      (scenario) =>
        scenario.notes === scenarioMarker || scenario.name === seedScenarioName,
    );

    if (!existingSeedScenario) {
      await Promise.all(
        scenarios
          .filter((scenario) => scenario.isBase)
          .map((scenario) => ctx.db.patch(scenario._id, { isBase: false })),
      );
    }

    const scenarioId =
      existingSeedScenario?._id ??
      (await ctx.db.insert("scenarios", {
        businessId,
        name: seedScenarioName,
        notes: scenarioMarker,
        isBase: true,
        status: "draft",
        currentVersion: 1,
      }));

    if (existingSeedScenario) {
      await Promise.all(
        scenarios
          .filter(
            (scenario) => scenario._id !== existingSeedScenario._id && scenario.isBase,
          )
          .map((scenario) => ctx.db.patch(scenario._id, { isBase: false })),
      );
      await ctx.db.patch(existingSeedScenario._id, {
        name: seedScenarioName,
        notes: scenarioMarker,
        isBase: true,
        status: "draft",
      });
    } else {
      await appendScenarioVersion(ctx, {
        scenarioId,
        versionNumber: 1,
        createdByUserId: user._id,
        changeSource: "system",
        summary: "PLAN-1003 manual verification seed scenario created",
      });
    }

    const revenueLines = await ctx.db
      .query("revenue_lines")
      .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
      .collect();
    const operatingExpenseLines = await ctx.db
      .query("operating_expense_lines")
      .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
      .collect();
    const capexLines = await ctx.db
      .query("capex_lines")
      .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
      .collect();

    const [
      openingAssets,
      startupCosts,
      fundingSources,
      openingBalances,
      revenueOverrides,
      payrollRoles,
      payrollAssumptions,
      payrollOverrides,
      workingCapitalSettings,
      taxSettings,
      cashAdjustmentMonths,
      ratioNorms,
      operatingExpenseMonths,
      capexMonths,
    ] = await Promise.all([
      ctx.db
        .query("opening_assets")
        .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
        .collect(),
      ctx.db
        .query("startup_costs")
        .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
        .collect(),
      ctx.db
        .query("funding_sources")
        .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
        .collect(),
      ctx.db
        .query("opening_balances")
        .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
        .collect(),
      ctx.db
        .query("revenue_overrides")
        .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
        .collect(),
      ctx.db
        .query("payroll_roles")
        .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
        .collect(),
      ctx.db
        .query("payroll_assumptions")
        .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
        .collect(),
      ctx.db
        .query("payroll_overrides")
        .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
        .collect(),
      ctx.db
        .query("working_capital_settings")
        .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
        .collect(),
      ctx.db
        .query("tax_settings")
        .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
        .collect(),
      ctx.db
        .query("cash_adjustment_months")
        .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
        .collect(),
      ctx.db
        .query("ratio_norms")
        .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
        .collect(),
      Promise.all(
        operatingExpenseLines.map((line) =>
          ctx.db
            .query("operating_expense_months")
            .withIndex("by_expense_line", (q) => q.eq("expenseLineId", line._id))
            .collect(),
        ),
      ).then((months) => months.flat()),
      Promise.all(
        capexLines.map((line) =>
          ctx.db
            .query("capex_months")
            .withIndex("by_capex_line", (q) => q.eq("capexLineId", line._id))
            .collect(),
        ),
      ).then((months) => months.flat()),
    ]);

    await deleteScenarioRecords({ ctx, rows: openingAssets });
    await deleteScenarioRecords({ ctx, rows: startupCosts });
    await deleteScenarioRecords({ ctx, rows: fundingSources });
    await deleteScenarioRecords({ ctx, rows: openingBalances });
    await deleteScenarioRecords({ ctx, rows: revenueOverrides });
    await deleteScenarioRecords({ ctx, rows: payrollOverrides });
    await deleteScenarioRecords({ ctx, rows: payrollRoles });
    await deleteScenarioRecords({ ctx, rows: payrollAssumptions });
    await deleteScenarioRecords({ ctx, rows: operatingExpenseMonths });
    await deleteScenarioRecords({ ctx, rows: operatingExpenseLines });
    await deleteScenarioRecords({ ctx, rows: workingCapitalSettings });
    await deleteScenarioRecords({ ctx, rows: capexMonths });
    await deleteScenarioRecords({ ctx, rows: capexLines });
    await deleteScenarioRecords({ ctx, rows: taxSettings });
    await deleteScenarioRecords({ ctx, rows: cashAdjustmentMonths });
    await deleteScenarioRecords({ ctx, rows: ratioNorms });
    await deleteScenarioRecords({ ctx, rows: revenueLines });

    await ctx.db.insert("opening_balances", {
      scenarioId,
      cash: 18000,
      accountsReceivable: 0,
      prepaidExpenses: 0,
      accountsPayable: 0,
      accruedExpenses: 0,
    });

    await ctx.db.insert("revenue_lines", {
      scenarioId,
      sortOrder: 1,
      name: "Core planning engagement",
      unitLabel: "engagements",
      month1Units: 8,
      pricePerUnit: 3200,
      cogsPerUnit: 450,
      q1MonthlyGrowth: 0.04,
      q2MonthlyGrowth: 0.03,
      q3MonthlyGrowth: 0.03,
      q4MonthlyGrowth: 0.02,
      year2MonthlyGrowth: 0.01,
      year3MonthlyGrowth: 0.01,
      startMonthIndex: 1,
      isActive: true,
    });

    return {
      businessId,
      scenarioId,
      overviewUrl: `/app/businesses/${businessId}/scenarios/${scenarioId}/overview`,
    };
  },
});
