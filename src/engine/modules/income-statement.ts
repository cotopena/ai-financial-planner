import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import { createStubSection } from "./helpers";

export function calculateIncomeStatement(
  _input: NormalizedScenarioInput,
  axis: PeriodAxis,
) {
  return createStubSection("income-statement", axis, [
    "Income statement assembly lands in Sprint 4.",
  ]);
}
