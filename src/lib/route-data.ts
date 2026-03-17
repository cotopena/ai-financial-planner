export type AppNavItem = {
  href: string;
  label: string;
  description: string;
};

export const appNavItems: AppNavItem[] = [
  {
    href: "/app",
    label: "Dashboard",
    description: "Businesses, scenarios, and rollout status.",
  },
  {
    href: "/app/businesses/new",
    label: "New Business",
    description: "Start from the wizard or manual setup.",
  },
  {
    href: "/app/settings/billing",
    label: "Billing",
    description: "Plan limits, checkout, and portal wiring.",
  },
  {
    href: "/app/settings/account",
    label: "Account",
    description: "Profile, sign-in, and workspace defaults.",
  },
] as const;

export const wizardSteps = [
  { slug: "step-1", label: "Basics" },
  { slug: "step-2", label: "Profile" },
  { slug: "step-3", label: "Opening" },
  { slug: "step-4", label: "Revenue" },
  { slug: "step-5", label: "COGS" },
  { slug: "step-6", label: "Payroll" },
  { slug: "step-7", label: "Expenses" },
  { slug: "step-8", label: "Cash" },
  { slug: "step-9", label: "Review" },
] as const;

export function buildScenarioNav({
  businessId,
  scenarioId,
}: {
  businessId: string;
  scenarioId: string;
}) {
  const basePath = `/app/businesses/${businessId}/scenarios/${scenarioId}`;

  return [
    { href: `${basePath}/overview`, label: "Overview" },
    { href: `${basePath}/setup`, label: "Setup" },
    { href: `${basePath}/opening-funding`, label: "Opening & Funding" },
    { href: `${basePath}/revenue/year-1`, label: "Revenue" },
    { href: `${basePath}/payroll/year-1`, label: "Payroll" },
    { href: `${basePath}/expenses/year-1`, label: "Expenses" },
    { href: `${basePath}/cash-financing`, label: "Cash & Financing" },
    {
      href: `${basePath}/statements/income-statement`,
      label: "Statements",
    },
    { href: `${basePath}/diagnostics`, label: "Diagnostics" },
    { href: `${basePath}/scenarios`, label: "Scenarios" },
    { href: `${basePath}/imports/actuals`, label: "Imports" },
    { href: `${basePath}/exports`, label: "Exports" },
  ] as const;
}
