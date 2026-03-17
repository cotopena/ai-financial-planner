import { notFound } from "next/navigation";
import { RoutePage } from "@/components/workspace/route-page";
import { payrollViewContent } from "@/lib/route-content";

export default async function PayrollViewPage({
  params,
}: {
  params: Promise<{ view: keyof typeof payrollViewContent }>;
}) {
  const { view } = await params;
  const content = payrollViewContent[view];

  if (!content) {
    notFound();
  }

  return (
    <RoutePage
      eyebrow="Payroll"
      title={content.title}
      description={content.description}
      sections={content.sections}
    />
  );
}
