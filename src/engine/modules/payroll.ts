import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import { createStubSection } from "./helpers";

export function calculatePayroll(
  _input: NormalizedScenarioInput,
  axis: PeriodAxis,
) {
  return createStubSection("payroll", axis, [
    "Payroll wages, taxes, and benefits land in Sprint 2.",
  ]);
}
