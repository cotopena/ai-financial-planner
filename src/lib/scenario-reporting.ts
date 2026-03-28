export const statementDefinitions = {
  "income-statement": {
    title: "Income Statement",
    description:
      "Persisted monthly and annual income-statement rows for the active scenario version.",
  },
  "balance-sheet": {
    title: "Balance Sheet",
    description:
      "Persisted annual and monthly balance-sheet rows for the active scenario version.",
  },
  "break-even": {
    title: "Break-Even",
    description:
      "Persisted break-even outputs for the active scenario version.",
  },
  ratios: {
    title: "Financial Ratios",
    description:
      "Persisted ratio snapshot rows and stored ratio norms for the active scenario version.",
  },
} as const;

export type StatementSlug = keyof typeof statementDefinitions;

export const statementOrder = Object.keys(statementDefinitions) as StatementSlug[];

export function isStatementSlug(value: string): value is StatementSlug {
  return value in statementDefinitions;
}
