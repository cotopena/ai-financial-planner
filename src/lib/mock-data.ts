export const pricingPlans = [
  {
    key: "builder",
    name: "Builder",
    price: "$50",
    description:
      "Single-founder planning workflow with guided edits and export-ready outputs.",
    highlights: [
      "1 active user",
      "Multiple businesses and scenarios",
      "Guided wizard and contextual assistant",
      "PDF and CSV exports",
      "Monthly AI action allowance",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$200",
    description:
      "Heavier AI usage, faster iteration, and room to manage a larger planning portfolio.",
    highlights: [
      "Everything in Builder",
      "Higher AI usage allowance",
      "Priority export queue",
      "Scenario comparison workflows",
      "Advanced diagnostics surface",
    ],
  },
] as const;

export const dashboardBusinesses = [
  {
    name: "Maple & Main Bakery",
    stage: "startup",
    endingCash: "$84k",
    yearOneRevenue: "$412k",
    scenario: "Base case",
    status: "Needs funding review",
  },
  {
    name: "Harbor Home Services",
    stage: "ongoing",
    endingCash: "$126k",
    yearOneRevenue: "$1.1M",
    scenario: "Stabilization",
    status: "Healthy",
  },
  {
    name: "Sprout Studio",
    stage: "startup",
    endingCash: "$41k",
    yearOneRevenue: "$268k",
    scenario: "Lean launch",
    status: "Margin watch",
  },
] as const;

export const usageSnapshot = {
  planName: "Builder",
  actionsUsed: 18,
  actionsRemaining: 42,
  resetDate: "April 1, 2026",
};
