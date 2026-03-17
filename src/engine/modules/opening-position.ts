import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import { createStubSection } from "./helpers";

export function calculateOpeningPosition(
  _input: NormalizedScenarioInput,
  axis: PeriodAxis,
) {
  return createStubSection("opening-position", axis, [
    "Opening position math is scheduled for Sprint 1.",
  ]);
}
