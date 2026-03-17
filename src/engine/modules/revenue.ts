import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import { createStubSection } from "./helpers";

export function calculateRevenue(
  _input: NormalizedScenarioInput,
  axis: PeriodAxis,
) {
  return createStubSection("revenue", axis, [
    "Revenue driver math, growth compounding, and overrides land in Sprint 2.",
  ]);
}
