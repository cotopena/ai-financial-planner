import { calculateScenario } from "../orchestrator/calculate-scenario";
import { revenueParityFixtures } from "./revenue-fixtures";

const TOLERANCE = 0.000001;

function isWithinTolerance(actual: number, expected: number) {
  return Math.abs(actual - expected) <= TOLERANCE;
}

function formatValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(6);
}

function assertWithinTolerance({
  actual,
  expected,
  message,
}: {
  actual: number;
  expected: number;
  message: string;
}) {
  if (!isWithinTolerance(actual, expected)) {
    throw new Error(
      `${message}: expected ${formatValue(expected)}, received ${formatValue(actual)}`,
    );
  }
}

for (const fixture of revenueParityFixtures) {
  const output = calculateScenario(fixture.input);
  const revenue = output.sections.revenue;

  if (revenue.monthly.length !== 36) {
    throw new Error(
      `${fixture.name}: expected 36 total-sales monthly values, received ${revenue.monthly.length}`,
    );
  }

  if (revenue.annual.length !== 3) {
    throw new Error(
      `${fixture.name}: expected 3 total-sales annual values, received ${revenue.annual.length}`,
    );
  }

  for (const check of fixture.monthlyChecks) {
    if (check.scope === "line") {
      const line = revenue.lineItems.find((item) => item.lineKey === check.lineKey);

      if (!line) {
        throw new Error(
          `${fixture.name}: missing revenue line ${check.lineKey} for month ${check.monthIndex} ${check.metric} check`,
        );
      }

      const month = line.monthly.find((item) => item.monthIndex === check.monthIndex);

      if (!month) {
        throw new Error(
          `${fixture.name}: missing revenue line ${check.lineKey} month ${check.monthIndex}`,
        );
      }

      assertWithinTolerance({
        actual: month[check.metric],
        expected: check.expected,
        message: `${fixture.name}: line ${check.lineKey} month ${check.monthIndex} metric ${check.metric} drifted`,
      });

      continue;
    }

    const series = revenue.totals[check.metric].monthly.find(
      (item) => item.monthIndex === check.monthIndex,
    );

    if (!series) {
      throw new Error(
        `${fixture.name}: missing total month ${check.monthIndex} metric ${check.metric}`,
      );
    }

    assertWithinTolerance({
      actual: series.value,
      expected: check.expected,
      message: `${fixture.name}: total month ${check.monthIndex} metric ${check.metric} drifted`,
    });

    if (check.metric === "sales") {
      const sectionMonthly = revenue.monthly.find(
        (item) => item.monthIndex === check.monthIndex,
      );

      if (!sectionMonthly) {
        throw new Error(
          `${fixture.name}: missing section aggregate month ${check.monthIndex} sales value`,
        );
      }

      assertWithinTolerance({
        actual: sectionMonthly.value,
        expected: check.expected,
        message: `${fixture.name}: section aggregate month ${check.monthIndex} sales drifted`,
      });
    }
  }

  for (const check of fixture.annualChecks) {
    if (check.scope === "line") {
      const line = revenue.lineItems.find((item) => item.lineKey === check.lineKey);

      if (!line) {
        throw new Error(
          `${fixture.name}: missing revenue line ${check.lineKey} for year ${check.yearBucket} ${check.metric} check`,
        );
      }

      const year = line.annual.find((item) => item.yearBucket === check.yearBucket);

      if (!year) {
        throw new Error(
          `${fixture.name}: missing revenue line ${check.lineKey} year ${check.yearBucket}`,
        );
      }

      assertWithinTolerance({
        actual: year[check.metric],
        expected: check.expected,
        message: `${fixture.name}: line ${check.lineKey} year ${check.yearBucket} metric ${check.metric} drifted`,
      });

      continue;
    }

    const series = revenue.totals[check.metric].annual.find(
      (item) => item.yearBucket === check.yearBucket,
    );

    if (!series) {
      throw new Error(
        `${fixture.name}: missing total year ${check.yearBucket} metric ${check.metric}`,
      );
    }

    assertWithinTolerance({
      actual: series.value,
      expected: check.expected,
      message: `${fixture.name}: total year ${check.yearBucket} metric ${check.metric} drifted`,
    });

    if (check.metric === "sales") {
      const sectionAnnual = revenue.annual.find(
        (item) => item.yearBucket === check.yearBucket,
      );

      if (!sectionAnnual) {
        throw new Error(
          `${fixture.name}: missing section aggregate year ${check.yearBucket} sales value`,
        );
      }

      assertWithinTolerance({
        actual: sectionAnnual.value,
        expected: check.expected,
        message: `${fixture.name}: section aggregate year ${check.yearBucket} sales drifted`,
      });
    }
  }

  for (const check of fixture.overrideChecks ?? []) {
    const override = revenue.appliedOverrides.find(
      (item) =>
        item.lineKey === check.lineKey &&
        item.monthIndex === check.monthIndex &&
        item.metric === check.metric,
    );

    if (!override) {
      throw new Error(
        `${fixture.name}: missing applied override for line ${check.lineKey} month ${check.monthIndex} metric ${check.metric}`,
      );
    }

    assertWithinTolerance({
      actual: override.overrideValue,
      expected: check.expectedOverrideValue,
      message: `${fixture.name}: override line ${check.lineKey} month ${check.monthIndex} metric ${check.metric} drifted`,
    });

    if (override.source !== check.expectedSource) {
      throw new Error(
        `${fixture.name}: override line ${check.lineKey} month ${check.monthIndex} metric ${check.metric} expected source ${check.expectedSource}, received ${override.source}`,
      );
    }
  }

  if (fixture.summaryChecks) {
    assertWithinTolerance({
      actual: output.summary.revenue,
      expected: fixture.summaryChecks.revenue,
      message: `${fixture.name}: summary revenue drifted`,
    });
    assertWithinTolerance({
      actual: output.summary.grossMarginPct,
      expected: fixture.summaryChecks.grossMarginPct,
      message: `${fixture.name}: summary grossMarginPct drifted`,
    });
  }

  console.log(`PASS ${fixture.name} :: ${fixture.description}`);
}

console.log(`Revenue parity passed for ${revenueParityFixtures.length} fixture(s).`);
