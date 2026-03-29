import { spawnSync } from "node:child_process";

type ManualVerifyIdentity = {
  subject: string;
  email: string;
  name: string;
};

function usage() {
  console.error(
    [
      "Usage:",
      "  npm run convex:run:manual -- <functionName> [jsonArgs]",
      "",
      "Examples:",
      '  npm run convex:run:manual -- dev:seedFoundationScenario \'{"fixtureKey":"startup-no-debt"}\'',
      '  npm run convex:run:manual -- engine:recalculateScenario \'{"scenarioId":"<scenarioId>"}\'',
      "",
      "Optional env vars:",
      "  CONVEX_MANUAL_VERIFY_IDENTITY_JSON",
      "  CONVEX_MANUAL_VERIFY_SUBJECT",
      "  CONVEX_MANUAL_VERIFY_EMAIL",
      "  CONVEX_MANUAL_VERIFY_NAME",
    ].join("\n"),
  );
}

function parseIdentity(): ManualVerifyIdentity {
  const rawIdentity = process.env.CONVEX_MANUAL_VERIFY_IDENTITY_JSON;

  if (rawIdentity) {
    const parsed = JSON.parse(rawIdentity) as Partial<ManualVerifyIdentity>;

    if (!parsed.subject || !parsed.email || !parsed.name) {
      throw new Error(
        "CONVEX_MANUAL_VERIFY_IDENTITY_JSON must include subject, email, and name.",
      );
    }

    return {
      subject: parsed.subject,
      email: parsed.email,
      name: parsed.name,
    };
  }

  return {
    subject: process.env.CONVEX_MANUAL_VERIFY_SUBJECT ?? "manual-verifier",
    email:
      process.env.CONVEX_MANUAL_VERIFY_EMAIL ??
      "manual-verifier+clerk_test@example.com",
    name: process.env.CONVEX_MANUAL_VERIFY_NAME ?? "Manual Verifier",
  };
}

function normalizeArgs(rawArgs: string | undefined) {
  if (!rawArgs) {
    return "{}";
  }

  JSON.parse(rawArgs);

  return rawArgs;
}

function main() {
  const [functionName, ...rawArgParts] = process.argv.slice(2);

  if (!functionName || functionName === "--help" || functionName === "-h") {
    usage();
    process.exit(functionName ? 0 : 1);
  }

  const identity = parseIdentity();
  const normalizedArgs = normalizeArgs(rawArgParts.join(" ").trim() || undefined);

  const result = spawnSync(
    "npx",
    [
      "convex",
      "run",
      "--identity",
      JSON.stringify(identity),
      functionName,
      normalizedArgs,
    ],
    {
      stdio: "inherit",
    },
  );

  if (result.error) {
    throw result.error;
  }

  process.exit(result.status ?? 1);
}

main();
