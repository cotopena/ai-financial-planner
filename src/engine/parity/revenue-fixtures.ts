import type {
  NormalizedScenarioInput,
  RevenueMetric,
  RevenueOverrideSource,
} from "../schemas/input-schema";

type RevenueMonthlyExpectation = {
  scope: "line" | "total";
  lineKey?: string;
  monthIndex: number;
  metric: RevenueMetric;
  expected: number;
};

type RevenueAnnualExpectation = {
  scope: "line" | "total";
  lineKey?: string;
  yearBucket: 1 | 2 | 3;
  metric: RevenueMetric;
  expected: number;
};

type RevenueOverrideExpectation = {
  lineKey: string;
  monthIndex: number;
  metric: RevenueMetric;
  expectedOverrideValue: number;
  expectedSource: RevenueOverrideSource;
};

export type RevenueParityFixture = {
  name: (typeof requiredRevenueParityFixtures)[number];
  description: string;
  input: Partial<NormalizedScenarioInput>;
  monthlyChecks: RevenueMonthlyExpectation[];
  annualChecks: RevenueAnnualExpectation[];
  overrideChecks?: RevenueOverrideExpectation[];
  summaryChecks?: {
    revenue: number;
    grossMarginPct: number;
  };
};

export const requiredRevenueParityFixtures = [
  "revenue-startup-no-debt",
  "revenue-ongoing-opening-balances",
  "revenue-sales-override-precedence",
  "revenue-low-margin-windowed",
] as const;

export const revenueParityFixtures: RevenueParityFixture[] = [
  {
    name: "revenue-startup-no-debt",
    description:
      "Year 1 revenue compounds monthly inside each quarter and preserves aggregate sales compatibility fields.",
    input: {
      revenueLines: [
        {
          lineKey: "core-services",
          sortOrder: 1,
          name: "Core services",
          unitLabel: "engagements",
          month1Units: 100,
          pricePerUnit: 10,
          cogsPerUnit: 4,
          q1MonthlyGrowth: 0.1,
          q2MonthlyGrowth: 0,
          q3MonthlyGrowth: 0,
          q4MonthlyGrowth: 0,
          year2MonthlyGrowth: 0,
          year3MonthlyGrowth: 0,
          startMonthIndex: 1,
          isActive: true,
        },
      ],
    },
    monthlyChecks: [
      {
        scope: "line",
        lineKey: "core-services",
        monthIndex: 1,
        metric: "units",
        expected: 100,
      },
      {
        scope: "line",
        lineKey: "core-services",
        monthIndex: 2,
        metric: "units",
        expected: 110,
      },
      {
        scope: "line",
        lineKey: "core-services",
        monthIndex: 3,
        metric: "units",
        expected: 121,
      },
      {
        scope: "total",
        monthIndex: 12,
        metric: "sales",
        expected: 1210,
      },
      {
        scope: "total",
        monthIndex: 12,
        metric: "margin",
        expected: 726,
      },
    ],
    annualChecks: [
      {
        scope: "line",
        lineKey: "core-services",
        yearBucket: 1,
        metric: "sales",
        expected: 14200,
      },
      {
        scope: "total",
        yearBucket: 1,
        metric: "cogs",
        expected: 5680,
      },
      {
        scope: "total",
        yearBucket: 1,
        metric: "margin",
        expected: 8520,
      },
    ],
    summaryChecks: {
      revenue: 14200,
      grossMarginPct: 60,
    },
  },
  {
    name: "revenue-ongoing-opening-balances",
    description:
      "Years 2 and 3 roll forward from the prior-year ending month before applying later-year monthly growth.",
    input: {
      revenueLines: [
        {
          lineKey: "retainers",
          sortOrder: 1,
          name: "Retainers",
          unitLabel: "clients",
          month1Units: 100,
          pricePerUnit: 12,
          cogsPerUnit: 3,
          q1MonthlyGrowth: 0,
          q2MonthlyGrowth: 0,
          q3MonthlyGrowth: 0,
          q4MonthlyGrowth: 0,
          year2MonthlyGrowth: 0.1,
          year3MonthlyGrowth: 0.05,
          startMonthIndex: 1,
          isActive: true,
        },
      ],
    },
    monthlyChecks: [
      {
        scope: "line",
        lineKey: "retainers",
        monthIndex: 13,
        metric: "units",
        expected: 100,
      },
      {
        scope: "line",
        lineKey: "retainers",
        monthIndex: 14,
        metric: "units",
        expected: 110,
      },
      {
        scope: "line",
        lineKey: "retainers",
        monthIndex: 24,
        metric: "units",
        expected: 285.3116706110003,
      },
      {
        scope: "line",
        lineKey: "retainers",
        monthIndex: 25,
        metric: "units",
        expected: 285.3116706110003,
      },
      {
        scope: "line",
        lineKey: "retainers",
        monthIndex: 26,
        metric: "units",
        expected: 299.5772541415503,
      },
    ],
    annualChecks: [
      {
        scope: "total",
        yearBucket: 2,
        metric: "sales",
        expected: 25661.140520652014,
      },
      {
        scope: "total",
        yearBucket: 3,
        metric: "margin",
        expected: 40872.07762986719,
      },
    ],
    summaryChecks: {
      revenue: 14400,
      grossMarginPct: 75,
    },
  },
  {
    name: "revenue-sales-override-precedence",
    description:
      "Metric-level overrides apply by line/month, and sales overrides beat generated units times price.",
    input: {
      revenueLines: [
        {
          lineKey: "enterprise-projects",
          sortOrder: 1,
          name: "Enterprise projects",
          unitLabel: "projects",
          month1Units: 10,
          pricePerUnit: 100,
          cogsPerUnit: 40,
          q1MonthlyGrowth: 0,
          q2MonthlyGrowth: 0,
          q3MonthlyGrowth: 0,
          q4MonthlyGrowth: 0,
          year2MonthlyGrowth: 0,
          year3MonthlyGrowth: 0,
          startMonthIndex: 1,
          isActive: true,
        },
      ],
      revenueOverrides: [
        {
          lineKey: "enterprise-projects",
          overrideKey: "override-month2-units",
          monthIndex: 2,
          metric: "units",
          overrideValue: 12,
          reason: "Adjusted staffing plan",
          source: "manual",
          isActive: true,
        },
        {
          lineKey: "enterprise-projects",
          overrideKey: "override-month2-sales",
          monthIndex: 2,
          metric: "sales",
          overrideValue: 1500,
          reason: "Booked premium package",
          source: "manual",
          isActive: true,
        },
        {
          lineKey: "enterprise-projects",
          overrideKey: "override-month2-cogs",
          monthIndex: 2,
          metric: "cogs",
          overrideValue: 500,
          reason: "Known delivery cost spike",
          source: "manual",
          isActive: true,
        },
        {
          lineKey: "enterprise-projects",
          overrideKey: "override-month2-margin",
          monthIndex: 2,
          metric: "margin",
          overrideValue: 900,
          reason: "Workbook reconciliation",
          source: "manual",
          isActive: true,
        },
      ],
    },
    monthlyChecks: [
      {
        scope: "line",
        lineKey: "enterprise-projects",
        monthIndex: 2,
        metric: "units",
        expected: 12,
      },
      {
        scope: "line",
        lineKey: "enterprise-projects",
        monthIndex: 2,
        metric: "sales",
        expected: 1500,
      },
      {
        scope: "line",
        lineKey: "enterprise-projects",
        monthIndex: 2,
        metric: "cogs",
        expected: 500,
      },
      {
        scope: "line",
        lineKey: "enterprise-projects",
        monthIndex: 2,
        metric: "margin",
        expected: 900,
      },
      {
        scope: "total",
        monthIndex: 2,
        metric: "sales",
        expected: 1500,
      },
    ],
    annualChecks: [
      {
        scope: "total",
        yearBucket: 1,
        metric: "sales",
        expected: 14500,
      },
      {
        scope: "total",
        yearBucket: 1,
        metric: "margin",
        expected: 8700,
      },
    ],
    overrideChecks: [
      {
        lineKey: "enterprise-projects",
        monthIndex: 2,
        metric: "units",
        expectedOverrideValue: 12,
        expectedSource: "manual",
      },
      {
        lineKey: "enterprise-projects",
        monthIndex: 2,
        metric: "sales",
        expectedOverrideValue: 1500,
        expectedSource: "manual",
      },
      {
        lineKey: "enterprise-projects",
        monthIndex: 2,
        metric: "cogs",
        expectedOverrideValue: 500,
        expectedSource: "manual",
      },
      {
        lineKey: "enterprise-projects",
        monthIndex: 2,
        metric: "margin",
        expectedOverrideValue: 900,
        expectedSource: "manual",
      },
    ],
    summaryChecks: {
      revenue: 14500,
      grossMarginPct: 60,
    },
  },
  {
    name: "revenue-low-margin-windowed",
    description:
      "Inactive months stay zeroed even when a line starts later and carries a very low gross margin.",
    input: {
      revenueLines: [
        {
          lineKey: "limited-window-line",
          sortOrder: 1,
          name: "Limited window line",
          unitLabel: "units",
          month1Units: 20,
          pricePerUnit: 15,
          cogsPerUnit: 14.5,
          q1MonthlyGrowth: 0,
          q2MonthlyGrowth: 0,
          q3MonthlyGrowth: 0,
          q4MonthlyGrowth: 0,
          year2MonthlyGrowth: 0,
          year3MonthlyGrowth: 0,
          startMonthIndex: 3,
          endMonthIndex: 5,
          isActive: true,
        },
      ],
    },
    monthlyChecks: [
      {
        scope: "total",
        monthIndex: 1,
        metric: "sales",
        expected: 0,
      },
      {
        scope: "line",
        lineKey: "limited-window-line",
        monthIndex: 2,
        metric: "units",
        expected: 0,
      },
      {
        scope: "line",
        lineKey: "limited-window-line",
        monthIndex: 3,
        metric: "sales",
        expected: 300,
      },
      {
        scope: "line",
        lineKey: "limited-window-line",
        monthIndex: 5,
        metric: "margin",
        expected: 10,
      },
      {
        scope: "total",
        monthIndex: 6,
        metric: "sales",
        expected: 0,
      },
    ],
    annualChecks: [
      {
        scope: "total",
        yearBucket: 1,
        metric: "sales",
        expected: 900,
      },
      {
        scope: "total",
        yearBucket: 1,
        metric: "margin",
        expected: 30,
      },
    ],
    summaryChecks: {
      revenue: 900,
      grossMarginPct: 3.3333333333333335,
    },
  },
];

export function listRevenueParityFixtures() {
  return requiredRevenueParityFixtures;
}
