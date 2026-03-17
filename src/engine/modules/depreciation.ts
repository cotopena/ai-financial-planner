import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import { createStubSection } from "./helpers";

export function calculateDepreciation(
  _input: NormalizedScenarioInput,
  axis: PeriodAxis,
) {
  return createStubSection("depreciation", axis, [
    "Depreciation schedules land with the opening asset engine work.",
  ]);
}
