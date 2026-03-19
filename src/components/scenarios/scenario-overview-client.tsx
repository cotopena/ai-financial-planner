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

export function ScenarioOverviewClient({ scenarioId }: { scenarioId: string }) {
  const data = useQuery(api.scenarios.get, {
    scenarioId: scenarioId as Id<"scenarios">,
  });

  if (data === undefined) {
    return (
      <PageIntro
        eyebrow="Scenario overview"
        title="Executive summary"
        description="Loading the active business and scenario metadata from Convex."
      />
    );
  }

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
        description={`Workspace home for ${data.business.name}. Reporting outputs are still on the snapshot sprint, but this route now opens against the real scenario record.`}
      >
        <div className="flex flex-wrap gap-3">
          {data.scenario.isBase ? <Badge>Base scenario</Badge> : null}
          <Badge variant="outline">{data.scenario.status}</Badge>
          <Badge variant="outline">
            {data.siblingScenarios.length} scenarios in business
          </Badge>
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
            <CardTitle>Reporting pipeline</CardTitle>
            <CardDescription>
              Snapshot-backed financial KPIs land in the reporting sprint. The
              current overview exposes the real workspace context instead of
              fake revenue and cash figures.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              "Revenue snapshot pending",
              "Ending cash snapshot pending",
              "Net income snapshot pending",
              "Scenario comparison pending",
            ].map((item) => (
              <div
                key={item}
                className="surface-grid rounded-3xl border border-border/70 bg-background/75 p-6 text-sm text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current draft notes</CardTitle>
            <CardDescription>
              Metadata persisted today. Financial diagnostics arrive once
              snapshot generation is connected end to end.
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
