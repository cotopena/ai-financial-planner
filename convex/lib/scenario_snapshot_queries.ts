import type { DiagnosticCard, ScenarioOutput } from "../../src/engine/schemas/output-schema";
import type {
  SnapshotRatiosPayload,
  SnapshotSectionAnnualPayload,
  SnapshotSectionMonthlyPayload,
} from "./scenario_snapshot_rows";

type SnapshotMetaDoc = {
  generatedAt: number;
};

type SnapshotSummaryDoc = {
  summaryJson: ScenarioOutput["summary"];
};

type SnapshotDiagnosticsDoc = {
  cardsJson: DiagnosticCard[];
};

type SnapshotRatiosDoc = {
  ratiosJson: SnapshotRatiosPayload;
};

type SnapshotMonthlyDoc = {
  sectionKey: string;
  payloadJson: SnapshotSectionMonthlyPayload;
};

type SnapshotAnnualDoc = {
  sectionKey: string;
  payloadJson: SnapshotSectionAnnualPayload;
};

export type SnapshotOverviewResponse = {
  generatedAt: number | null;
  hasSnapshot: boolean;
  summary: ScenarioOutput["summary"] | null;
};

export type SnapshotStatementsResponse = {
  generatedAt: number | null;
  hasSnapshot: boolean;
  monthlySections: SnapshotSectionMonthlyPayload[];
  annualSections: SnapshotSectionAnnualPayload[];
  ratios: SnapshotRatiosPayload | null;
};

export type SnapshotDiagnosticsResponse = {
  generatedAt: number | null;
  hasSnapshot: boolean;
  diagnostics: DiagnosticCard[] | null;
};

export function buildSnapshotOverviewResponse({
  metaDocs,
  summaryDocs,
}: {
  metaDocs: SnapshotMetaDoc[];
  summaryDocs: SnapshotSummaryDoc[];
}): SnapshotOverviewResponse {
  return {
    generatedAt: metaDocs[0]?.generatedAt ?? null,
    hasSnapshot: metaDocs.length > 0 || summaryDocs.length > 0,
    summary: summaryDocs[0]?.summaryJson ?? null,
  };
}

export function buildSnapshotStatementsResponse({
  metaDocs,
  monthlyDocs,
  annualDocs,
  ratioDocs,
  sectionKey,
}: {
  metaDocs: SnapshotMetaDoc[];
  monthlyDocs: SnapshotMonthlyDoc[];
  annualDocs: SnapshotAnnualDoc[];
  ratioDocs: SnapshotRatiosDoc[];
  sectionKey?: string;
}): SnapshotStatementsResponse {
  const monthlySections =
    sectionKey === undefined
      ? monthlyDocs
      : monthlyDocs.filter((doc) => doc.sectionKey === sectionKey);
  const annualSections =
    sectionKey === undefined
      ? annualDocs
      : annualDocs.filter((doc) => doc.sectionKey === sectionKey);
  const ratios =
    sectionKey === undefined || sectionKey === "ratios"
      ? (ratioDocs[0]?.ratiosJson ?? null)
      : null;

  return {
    generatedAt: metaDocs[0]?.generatedAt ?? null,
    hasSnapshot:
      metaDocs.length > 0 ||
      monthlyDocs.length > 0 ||
      annualDocs.length > 0 ||
      ratioDocs.length > 0,
    monthlySections: monthlySections.map((doc) => doc.payloadJson),
    annualSections: annualSections.map((doc) => doc.payloadJson),
    ratios,
  };
}

export function buildSnapshotDiagnosticsResponse({
  metaDocs,
  diagnosticsDocs,
}: {
  metaDocs: SnapshotMetaDoc[];
  diagnosticsDocs: SnapshotDiagnosticsDoc[];
}): SnapshotDiagnosticsResponse {
  return {
    generatedAt: metaDocs[0]?.generatedAt ?? null,
    hasSnapshot: metaDocs.length > 0 || diagnosticsDocs.length > 0,
    diagnostics: diagnosticsDocs[0]?.cardsJson ?? null,
  };
}
