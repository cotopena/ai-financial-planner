import { RoutePage } from "@/components/workspace/route-page";

export default function ExportsPage() {
  return (
    <RoutePage
      eyebrow="Exports"
      title="PDF and CSV export center"
      description="Route scaffold for queued export jobs, historical downloads, and export option presets."
      sections={[
        {
          title: "Export jobs",
          description: "Convex stores PDF and CSV work in a dedicated `export_jobs` table.",
          table: {
            columns: ["Type", "Status", "Result"],
            rows: [
              ["PDF", "queued", "Pending"],
              ["CSV", "queued", "Pending"],
            ],
          },
        },
        {
          title: "Output scope",
          description: "The implementation PRD defines a summary PDF plus a CSV bundle of assumptions and report tables.",
        },
      ]}
    />
  );
}
