import type { Id } from "../_generated/dataModel";
import type { RatioNorm } from "../../src/engine/schemas/input-schema";
import type {
  AnnualValue,
  DiagnosticCard,
  MonthlyValue,
  ScenarioOutput,
} from "../../src/engine/schemas/output-schema";

export type SnapshotSectionMonthlyPayload = {
  sectionKey: string;
  notes: string[];
  monthly: MonthlyValue[];
};

export type SnapshotSectionAnnualPayload = {
  sectionKey: string;
  notes: string[];
  annual: AnnualValue[];
};

export type SnapshotRatiosPayload = {
  sectionKey: string;
  notes: string[];
  monthly: MonthlyValue[];
  annual: AnnualValue[];
  norms: RatioNorm[];
};

export type ScenarioSnapshotRows = {
  meta: {
    generatedAt: number;
    parityHash?: string;
  };
  summary: {
    summaryJson: ScenarioOutput["summary"];
  };
  diagnostics: {
    cardsJson: DiagnosticCard[];
  };
  ratios: {
    ratiosJson: SnapshotRatiosPayload;
  };
  monthly: Array<{
    sectionKey: string;
    payloadJson: SnapshotSectionMonthlyPayload;
  }>;
  annual: Array<{
    sectionKey: string;
    payloadJson: SnapshotSectionAnnualPayload;
  }>;
};

type ExistingSnapshotRows = {
  meta: Array<{ _id: Id<"scenario_snapshot_meta"> }>;
  summary: Array<{ _id: Id<"scenario_snapshot_summary"> }>;
  diagnostics: Array<{ _id: Id<"scenario_snapshot_diagnostics"> }>;
  ratios: Array<{ _id: Id<"scenario_snapshot_ratios"> }>;
  monthly: Array<{ _id: Id<"scenario_snapshot_monthly"> }>;
  annual: Array<{ _id: Id<"scenario_snapshot_annual"> }>;
};

export type ScenarioSnapshotReplacementPlan = {
  deleteIds: {
    meta: Id<"scenario_snapshot_meta">[];
    summary: Id<"scenario_snapshot_summary">[];
    diagnostics: Id<"scenario_snapshot_diagnostics">[];
    ratios: Id<"scenario_snapshot_ratios">[];
    monthly: Id<"scenario_snapshot_monthly">[];
    annual: Id<"scenario_snapshot_annual">[];
  };
  inserts: ScenarioSnapshotRows;
  deleteCount: number;
  insertCount: number;
};

function toGeneratedAt(output: ScenarioOutput) {
  const parsed = Date.parse(output.generatedAt);

  return Number.isNaN(parsed) ? Date.now() : parsed;
}

export function serializeScenarioSnapshotRows({
  output,
  ratioNorms,
}: {
  output: ScenarioOutput;
  ratioNorms: RatioNorm[];
}): ScenarioSnapshotRows {
  const sections = Object.values(output.sections);

  return {
    meta: {
      generatedAt: toGeneratedAt(output),
    },
    summary: {
      summaryJson: output.summary,
    },
    diagnostics: {
      cardsJson: output.diagnostics,
    },
    ratios: {
      ratiosJson: {
        sectionKey: output.sections.ratios.sectionKey,
        notes: output.sections.ratios.notes,
        monthly: output.sections.ratios.monthly,
        annual: output.sections.ratios.annual,
        norms: ratioNorms,
      },
    },
    monthly: sections.map((section) => ({
      sectionKey: section.sectionKey,
      payloadJson: {
        sectionKey: section.sectionKey,
        notes: section.notes,
        monthly: section.monthly,
      },
    })),
    annual: sections.map((section) => ({
      sectionKey: section.sectionKey,
      payloadJson: {
        sectionKey: section.sectionKey,
        notes: section.notes,
        annual: section.annual,
      },
    })),
  };
}

export function planScenarioSnapshotReplacement({
  existing,
  next,
}: {
  existing: ExistingSnapshotRows;
  next: ScenarioSnapshotRows;
}): ScenarioSnapshotReplacementPlan {
  const deleteIds = {
    meta: existing.meta.map((row) => row._id),
    summary: existing.summary.map((row) => row._id),
    diagnostics: existing.diagnostics.map((row) => row._id),
    ratios: existing.ratios.map((row) => row._id),
    monthly: existing.monthly.map((row) => row._id),
    annual: existing.annual.map((row) => row._id),
  };
  const deleteCount = Object.values(deleteIds).reduce(
    (total, ids) => total + ids.length,
    0,
  );
  const insertCount = 4 + next.monthly.length + next.annual.length;

  return {
    deleteIds,
    inserts: next,
    deleteCount,
    insertCount,
  };
}

export function summarizeScenarioSnapshotRows(rows: ScenarioSnapshotRows) {
  return {
    generatedAt: rows.meta.generatedAt,
    monthlySections: rows.monthly.map((row) => row.sectionKey),
    annualSections: rows.annual.map((row) => row.sectionKey),
    diagnosticsCount: rows.diagnostics.cardsJson.length,
    ratioNormCount: rows.ratios.ratiosJson.norms.length,
  };
}
