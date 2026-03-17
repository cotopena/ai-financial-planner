import type { NormalizedScenarioInput } from "../schemas/input-schema";
import type { DiagnosticCard } from "../schemas/output-schema";

export function calculateDiagnostics(
  _input: NormalizedScenarioInput,
): DiagnosticCard[] {
  void _input;

  return [
    {
      severity: "info",
      title: "Diagnostics scaffolded",
      message:
        "Diagnostics stay placeholder-only until the deterministic output pipeline is implemented.",
      recommendation:
        "Use Sprint 4 to connect warnings to ratios, break-even, and cash-flow outputs.",
    },
  ];
}
