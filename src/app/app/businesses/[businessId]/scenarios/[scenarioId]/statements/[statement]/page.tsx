import { notFound } from "next/navigation";
import { ScenarioStatementsClient } from "@/components/scenarios/scenario-statements-client";
import {
  isStatementSlug,
  type StatementSlug,
} from "@/lib/scenario-reporting";

export default async function StatementPage({
  params,
}: {
  params: Promise<{
    businessId: string;
    scenarioId: string;
    statement: string;
  }>;
}) {
  const { businessId, scenarioId, statement } = await params;

  if (!isStatementSlug(statement)) {
    notFound();
  }

  return (
    <ScenarioStatementsClient
      businessId={businessId}
      scenarioId={scenarioId}
      statement={statement as StatementSlug}
    />
  );
}
