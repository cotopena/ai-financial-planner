import { calculateScenario } from "../orchestrator/calculate-scenario";
import { foundationParityFixtures } from "./foundation-fixtures";

const TOLERANCE = 0.000001;

function isWithinTolerance(actual: number, expected: number) {
  return Math.abs(actual - expected) <= TOLERANCE;
}

function formatValue(value: number | boolean) {
  if (typeof value === "boolean") {
    return String(value);
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(6);
}

function assertNumber({
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

function assertBoolean({
  actual,
  expected,
  message,
}: {
  actual: boolean;
  expected: boolean;
  message: string;
}) {
  if (actual !== expected) {
    throw new Error(
      `${message}: expected ${formatValue(expected)}, received ${formatValue(actual)}`,
    );
  }
}

for (const fixture of foundationParityFixtures) {
  const output = calculateScenario(fixture.input);

  if (output.sections.openingPosition.monthly.length !== 36) {
    throw new Error(
      `${fixture.name}: expected 36 opening-position monthly values, received ${output.sections.openingPosition.monthly.length}`,
    );
  }

  if (output.sections.debtSchedules.annual.length !== 3) {
    throw new Error(
      `${fixture.name}: expected 3 debt-schedule annual values, received ${output.sections.debtSchedules.annual.length}`,
    );
  }

  for (const check of fixture.openingChecks) {
    const actual = output.sections.openingPosition.totals[check.metric];

    if (typeof check.expected === "boolean") {
      assertBoolean({
        actual: actual as boolean,
        expected: check.expected,
        message: `${fixture.name}: opening-position total ${check.metric} drifted`,
      });
      continue;
    }

    assertNumber({
      actual: actual as number,
      expected: check.expected,
      message: `${fixture.name}: opening-position total ${check.metric} drifted`,
    });
  }

  for (const check of fixture.openingSeriesChecks ?? []) {
    if (check.scope === "monthly") {
      const row = output.sections.openingPosition.monthly.find(
        (item) => item.monthIndex === check.monthIndex,
      );

      if (!row) {
        throw new Error(
          `${fixture.name}: missing opening-position month ${check.monthIndex}`,
        );
      }

      assertNumber({
        actual: row.value,
        expected: check.expected,
        message: `${fixture.name}: opening-position month ${check.monthIndex} drifted`,
      });

      continue;
    }

    const row = output.sections.openingPosition.annual.find(
      (item) => item.yearBucket === check.yearBucket,
    );

    if (!row) {
      throw new Error(
        `${fixture.name}: missing opening-position year ${check.yearBucket}`,
      );
    }

    assertNumber({
      actual: row.value,
      expected: check.expected,
      message: `${fixture.name}: opening-position year ${check.yearBucket} drifted`,
    });
  }

  for (const check of fixture.debtMonthlyChecks ?? []) {
    if (check.scope === "loan") {
      const loan = output.sections.debtSchedules.loans.find(
        (item) => item.debtKey === check.loanKey,
      );

      if (!loan) {
        throw new Error(
          `${fixture.name}: missing debt schedule ${check.loanKey} for month ${check.monthIndex}`,
        );
      }

      const row = loan.monthly.find((item) => item.monthIndex === check.monthIndex);

      if (!row) {
        throw new Error(
          `${fixture.name}: missing debt schedule ${check.loanKey} month ${check.monthIndex}`,
        );
      }

      assertNumber({
        actual: row[check.metric],
        expected: check.expected,
        message: `${fixture.name}: debt schedule ${check.loanKey} month ${check.monthIndex} ${check.metric} drifted`,
      });

      continue;
    }

    if (check.metric === "payment") {
      const row = output.sections.debtSchedules.monthly.find(
        (item) => item.monthIndex === check.monthIndex,
      );

      if (!row) {
        throw new Error(
          `${fixture.name}: missing aggregate debt month ${check.monthIndex}`,
        );
      }

      assertNumber({
        actual: row.value,
        expected: check.expected,
        message: `${fixture.name}: aggregate debt month ${check.monthIndex} payment drifted`,
      });

      continue;
    }

    const row = output.sections.debtSchedules.totals[check.metric].monthly.find(
      (item) => item.monthIndex === check.monthIndex,
    );

    if (!row) {
      throw new Error(
        `${fixture.name}: missing aggregate debt month ${check.monthIndex} ${check.metric}`,
      );
    }

    assertNumber({
      actual: row.value,
      expected: check.expected,
      message: `${fixture.name}: aggregate debt month ${check.monthIndex} ${check.metric} drifted`,
    });
  }

  for (const check of fixture.debtAnnualChecks ?? []) {
    if (check.scope === "loan") {
      const loan = output.sections.debtSchedules.loans.find(
        (item) => item.debtKey === check.loanKey,
      );

      if (!loan) {
        throw new Error(
          `${fixture.name}: missing debt schedule ${check.loanKey} for year ${check.yearBucket}`,
        );
      }

      const row = loan.annual.find((item) => item.yearBucket === check.yearBucket);

      if (!row) {
        throw new Error(
          `${fixture.name}: missing debt schedule ${check.loanKey} year ${check.yearBucket}`,
        );
      }

      assertNumber({
        actual: row[check.metric],
        expected: check.expected,
        message: `${fixture.name}: debt schedule ${check.loanKey} year ${check.yearBucket} ${check.metric} drifted`,
      });

      continue;
    }

    if (check.metric === "payment") {
      const row = output.sections.debtSchedules.annual.find(
        (item) => item.yearBucket === check.yearBucket,
      );

      if (!row) {
        throw new Error(
          `${fixture.name}: missing aggregate debt year ${check.yearBucket}`,
        );
      }

      assertNumber({
        actual: row.value,
        expected: check.expected,
        message: `${fixture.name}: aggregate debt year ${check.yearBucket} payment drifted`,
      });

      continue;
    }

    const row = output.sections.debtSchedules.totals[check.metric].annual.find(
      (item) => item.yearBucket === check.yearBucket,
    );

    if (!row) {
      throw new Error(
        `${fixture.name}: missing aggregate debt year ${check.yearBucket} ${check.metric}`,
      );
    }

    assertNumber({
      actual: row.value,
      expected: check.expected,
      message: `${fixture.name}: aggregate debt year ${check.yearBucket} ${check.metric} drifted`,
    });
  }

  for (const check of fixture.depreciationMonthlyChecks) {
    if (check.scope === "item") {
      const item = output.sections.depreciation.items.find(
        (entry) => entry.itemKey === check.itemKey,
      );

      if (!item) {
        throw new Error(
          `${fixture.name}: missing depreciation item ${check.itemKey} for month ${check.monthIndex}`,
        );
      }

      const row = item.monthly.find((entry) => entry.monthIndex === check.monthIndex);

      if (!row) {
        throw new Error(
          `${fixture.name}: missing depreciation item ${check.itemKey} month ${check.monthIndex}`,
        );
      }

      assertNumber({
        actual: row[check.metric],
        expected: check.expected,
        message: `${fixture.name}: depreciation item ${check.itemKey} month ${check.monthIndex} ${check.metric} drifted`,
      });

      continue;
    }

    if (check.metric === "expense") {
      const row = output.sections.depreciation.monthly.find(
        (entry) => entry.monthIndex === check.monthIndex,
      );

      if (!row) {
        throw new Error(
          `${fixture.name}: missing aggregate depreciation month ${check.monthIndex}`,
        );
      }

      assertNumber({
        actual: row.value,
        expected: check.expected,
        message: `${fixture.name}: aggregate depreciation month ${check.monthIndex} expense drifted`,
      });

      continue;
    }

    const row = output.sections.depreciation.totals.endingBookValue.monthly.find(
      (entry) => entry.monthIndex === check.monthIndex,
    );

    if (!row) {
      throw new Error(
        `${fixture.name}: missing aggregate depreciation month ${check.monthIndex} endingBookValue`,
      );
    }

    assertNumber({
      actual: row.value,
      expected: check.expected,
      message: `${fixture.name}: aggregate depreciation month ${check.monthIndex} endingBookValue drifted`,
    });
  }

  for (const check of fixture.depreciationAnnualChecks) {
    if (check.scope === "item") {
      const item = output.sections.depreciation.items.find(
        (entry) => entry.itemKey === check.itemKey,
      );

      if (!item) {
        throw new Error(
          `${fixture.name}: missing depreciation item ${check.itemKey} for year ${check.yearBucket}`,
        );
      }

      const row = item.annual.find((entry) => entry.yearBucket === check.yearBucket);

      if (!row) {
        throw new Error(
          `${fixture.name}: missing depreciation item ${check.itemKey} year ${check.yearBucket}`,
        );
      }

      assertNumber({
        actual: row[check.metric],
        expected: check.expected,
        message: `${fixture.name}: depreciation item ${check.itemKey} year ${check.yearBucket} ${check.metric} drifted`,
      });

      continue;
    }

    if (check.metric === "expense") {
      const row = output.sections.depreciation.annual.find(
        (entry) => entry.yearBucket === check.yearBucket,
      );

      if (!row) {
        throw new Error(
          `${fixture.name}: missing aggregate depreciation year ${check.yearBucket}`,
        );
      }

      assertNumber({
        actual: row.value,
        expected: check.expected,
        message: `${fixture.name}: aggregate depreciation year ${check.yearBucket} expense drifted`,
      });

      continue;
    }

    const row = output.sections.depreciation.totals.endingBookValue.annual.find(
      (entry) => entry.yearBucket === check.yearBucket,
    );

    if (!row) {
      throw new Error(
        `${fixture.name}: missing aggregate depreciation year ${check.yearBucket} endingBookValue`,
      );
    }

    assertNumber({
      actual: row.value,
      expected: check.expected,
      message: `${fixture.name}: aggregate depreciation year ${check.yearBucket} endingBookValue drifted`,
    });
  }

  for (const check of fixture.amortizationMonthlyChecks) {
    if (check.scope === "item") {
      const item = output.sections.amortization.items.find(
        (entry) => entry.itemKey === check.itemKey,
      );

      if (!item) {
        throw new Error(
          `${fixture.name}: missing amortization item ${check.itemKey} for month ${check.monthIndex}`,
        );
      }

      const row = item.monthly.find((entry) => entry.monthIndex === check.monthIndex);

      if (!row) {
        throw new Error(
          `${fixture.name}: missing amortization item ${check.itemKey} month ${check.monthIndex}`,
        );
      }

      assertNumber({
        actual: row[check.metric],
        expected: check.expected,
        message: `${fixture.name}: amortization item ${check.itemKey} month ${check.monthIndex} ${check.metric} drifted`,
      });

      continue;
    }

    if (check.metric === "expense") {
      const row = output.sections.amortization.monthly.find(
        (entry) => entry.monthIndex === check.monthIndex,
      );

      if (!row) {
        throw new Error(
          `${fixture.name}: missing aggregate amortization month ${check.monthIndex}`,
        );
      }

      assertNumber({
        actual: row.value,
        expected: check.expected,
        message: `${fixture.name}: aggregate amortization month ${check.monthIndex} expense drifted`,
      });

      continue;
    }

    const row = output.sections.amortization.totals.endingBalance.monthly.find(
      (entry) => entry.monthIndex === check.monthIndex,
    );

    if (!row) {
      throw new Error(
        `${fixture.name}: missing aggregate amortization month ${check.monthIndex} endingBalance`,
      );
    }

    assertNumber({
      actual: row.value,
      expected: check.expected,
      message: `${fixture.name}: aggregate amortization month ${check.monthIndex} endingBalance drifted`,
    });
  }

  for (const check of fixture.amortizationAnnualChecks) {
    if (check.scope === "item") {
      const item = output.sections.amortization.items.find(
        (entry) => entry.itemKey === check.itemKey,
      );

      if (!item) {
        throw new Error(
          `${fixture.name}: missing amortization item ${check.itemKey} for year ${check.yearBucket}`,
        );
      }

      const row = item.annual.find((entry) => entry.yearBucket === check.yearBucket);

      if (!row) {
        throw new Error(
          `${fixture.name}: missing amortization item ${check.itemKey} year ${check.yearBucket}`,
        );
      }

      assertNumber({
        actual: row[check.metric],
        expected: check.expected,
        message: `${fixture.name}: amortization item ${check.itemKey} year ${check.yearBucket} ${check.metric} drifted`,
      });

      continue;
    }

    if (check.metric === "expense") {
      const row = output.sections.amortization.annual.find(
        (entry) => entry.yearBucket === check.yearBucket,
      );

      if (!row) {
        throw new Error(
          `${fixture.name}: missing aggregate amortization year ${check.yearBucket}`,
        );
      }

      assertNumber({
        actual: row.value,
        expected: check.expected,
        message: `${fixture.name}: aggregate amortization year ${check.yearBucket} expense drifted`,
      });

      continue;
    }

    const row = output.sections.amortization.totals.endingBalance.annual.find(
      (entry) => entry.yearBucket === check.yearBucket,
    );

    if (!row) {
      throw new Error(
        `${fixture.name}: missing aggregate amortization year ${check.yearBucket} endingBalance`,
      );
    }

    assertNumber({
      actual: row.value,
      expected: check.expected,
      message: `${fixture.name}: aggregate amortization year ${check.yearBucket} endingBalance drifted`,
    });
  }

  for (const check of fixture.noteChecks ?? []) {
    const notes = output.sections[check.section].notes;

    if (!notes.some((note) => note.includes(check.includes))) {
      throw new Error(
        `${fixture.name}: expected ${check.section} notes to include "${check.includes}"`,
      );
    }
  }

  console.log(`PASS ${fixture.name} :: ${fixture.description}`);
}

console.log(
  `Foundation parity passed for ${foundationParityFixtures.length} fixture(s).`,
);
