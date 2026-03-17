import { notFound } from "next/navigation";
import { RoutePage } from "@/components/workspace/route-page";
import { revenueViewContent } from "@/lib/route-content";

export default async function RevenueViewPage({
  params,
}: {
  params: Promise<{ view: keyof typeof revenueViewContent }>;
}) {
  const { view } = await params;
  const content = revenueViewContent[view];

  if (!content) {
    notFound();
  }

  return (
    <RoutePage
      eyebrow="Revenue"
      title={content.title}
      description={content.description}
      sections={content.sections}
    />
  );
}
