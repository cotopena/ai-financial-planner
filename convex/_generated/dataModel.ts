import type { AnyDataModel } from "convex/server";
import type { GenericId } from "convex/values";

export type TableNames =
  | "users"
  | "subscriptions"
  | "businesses"
  | "scenarios"
  | "scenario_versions"
  | "opening_assets"
  | "startup_costs"
  | "funding_sources"
  | "opening_balances"
  | "revenue_lines"
  | "revenue_overrides"
  | "payroll_roles"
  | "payroll_assumptions"
  | "payroll_overrides"
  | "operating_expense_lines"
  | "operating_expense_months"
  | "working_capital_settings"
  | "capex_lines"
  | "capex_months"
  | "tax_settings"
  | "cash_adjustment_months"
  | "ratio_norms"
  | "historical_actual_imports"
  | "historical_actual_rows"
  | "ai_conversations"
  | "ai_messages"
  | "ai_suggestions"
  | "ai_usage_events"
  | "scenario_snapshot_meta"
  | "scenario_snapshot_summary"
  | "scenario_snapshot_monthly"
  | "scenario_snapshot_annual"
  | "scenario_snapshot_diagnostics"
  | "scenario_snapshot_ratios"
  | "export_jobs";

export type Id<TableName extends string> = GenericId<TableName>;
export type Doc<TableName extends string> = Record<string, unknown> & {
  _id: Id<TableName>;
  _creationTime: number;
};
export type DataModel = AnyDataModel;
