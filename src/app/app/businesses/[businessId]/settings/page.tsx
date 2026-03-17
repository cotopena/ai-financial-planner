import { RoutePage } from "@/components/workspace/route-page";

export default function BusinessSettingsPage() {
  return (
    <RoutePage
      eyebrow="Business settings"
      title="Business metadata"
      description="Rename, archive, or delete a business and adjust base metadata that sits above all scenarios."
      sections={[
        {
          title: "Editable fields",
          description: "Business-level metadata mirrors the top-level business record in Convex.",
          items: [
            "Business name and company name",
            "Preparer name and notes",
            "Archive / restore controls",
          ],
        },
        {
          title: "Data ownership",
          description: "Convex mutations validate ownership through the current authenticated user record.",
        },
      ]}
    />
  );
}
