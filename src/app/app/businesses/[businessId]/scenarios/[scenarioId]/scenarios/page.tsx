import { RoutePage } from "@/components/workspace/route-page";

export default function ScenarioComparePage() {
  return (
    <RoutePage
      eyebrow="Scenario compare"
      title="Clone, branch, and compare"
      description="Workspace route for branching scenarios, comparing KPI deltas, and managing base/best/worst/custom cases."
      sections={[
        {
          title: "Actions",
          description: "Convex already exposes create, clone, list, and update-meta entry points.",
          items: [
            "Create scenario",
            "Clone scenario",
            "Mark as base case",
            "Archive scenario",
          ],
        },
        {
          title: "Comparison surface",
          description: "The shared engine includes a scenario-comparison module placeholder for later snapshot diffs.",
        },
      ]}
    />
  );
}
