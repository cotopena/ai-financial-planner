import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const planKey = v.union(v.literal("builder"), v.literal("pro"));
const subscriptionStatus = v.union(
  v.literal("trialing"),
  v.literal("active"),
  v.literal("past_due"),
  v.literal("canceled"),
  v.literal("incomplete"),
);
const scenarioStatus = v.union(
  v.literal("draft"),
  v.literal("ready"),
  v.literal("archived"),
);
const changeSource = v.union(
  v.literal("manual"),
  v.literal("wizard"),
  v.literal("ai_approved"),
  v.literal("csv_import"),
  v.literal("system"),
);
const importSourceType = v.union(v.literal("csv"), v.literal("manual"));
const importStatus = v.union(
  v.literal("uploaded"),
  v.literal("mapped"),
  v.literal("validated"),
  v.literal("applied"),
  v.literal("failed"),
);
const suggestionStatus = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected"),
  v.literal("expired"),
);
const exportType = v.union(v.literal("pdf"), v.literal("csv"));
const exportStatus = v.union(
  v.literal("queued"),
  v.literal("running"),
  v.literal("completed"),
  v.literal("failed"),
);

export default defineSchema({
  users: defineTable({
    authSubject: v.string(),
    email: v.string(),
    fullName: v.string(),
    defaultPlanKey: planKey,
    lastSeenAt: v.number(),
  })
    .index("by_auth_subject", ["authSubject"])
    .index("by_email", ["email"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    planKey,
    status: subscriptionStatus,
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    aiActionLimit: v.number(),
    aiActionsUsed: v.number(),
    lastResetAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_stripe_customer_id", ["stripeCustomerId"])
    .index("by_stripe_subscription_id", ["stripeSubscriptionId"]),

  businesses: defineTable({
    userId: v.id("users"),
    name: v.string(),
    companyName: v.string(),
    preparerName: v.optional(v.string()),
    businessProfile: v.string(),
    businessStage: v.string(),
    startMonth: v.number(),
    startYear: v.number(),
    currencyCode: v.literal("USD"),
    countryRegion: v.literal("US"),
    notes: v.optional(v.string()),
    archivedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_archived", ["userId", "archivedAt"]),

  scenarios: defineTable({
    businessId: v.id("businesses"),
    name: v.string(),
    notes: v.optional(v.string()),
    isBase: v.boolean(),
    status: scenarioStatus,
    currentVersion: v.number(),
  })
    .index("by_business", ["businessId"])
    .index("by_business_base", ["businessId", "isBase"]),

  scenario_versions: defineTable({
    scenarioId: v.id("scenarios"),
    versionNumber: v.number(),
    changeSource,
    aiSuggestionId: v.optional(v.id("ai_suggestions")),
    summary: v.optional(v.string()),
    createdByUserId: v.optional(v.id("users")),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_scenario_version", ["scenarioId", "versionNumber"]),

  opening_assets: defineTable({
    scenarioId: v.id("scenarios"),
    category: v.string(),
    amount: v.number(),
    depreciationYears: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_scenario_category", ["scenarioId", "category"]),

  startup_costs: defineTable({
    scenarioId: v.id("scenarios"),
    category: v.string(),
    amount: v.number(),
    notes: v.optional(v.string()),
  }).index("by_scenario", ["scenarioId"]),

  funding_sources: defineTable({
    scenarioId: v.id("scenarios"),
    category: v.string(),
    amount: v.number(),
    interestRate: v.optional(v.number()),
    termMonths: v.optional(v.number()),
    monthlyPaymentOverride: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_scenario_category", ["scenarioId", "category"]),

  opening_balances: defineTable({
    scenarioId: v.id("scenarios"),
    cash: v.number(),
    accountsReceivable: v.number(),
    prepaidExpenses: v.number(),
    accountsPayable: v.number(),
    accruedExpenses: v.number(),
  }).index("by_scenario", ["scenarioId"]),

  revenue_lines: defineTable({
    scenarioId: v.id("scenarios"),
    sortOrder: v.number(),
    name: v.string(),
    unitLabel: v.string(),
    month1Units: v.number(),
    pricePerUnit: v.number(),
    cogsPerUnit: v.number(),
    q1MonthlyGrowth: v.number(),
    q2MonthlyGrowth: v.number(),
    q3MonthlyGrowth: v.number(),
    q4MonthlyGrowth: v.number(),
    year2MonthlyGrowth: v.number(),
    year3MonthlyGrowth: v.number(),
    startMonthIndex: v.number(),
    endMonthIndex: v.optional(v.number()),
    isActive: v.boolean(),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_scenario_sort_order", ["scenarioId", "sortOrder"]),

  revenue_overrides: defineTable({
    scenarioId: v.id("scenarios"),
    revenueLineId: v.id("revenue_lines"),
    monthIndex: v.number(),
    metric: v.string(),
    overrideValue: v.number(),
    reason: v.string(),
    source: v.string(),
    isActive: v.boolean(),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_line_month_metric", ["revenueLineId", "monthIndex", "metric"]),

  payroll_roles: defineTable({
    scenarioId: v.id("scenarios"),
    sortOrder: v.number(),
    roleName: v.string(),
    roleType: v.string(),
    compensationMode: v.string(),
    headcount: v.number(),
    hourlyRate: v.optional(v.number()),
    monthlyPay: v.optional(v.number()),
    hoursPerWeek: v.optional(v.number()),
    startMonthIndex: v.number(),
    endMonthIndex: v.optional(v.number()),
    year2Growth: v.number(),
    year3Growth: v.number(),
    isActive: v.boolean(),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_scenario_sort_order", ["scenarioId", "sortOrder"]),

  payroll_assumptions: defineTable({
    scenarioId: v.id("scenarios"),
    socialSecurityRate: v.number(),
    medicareRate: v.number(),
    futaRate: v.number(),
    futaWageBase: v.number(),
    sutaRate: v.number(),
    sutaWageBase: v.number(),
    pensionRate: v.number(),
    workersCompRate: v.number(),
    healthInsuranceRate: v.number(),
    otherBenefitsRate: v.number(),
  }).index("by_scenario", ["scenarioId"]),

  payroll_overrides: defineTable({
    scenarioId: v.id("scenarios"),
    payrollRoleId: v.id("payroll_roles"),
    monthIndex: v.number(),
    metric: v.string(),
    overrideValue: v.number(),
    reason: v.string(),
    source: v.string(),
    isActive: v.boolean(),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_role_month_metric", ["payrollRoleId", "monthIndex", "metric"]),

  operating_expense_lines: defineTable({
    scenarioId: v.id("scenarios"),
    sortOrder: v.number(),
    categoryKey: v.string(),
    label: v.string(),
    isCustom: v.boolean(),
    year2GrowthRate: v.number(),
    year3GrowthRate: v.number(),
    isActive: v.boolean(),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_scenario_sort_order", ["scenarioId", "sortOrder"]),

  operating_expense_months: defineTable({
    expenseLineId: v.id("operating_expense_lines"),
    monthIndex: v.number(),
    amount: v.number(),
  })
    .index("by_expense_line", ["expenseLineId"])
    .index("by_expense_line_month", ["expenseLineId", "monthIndex"]),

  working_capital_settings: defineTable({
    scenarioId: v.id("scenarios"),
    arWithin30: v.number(),
    ar30To60: v.number(),
    arOver60: v.number(),
    badDebtAllowance: v.number(),
    apWithin30: v.number(),
    ap30To60: v.number(),
    apOver60: v.number(),
    desiredMinCash: v.number(),
    locInterestRate: v.number(),
    financingBehavior: v.string(),
  }).index("by_scenario", ["scenarioId"]),

  capex_lines: defineTable({
    scenarioId: v.id("scenarios"),
    category: v.string(),
    depreciationYears: v.number(),
    year2AnnualAmount: v.number(),
    year3AnnualAmount: v.number(),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_scenario_category", ["scenarioId", "category"]),

  capex_months: defineTable({
    capexLineId: v.id("capex_lines"),
    monthIndex: v.number(),
    amount: v.number(),
  })
    .index("by_capex_line", ["capexLineId"])
    .index("by_capex_line_month", ["capexLineId", "monthIndex"]),

  tax_settings: defineTable({
    scenarioId: v.id("scenarios"),
    year1TaxRate: v.number(),
    year2TaxRate: v.number(),
    year3TaxRate: v.number(),
    amortizationYears: v.number(),
  }).index("by_scenario", ["scenarioId"]),

  cash_adjustment_months: defineTable({
    scenarioId: v.id("scenarios"),
    monthIndex: v.number(),
    taxesPaid: v.number(),
    ownerDraws: v.number(),
    dividends: v.number(),
    additionalInventory: v.number(),
    manualLocRepayment: v.number(),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_scenario_month", ["scenarioId", "monthIndex"]),

  ratio_norms: defineTable({
    scenarioId: v.id("scenarios"),
    ratioKey: v.string(),
    year1Norm: v.optional(v.number()),
    year2Norm: v.optional(v.number()),
    year3Norm: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_scenario_ratio", ["scenarioId", "ratioKey"]),

  historical_actual_imports: defineTable({
    scenarioId: v.id("scenarios"),
    sourceType: importSourceType,
    uploadName: v.string(),
    mappingJson: v.any(),
    importStatus,
    periodCount: v.number(),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_scenario_status", ["scenarioId", "importStatus"]),

  historical_actual_rows: defineTable({
    importId: v.id("historical_actual_imports"),
    periodStart: v.string(),
    metricKey: v.string(),
    categoryKey: v.optional(v.string()),
    amount: v.number(),
  })
    .index("by_import", ["importId"])
    .index("by_import_period", ["importId", "periodStart"]),

  ai_conversations: defineTable({
    scenarioId: v.id("scenarios"),
    screenContext: v.string(),
    conversationType: v.string(),
  }).index("by_scenario", ["scenarioId"]),

  ai_messages: defineTable({
    conversationId: v.id("ai_conversations"),
    role: v.string(),
    content: v.string(),
    modelName: v.optional(v.string()),
    usageJson: v.optional(v.any()),
  }).index("by_conversation", ["conversationId"]),

  ai_suggestions: defineTable({
    conversationId: v.id("ai_conversations"),
    scenarioId: v.id("scenarios"),
    suggestionType: v.string(),
    proposedChangesJson: v.any(),
    impactSummaryJson: v.any(),
    status: suggestionStatus,
    approvedAt: v.optional(v.number()),
    rejectedAt: v.optional(v.number()),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_conversation", ["conversationId"])
    .index("by_scenario_status", ["scenarioId", "status"]),

  ai_usage_events: defineTable({
    userId: v.id("users"),
    scenarioId: v.optional(v.id("scenarios")),
    conversationId: v.optional(v.id("ai_conversations")),
    actionType: v.string(),
    actionsConsumed: v.number(),
    providerCostUsd: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_period", ["userId", "_creationTime"]),

  scenario_snapshot_meta: defineTable({
    scenarioId: v.id("scenarios"),
    versionNumber: v.number(),
    parityHash: v.optional(v.string()),
    generatedAt: v.number(),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_scenario_version", ["scenarioId", "versionNumber"]),

  scenario_snapshot_summary: defineTable({
    scenarioId: v.id("scenarios"),
    versionNumber: v.number(),
    summaryJson: v.any(),
  }).index("by_scenario_version", ["scenarioId", "versionNumber"]),

  scenario_snapshot_monthly: defineTable({
    scenarioId: v.id("scenarios"),
    versionNumber: v.number(),
    sectionKey: v.string(),
    payloadJson: v.any(),
  })
    .index("by_scenario_version", ["scenarioId", "versionNumber"])
    .index("by_scenario_version_section", [
      "scenarioId",
      "versionNumber",
      "sectionKey",
    ]),

  scenario_snapshot_annual: defineTable({
    scenarioId: v.id("scenarios"),
    versionNumber: v.number(),
    sectionKey: v.string(),
    payloadJson: v.any(),
  })
    .index("by_scenario_version", ["scenarioId", "versionNumber"])
    .index("by_scenario_version_section", [
      "scenarioId",
      "versionNumber",
      "sectionKey",
    ]),

  scenario_snapshot_diagnostics: defineTable({
    scenarioId: v.id("scenarios"),
    versionNumber: v.number(),
    cardsJson: v.any(),
  }).index("by_scenario_version", ["scenarioId", "versionNumber"]),

  scenario_snapshot_ratios: defineTable({
    scenarioId: v.id("scenarios"),
    versionNumber: v.number(),
    ratiosJson: v.any(),
  }).index("by_scenario_version", ["scenarioId", "versionNumber"]),

  export_jobs: defineTable({
    scenarioId: v.id("scenarios"),
    exportType,
    status: exportStatus,
    optionsJson: v.any(),
    storageId: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    completedAt: v.optional(v.number()),
  })
    .index("by_scenario", ["scenarioId"])
    .index("by_scenario_status", ["scenarioId", "status"]),
});
