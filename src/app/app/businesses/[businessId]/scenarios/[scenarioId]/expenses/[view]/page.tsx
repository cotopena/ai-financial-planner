import { notFound } from "next/navigation";
import { RoutePage } from "@/components/workspace/route-page";
import { expenseViewContent } from "@/lib/route-content";

export default async function ExpenseViewPage({
  params,
}: {
  params: Promise<{ view: keyof typeof expenseViewContent }>;
}) {
  const { view } = await params;
  const content = expenseViewContent[view];

  if (!content) {
    notFound();
  }

  return (
    <RoutePage
      eyebrow="Expenses"
      title={content.title}
      description={content.description}
      sections={content.sections}
    />
  );
}
