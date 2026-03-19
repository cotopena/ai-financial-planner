"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
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

function getScenarioStatusVariant(status: Doc<"scenarios">["status"]) {
  if (status === "archived") {
    return "muted";
  }

  return status === "ready" ? "default" : "outline";
}

export function ScenarioCardEditor({
  businessId,
  isCurrent,
  scenario,
}: {
  businessId: Id<"businesses">;
  isCurrent: boolean;
  scenario: Doc<"scenarios">;
}) {
  const updateScenario = useMutation(api.scenarios.updateMeta);
  const [name, setName] = useState(scenario.name);
  const [notes, setNotes] = useState(scenario.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingState, setIsUpdatingState] = useState(false);

  useEffect(() => {
    setName(scenario.name);
    setNotes(scenario.notes ?? "");
  }, [scenario._id, scenario.name, scenario.notes]);

  async function handleSave() {
    setError(null);
    setStatusMessage(null);
    setIsSaving(true);

    try {
      await updateScenario({
        scenarioId: scenario._id,
        name: name.trim(),
        notes: notes.trim() || undefined,
      });
      setStatusMessage("Scenario details saved.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save scenario details.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSetBase() {
    setError(null);
    setStatusMessage(null);
    setIsUpdatingState(true);

    try {
      await updateScenario({
        scenarioId: scenario._id,
        isBase: true,
      });
      setStatusMessage("Scenario set as base.");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update the base scenario.",
      );
    } finally {
      setIsUpdatingState(false);
    }
  }

  async function handleArchiveToggle() {
    setError(null);
    setStatusMessage(null);
    setIsUpdatingState(true);

    try {
      await updateScenario({
        scenarioId: scenario._id,
        status: scenario.status === "archived" ? "draft" : "archived",
      });
      setStatusMessage(
        scenario.status === "archived" ? "Scenario restored." : "Scenario archived.",
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update scenario state.",
      );
    } finally {
      setIsUpdatingState(false);
    }
  }

  return (
    <Card className={isCurrent ? "border-primary/40" : undefined}>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{scenario.name}</CardTitle>
              {scenario.isBase ? <Badge>Base</Badge> : null}
              <Badge variant={getScenarioStatusVariant(scenario.status)}>
                {scenario.status}
              </Badge>
              {isCurrent ? <Badge variant="secondary">Current workspace</Badge> : null}
            </div>
            <CardDescription>
              Version {scenario.currentVersion} · Scenario ID {scenario._id.slice(-6)}
            </CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href={`/app/businesses/${businessId}/scenarios/${scenario._id}/overview`}>
              Open workspace
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="grid gap-2 text-sm font-medium">
          Scenario name
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Notes
          <Textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional scenario note"
          />
        </label>

        {statusMessage ? (
          <p className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm">
            {statusMessage}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button
            disabled={isSaving || isUpdatingState}
            onClick={handleSave}
            size="sm"
            type="button"
          >
            {isSaving ? "Saving..." : "Save details"}
          </Button>
          {!scenario.isBase && scenario.status !== "archived" ? (
            <Button
              disabled={isSaving || isUpdatingState}
              onClick={handleSetBase}
              size="sm"
              type="button"
              variant="outline"
            >
              Make base
            </Button>
          ) : null}
          <Button
            disabled={isSaving || isUpdatingState}
            onClick={handleArchiveToggle}
            size="sm"
            type="button"
            variant={scenario.status === "archived" ? "secondary" : "destructive"}
          >
            {isUpdatingState
              ? "Updating..."
              : scenario.status === "archived"
                ? "Restore"
                : "Archive"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
