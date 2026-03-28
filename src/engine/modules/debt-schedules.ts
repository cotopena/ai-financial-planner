import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import type {
  DebtScheduleAnnualValue,
  DebtScheduleItem,
  DebtScheduleMonthlyValue,
  DebtSchedulesSectionPayload,
} from "../schemas/output-schema";
import {
  buildMonthlyValueSeries,
  buildValueSeries,
  buildYearBucketRows,
  calculateAmortizedPayment,
  clampBalance,
  sanitizeNumber,
  sumBy,
} from "./helpers";

const DEBT_FUNDING_CATEGORIES = new Set([
  "commercial_loan",
  "commercial_mortgage",
  "credit_card_debt",
  "vehicle_loans",
  "other_bank_debt",
]);

function buildZeroMonth(
  period: PeriodAxis["periods"][number],
): DebtScheduleMonthlyValue {
  return {
    monthIndex: period.monthIndex,
    label: period.label,
    payment: 0,
    interest: 0,
    principal: 0,
    endingBalance: 0,
  };
}

function buildAnnualRows(
  axis: PeriodAxis,
  monthly: DebtScheduleMonthlyValue[],
): DebtScheduleAnnualValue[] {
  return buildYearBucketRows({
    axis,
    createRow: ({ yearBucket, label, monthIndexes }) => {
      const bucketRows = monthIndexes.map((monthIndex) => monthly[monthIndex - 1]);
      const finalMonthIndex = monthIndexes[monthIndexes.length - 1] ?? 1;

      return {
        yearBucket,
        label,
        payment: sumBy(bucketRows, (row) => row?.payment ?? 0),
        interest: sumBy(bucketRows, (row) => row?.interest ?? 0),
        principal: sumBy(bucketRows, (row) => row?.principal ?? 0),
        endingBalance: sanitizeNumber(
          monthly[finalMonthIndex - 1]?.endingBalance ?? 0,
        ),
      };
    },
  });
}

export function calculateDebtSchedules(
  input: NormalizedScenarioInput,
  axis: PeriodAxis,
): DebtSchedulesSectionPayload {
  const loans: DebtScheduleItem[] = input.fundingSources
    .map((source, index) => ({
      ...source,
      sortOrder: index + 1,
    }))
    .filter(
      (source) =>
        source.amount > 0 &&
        DEBT_FUNDING_CATEGORIES.has(source.category) &&
        source.interestRate !== undefined &&
        source.termMonths !== undefined,
    )
    .map((source) => {
      const debtKey = source.sourceKey ?? `funding-source-${source.sortOrder}`;
      const standardPayment = calculateAmortizedPayment({
        principal: source.amount,
        annualRate: source.interestRate ?? 0,
        termMonths: source.termMonths ?? 0,
      });
      const effectivePayment =
        source.monthlyPaymentOverride ?? standardPayment;
      const monthlyRate = (source.interestRate ?? 0) / 12;
      const notes = [];
      let balance = source.amount;

      if (source.monthlyPaymentOverride !== undefined) {
        notes.push(
          "Monthly payment override is applied instead of the standard amortized payment.",
        );

        if (source.monthlyPaymentOverride <= source.amount * monthlyRate) {
          notes.push(
            "The payment override is at or below the first-month interest charge, so principal may not decline immediately.",
          );
        }
      }

      const monthly = axis.periods.map((period) => {
        if (balance <= 0) {
          return buildZeroMonth(period);
        }

        const interest = balance * monthlyRate;
        const payment =
          effectivePayment > balance + interest
            ? balance + interest
            : effectivePayment;
        const principal = payment - interest;
        const endingBalance = clampBalance(balance - principal);

        balance = endingBalance;

        return {
          monthIndex: period.monthIndex,
          label: period.label,
          payment: sanitizeNumber(payment),
          interest: sanitizeNumber(interest),
          principal: sanitizeNumber(principal),
          endingBalance,
        };
      });

      return {
        debtKey,
        sortOrder: source.sortOrder,
        category: source.category,
        originalAmount: source.amount,
        interestRate: source.interestRate ?? 0,
        termMonths: source.termMonths ?? 0,
        standardPayment: sanitizeNumber(standardPayment),
        monthlyPaymentOverride: source.monthlyPaymentOverride,
        notes,
        monthly,
        annual: buildAnnualRows(axis, monthly),
      };
    });

  const paymentValues = axis.periods.map((period) =>
    sumBy(loans, (loan) => loan.monthly[period.monthIndex - 1]?.payment ?? 0),
  );
  const interestValues = axis.periods.map((period) =>
    sumBy(loans, (loan) => loan.monthly[period.monthIndex - 1]?.interest ?? 0),
  );
  const principalValues = axis.periods.map((period) =>
    sumBy(loans, (loan) => loan.monthly[period.monthIndex - 1]?.principal ?? 0),
  );
  const endingBalanceValues = axis.periods.map((period) =>
    sumBy(
      loans,
      (loan) => loan.monthly[period.monthIndex - 1]?.endingBalance ?? 0,
    ),
  );
  const overrideCount = loans.filter(
    (loan) => loan.monthlyPaymentOverride !== undefined,
  ).length;
  const notes = [];

  if (loans.length === 0) {
    notes.push("No debt funding sources are configured for this scenario.");
  }

  if (overrideCount > 0) {
    notes.push(`${overrideCount} debt source(s) use monthly payment overrides.`);
  }

  return {
    sectionKey: "debt-schedules",
    monthly: buildMonthlyValueSeries(axis, paymentValues),
    annual: buildValueSeries(axis, paymentValues).annual,
    notes,
    loans,
    totals: {
      payment: buildValueSeries(axis, paymentValues),
      interest: buildValueSeries(axis, interestValues),
      principal: buildValueSeries(axis, principalValues),
      endingBalance: {
        monthly: buildMonthlyValueSeries(axis, endingBalanceValues),
        annual: buildYearBucketRows({
          axis,
          createRow: ({ yearBucket, label, monthIndexes }) => ({
            yearBucket,
            label,
            value: sanitizeNumber(
              endingBalanceValues[(monthIndexes[monthIndexes.length - 1] ?? 1) - 1] ??
                0,
            ),
          }),
        }),
      },
    },
  };
}
