import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import { createStubSection } from "./helpers";

export function calculateBreakEven(
  _input: NormalizedScenarioInput,
  axis: PeriodAxis,
) {
  return createStubSection("break-even", axis, [
    "Break-even math lands in Sprint 4.",
  ]);
}
