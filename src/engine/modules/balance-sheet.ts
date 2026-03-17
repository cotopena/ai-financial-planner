import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import { createStubSection } from "./helpers";

export function calculateBalanceSheet(
  _input: NormalizedScenarioInput,
  axis: PeriodAxis,
) {
  return createStubSection("balance-sheet", axis, [
    "Balance sheet logic and balance checks land in Sprint 4.",
  ]);
}
