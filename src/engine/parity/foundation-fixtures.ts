import type { NormalizedScenarioInput } from "../schemas/input-schema";
import type {
  AmortizationSectionPayload,
  DebtSchedulesSectionPayload,
  DepreciationSectionPayload,
  OpeningPositionSectionPayload,
} from "../schemas/output-schema";

type OpeningPositionMetric = keyof OpeningPositionSectionPayload["totals"];
type DebtMetric = "payment" | "interest" | "principal" | "endingBalance";
type DepreciationMetric = "expense" | "endingBookValue";
type AmortizationMetric = "expense" | "endingBalance";

type OpeningPositionCheck = {
  metric: OpeningPositionMetric;
  expected: number | boolean;
};

type OpeningSeriesCheck = {
  scope: "monthly" | "annual";
  monthIndex?: number;
  yearBucket?: 1 | 2 | 3;
  expected: number;
};

type DebtMonthlyCheck = {
  scope: "loan" | "total";
  loanKey?: string;
  monthIndex: number;
  metric: DebtMetric;
  expected: number;
};

type DebtAnnualCheck = {
  scope: "loan" | "total";
  loanKey?: string;
  yearBucket: 1 | 2 | 3;
  metric: DebtMetric;
  expected: number;
};

type DepreciationMonthlyCheck = {
  scope: "item" | "total";
  itemKey?: string;
  monthIndex: number;
  metric: DepreciationMetric;
  expected: number;
};

type DepreciationAnnualCheck = {
  scope: "item" | "total";
  itemKey?: string;
  yearBucket: 1 | 2 | 3;
  metric: DepreciationMetric;
  expected: number;
};

type AmortizationMonthlyCheck = {
  scope: "item" | "total";
  itemKey?: string;
  monthIndex: number;
  metric: AmortizationMetric;
  expected: number;
};

type AmortizationAnnualCheck = {
  scope: "item" | "total";
  itemKey?: string;
  yearBucket: 1 | 2 | 3;
  metric: AmortizationMetric;
  expected: number;
};

type SectionKey = keyof Pick<
  {
    openingPosition: OpeningPositionSectionPayload;
    debtSchedules: DebtSchedulesSectionPayload;
    depreciation: DepreciationSectionPayload;
    amortization: AmortizationSectionPayload;
  },
  "openingPosition" | "debtSchedules" | "depreciation" | "amortization"
>;

type NoteCheck = {
  section: SectionKey;
  includes: string;
};

export type FoundationParityFixture = {
  name: (typeof requiredFoundationParityFixtures)[number];
  description: string;
  input: Partial<NormalizedScenarioInput>;
  openingChecks: OpeningPositionCheck[];
  openingSeriesChecks?: OpeningSeriesCheck[];
  debtMonthlyChecks?: DebtMonthlyCheck[];
  debtAnnualChecks?: DebtAnnualCheck[];
  depreciationMonthlyChecks: DepreciationMonthlyCheck[];
  depreciationAnnualChecks: DepreciationAnnualCheck[];
  amortizationMonthlyChecks: AmortizationMonthlyCheck[];
  amortizationAnnualChecks: AmortizationAnnualCheck[];
  noteChecks?: NoteCheck[];
};

export const requiredFoundationParityFixtures = [
  "foundation-startup-no-debt",
  "foundation-startup-multiple-debt",
  "foundation-ongoing-opening-balances",
] as const;

export const foundationParityFixtures: FoundationParityFixture[] = [
  {
    name: "foundation-startup-no-debt",
    description:
      "Balanced startup opening funding with no debt, land exclusion, and straight-line depreciation plus amortization.",
    input: {
      openingAssets: [
        {
          assetKey: "asset-equipment",
          category: "equipment",
          amount: 12000,
          depreciationYears: 5,
        },
        {
          assetKey: "asset-land",
          category: "land",
          amount: 5000,
        },
      ],
      startupCosts: [
        {
          costKey: "startup-wages",
          category: "pre_opening_wages",
          amount: 6000,
        },
        {
          costKey: "startup-working-capital",
          category: "working_capital_cash_on_hand",
          amount: 12000,
        },
      ],
      fundingSources: [
        {
          sourceKey: "owner-equity",
          category: "owner_equity",
          amount: 35000,
        },
      ],
      taxSettings: {
        year1TaxRate: 0,
        year2TaxRate: 0,
        year3TaxRate: 0,
        amortizationYears: 5,
      },
    },
    openingChecks: [
      { metric: "totalFixedAssets", expected: 17000 },
      { metric: "totalStartupCosts", expected: 18000 },
      { metric: "totalRequiredFunds", expected: 35000 },
      { metric: "totalFundingSources", expected: 35000 },
      { metric: "isBalanced", expected: true },
    ],
    depreciationMonthlyChecks: [
      {
        scope: "total",
        monthIndex: 1,
        metric: "expense",
        expected: 200,
      },
      {
        scope: "item",
        itemKey: "asset-equipment",
        monthIndex: 1,
        metric: "endingBookValue",
        expected: 11800,
      },
    ],
    depreciationAnnualChecks: [
      {
        scope: "total",
        yearBucket: 1,
        metric: "expense",
        expected: 2400,
      },
      {
        scope: "item",
        itemKey: "asset-equipment",
        yearBucket: 1,
        metric: "endingBookValue",
        expected: 9600,
      },
    ],
    amortizationMonthlyChecks: [
      {
        scope: "total",
        monthIndex: 1,
        metric: "expense",
        expected: 300,
      },
      {
        scope: "item",
        itemKey: "startup-working-capital",
        monthIndex: 1,
        metric: "expense",
        expected: 200,
      },
    ],
    amortizationAnnualChecks: [
      {
        scope: "total",
        yearBucket: 1,
        metric: "expense",
        expected: 3600,
      },
      {
        scope: "item",
        itemKey: "startup-wages",
        yearBucket: 1,
        metric: "endingBalance",
        expected: 4800,
      },
    ],
    noteChecks: [
      {
        section: "openingPosition",
        includes: "Opening funding sources match required funds.",
      },
      {
        section: "debtSchedules",
        includes: "No debt funding sources are configured",
      },
      {
        section: "depreciation",
        includes: "Land is excluded from depreciation schedules.",
      },
    ],
  },
  {
    name: "foundation-startup-multiple-debt",
    description:
      "Startup scenario with multiple debt rows, an override-driven amortization path, and Year 2 CapEx fallback timing.",
    input: {
      openingAssets: [
        {
          assetKey: "asset-opening-equip",
          category: "equipment",
          amount: 1000,
          depreciationYears: 5,
        },
      ],
      startupCosts: [
        {
          costKey: "startup-inventory",
          category: "inventory",
          amount: 2400,
        },
        {
          costKey: "startup-legal",
          category: "legal_accounting_fees",
          amount: 1200,
        },
      ],
      fundingSources: [
        {
          sourceKey: "equity",
          category: "owner_equity",
          amount: 1000,
        },
        {
          sourceKey: "loan-a",
          category: "commercial_loan",
          amount: 1200,
          interestRate: 0.12,
          termMonths: 12,
        },
        {
          sourceKey: "loan-b",
          category: "vehicle_loans",
          amount: 2400,
          interestRate: 0.12,
          termMonths: 24,
          monthlyPaymentOverride: 100,
        },
      ],
      capexLines: [
        {
          lineKey: "capex-equip",
          category: "equipment",
          depreciationYears: 2,
          year2AnnualAmount: 1200,
          year3AnnualAmount: 0,
        },
      ],
      capexMonths: {
        "capex-equip": [{ monthIndex: 2, amount: 600 }],
      },
      taxSettings: {
        year1TaxRate: 0,
        year2TaxRate: 0,
        year3TaxRate: 0,
        amortizationYears: 3,
      },
    },
    openingChecks: [
      { metric: "totalRequiredFunds", expected: 4600 },
      { metric: "totalFundingSources", expected: 4600 },
      { metric: "isBalanced", expected: true },
    ],
    debtMonthlyChecks: [
      {
        scope: "total",
        monthIndex: 1,
        metric: "payment",
        expected: 206.61854641400993,
      },
      {
        scope: "loan",
        loanKey: "loan-a",
        monthIndex: 1,
        metric: "interest",
        expected: 12,
      },
      {
        scope: "loan",
        loanKey: "loan-b",
        monthIndex: 1,
        metric: "principal",
        expected: 76,
      },
      {
        scope: "loan",
        loanKey: "loan-b",
        monthIndex: 28,
        metric: "payment",
        expected: 58.18865157329389,
      },
    ],
    debtAnnualChecks: [
      {
        scope: "total",
        yearBucket: 1,
        metric: "payment",
        expected: 2479.422556968119,
      },
      {
        scope: "loan",
        loanKey: "loan-a",
        yearBucket: 1,
        metric: "endingBalance",
        expected: 0,
      },
      {
        scope: "loan",
        loanKey: "loan-b",
        yearBucket: 1,
        metric: "endingBalance",
        expected: 1436.1297709970302,
      },
      {
        scope: "total",
        yearBucket: 2,
        metric: "endingBalance",
        expected: 350.01667115745005,
      },
    ],
    depreciationMonthlyChecks: [
      {
        scope: "total",
        monthIndex: 1,
        metric: "expense",
        expected: 16.666666666666668,
      },
      {
        scope: "total",
        monthIndex: 2,
        metric: "expense",
        expected: 41.66666666666667,
      },
      {
        scope: "total",
        monthIndex: 13,
        metric: "expense",
        expected: 45.833333333333336,
      },
      {
        scope: "item",
        itemKey: "capex-equip",
        monthIndex: 13,
        metric: "expense",
        expected: 29.166666666666668,
      },
    ],
    depreciationAnnualChecks: [
      {
        scope: "total",
        yearBucket: 1,
        metric: "expense",
        expected: 475.00000000000017,
      },
      {
        scope: "total",
        yearBucket: 2,
        metric: "expense",
        expected: 825,
      },
      {
        scope: "item",
        itemKey: "capex-equip",
        yearBucket: 2,
        metric: "endingBookValue",
        expected: 900,
      },
    ],
    amortizationMonthlyChecks: [
      {
        scope: "total",
        monthIndex: 1,
        metric: "expense",
        expected: 100,
      },
      {
        scope: "item",
        itemKey: "startup-inventory",
        monthIndex: 1,
        metric: "expense",
        expected: 66.66666666666667,
      },
    ],
    amortizationAnnualChecks: [
      {
        scope: "total",
        yearBucket: 1,
        metric: "expense",
        expected: 1200,
      },
      {
        scope: "total",
        yearBucket: 3,
        metric: "endingBalance",
        expected: 0,
      },
    ],
    noteChecks: [
      {
        section: "debtSchedules",
        includes: "1 debt source(s) use monthly payment overrides.",
      },
      {
        section: "depreciation",
        includes: "CapEx annual fallback timing was used",
      },
    ],
  },
  {
    name: "foundation-ongoing-opening-balances",
    description:
      "Ongoing business opening balances flow into opening-position compatibility fields alongside depreciation and amortization.",
    input: {
      business: {
        name: "Ongoing scenario",
        companyName: "Ongoing scenario",
        businessProfile: "services",
        businessStage: "ongoing",
        startMonth: 1,
        startYear: 2026,
        currencyCode: "USD",
        countryRegion: "US",
      },
      openingAssets: [
        {
          assetKey: "asset-ongoing-equipment",
          category: "equipment",
          amount: 6000,
          depreciationYears: 3,
        },
      ],
      startupCosts: [
        {
          costKey: "startup-legacy-fees",
          category: "legal_accounting_fees",
          amount: 1800,
        },
      ],
      fundingSources: [
        {
          sourceKey: "ongoing-equity",
          category: "outside_investors",
          amount: 7800,
        },
      ],
      openingBalances: {
        cash: 10000,
        accountsReceivable: 2000,
        prepaidExpenses: 500,
        accountsPayable: 1500,
        accruedExpenses: 1000,
      },
      taxSettings: {
        year1TaxRate: 0,
        year2TaxRate: 0,
        year3TaxRate: 0,
        amortizationYears: 3,
      },
    },
    openingChecks: [
      { metric: "totalRequiredFunds", expected: 7800 },
      { metric: "openingCashPosition", expected: 10000 },
      { metric: "isBalanced", expected: true },
    ],
    openingSeriesChecks: [
      {
        scope: "monthly",
        monthIndex: 1,
        expected: 10000,
      },
      {
        scope: "annual",
        yearBucket: 1,
        expected: 10000,
      },
    ],
    depreciationMonthlyChecks: [
      {
        scope: "total",
        monthIndex: 1,
        metric: "expense",
        expected: 166.66666666666666,
      },
    ],
    depreciationAnnualChecks: [
      {
        scope: "total",
        yearBucket: 1,
        metric: "expense",
        expected: 2000.0000000000002,
      },
    ],
    amortizationMonthlyChecks: [
      {
        scope: "total",
        monthIndex: 1,
        metric: "expense",
        expected: 50,
      },
    ],
    amortizationAnnualChecks: [
      {
        scope: "total",
        yearBucket: 1,
        metric: "expense",
        expected: 600,
      },
    ],
    noteChecks: [
      {
        section: "openingPosition",
        includes: "ongoing business",
      },
    ],
  },
];

export function listFoundationParityFixtures() {
  return foundationParityFixtures.map((fixture) => fixture.name);
}
