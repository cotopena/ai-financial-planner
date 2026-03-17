export const requiredParityFixtures = [
  "startup-no-debt",
  "startup-multi-debt",
  "ongoing-opening-balances",
  "low-margin-warning",
  "cash-shortfall-auto-loc",
  "cash-shortfall-no-financing",
] as const;

export function listParityFixtures() {
  return requiredParityFixtures;
}
