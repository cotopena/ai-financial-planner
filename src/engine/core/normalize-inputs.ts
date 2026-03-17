import {
  NormalizedScenarioInputSchema,
  createEmptyScenarioInput,
  type NormalizedScenarioInput,
} from "../schemas/input-schema";

export function normalizeScenarioInput(
  rawInput: Partial<NormalizedScenarioInput> = {},
): NormalizedScenarioInput {
  const base = createEmptyScenarioInput();

  return NormalizedScenarioInputSchema.parse({
    ...base,
    ...rawInput,
    business: {
      ...base.business,
      ...rawInput.business,
    },
    scenario: {
      ...base.scenario,
      ...rawInput.scenario,
    },
    openingBalances: {
      ...base.openingBalances,
      ...rawInput.openingBalances,
    },
    payrollAssumptions: {
      ...base.payrollAssumptions,
      ...rawInput.payrollAssumptions,
    },
    workingCapitalSettings: {
      ...base.workingCapitalSettings,
      ...rawInput.workingCapitalSettings,
    },
    taxSettings: {
      ...base.taxSettings,
      ...rawInput.taxSettings,
    },
    operatingExpenseMonths:
      rawInput.operatingExpenseMonths ?? base.operatingExpenseMonths,
    capexMonths: rawInput.capexMonths ?? base.capexMonths,
  });
}
