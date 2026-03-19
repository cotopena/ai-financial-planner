import { BusinessSettingsForm } from "@/components/businesses/business-settings-form";

export default async function BusinessSettingsPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;

  return <BusinessSettingsForm businessId={businessId} />;
}
