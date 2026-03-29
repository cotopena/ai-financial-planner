"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useAction, useMutation } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageIntro } from "@/components/workspace/page-intro";

type FoundationFixtureKey =
  | "startup-no-debt"
  | "startup-multiple-debt"
  | "ongoing-opening-balances";

type SeedResult = {
  businessId: string;
  fixtureKey: FoundationFixtureKey;
  generatedAt?: string;
  overviewUrl: string;
  recalculateCommand: string;
  scenarioId: string;
  versionNumber?: number;
};

const fixtures: Array<{
  description: string;
  key: FoundationFixtureKey;
  title: string;
}> = [
  {
    key: "startup-no-debt",
    title: "Startup, no debt",
    description:
      "Seeds the balanced startup case where opening-position totals should match required funds with no loan schedules.",
  },
  {
    key: "startup-multiple-debt",
    title: "Startup, multiple debt",
    description:
      "Seeds multiple debt sources, including one payment override, so manual verification can inspect the amortization path.",
  },
  {
    key: "ongoing-opening-balances",
    title: "Ongoing, opening balances",
    description:
      "Seeds an ongoing business with opening balances so depreciation and amortization can be checked against persisted rows.",
  },
];

function formatGeneratedAt(value: string | undefined) {
  if (!value) {
    return "Not generated yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildScenarioLinks(result: SeedResult | null) {
  if (!result) {
    return null;
  }

  const basePath =
    `/app/businesses/${result.businessId}/scenarios/${result.scenarioId}` as const;

  return {
    overview: result.overviewUrl as Route,
    openingFunding: `${basePath}/opening-funding` as Route,
    cashFinancing: `${basePath}/cash-financing` as Route,
    diagnostics: `${basePath}/diagnostics` as Route,
  };
}

export function FoundationSeedClient({
  appUrl,
  convexDeployment,
  convexUrl,
}: {
  appUrl: string;
  convexDeployment: string | null;
  convexUrl: string | null;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const seedFoundationScenario = useMutation(api.dev.seedFoundationScenario);
  const recalculateScenario = useAction(api.engine.recalculateScenario);
  const [results, setResults] = useState<
    Partial<Record<FoundationFixtureKey, SeedResult>>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [busyFixture, setBusyFixture] = useState<FoundationFixtureKey | null>(null);

  async function handleSeedAndRecalculate(fixtureKey: FoundationFixtureKey) {
    setBusyFixture(fixtureKey);
    setError(null);

    try {
      const seed = await seedFoundationScenario({ fixtureKey });
      const recalc = await recalculateScenario({
        scenarioId: seed.scenarioId as Id<"scenarios">,
      });

      setResults((current) => ({
        ...current,
        [fixtureKey]: {
          ...seed,
          generatedAt: recalc.generatedAt,
          versionNumber: recalc.versionNumber,
        },
      }));
    } catch (runError) {
      setError(
        runError instanceof Error
          ? runError.message
          : "Unable to seed and recalculate the foundation scenario.",
      );
    } finally {
      setBusyFixture(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Manual verification"
        title="Seed owned foundation scenarios"
        description="Creates or refreshes PLAN-1004 foundation verification scenarios for the signed-in Clerk user, then runs recalculation on the same Convex deployment the browser is already using."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Environment lock</CardTitle>
            <CardDescription>
              This route is local-only and is intended for Clerk-backed manual
              verification when browser ownership must match the seeded scenario.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="font-medium">App URL</p>
              <p className="mt-1 text-muted-foreground">{appUrl}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="font-medium">Convex URL</p>
              <p className="mt-1 break-all text-muted-foreground">
                {convexUrl ?? "Missing"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="font-medium">Convex deployment</p>
              <p className="mt-1 text-muted-foreground">
                {convexDeployment ?? "Missing"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="font-medium">Clerk test mode hint</p>
              <p className="mt-1 text-muted-foreground">
                Use a test identifier like
                {" "}
                <code>manual+clerk_test@example.com</code>.
                If your Clerk dev instance is using email verification codes,
                enter <code>424242</code>. If password auth is enabled instead,
                use the password you created for that test user.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="font-medium">Terminal note</p>
              <p className="mt-1 text-muted-foreground">
                Use this page when you need the browser and Convex mutations to
                run as the same user. The terminal wrapper is still available
                for CLI-only checks, but it uses a mocked identity by default.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Signed-in operator</CardTitle>
            <CardDescription>
              Foundation seed actions require a Clerk-authenticated browser
              session because the created scenarios stay user-owned.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {isLoaded && isSignedIn ? (
              <>
                <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 p-4">
                  <UserButton />
                  <div>
                    <p className="font-medium">Authenticated</p>
                    <p className="text-muted-foreground">
                      Seeded scenarios from this page will be visible to the
                      current Clerk user in the workspace.
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Run one fixture at a time, then open the linked scenario pages
                  to complete the manual verification flow.
                </p>
              </>
            ) : (
              <>
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="font-medium">Sign in first</p>
                  <p className="mt-1 text-muted-foreground">
                    Open the Clerk sign-in route in this local app before using
                    the foundation seed actions.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <Link href="/sign-in">Open sign-in</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/sign-up">Open sign-up</Link>
                  </Button>
                </div>
              </>
            )}

            {error ? (
              <p className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {fixtures.map((fixture) => {
          const result = results[fixture.key] ?? null;
          const links = buildScenarioLinks(result);
          const isBusy = busyFixture === fixture.key;

          return (
            <Card key={fixture.key}>
              <CardHeader>
                <CardTitle>{fixture.title}</CardTitle>
                <CardDescription>{fixture.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="font-medium">Fixture key</p>
                  <p className="mt-1 break-all text-muted-foreground">
                    {fixture.key}
                  </p>
                </div>
                <Button
                  disabled={!isLoaded || !isSignedIn || busyFixture !== null}
                  onClick={() => handleSeedAndRecalculate(fixture.key)}
                >
                  {isBusy ? "Seeding and recalculating..." : "Seed owned scenario"}
                </Button>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="font-medium">Scenario ID</p>
                    <p className="mt-1 break-all text-muted-foreground">
                      {result?.scenarioId ?? "Not created yet"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="font-medium">Scenario version</p>
                    <p className="mt-1 text-muted-foreground">
                      {result?.versionNumber ?? "Not calculated yet"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="font-medium">Generated at</p>
                    <p className="mt-1 text-muted-foreground">
                      {formatGeneratedAt(result?.generatedAt)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="font-medium">Recalculate command</p>
                    <p className="mt-1 break-all text-muted-foreground">
                      {result?.recalculateCommand ?? "Available after seed"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild disabled={!links} variant="outline">
                    <Link href={links?.overview ?? "/app/dev/foundation-seed"}>
                      Open overview
                    </Link>
                  </Button>
                  <Button asChild disabled={!links} variant="outline">
                    <Link
                      href={links?.openingFunding ?? "/app/dev/foundation-seed"}
                    >
                      Open opening funding
                    </Link>
                  </Button>
                  <Button asChild disabled={!links} variant="outline">
                    <Link
                      href={links?.cashFinancing ?? "/app/dev/foundation-seed"}
                    >
                      Open cash financing
                    </Link>
                  </Button>
                  <Button asChild disabled={!links} variant="outline">
                    <Link href={links?.diagnostics ?? "/app/dev/foundation-seed"}>
                      Open diagnostics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
