import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import { createStubSection } from "./helpers";

export function calculateCashFlow(
  _input: NormalizedScenarioInput,
  axis: PeriodAxis,
) {
  return createStubSection("cash-flow", axis, [
    "Cash flow, LOC behavior, and minimum cash enforcement land in Sprint 3.",
  ]);
}
