"use client";

import { useQuery } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { PageIntro } from "@/components/workspace/page-intro";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatProfileLabel,
  formatStageLabel,
  formatStartPeriod,
} from "@/lib/business-options";
import { formatCurrency } from "@/lib/utils";

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatRatio(value: number) {
  return `${value.toFixed(2)}x`;
}

function formatTimestamp(value: number) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ScenarioOverviewClient({ scenarioId }: { scenarioId: string }) {
  const data = useQuery(api.scenarios.get, {
    scenarioId: scenarioId as Id<"scenarios">,
  });
  const overview = useQuery(api.snapshots.getOverview, {
    scenarioId: scenarioId as Id<"scenarios">,
  });

  if (data === undefined || overview === undefined) {
    return (
      <PageIntro
        eyebrow="Scenario overview"
        title="Executive summary"
        description="Loading the active business and scenario metadata from Convex."
      />
    );
  }

  const overviewMetrics = overview.summary
    ? [
        { label: "Revenue", value: formatCurrency(overview.summary.revenue) },
        {
          label: "Gross margin",
          value: formatPercent(overview.summary.grossMarginPct),
        },
        { label: "Net income", value: formatCurrency(overview.summary.netIncome) },
        {
          label: "Ending cash",
          value: formatCurrency(overview.summary.endingCash),
        },
        { label: "Max LOC", value: formatCurrency(overview.summary.maxLoc) },
        { label: "DSCR", value: formatRatio(overview.summary.dscr) },
      ]
    : [];

  const metadataCards = [
    { label: "Business", value: data.business.name },
    {
      label: "Profile",
      value: formatProfileLabel(data.business.businessProfile),
    },
    {
      label: "Stage",
      value: formatStageLabel(data.business.businessStage),
    },
    {
      label: "Start period",
      value: formatStartPeriod(data.business.startMonth, data.business.startYear),
    },
    { label: "Scenario status", value: data.scenario.status },
    { label: "Version", value: String(data.scenario.currentVersion) },
  ];

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Scenario overview"
        title={data.scenario.name}
        description={
          overview.hasSnapshot
            ? `Workspace home for ${data.business.name}. Overview KPIs are now reading from the stored snapshot for the active scenario version.`
            : `Workspace home for ${data.business.name}. Run recalculation to persist overview KPIs for the active scenario version.`
        }
      >
        <div className="flex flex-wrap gap-3">
          {data.scenario.isBase ? <Badge>Base scenario</Badge> : null}
          <Badge variant="outline">{data.scenario.status}</Badge>
          <Badge variant="outline">
            {data.siblingScenarios.length} scenarios in business
          </Badge>
          <Badge variant={overview.hasSnapshot ? "secondary" : "outline"}>
            {overview.hasSnapshot ? "Snapshot ready" : "Snapshot missing"}
          </Badge>
          {overview.generatedAt ? (
            <Badge variant="outline">
              {`Generated ${formatTimestamp(overview.generatedAt)}`}
            </Badge>
          ) : null}
        </div>
      </PageIntro>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {metadataCards.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="mt-2 text-xl font-semibold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Persisted reporting snapshot</CardTitle>
            <CardDescription>
              {overview.summary
                ? "These KPI cards are sourced from the persisted snapshot summary tied to the active scenario version."
                : "No snapshot summary has been generated for this version yet. Run recalculation to populate the stored KPI set."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {overviewMetrics.length > 0 ? (
              overviewMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="surface-grid rounded-3xl border border-border/70 bg-background/75 p-6"
                >
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-border/70 bg-background/75 p-6 text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
                Persisted KPI rows are missing for this version. Trigger
                `engine.recalculateScenario` to write the current summary snapshot.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current draft notes</CardTitle>
            <CardDescription>
              Business metadata and scenario notes stay editable separately from
              the persisted reporting snapshot.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm">
              {data.scenario.notes || "No scenario notes yet."}
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
              Business note: {data.business.notes || "No business notes yet."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
