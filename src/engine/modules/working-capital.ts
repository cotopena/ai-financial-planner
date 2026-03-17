import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import { createStubSection } from "./helpers";

export function calculateWorkingCapital(
  _input: NormalizedScenarioInput,
  axis: PeriodAxis,
) {
  return createStubSection("working-capital", axis, [
    "A/R and A/P timing logic lands in Sprint 3.",
  ]);
}
