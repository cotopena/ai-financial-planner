import { ScenarioManager } from "@/components/scenarios/scenario-manager";

export default async function ScenarioComparePage({
  params,
}: {
  params: Promise<{ businessId: string; scenarioId: string }>;
}) {
  const { businessId, scenarioId } = await params;

  return (
    <ScenarioManager
      businessId={businessId}
      currentScenarioId={scenarioId}
      mode="workspace"
    />
  );
}
