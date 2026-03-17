import { RoutePage } from "@/components/workspace/route-page";

export default function SetupPage() {
  return (
    <RoutePage
      eyebrow="Setup"
      title="Model settings"
      description="Identity, period start, business stage, and top-level metadata aligned to the workbook setup and PRD field list."
      sections={[
        {
          title: "Form fields",
          description: "These map to business and scenario metadata plus setup-specific assumptions.",
          items: [
            "Model name, business name, preparer name",
            "Start month and start year",
            "Currency and country/region",
            "Business stage and profile",
          ],
        },
        {
          title: "Persistence",
          description: "The setup workspace query returns business and scenario state for this screen.",
          note: "Detailed setup upsert is scaffolded but not fully implemented.",
        },
      ]}
    />
  );
}
