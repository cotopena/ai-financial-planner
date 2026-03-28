"use client";

import { useState } from "react";
import Link from "next/link";
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

type SeedResult = {
  businessId: string;
  scenarioId: string;
  overviewUrl: string;
  versionNumber?: number;
  generatedAt?: string;
};

function formatGeneratedAt(value: string | undefined) {
  if (!value) {
    return "Not generated yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ReportingSeedClient({
  appUrl,
  convexUrl,
  convexDeployment,
}: {
  appUrl: string;
  convexUrl: string | null;
  convexDeployment: string | null;
}) {
  const seedScenarioReporting = useMutation(api.dev.seedScenarioReporting);
  const recalculateScenario = useAction(api.engine.recalculateScenario);
  const [result, setResult] = useState<SeedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  async function handleSeedAndRecalculate() {
    setIsRunning(true);
    setError(null);

    try {
      const seed = await seedScenarioReporting({});
      const recalc = await recalculateScenario({
        scenarioId: seed.scenarioId as Id<"scenarios">,
      });

      setResult({
        ...seed,
        versionNumber: recalc.versionNumber,
        generatedAt: recalc.generatedAt,
      });
    } catch (runError) {
      setError(
        runError instanceof Error
          ? runError.message
          : "Unable to seed and recalculate the reporting scenario.",
      );
    } finally {
      setIsRunning(false);
    }
  }

  const overviewUrl = result?.overviewUrl ?? null;
  const diagnosticsUrl = result
    ? `/app/businesses/${result.businessId}/scenarios/${result.scenarioId}/diagnostics`
    : null;
  const statementsUrl = result
    ? `/app/businesses/${result.businessId}/scenarios/${result.scenarioId}/statements/income-statement`
    : null;

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Manual verification"
        title="Seed snapshot-backed reporting"
        description="Creates or refreshes an owned PLAN-1003 reporting scenario for the signed-in user, then runs recalculation against the same Convex deployment the browser is already using."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Environment lock</CardTitle>
            <CardDescription>
              This route is only available in local development and is intended
              for PLAN-1003 browser verification.
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
            <Button disabled={isRunning} onClick={handleSeedAndRecalculate}>
              {isRunning
                ? "Seeding and recalculating..."
                : "Seed owned scenario and recalculate"}
            </Button>
            {error ? (
              <p className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seed result</CardTitle>
            <CardDescription>
              Use these links for the manual verification pass once the seed and
              recalc call finish.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="font-medium">Business ID</p>
              <p className="mt-1 break-all text-muted-foreground">
                {result?.businessId ?? "Not created yet"}
              </p>
            </div>
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
            <div className="flex flex-wrap gap-3">
              <Button asChild disabled={!overviewUrl} variant="outline">
                <Link href={overviewUrl ?? "/app/dev/reporting-seed"}>
                  Open overview
                </Link>
              </Button>
              <Button asChild disabled={!statementsUrl} variant="outline">
                <Link href={statementsUrl ?? "/app/dev/reporting-seed"}>
                  Open statements
                </Link>
              </Button>
              <Button asChild disabled={!diagnosticsUrl} variant="outline">
                <Link href={diagnosticsUrl ?? "/app/dev/reporting-seed"}>
                  Open diagnostics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
