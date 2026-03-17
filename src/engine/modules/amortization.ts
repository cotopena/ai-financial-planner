import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import { createStubSection } from "./helpers";

export function calculateAmortization(
  _input: NormalizedScenarioInput,
  axis: PeriodAxis,
) {
  return createStubSection("amortization", axis, [
    "Startup cost amortization lands in Sprint 1.",
  ]);
}
