import { ScenarioManager } from "@/components/scenarios/scenario-manager";

export default async function BusinessScenarioListPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;

  return <ScenarioManager businessId={businessId} mode="business" />;
}
