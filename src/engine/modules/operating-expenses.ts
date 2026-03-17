import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import { createStubSection } from "./helpers";

export function calculateOperatingExpenses(
  _input: NormalizedScenarioInput,
  axis: PeriodAxis,
) {
  return createStubSection("operating-expenses", axis, [
    "Operating expense roll-forward logic lands in Sprint 3.",
  ]);
}
