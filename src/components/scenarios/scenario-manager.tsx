"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { PageIntro } from "@/components/workspace/page-intro";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatStageLabel } from "@/lib/business-options";
import { ScenarioCardEditor } from "./scenario-card-editor";

function createDefaultScenarioName(existingCount: number) {
  if (existingCount === 0) {
    return "Base case";
  }

  return `Scenario ${existingCount + 1}`;
}

export function ScenarioManager({
  businessId,
  currentScenarioId,
  mode,
}: {
  businessId: string;
  currentScenarioId?: string;
  mode: "business" | "workspace";
}) {
  const business = useQuery(api.businesses.get, {
    businessId: businessId as Id<"businesses">,
  });
  const createScenario = useMutation(api.scenarios.create);
  const [name, setName] = useState("Base case");
  const [notes, setNotes] = useState("");
  const [makeBase, setMakeBase] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!business) {
      return;
    }

    setName((current) =>
      current === "Base case" || current.startsWith("Scenario ")
        ? createDefaultScenarioName(business.scenarios.length)
        : current,
    );
    setMakeBase(business.scenarios.length === 0);
  }, [business]);

  async function handleCreateScenario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsCreating(true);

    try {
      await createScenario({
        businessId: businessId as Id<"businesses">,
        name: name.trim(),
        notes: notes.trim() || undefined,
        isBase: makeBase || undefined,
      });

      const nextCount = (business?.scenarios.length ?? 0) + 1;
      setName(createDefaultScenarioName(nextCount));
      setNotes("");
      setMakeBase(false);
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create the scenario.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  if (business === undefined) {
    return (
      <PageIntro
        eyebrow="Scenario list"
        title="Scenario management"
        description="Loading business and scenario records from Convex."
      />
    );
  }

  const title =
    mode === "workspace" ? "Clone, branch, and compare" : "Scenario management";
  const description =
    mode === "workspace"
      ? "Manage real scenario records from inside the active workspace."
      : "Create, update, archive, and open scenarios with real Convex IDs.";

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Scenario list"
        title={title}
        description={description}
      >
        <div className="flex flex-wrap gap-3">
          <Badge variant="secondary">{business.name}</Badge>
          <Badge variant="outline">{formatStageLabel(business.businessStage)}</Badge>
          <Badge variant="outline">{business.scenarios.length} scenarios</Badge>
        </div>
      </PageIntro>

      <Card>
        <CardHeader>
          <CardTitle>Create scenario</CardTitle>
          <CardDescription>
            Scenarios are owner-scoped through the parent business and open with
            their real Convex document IDs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleCreateScenario}>
            <label className="grid gap-2 text-sm font-medium">
              Scenario name
              <Input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Notes
              <Textarea
                className="min-h-11"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Optional scenario note"
              />
            </label>

            <div className="flex flex-col justify-end gap-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  checked={makeBase}
                  className="h-4 w-4 rounded border-border"
                  onChange={(event) => setMakeBase(event.target.checked)}
                  type="checkbox"
                />
                Make base scenario
              </label>
              <Button disabled={isCreating} type="submit">
                {isCreating ? "Creating..." : "Create scenario"}
              </Button>
            </div>
          </form>

          {error ? (
            <p className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {business.scenarios.map((scenario) => (
          <ScenarioCardEditor
            key={scenario._id}
            businessId={business._id}
            isCurrent={scenario._id === currentScenarioId}
            scenario={scenario}
          />
        ))}
      </div>
    </div>
  );
}
