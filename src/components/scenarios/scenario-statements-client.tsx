"use client";

import Link from "next/link";
import type { Route } from "next";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  statementDefinitions,
  statementOrder,
  type StatementSlug,
} from "@/lib/scenario-reporting";
import { cn, formatCurrency } from "@/lib/utils";

function formatTimestamp(value: number) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatStatementValue(statement: StatementSlug, value: number) {
  if (statement === "ratios") {
    return value.toFixed(2);
  }

  return formatCurrency(value);
}

function StatementSeriesCard({
  title,
  description,
  valueLabel,
  values,
  statement,
  notes,
}: {
  title: string;
  description: string;
  valueLabel: string;
  values: Array<{ label: string; value: number }>;
  statement: StatementSlug;
  notes: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {notes.map((note) => (
              <Badge key={note} variant="outline">
                {note}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="rounded-2xl border border-border/70 bg-background/70 p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>{valueLabel}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {values.map((value) => (
                <TableRow key={`${title}-${value.label}`}>
                  <TableCell>{value.label}</TableCell>
                  <TableCell>{formatStatementValue(statement, value.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export function ScenarioStatementsClient({
  businessId,
  scenarioId,
  statement,
}: {
  businessId: string;
  scenarioId: string;
  statement: StatementSlug;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const snapshot = useQuery(
    api.snapshots.getStatements,
    isLoaded && isSignedIn
      ? {
          scenarioId: scenarioId as Id<"scenarios">,
          sectionKey: statement,
        }
      : "skip",
  );
  const definition = statementDefinitions[statement];

  if (!isLoaded || !isSignedIn || snapshot === undefined) {
    return (
      <PageIntro
        eyebrow="Statements"
        title={definition.title}
        description="Loading persisted statement rows from Convex."
      />
    );
  }

  const hasSectionData =
    statement === "ratios"
      ? Boolean(snapshot.ratios)
      : snapshot.monthlySections.length > 0 || snapshot.annualSections.length > 0;

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Statements"
        title={definition.title}
        description={
          snapshot.hasSnapshot
            ? definition.description
            : "No persisted snapshot exists for this scenario version yet. Run recalculation to populate reporting rows."
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

      <div className="flex flex-wrap gap-3">
        {statementOrder.map((slug) => (
          <Link
            key={slug}
            href={
              `/app/businesses/${businessId}/scenarios/${scenarioId}/statements/${slug}` as Route
            }
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              slug === statement
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background hover:bg-accent",
            )}
          >
            {statementDefinitions[slug].title}
          </Link>
        ))}
      </div>

      {!snapshot.hasSnapshot ? (
        <Card>
          <CardHeader>
            <CardTitle>Run recalculation first</CardTitle>
            <CardDescription>
              Statement routes now read only from persisted snapshot rows tied to
              the current scenario version.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Trigger `engine.recalculateScenario` for this scenario, then reload this
            route to inspect the stored statement snapshot.
          </CardContent>
        </Card>
      ) : null}

      {snapshot.hasSnapshot && !hasSectionData ? (
        <Card>
          <CardHeader>
            <CardTitle>No section payload stored</CardTitle>
            <CardDescription>
              A snapshot exists for this version, but this statement section does not
              currently have a persisted payload.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {statement === "ratios" && snapshot.ratios ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Stored ratio norms</CardTitle>
              <CardDescription>
                Norms remain scenario-scoped inputs and are now bundled into the
                persisted ratio snapshot for reporting reads.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {snapshot.ratios.norms.length > 0 ? (
                <div className="rounded-2xl border border-border/70 bg-background/70 p-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ratio</TableHead>
                        <TableHead>Year 1 norm</TableHead>
                        <TableHead>Year 2 norm</TableHead>
                        <TableHead>Year 3 norm</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {snapshot.ratios.norms.map((norm) => (
                        <TableRow key={norm.ratioKey}>
                          <TableCell>{norm.ratioKey}</TableCell>
                          <TableCell>
                            {norm.year1Norm === undefined
                              ? "Not set"
                              : norm.year1Norm.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {norm.year2Norm === undefined
                              ? "Not set"
                              : norm.year2Norm.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {norm.year3Norm === undefined
                              ? "Not set"
                              : norm.year3Norm.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                  No ratio norms have been stored for this scenario yet.
                </div>
              )}
            </CardContent>
          </Card>

          <StatementSeriesCard
            title="Annual ratio snapshot"
            description="Annual ratio values persisted for the active version."
            valueLabel="Value"
            values={snapshot.ratios.annual}
            statement={statement}
            notes={snapshot.ratios.notes}
          />

          <StatementSeriesCard
            title="Monthly ratio snapshot"
            description="Monthly ratio values persisted for the active version."
            valueLabel="Value"
            values={snapshot.ratios.monthly}
            statement={statement}
            notes={snapshot.ratios.notes}
          />
        </div>
      ) : null}

      {statement !== "ratios" && hasSectionData ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {snapshot.annualSections.map((section) => (
            <StatementSeriesCard
              key={`annual-${section.sectionKey}`}
              title="Annual snapshot"
              description="Stored annual values for the active version."
              valueLabel="Value"
              values={section.annual}
              statement={statement}
              notes={section.notes}
            />
          ))}

          {snapshot.monthlySections.map((section) => (
            <StatementSeriesCard
              key={`monthly-${section.sectionKey}`}
              title="Monthly snapshot"
              description="Stored monthly values for the active version."
              valueLabel="Value"
              values={section.monthly}
              statement={statement}
              notes={section.notes}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
