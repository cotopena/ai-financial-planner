export const wizardStepContent = {
  "step-1": {
    title: "Wizard Step 1: Basics",
    description:
      "Capture model identity, preparer details, planning start date, and business stage.",
    sections: [
      {
        title: "Inputs on this step",
        description: "Exact fields come from PRD section 6.2 and section 7.1.",
        items: [
          "Model name, business name, and preparer name",
          "Start month and start year",
          "Currency and country/region locked to USD / US for v1",
          "Business stage: startup or ongoing",
        ],
      },
      {
        title: "AI behavior",
        description:
          "The wizard asks one concept at a time and offers estimate help when users are unsure.",
        note: "Approval flow remains stubbed until Sprint 6.",
      },
    ],
  },
  "step-2": {
    title: "Wizard Step 2: Profile",
    description:
      "Capture business type to drive language, examples, and diagnostics context.",
    sections: [
      {
        title: "Business profile",
        description: "One generic core template ships in v1, with profile-aware wording.",
        items: [
          "Industry / business type selector",
          "Short narrative about how the business makes money",
          "Profile-specific examples used by AI helper copy",
        ],
      },
      {
        title: "Downstream usage",
        description: "Profile data informs prompts, diagnostics language, and ratio norm hints.",
        note: "No separate vertical models in v1.",
      },
    ],
  },
  "step-3": {
    title: "Wizard Step 3: Opening Position",
    description:
      "Capture opening assets, startup costs, funding rows, and ongoing-business opening balances.",
    sections: [
      {
        title: "Opening tables",
        description: "These rows persist to the opening and funding assumption tables.",
        items: [
          "Opening assets with depreciation years",
          "Startup cost and operating capital rows",
          "Funding source rows",
          "Opening balances for ongoing businesses",
        ],
      },
      {
        title: "Data model target",
        description: "Convex tables already exist for each assumption group.",
        note: "Detailed upserts are stubbed in Sprint 0.",
      },
    ],
  },
  "step-4": {
    title: "Wizard Step 4: Revenue",
    description:
      "Capture initial revenue lines, Month 1 drivers, pricing, COGS, and growth assumptions.",
    sections: [
      {
        title: "Revenue line starter rows",
        description: "Dynamic revenue lines with caps replace hard-coded worksheet rows.",
        table: {
          columns: ["Line", "Month 1 units", "Price", "COGS"],
          rows: [
            ["Service package", "40", "$325", "$90"],
            ["Add-on product", "25", "$80", "$32"],
          ],
        },
      },
      {
        title: "Override discipline",
        description:
          "AI can suggest adjustments, but direct writes still require explicit approval.",
        note: "Controlled overrides only in v1.",
      },
    ],
  },
  "step-5": {
    title: "Wizard Step 5: COGS",
    description:
      "Review estimate-helper outputs and confirm assumptions before they become line defaults.",
    sections: [
      {
        title: "Estimate helper",
        description:
          "The AI helper will later present options, pros and cons, and a recommendation.",
        items: [
          "Suggested cost structure",
          "Confidence label and reasoning",
          "User approval before apply",
        ],
      },
      {
        title: "PRD safety rule",
        description: "All AI estimates must be labeled as assumptions.",
        note: "No direct AI writes to tables.",
      },
    ],
  },
  "step-6": {
    title: "Wizard Step 6: Payroll",
    description:
      "Collect role rows and global tax / benefits assumptions for the payroll engine.",
    sections: [
      {
        title: "Role setup",
        description: "Year 1 is monthly detail. Years 2 and 3 roll forward from growth assumptions.",
        table: {
          columns: ["Role", "Mode", "Headcount", "Growth"],
          rows: [
            ["Founder", "Monthly", "1", "0% / 0%"],
            ["Sales rep", "Monthly", "2", "4% / 4%"],
          ],
        },
      },
      {
        title: "Payroll assumptions",
        description: "US-shaped defaults stay editable in the assumption model.",
        note: "Tax and benefit math is intentionally unimplemented in Sprint 0.",
      },
    ],
  },
  "step-7": {
    title: "Wizard Step 7: Expenses",
    description:
      "Capture Year 1 monthly operating expenses and Years 2-3 annual growth assumptions.",
    sections: [
      {
        title: "Year 1 detail",
        description: "One row per category with 12 editable months.",
        items: [
          "Rent, utilities, software, marketing, insurance",
          "Custom categories with labels and sort order",
          "Monthly edit grid state with validation badges",
        ],
      },
      {
        title: "Years 2-3 summary",
        description: "Growth assumptions feed the engine rather than 36 manual monthly rows.",
        note: "Month-detail drawer will land with the workspace screens.",
      },
    ],
  },
  "step-8": {
    title: "Wizard Step 8: Cash & Financing",
    description:
      "Capture working-capital timing, minimum cash, tax settings, LOC behavior, and capex.",
    sections: [
      {
        title: "Cash controls",
        description:
          "This screen mirrors the workbook's additional inputs and financing behavior.",
        items: [
          "A/R and A/P timing buckets",
          "Desired minimum cash and LOC interest",
          "Tax settings, capex plan, and manual cash items",
        ],
      },
      {
        title: "Financing mode",
        description: "Users choose auto-draw, no financing, or manual financing behavior.",
        note: "LOC logic lands in Sprint 3.",
      },
    ],
  },
  "step-9": {
    title: "Wizard Step 9: Review",
    description:
      "Summarize assumptions, warnings, funding gap checks, and create the base scenario.",
    sections: [
      {
        title: "Review payload",
        description: "The exit screen will later combine validation, diagnostics, and suggested fixes.",
        items: [
          "Missing required fields",
          "Funding gap warning",
          "Readiness to create the base case",
        ],
      },
      {
        title: "Next action",
        description: "Approved wizard completion creates the first persisted scenario version.",
        note: "Scenario versioning is scaffolded in Convex.",
      },
    ],
  },
} as const;

export const revenueViewContent = {
  "year-1": {
    title: "Revenue Year 1",
    description:
      "Monthly detail grid for units, price, COGS, and controlled overrides in the first twelve months.",
    sections: [
      {
        title: "Driver grid",
        description: "Month 1 base drivers plus quarterly growth assumptions.",
        table: {
          columns: ["Line", "Month 1", "Price", "COGS", "Q1 growth"],
          rows: [
            ["Service package", "40", "$325", "$90", "3.0%"],
            ["Support retainer", "12", "$1,200", "$180", "1.5%"],
          ],
        },
      },
      {
        title: "Override panel",
        description: "Month-level override rows are persisted separately for explainability.",
        note: "Override CRUD lands with Sprint 2 and Sprint 5.",
      },
    ],
  },
  "years-2-3": {
    title: "Revenue Years 2-3",
    description:
      "Growth-driven summary view for later periods with drawer-based month detail on demand.",
    sections: [
      {
        title: "Forward plan",
        description: "Year 2 and Year 3 monthly growth settings extend from the last Year 1 month.",
        table: {
          columns: ["Line", "Year 2 growth", "Year 3 growth", "Status"],
          rows: [
            ["Service package", "2.5%", "2.0%", "Active"],
            ["Support retainer", "1.0%", "1.0%", "Active"],
          ],
        },
      },
      {
        title: "Detail model",
        description: "The engine still produces all 36 months even when the UI shows summary tables.",
      },
    ],
  },
} as const;

export const payrollViewContent = {
  "year-1": {
    title: "Payroll Year 1",
    description:
      "Role-level monthly detail for headcount, compensation mode, wages, and tax assumptions.",
    sections: [
      {
        title: "Role drivers",
        description: "The payroll engine treats owners, employees, and contractors differently.",
        table: {
          columns: ["Role", "Mode", "Headcount", "Start month", "Monthly pay"],
          rows: [
            ["Founder", "Monthly", "1", "1", "$6,500"],
            ["Sales rep", "Monthly", "2", "2", "$4,200"],
          ],
        },
      },
      {
        title: "Tax assumptions",
        description: "US defaults are stored separately from role rows.",
        note: "Wage-base caps and payroll tax math remain unimplemented.",
      },
    ],
  },
  "years-2-3": {
    title: "Payroll Years 2-3",
    description:
      "Annualized payroll growth view for later periods, driven by role-level year-over-year assumptions.",
    sections: [
      {
        title: "Growth assumptions",
        description: "Each role carries independent Year 2 and Year 3 growth rates.",
        table: {
          columns: ["Role", "Year 2 growth", "Year 3 growth"],
          rows: [
            ["Founder", "0.0%", "0.0%"],
            ["Sales rep", "4.0%", "4.0%"],
          ],
        },
      },
      {
        title: "Detail fallback",
        description: "The UI will expose month detail through a drawer rather than a full sheet.",
      },
    ],
  },
} as const;

export const expenseViewContent = {
  "year-1": {
    title: "Expenses Year 1",
    description:
      "Monthly operating expense grid for category-level planning in the first twelve months.",
    sections: [
      {
        title: "Expense categories",
        description: "Fixed and custom lines are stored separately from the monthly amounts table.",
        table: {
          columns: ["Category", "Jan", "Feb", "Mar"],
          rows: [
            ["Rent", "$3,400", "$3,400", "$3,400"],
            ["Marketing", "$1,250", "$1,250", "$1,500"],
          ],
        },
      },
      {
        title: "Edit behavior",
        description: "Rows expose validation, save state, and override badges in the full workspace.",
      },
    ],
  },
  "years-2-3": {
    title: "Expenses Years 2-3",
    description:
      "Annual growth summary for operating expenses beyond Year 1 with detailed monthly persistence left to the engine.",
    sections: [
      {
        title: "Growth model",
        description: "Year 2 and Year 3 growth rates sit on each expense category row.",
        table: {
          columns: ["Category", "Year 2 growth", "Year 3 growth"],
          rows: [
            ["Rent", "3.0%", "3.0%"],
            ["Marketing", "6.0%", "5.0%"],
          ],
        },
      },
      {
        title: "Engine expectation",
        description: "The shared engine still outputs all monthly OpEx totals for cash-flow math.",
      },
    ],
  },
} as const;
