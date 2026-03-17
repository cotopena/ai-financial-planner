import { EnginePeriodSchema, type EnginePeriod } from "../schemas/output-schema";

export type PeriodAxis = {
  periods: EnginePeriod[];
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function buildPeriodAxis({
  startMonth,
  startYear,
}: {
  startMonth: number;
  startYear: number;
}): PeriodAxis {
  const periods = Array.from({ length: 36 }, (_, index) => {
    const zeroBasedMonth = startMonth - 1 + index;
    const month = (zeroBasedMonth % 12) + 1;
    const year = startYear + Math.floor(zeroBasedMonth / 12);
    const yearBucket = Math.floor(index / 12) + 1;
    const quarter = Math.floor((month - 1) / 3) + 1;

    return EnginePeriodSchema.parse({
      monthIndex: index + 1,
      month,
      year,
      quarter,
      yearBucket,
      label: `${MONTH_LABELS[month - 1]} ${year}`,
    });
  });

  return { periods };
}
