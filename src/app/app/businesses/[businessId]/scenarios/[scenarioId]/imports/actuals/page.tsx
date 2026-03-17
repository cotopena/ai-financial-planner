import { RoutePage } from "@/components/workspace/route-page";

export default function ImportsActualsPage() {
  return (
    <RoutePage
      eyebrow="Imports"
      title="CSV and manual actuals"
      description="Ongoing-business support route for uploading trailing actuals, approving mappings, and applying normalized rows."
      sections={[
        {
          title: "Supported flow",
          description: "The PRD supports CSV import with manual fallback in v1.",
          items: [
            "Upload CSV",
            "Approve mapping",
            "Normalize rows",
            "Apply trailing actuals",
          ],
        },
        {
          title: "Backend surface",
          description: "Convex action and mutation stubs are already in place for upload, mapping, and apply.",
        },
      ]}
    />
  );
}
