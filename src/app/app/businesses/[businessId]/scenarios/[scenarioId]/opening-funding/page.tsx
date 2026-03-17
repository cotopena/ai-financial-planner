import { RoutePage } from "@/components/workspace/route-page";

export default function OpeningFundingPage() {
  return (
    <RoutePage
      eyebrow="Opening & funding"
      title="Opening position and funding"
      description="Fixed assets, startup costs, funding sources, and opening balances mapped to dedicated Convex tables."
      sections={[
        {
          title: "Opening tables",
          description: "Separate assumption tables keep the finance engine normalized and auditable.",
          table: {
            columns: ["Table", "Purpose"],
            rows: [
              ["opening_assets", "Fixed assets and depreciation years"],
              ["startup_costs", "Startup spend and operating capital"],
              ["funding_sources", "Debt and equity rows"],
              ["opening_balances", "Ongoing business opening balances"],
            ],
          },
        },
        {
          title: "Engine handoff",
          description: "These tables feed the opening position, debt, depreciation, and amortization modules.",
        },
      ]}
    />
  );
}
