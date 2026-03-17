import { redirect } from "next/navigation";

export default async function BusinessRootPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  redirect(`/app/businesses/${businessId}/scenarios`);
}
