import { ScenarioOverviewClient } from "@/components/scenarios/scenario-overview-client";

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = await params;

  return <ScenarioOverviewClient scenarioId={scenarioId} />;
}
