import { notFound } from "next/navigation";
import { RoutePage } from "@/components/workspace/route-page";
import { wizardStepContent } from "@/lib/route-content";

export default async function WizardStepPage({
  params,
}: {
  params: Promise<{ step: keyof typeof wizardStepContent }>;
}) {
  const { step } = await params;
  const content = wizardStepContent[step];

  if (!content) {
    notFound();
  }

  return (
    <RoutePage
      eyebrow="Wizard"
      title={content.title}
      description={content.description}
      sections={content.sections}
    />
  );
}
