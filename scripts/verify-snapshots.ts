import { strict as assert } from "node:assert";
import type { Id } from "../convex/_generated/dataModel";
import {
  buildSnapshotDiagnosticsResponse,
  buildSnapshotOverviewResponse,
  buildSnapshotStatementsResponse,
} from "../convex/lib/scenario_snapshot_queries";
import {
  planScenarioSnapshotReplacement,
  serializeScenarioSnapshotRows,
  summarizeScenarioSnapshotRows,
} from "../convex/lib/scenario_snapshot_rows";
import { calculateScenario } from "../src/engine/orchestrator/calculate-scenario";
import { revenueParityFixtures } from "../src/engine/parity/revenue-fixtures";

type SnapshotTableName =
  | "scenario_snapshot_meta"
  | "scenario_snapshot_summary"
  | "scenario_snapshot_diagnostics"
  | "scenario_snapshot_ratios"
  | "scenario_snapshot_monthly"
  | "scenario_snapshot_annual";

function fakeId<TableName extends SnapshotTableName>(
  tableName: TableName,
  index: number,
) {
  return `${tableName}-${index}` as Id<TableName>;
}

const fixture = revenueParityFixtures[0];
const input = {
  ...fixture.input,
  ratioNorms: [
    {
      ratioKey: "current-ratio",
      year1Norm: 1.5,
      year2Norm: 1.6,
      year3Norm: 1.7,
      notes: "Baseline liquidity guardrail",
    },
    {
      ratioKey: "dscr",
      year1Norm: 1.25,
      year2Norm: 1.3,
      year3Norm: 1.35,
      notes: "Debt coverage target",
    },
  ],
};
const output = calculateScenario(input);
const rows = serializeScenarioSnapshotRows({
  output,
  ratioNorms: input.ratioNorms,
});
const summary = summarizeScenarioSnapshotRows(rows);
const sectionCount = Object.values(output.sections).length;

assert.equal(rows.monthly.length, sectionCount);
assert.equal(rows.annual.length, sectionCount);
assert.equal(summary.ratioNormCount, input.ratioNorms.length);
assert(summary.monthlySections.includes("income-statement"));
assert(summary.annualSections.includes("ratios"));
assert.equal(rows.summary.summaryJson.revenue, output.summary.revenue);
assert.equal(rows.ratios.ratiosJson.norms[0]?.ratioKey, "current-ratio");

const replacementPlan = planScenarioSnapshotReplacement({
  existing: {
    meta: [{ _id: fakeId("scenario_snapshot_meta", 1) }],
    summary: [{ _id: fakeId("scenario_snapshot_summary", 1) }],
    diagnostics: [{ _id: fakeId("scenario_snapshot_diagnostics", 1) }],
    ratios: [{ _id: fakeId("scenario_snapshot_ratios", 1) }],
    monthly: rows.monthly.map((_, index) => ({
      _id: fakeId("scenario_snapshot_monthly", index + 1),
    })),
    annual: rows.annual.map((_, index) => ({
      _id: fakeId("scenario_snapshot_annual", index + 1),
    })),
  },
  next: rows,
});

assert.equal(replacementPlan.deleteCount, replacementPlan.insertCount);
assert.equal(replacementPlan.inserts.monthly.length, rows.monthly.length);
assert.equal(replacementPlan.inserts.annual.length, rows.annual.length);

const missingOverview = buildSnapshotOverviewResponse({
  metaDocs: [],
  summaryDocs: [],
});
assert.equal(missingOverview.hasSnapshot, false);
assert.equal(missingOverview.summary, null);

const overview = buildSnapshotOverviewResponse({
  metaDocs: [rows.meta],
  summaryDocs: [rows.summary],
});
assert.equal(overview.hasSnapshot, true);
assert.equal(overview.summary?.revenue, output.summary.revenue);

const statements = buildSnapshotStatementsResponse({
  metaDocs: [rows.meta],
  monthlyDocs: rows.monthly,
  annualDocs: rows.annual,
  ratioDocs: [rows.ratios],
  sectionKey: "income-statement",
});
assert.equal(statements.hasSnapshot, true);
assert.equal(statements.monthlySections.length, 1);
assert.equal(statements.annualSections.length, 1);
assert.equal(statements.monthlySections[0]?.sectionKey, "income-statement");
assert.equal(statements.ratios, null);

const ratioStatements = buildSnapshotStatementsResponse({
  metaDocs: [rows.meta],
  monthlyDocs: rows.monthly,
  annualDocs: rows.annual,
  ratioDocs: [rows.ratios],
  sectionKey: "ratios",
});
assert.equal(ratioStatements.ratios?.sectionKey, "ratios");
assert.equal(ratioStatements.monthlySections[0]?.sectionKey, "ratios");
assert.equal(ratioStatements.annualSections[0]?.sectionKey, "ratios");

const diagnostics = buildSnapshotDiagnosticsResponse({
  metaDocs: [rows.meta],
  diagnosticsDocs: [rows.diagnostics],
});
assert.equal(diagnostics.hasSnapshot, true);
assert.equal(diagnostics.diagnostics?.length, output.diagnostics.length);

console.log(
  `Snapshot verification passed for ${fixture.name}: ${rows.monthly.length} monthly rows, ${rows.annual.length} annual rows.`,
);
