import { BusinessRootRedirect } from "@/components/businesses/business-root-redirect";

export default async function BusinessRootPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;

  return <BusinessRootRedirect businessId={businessId} />;
}
