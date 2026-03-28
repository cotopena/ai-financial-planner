import { ScenarioDiagnosticsClient } from "@/components/scenarios/scenario-diagnostics-client";

export default async function DiagnosticsPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = await params;

  return <ScenarioDiagnosticsClient scenarioId={scenarioId} />;
}
