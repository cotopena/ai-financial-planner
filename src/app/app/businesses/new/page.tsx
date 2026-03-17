import { RoutePage } from "@/components/workspace/route-page";

export default function NewBusinessPage() {
  return (
    <RoutePage
      eyebrow="Create business"
      title="New business model"
      description="Entry point for starting the wizard or creating a business manually before assumptions are filled."
      sections={[
        {
          title: "Primary actions",
          description: "This route exists so the dashboard CTA has a stable destination in Sprint 0.",
          items: [
            "Create a business shell",
            "Choose wizard setup or manual setup",
            "Seed a base scenario",
          ],
        },
        {
          title: "Backend target",
          description: "Business and scenario mutations already exist in Convex with placeholder auth-aware CRUD.",
          note: "Wizard handoff remains UI-only until Sprint 6.",
        },
      ]}
    />
  );
}
