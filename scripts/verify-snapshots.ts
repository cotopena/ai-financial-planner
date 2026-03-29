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
import { foundationParityFixtures } from "../src/engine/parity/foundation-fixtures";

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

const fixture = foundationParityFixtures[1];
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
assert.equal(
  (
    rows.monthly.find((row) => row.sectionKey === "debt-schedules")?.payloadJson
      .detailsJson as { loans?: unknown[] } | undefined
  )?.loans?.length,
  output.sections.debtSchedules.loans.length,
);
assert.equal(
  (
    rows.annual.find((row) => row.sectionKey === "opening-position")?.payloadJson
      .detailsJson as { totals?: { openingCashPosition?: number } } | undefined
  )?.totals?.openingCashPosition,
  output.sections.openingPosition.totals.openingCashPosition,
);

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
  metaDocs: [
    { ...rows.meta, generatedAt: rows.meta.generatedAt - 5000, _creationTime: 1 },
    { ...rows.meta, _creationTime: 2 },
  ],
  summaryDocs: [
    {
      ...rows.summary,
      summaryJson: {
        ...rows.summary.summaryJson,
        revenue: 1,
      },
      _creationTime: 1,
    },
    { ...rows.summary, _creationTime: 2 },
  ],
});
assert.equal(overview.hasSnapshot, true);
assert.equal(overview.summary?.revenue, output.summary.revenue);

const statements = buildSnapshotStatementsResponse({
  metaDocs: [{ ...rows.meta, _creationTime: 2 }],
  monthlyDocs: [
    ...rows.monthly.map((row) => ({
      ...row,
      payloadJson: {
        ...row.payloadJson,
        notes: ["stale"],
      },
      _creationTime: 1,
    })),
    ...rows.monthly.map((row) => ({ ...row, _creationTime: 2 })),
  ],
  annualDocs: [
    ...rows.annual.map((row) => ({
      ...row,
      payloadJson: {
        ...row.payloadJson,
        notes: ["stale"],
      },
      _creationTime: 1,
    })),
    ...rows.annual.map((row) => ({ ...row, _creationTime: 2 })),
  ],
  ratioDocs: [
    {
      ...rows.ratios,
      ratiosJson: {
        ...rows.ratios.ratiosJson,
        notes: ["stale"],
      },
      _creationTime: 1,
    },
    { ...rows.ratios, _creationTime: 2 },
  ],
  sectionKey: "income-statement",
});
assert.equal(statements.hasSnapshot, true);
assert.equal(statements.monthlySections.length, 1);
assert.equal(statements.annualSections.length, 1);
assert.equal(statements.monthlySections[0]?.sectionKey, "income-statement");
assert.deepEqual(
  statements.monthlySections[0]?.notes,
  rows.monthly.find((row) => row.sectionKey === "income-statement")?.payloadJson.notes,
);
assert.equal(statements.ratios, null);

const ratioStatements = buildSnapshotStatementsResponse({
  metaDocs: [{ ...rows.meta, _creationTime: 2 }],
  monthlyDocs: rows.monthly.map((row) => ({ ...row, _creationTime: 2 })),
  annualDocs: rows.annual.map((row) => ({ ...row, _creationTime: 2 })),
  ratioDocs: [{ ...rows.ratios, _creationTime: 2 }],
  sectionKey: "ratios",
});
assert.equal(ratioStatements.ratios?.sectionKey, "ratios");
assert.equal(ratioStatements.monthlySections[0]?.sectionKey, "ratios");
assert.equal(ratioStatements.annualSections[0]?.sectionKey, "ratios");

const diagnostics = buildSnapshotDiagnosticsResponse({
  metaDocs: [{ ...rows.meta, _creationTime: 2 }],
  diagnosticsDocs: [
    {
      ...rows.diagnostics,
      cardsJson: [],
      _creationTime: 1,
    },
    { ...rows.diagnostics, _creationTime: 2 },
  ],
});
assert.equal(diagnostics.hasSnapshot, true);
assert.equal(diagnostics.diagnostics?.length, output.diagnostics.length);

console.log(
  `Snapshot verification passed for ${fixture.name}: ${rows.monthly.length} monthly rows, ${rows.annual.length} annual rows.`,
);
