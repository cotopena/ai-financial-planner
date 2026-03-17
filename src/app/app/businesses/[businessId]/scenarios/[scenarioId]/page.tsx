import { redirect } from "next/navigation";

export default async function ScenarioRootPage({
  params,
}: {
  params: Promise<{ businessId: string; scenarioId: string }>;
}) {
  const { businessId, scenarioId } = await params;
  redirect(`/app/businesses/${businessId}/scenarios/${scenarioId}/overview`);
}
