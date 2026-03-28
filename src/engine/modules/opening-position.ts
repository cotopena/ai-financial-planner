import type { PeriodAxis } from "../core/period-axis";
import type { NormalizedScenarioInput } from "../schemas/input-schema";
import type { OpeningPositionSectionPayload } from "../schemas/output-schema";
import { buildOpeningValueSeries, sanitizeNumber, sumBy } from "./helpers";

const BALANCE_TOLERANCE = 0.000001;

function formatAmount(value: number) {
  return sanitizeNumber(value).toFixed(2);
}

export function calculateOpeningPosition(
  input: NormalizedScenarioInput,
  axis: PeriodAxis,
): OpeningPositionSectionPayload {
  const totalFixedAssets = sumBy(input.openingAssets, (asset) => asset.amount);
  const totalStartupCosts = sumBy(input.startupCosts, (cost) => cost.amount);
  const totalRequiredFunds = sanitizeNumber(totalFixedAssets + totalStartupCosts);
  const totalFundingSources = sumBy(input.fundingSources, (source) => source.amount);
  const netFundingDifference = sanitizeNumber(
    totalFundingSources - totalRequiredFunds,
  );
  const fundingGap = netFundingDifference < 0 ? Math.abs(netFundingDifference) : 0;
  const fundingSurplus = netFundingDifference > 0 ? netFundingDifference : 0;
  const isBalanced = Math.abs(netFundingDifference) <= BALANCE_TOLERANCE;
  const openingCashPosition = sanitizeNumber(
    input.openingBalances.cash +
      input.openingBalances.accountsReceivable +
      input.openingBalances.prepaidExpenses -
      input.openingBalances.accountsPayable -
      input.openingBalances.accruedExpenses,
  );
  const openingCashSeries = buildOpeningValueSeries(axis, openingCashPosition);
  const notes = [];

  if (totalRequiredFunds === 0 && totalFundingSources === 0) {
    notes.push("No opening-funding assumptions are configured for this scenario.");
  } else if (isBalanced) {
    notes.push("Opening funding sources match required funds.");
  } else if (fundingGap > 0) {
    notes.push(`Opening funding gap remains ${formatAmount(fundingGap)}.`);
  } else if (fundingSurplus > 0) {
    notes.push(`Opening funding surplus totals ${formatAmount(fundingSurplus)}.`);
  }

  if (input.business.businessStage === "ongoing") {
    notes.push(
      "Opening cash position reflects opening balances for the ongoing business.",
    );
  }

  return {
    sectionKey: "opening-position",
    monthly: openingCashSeries.monthly,
    annual: openingCashSeries.annual,
    notes,
    totals: {
      totalFixedAssets,
      totalStartupCosts,
      totalRequiredFunds,
      totalFundingSources,
      fundingGap,
      fundingSurplus,
      netFundingDifference,
      isBalanced,
      openingCash: input.openingBalances.cash,
      accountsReceivable: input.openingBalances.accountsReceivable,
      prepaidExpenses: input.openingBalances.prepaidExpenses,
      accountsPayable: input.openingBalances.accountsPayable,
      accruedExpenses: input.openingBalances.accruedExpenses,
      openingCashPosition,
    },
  };
}
