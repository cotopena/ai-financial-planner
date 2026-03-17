import type { PeriodAxis } from "../core/period-axis";
import { createStubSection } from "./helpers";

export function calculateScenarioComparison(axis: PeriodAxis) {
  return createStubSection("scenario-comparison", axis, [
    "Scenario comparison payloads land after snapshot generation is implemented.",
  ]);
}
