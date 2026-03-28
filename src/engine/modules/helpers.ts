import type { PeriodAxis } from "../core/period-axis";
import type {
  AnnualValue,
  MonthlyValue,
  SectionPayload,
  ValueSeries,
} from "../schemas/output-schema";

const YEAR_BUCKETS = [1, 2, 3] as const;
const EPSILON = 0.000000001;

type YearBucket = (typeof YEAR_BUCKETS)[number];

export type StraightLineBasisEntry = {
  monthIndex: number;
  amount: number;
};

export function sanitizeNumber(value: number) {
  const normalized = Math.abs(value) <= EPSILON ? 0 : value;

  return Object.is(normalized, -0) ? 0 : normalized;
}

export function clampBalance(value: number) {
  return value <= EPSILON ? 0 : sanitizeNumber(value);
}

export function sumNumbers(values: number[]) {
  return sanitizeNumber(values.reduce((total, value) => total + value, 0));
}

export function sumBy<T>(items: T[], getValue: (item: T) => number) {
  return sumNumbers(items.map(getValue));
}

export function buildMonthlyValueSeries(
  axis: PeriodAxis,
  values: number[],
): MonthlyValue[] {
  return axis.periods.map((period, index) => ({
    monthIndex: period.monthIndex,
    label: period.label,
    value: sanitizeNumber(values[index] ?? 0),
  }));
}

export function buildAnnualValueSeries(
  axis: PeriodAxis,
  values: number[],
): AnnualValue[] {
  return YEAR_BUCKETS.map((yearBucket) => ({
    yearBucket,
    label: `Year ${yearBucket}`,
    value: sumNumbers(
      axis.periods
        .filter((period) => period.yearBucket === yearBucket)
        .map((period) => values[period.monthIndex - 1] ?? 0),
    ),
  }));
}

export function buildValueSeries(axis: PeriodAxis, values: number[]): ValueSeries {
  return {
    monthly: buildMonthlyValueSeries(axis, values),
    annual: buildAnnualValueSeries(axis, values),
  };
}

export function buildOpeningValueSeries(
  axis: PeriodAxis,
  openingValue: number,
): ValueSeries {
  const monthly = axis.periods.map((period) =>
    period.monthIndex === 1 ? openingValue : 0,
  );

  return {
    monthly: buildMonthlyValueSeries(axis, monthly),
    annual: YEAR_BUCKETS.map((yearBucket) => ({
      yearBucket,
      label: `Year ${yearBucket}`,
      value: yearBucket === 1 ? sanitizeNumber(openingValue) : 0,
    })),
  };
}

export function calculateAmortizedPayment({
  principal,
  annualRate,
  termMonths,
}: {
  principal: number;
  annualRate: number;
  termMonths: number;
}) {
  if (principal <= 0 || termMonths <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 12;

  if (Math.abs(monthlyRate) <= EPSILON) {
    return principal / termMonths;
  }

  return (
    (principal * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -termMonths))
  );
}

export function buildStraightLineSchedule({
  axis,
  lifeMonths,
  basisEntries,
}: {
  axis: PeriodAxis;
  lifeMonths: number;
  basisEntries: StraightLineBasisEntry[];
}) {
  if (lifeMonths <= 0) {
    return {
      expenseValues: axis.periods.map(() => 0),
      endingBalanceValues: axis.periods.map(() => 0),
    };
  }

  const normalizedEntries = [...basisEntries]
    .filter((entry) => entry.amount > 0)
    .sort((left, right) => left.monthIndex - right.monthIndex);
  const expenseValues: number[] = [];
  const endingBalanceValues: number[] = [];
  let recognizedBasis = 0;
  let cumulativeExpense = 0;

  for (const period of axis.periods) {
    recognizedBasis += sumBy(
      normalizedEntries.filter((entry) => entry.monthIndex === period.monthIndex),
      (entry) => entry.amount,
    );

    const expense = sumBy(
      normalizedEntries.filter(
        (entry) =>
          period.monthIndex >= entry.monthIndex &&
          period.monthIndex < entry.monthIndex + lifeMonths,
      ),
      (entry) => entry.amount / lifeMonths,
    );

    cumulativeExpense += expense;
    expenseValues.push(sanitizeNumber(expense));
    endingBalanceValues.push(clampBalance(recognizedBasis - cumulativeExpense));
  }

  return {
    expenseValues,
    endingBalanceValues,
  };
}

export function buildYearBucketRows<T>({
  axis,
  createRow,
}: {
  axis: PeriodAxis;
  createRow: (args: {
    yearBucket: YearBucket;
    label: string;
    monthIndexes: number[];
  }) => T;
}) {
  return YEAR_BUCKETS.map((yearBucket) =>
    createRow({
      yearBucket,
      label: `Year ${yearBucket}`,
      monthIndexes: axis.periods
        .filter((period) => period.yearBucket === yearBucket)
        .map((period) => period.monthIndex),
    }),
  );
}

export function createStubSection(
  sectionKey: string,
  axis: PeriodAxis,
  notes: string[],
): SectionPayload {
  return {
    sectionKey,
    monthly: buildMonthlyValueSeries(axis, axis.periods.map(() => 0)),
    annual: buildAnnualValueSeries(axis, axis.periods.map(() => 0)),
    notes,
  };
}
