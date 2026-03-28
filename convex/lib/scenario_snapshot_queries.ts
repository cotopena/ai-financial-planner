import type { DiagnosticCard, ScenarioOutput } from "../../src/engine/schemas/output-schema";
import type {
  SnapshotRatiosPayload,
  SnapshotSectionAnnualPayload,
  SnapshotSectionMonthlyPayload,
} from "./scenario_snapshot_rows";

type SnapshotMetaDoc = {
  generatedAt: number;
  _creationTime?: number;
};

type SnapshotSummaryDoc = {
  summaryJson: ScenarioOutput["summary"];
  _creationTime?: number;
};

type SnapshotDiagnosticsDoc = {
  cardsJson: DiagnosticCard[];
  _creationTime?: number;
};

type SnapshotRatiosDoc = {
  ratiosJson: SnapshotRatiosPayload;
  _creationTime?: number;
};

type SnapshotMonthlyDoc = {
  sectionKey: string;
  payloadJson: SnapshotSectionMonthlyPayload;
  _creationTime?: number;
};

type SnapshotAnnualDoc = {
  sectionKey: string;
  payloadJson: SnapshotSectionAnnualPayload;
  _creationTime?: number;
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

function sortNewestByCreationTime<T extends { _creationTime?: number }>(docs: T[]) {
  return [...docs].sort(
    (left, right) =>
      (right._creationTime ?? Number.NEGATIVE_INFINITY) -
      (left._creationTime ?? Number.NEGATIVE_INFINITY),
  );
}

function selectNewestMetaDoc(metaDocs: SnapshotMetaDoc[]) {
  return [...metaDocs].sort((left, right) => {
    if (left.generatedAt !== right.generatedAt) {
      return right.generatedAt - left.generatedAt;
    }

    return (right._creationTime ?? 0) - (left._creationTime ?? 0);
  })[0];
}

function selectNewestDoc<T extends { _creationTime?: number }>(docs: T[]) {
  return sortNewestByCreationTime(docs)[0];
}

function selectNewestSectionDocs<
  T extends { sectionKey: string; _creationTime?: number },
>(docs: T[]) {
  const newestBySection = new Map<string, T>();

  for (const doc of sortNewestByCreationTime(docs)) {
    if (!newestBySection.has(doc.sectionKey)) {
      newestBySection.set(doc.sectionKey, doc);
    }
  }

  return [...newestBySection.values()].sort((left, right) =>
    left.sectionKey.localeCompare(right.sectionKey),
  );
}

export function buildSnapshotOverviewResponse({
  metaDocs,
  summaryDocs,
}: {
  metaDocs: SnapshotMetaDoc[];
  summaryDocs: SnapshotSummaryDoc[];
}): SnapshotOverviewResponse {
  const newestMeta = selectNewestMetaDoc(metaDocs);
  const newestSummary = selectNewestDoc(summaryDocs);

  return {
    generatedAt: newestMeta?.generatedAt ?? null,
    hasSnapshot: metaDocs.length > 0 || summaryDocs.length > 0,
    summary: newestSummary?.summaryJson ?? null,
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
  const newestMeta = selectNewestMetaDoc(metaDocs);
  const newestMonthlyDocs = selectNewestSectionDocs(monthlyDocs);
  const newestAnnualDocs = selectNewestSectionDocs(annualDocs);
  const newestRatioDoc = selectNewestDoc(ratioDocs);
  const monthlySections =
    sectionKey === undefined
      ? newestMonthlyDocs
      : newestMonthlyDocs.filter((doc) => doc.sectionKey === sectionKey);
  const annualSections =
    sectionKey === undefined
      ? newestAnnualDocs
      : newestAnnualDocs.filter((doc) => doc.sectionKey === sectionKey);
  const ratios =
    sectionKey === undefined || sectionKey === "ratios"
      ? (newestRatioDoc?.ratiosJson ?? null)
      : null;

  return {
    generatedAt: newestMeta?.generatedAt ?? null,
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
  const newestMeta = selectNewestMetaDoc(metaDocs);
  const newestDiagnostics = selectNewestDoc(diagnosticsDocs);

  return {
    generatedAt: newestMeta?.generatedAt ?? null,
    hasSnapshot: metaDocs.length > 0 || diagnosticsDocs.length > 0,
    diagnostics: newestDiagnostics?.cardsJson ?? null,
  };
}
