import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import { createStubSection } from "./helpers";

export function calculateRatios(
  _input: NormalizedScenarioInput,
  axis: PeriodAxis,
) {
  return createStubSection("ratios", axis, [
    "Financial ratio calculations and norm comparisons land in Sprint 4.",
  ]);
}
