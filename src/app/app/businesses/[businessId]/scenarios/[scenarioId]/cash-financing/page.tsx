import { RoutePage } from "@/components/workspace/route-page";

export default function CashFinancingPage() {
  return (
    <RoutePage
      eyebrow="Cash & financing"
      title="Working capital, tax, debt, and capex"
      description="Primary assumptions page for timing buckets, financing behavior, capex, taxes, and manual cash items."
      sections={[
        {
          title: "Stored assumption groups",
          description: "This screen spans multiple normalized tables in Convex.",
          items: [
            "working_capital_settings",
            "capex_lines and capex_months",
            "tax_settings",
            "cash_adjustment_months",
          ],
        },
        {
          title: "Engine dependency",
          description: "These inputs drive the working-capital, debt, cash-flow, and tax modules.",
          note: "Core finance math starts in Sprint 1 and Sprint 3.",
        },
      ]}
    />
  );
}
