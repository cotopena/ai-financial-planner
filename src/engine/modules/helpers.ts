import type { PeriodAxis } from "../core/period-axis";
import type { SectionPayload } from "../schemas/output-schema";

export function createStubSection(
  sectionKey: string,
  axis: PeriodAxis,
  notes: string[],
): SectionPayload {
  return {
    sectionKey,
    monthly: axis.periods.map((period) => ({
      monthIndex: period.monthIndex,
      label: period.label,
      value: 0,
    })),
    annual: [1, 2, 3].map((yearBucket) => ({
      yearBucket,
      label: `Year ${yearBucket}`,
      value: 0,
    })),
    notes,
  };
}
