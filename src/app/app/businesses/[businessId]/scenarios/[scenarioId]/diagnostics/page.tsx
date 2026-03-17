import { RoutePage } from "@/components/workspace/route-page";

export default function DiagnosticsPage() {
  return (
    <RoutePage
      eyebrow="Diagnostics"
      title="Explainable warnings and recommendations"
      description="Human-readable findings derived from outputs and assumptions, ordered by severity and suggestion quality."
      sections={[
        {
          title: "Diagnostic card types",
          description: "The PRD calls for warnings that explain both the issue and a suggested response.",
          items: [
            "Cash shortfall",
            "Margin compression",
            "Break-even risk",
            "Balance sheet warning",
          ],
        },
        {
          title: "Data path",
          description: "Diagnostics are persisted in `scenario_snapshot_diagnostics` once the engine is implemented.",
        },
      ]}
    />
  );
}
