"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { PageIntro } from "@/components/workspace/page-intro";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function formatTimestamp(value: number) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSeverityVariant(severity: "info" | "warning" | "critical") {
  switch (severity) {
    case "critical":
      return "danger" as const;
    case "warning":
      return "outline" as const;
    case "info":
    default:
      return "secondary" as const;
  }
}

export function ScenarioDiagnosticsClient({ scenarioId }: { scenarioId: string }) {
  const { isLoaded, isSignedIn } = useAuth();
  const snapshot = useQuery(
    api.snapshots.getDiagnostics,
    isLoaded && isSignedIn
      ? {
          scenarioId: scenarioId as Id<"scenarios">,
        }
      : "skip",
  );

  if (!isLoaded || !isSignedIn || snapshot === undefined) {
    return (
      <PageIntro
        eyebrow="Diagnostics"
        title="Explainable warnings and recommendations"
        description="Loading persisted diagnostic cards from Convex."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Diagnostics"
        title="Explainable warnings and recommendations"
        description={
          snapshot.hasSnapshot
            ? "Diagnostics now read from the persisted snapshot for the active scenario version."
            : "No persisted diagnostics snapshot exists for this version yet. Run recalculation to populate this route."
        }
      >
        <div className="flex flex-wrap gap-3">
          <Badge>{`Version ${snapshot.versionNumber}`}</Badge>
          <Badge variant={snapshot.hasSnapshot ? "secondary" : "outline"}>
            {snapshot.hasSnapshot ? "Snapshot ready" : "Snapshot missing"}
          </Badge>
          {snapshot.generatedAt ? (
            <Badge variant="outline">
              {`Generated ${formatTimestamp(snapshot.generatedAt)}`}
            </Badge>
          ) : null}
        </div>
      </PageIntro>

      {!snapshot.hasSnapshot ? (
        <Card>
          <CardHeader>
            <CardTitle>Run recalculation first</CardTitle>
            <CardDescription>
              Diagnostic cards are now rendered only from persisted snapshot rows.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Trigger `engine.recalculateScenario` for this scenario, then reload this
            route to inspect the stored diagnostic payload.
          </CardContent>
        </Card>
      ) : null}

      {snapshot.hasSnapshot && snapshot.diagnostics?.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {snapshot.diagnostics.map((card) => (
            <Card
              key={`${card.severity}-${card.title}`}
              className={cn(
                card.severity === "critical" && "border-destructive/40",
                card.severity === "warning" && "border-amber-500/40",
              )}
            >
              <CardHeader className="gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle>{card.title}</CardTitle>
                  <Badge variant={getSeverityVariant(card.severity)}>
                    {card.severity}
                  </Badge>
                </div>
                <CardDescription>{card.message}</CardDescription>
              </CardHeader>
              {card.recommendation ? (
                <CardContent>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                    {card.recommendation}
                  </div>
                </CardContent>
              ) : null}
            </Card>
          ))}
        </div>
      ) : null}

      {snapshot.hasSnapshot && !snapshot.diagnostics?.length ? (
        <Card>
          <CardHeader>
            <CardTitle>No diagnostic cards stored</CardTitle>
            <CardDescription>
              The current snapshot exists, but it does not contain any diagnostic cards.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  );
}
