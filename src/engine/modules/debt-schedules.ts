import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import { createStubSection } from "./helpers";

export function calculateDebtSchedules(
  _input: NormalizedScenarioInput,
  axis: PeriodAxis,
) {
  return createStubSection("debt-schedules", axis, [
    "Debt amortization schedules are scaffolded and intentionally return zeros in Sprint 0.",
  ]);
}
