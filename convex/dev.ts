import { v } from "convex/values";
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

const foundationFixtureKey = v.union(
  v.literal("startup-no-debt"),
  v.literal("startup-multiple-debt"),
  v.literal("ongoing-opening-balances"),
);

type FoundationSeedFixtureKey =
  | "startup-no-debt"
  | "startup-multiple-debt"
  | "ongoing-opening-balances";

type FoundationSeedFixture = {
  businessName: string;
  companyName: string;
  scenarioName: string;
  businessMarker: string;
  scenarioMarker: string;
  businessStage: "startup" | "ongoing";
  businessProfile: string;
  openingAssets: Array<{
    category: string;
    amount: number;
    depreciationYears?: number;
    notes?: string;
  }>;
  startupCosts: Array<{
    category: string;
    amount: number;
    notes?: string;
  }>;
  fundingSources: Array<{
    category: string;
    amount: number;
    interestRate?: number;
    termMonths?: number;
    monthlyPaymentOverride?: number;
    notes?: string;
  }>;
  openingBalances: {
    cash: number;
    accountsReceivable: number;
    prepaidExpenses: number;
    accountsPayable: number;
    accruedExpenses: number;
  };
  capexLines: Array<{
    seedKey: string;
    category: string;
    depreciationYears: number;
    year2AnnualAmount: number;
    year3AnnualAmount: number;
  }>;
  capexMonths: Record<string, Array<{ monthIndex: number; amount: number }>>;
  taxSettings: {
    year1TaxRate: number;
    year2TaxRate: number;
    year3TaxRate: number;
    amortizationYears: number;
  };
};

const FOUNDATION_SEED_FIXTURES: Record<
  FoundationSeedFixtureKey,
  FoundationSeedFixture
> = {
  "startup-no-debt": {
    businessName: "PLAN-1004 Startup No Debt Seed",
    companyName: "PLAN-1004 Startup No Debt LLC",
    scenarioName: "Foundation startup no debt seed",
    businessMarker: "dev-seed:plan-1004-startup-no-debt-business",
    scenarioMarker: "dev-seed:plan-1004-startup-no-debt-scenario",
    businessStage: "startup",
    businessProfile: "services",
    openingAssets: [
      {
        category: "equipment",
        amount: 12000,
        depreciationYears: 5,
      },
      {
        category: "land",
        amount: 5000,
      },
    ],
    startupCosts: [
      {
        category: "pre_opening_wages",
        amount: 6000,
      },
      {
        category: "working_capital_cash_on_hand",
        amount: 12000,
      },
    ],
    fundingSources: [
      {
        category: "owner_equity",
        amount: 35000,
      },
    ],
    openingBalances: {
      cash: 0,
      accountsReceivable: 0,
      prepaidExpenses: 0,
      accountsPayable: 0,
      accruedExpenses: 0,
    },
    capexLines: [],
    capexMonths: {},
    taxSettings: {
      year1TaxRate: 0,
      year2TaxRate: 0,
      year3TaxRate: 0,
      amortizationYears: 5,
    },
  },
  "startup-multiple-debt": {
    businessName: "PLAN-1004 Startup Multiple Debt Seed",
    companyName: "PLAN-1004 Startup Multiple Debt LLC",
    scenarioName: "Foundation startup multiple debt seed",
    businessMarker: "dev-seed:plan-1004-startup-multiple-debt-business",
    scenarioMarker: "dev-seed:plan-1004-startup-multiple-debt-scenario",
    businessStage: "startup",
    businessProfile: "services",
    openingAssets: [
      {
        category: "equipment",
        amount: 1000,
        depreciationYears: 5,
      },
    ],
    startupCosts: [
      {
        category: "inventory",
        amount: 2400,
      },
      {
        category: "legal_accounting_fees",
        amount: 1200,
      },
    ],
    fundingSources: [
      {
        category: "owner_equity",
        amount: 1000,
      },
      {
        category: "commercial_loan",
        amount: 1200,
        interestRate: 0.12,
        termMonths: 12,
      },
      {
        category: "vehicle_loans",
        amount: 2400,
        interestRate: 0.12,
        termMonths: 24,
        monthlyPaymentOverride: 100,
      },
    ],
    openingBalances: {
      cash: 0,
      accountsReceivable: 0,
      prepaidExpenses: 0,
      accountsPayable: 0,
      accruedExpenses: 0,
    },
    capexLines: [
      {
        seedKey: "capex-equip",
        category: "equipment",
        depreciationYears: 2,
        year2AnnualAmount: 1200,
        year3AnnualAmount: 0,
      },
    ],
    capexMonths: {
      "capex-equip": [
        {
          monthIndex: 2,
          amount: 600,
        },
      ],
    },
    taxSettings: {
      year1TaxRate: 0,
      year2TaxRate: 0,
      year3TaxRate: 0,
      amortizationYears: 3,
    },
  },
  "ongoing-opening-balances": {
    businessName: "PLAN-1004 Ongoing Opening Balances Seed",
    companyName: "PLAN-1004 Ongoing Opening Balances LLC",
    scenarioName: "Foundation ongoing opening balances seed",
    businessMarker: "dev-seed:plan-1004-ongoing-opening-balances-business",
    scenarioMarker: "dev-seed:plan-1004-ongoing-opening-balances-scenario",
    businessStage: "ongoing",
    businessProfile: "services",
    openingAssets: [
      {
        category: "equipment",
        amount: 6000,
        depreciationYears: 3,
      },
    ],
    startupCosts: [
      {
        category: "legal_accounting_fees",
        amount: 1800,
      },
    ],
    fundingSources: [
      {
        category: "outside_investors",
        amount: 7800,
      },
    ],
    openingBalances: {
      cash: 10000,
      accountsReceivable: 2000,
      prepaidExpenses: 500,
      accountsPayable: 1500,
      accruedExpenses: 1000,
    },
    capexLines: [],
    capexMonths: {},
    taxSettings: {
      year1TaxRate: 0,
      year2TaxRate: 0,
      year3TaxRate: 0,
      amortizationYears: 3,
    },
  },
};

export const seedFoundationScenario = mutation({
  args: {
    fixtureKey: foundationFixtureKey,
  },
  handler: async (ctx, args) => {
    const user = await ensureCurrentUser(ctx);
    const fixture = FOUNDATION_SEED_FIXTURES[args.fixtureKey];
    const existingBusinesses = await ctx.db
      .query("businesses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    const activeSeedBusiness = existingBusinesses
      .filter((business) => !business.archivedAt)
      .find(
        (business) =>
          business.notes === fixture.businessMarker ||
          business.name === fixture.businessName,
      );

    const businessId =
      activeSeedBusiness?._id ??
      (await ctx.db.insert("businesses", {
        userId: user._id,
        name: fixture.businessName,
        companyName: fixture.companyName,
        preparerName: user.fullName,
        businessProfile: fixture.businessProfile,
        businessStage: fixture.businessStage,
        startMonth: 1,
        startYear: 2026,
        currencyCode: "USD",
        countryRegion: "US",
        notes: fixture.businessMarker,
      }));

    if (activeSeedBusiness) {
      await ctx.db.patch(activeSeedBusiness._id, {
        name: fixture.businessName,
        companyName: fixture.companyName,
        preparerName: user.fullName,
        businessProfile: fixture.businessProfile,
        businessStage: fixture.businessStage,
        startMonth: 1,
        startYear: 2026,
        notes: fixture.businessMarker,
      });
    }

    const scenarios = await ctx.db
      .query("scenarios")
      .withIndex("by_business", (q) => q.eq("businessId", businessId))
      .collect();
    const existingSeedScenario = scenarios.find(
      (scenario) =>
        scenario.notes === fixture.scenarioMarker ||
        scenario.name === fixture.scenarioName,
    );
    const nextVersion = existingSeedScenario
      ? existingSeedScenario.currentVersion + 1
      : 1;

    const scenarioId =
      existingSeedScenario?._id ??
      (await ctx.db.insert("scenarios", {
        businessId,
        name: fixture.scenarioName,
        notes: fixture.scenarioMarker,
        isBase: true,
        status: "draft",
        currentVersion: nextVersion,
      }));

    if (existingSeedScenario) {
      await ctx.db.patch(existingSeedScenario._id, {
        name: fixture.scenarioName,
        notes: fixture.scenarioMarker,
        isBase: true,
        status: "draft",
        currentVersion: nextVersion,
      });
    } else {
      await appendScenarioVersion(ctx, {
        scenarioId,
        versionNumber: nextVersion,
        createdByUserId: user._id,
        changeSource: "system",
        summary: `PLAN-1004 ${args.fixtureKey} foundation seed scenario created`,
      });
    }

    if (existingSeedScenario) {
      await appendScenarioVersion(ctx, {
        scenarioId,
        versionNumber: nextVersion,
        createdByUserId: user._id,
        changeSource: "system",
        summary: `PLAN-1004 ${args.fixtureKey} foundation seed scenario refreshed`,
      });
    }

    const [openingAssets, startupCosts, fundingSources, openingBalances, capexLines, taxSettings] =
      await Promise.all([
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
          .query("capex_lines")
          .withIndex("by_scenario_category", (q) => q.eq("scenarioId", scenarioId))
          .collect(),
        ctx.db
          .query("tax_settings")
          .withIndex("by_scenario", (q) => q.eq("scenarioId", scenarioId))
          .collect(),
      ]);
    const capexMonths = await Promise.all(
      capexLines.map((line) =>
        ctx.db
          .query("capex_months")
          .withIndex("by_capex_line_month", (q) => q.eq("capexLineId", line._id))
          .collect(),
      ),
    ).then((months) => months.flat());

    await deleteScenarioRecords({ ctx, rows: openingAssets });
    await deleteScenarioRecords({ ctx, rows: startupCosts });
    await deleteScenarioRecords({ ctx, rows: fundingSources });
    await deleteScenarioRecords({ ctx, rows: openingBalances });
    await deleteScenarioRecords({ ctx, rows: capexMonths });
    await deleteScenarioRecords({ ctx, rows: capexLines });
    await deleteScenarioRecords({ ctx, rows: taxSettings });

    for (const asset of fixture.openingAssets) {
      await ctx.db.insert("opening_assets", {
        scenarioId,
        category: asset.category,
        amount: asset.amount,
        depreciationYears: asset.depreciationYears,
        notes: asset.notes,
      });
    }

    for (const cost of fixture.startupCosts) {
      await ctx.db.insert("startup_costs", {
        scenarioId,
        category: cost.category,
        amount: cost.amount,
        notes: cost.notes,
      });
    }

    for (const source of fixture.fundingSources) {
      await ctx.db.insert("funding_sources", {
        scenarioId,
        category: source.category,
        amount: source.amount,
        interestRate: source.interestRate,
        termMonths: source.termMonths,
        monthlyPaymentOverride: source.monthlyPaymentOverride,
        notes: source.notes,
      });
    }

    await ctx.db.insert("opening_balances", {
      scenarioId,
      cash: fixture.openingBalances.cash,
      accountsReceivable: fixture.openingBalances.accountsReceivable,
      prepaidExpenses: fixture.openingBalances.prepaidExpenses,
      accountsPayable: fixture.openingBalances.accountsPayable,
      accruedExpenses: fixture.openingBalances.accruedExpenses,
    });

    const insertedCapexLineIds = new Map<string, Id<"capex_lines">>();

    for (const line of fixture.capexLines) {
      const capexLineId = await ctx.db.insert("capex_lines", {
        scenarioId,
        category: line.category,
        depreciationYears: line.depreciationYears,
        year2AnnualAmount: line.year2AnnualAmount,
        year3AnnualAmount: line.year3AnnualAmount,
      });

      insertedCapexLineIds.set(line.seedKey, capexLineId);
    }

    for (const [seedKey, months] of Object.entries(fixture.capexMonths)) {
      const capexLineId = insertedCapexLineIds.get(seedKey);

      if (!capexLineId) {
        continue;
      }

      for (const month of months) {
        await ctx.db.insert("capex_months", {
          capexLineId,
          monthIndex: month.monthIndex,
          amount: month.amount,
        });
      }
    }

    await ctx.db.insert("tax_settings", {
      scenarioId,
      year1TaxRate: fixture.taxSettings.year1TaxRate,
      year2TaxRate: fixture.taxSettings.year2TaxRate,
      year3TaxRate: fixture.taxSettings.year3TaxRate,
      amortizationYears: fixture.taxSettings.amortizationYears,
    });

    return {
      fixtureKey: args.fixtureKey,
      businessId,
      scenarioId,
      versionNumber: nextVersion,
      overviewUrl: `/app/businesses/${businessId}/scenarios/${scenarioId}/overview`,
      recalculateCommand: `npx convex run engine:recalculateScenario '{\"scenarioId\":\"${scenarioId}\"}'`,
    };
  },
});
