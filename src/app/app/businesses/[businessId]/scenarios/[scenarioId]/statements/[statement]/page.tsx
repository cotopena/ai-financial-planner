import { notFound } from "next/navigation";
import { RoutePage } from "@/components/workspace/route-page";
import { statementContent } from "@/lib/route-content";

export default async function StatementPage({
  params,
}: {
  params: Promise<{ statement: keyof typeof statementContent }>;
}) {
  const { statement } = await params;
  const content = statementContent[statement];

  if (!content) {
    notFound();
  }

  return (
    <RoutePage
      eyebrow="Statements"
      title={content.title}
      description={content.description}
      sections={content.sections}
    />
  );
}
