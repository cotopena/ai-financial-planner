"use client";

import type { FormEvent } from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PageIntro } from "@/components/workspace/page-intro";
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
import {
  businessProfileOptions,
  businessStageOptions,
  monthOptions,
} from "@/lib/business-options";

type NewBusinessFormState = {
  name: string;
  companyName: string;
  preparerName: string;
  businessProfile: string;
  businessStage: string;
  startMonth: number;
  startYear: number;
  notes: string;
  scenarioName: string;
  scenarioNotes: string;
};

const now = new Date();

const initialFormState: NewBusinessFormState = {
  name: "",
  companyName: "",
  preparerName: "",
  businessProfile: "services",
  businessStage: "startup",
  startMonth: now.getMonth() + 1,
  startYear: now.getFullYear(),
  notes: "",
  scenarioName: "Base case",
  scenarioNotes: "",
};

export function NewBusinessForm() {
  const router = useRouter();
  const createWithBaseScenario = useMutation(api.businesses.createWithBaseScenario);
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRouting, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createWithBaseScenario({
        name: form.name.trim(),
        companyName: form.companyName.trim(),
        preparerName: form.preparerName.trim() || undefined,
        businessProfile: form.businessProfile,
        businessStage: form.businessStage,
        startMonth: form.startMonth,
        startYear: form.startYear,
        notes: form.notes.trim() || undefined,
        scenarioName: form.scenarioName.trim(),
        scenarioNotes: form.scenarioNotes.trim() || undefined,
      });

      startTransition(() => {
        router.push(
          `/app/businesses/${result.businessId}/scenarios/${result.scenarioId}/overview`,
        );
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create the business right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Create business"
        title="New business model"
        description="Manual Sprint 0 flow that creates the business record, seeds a default base scenario, and opens the authenticated workspace."
      />

      <form className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Business shell</CardTitle>
            <CardDescription>
              Clerk auth and Convex persistence are live. This form writes the
              real owner-scoped business record.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium md:col-span-2">
              Business model name
              <Input
                required
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Main Street Bakery plan"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium md:col-span-2">
              Company name
              <Input
                required
                value={form.companyName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    companyName: event.target.value,
                  }))
                }
                placeholder="Main Street Bakery LLC"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Preparer name
              <Input
                value={form.preparerName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    preparerName: event.target.value,
                  }))
                }
                placeholder="Alex Founder"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Business stage
              <select
                className="flex h-11 w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60"
                value={form.businessStage}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    businessStage: event.target.value,
                  }))
                }
              >
                {businessStageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Business profile
              <select
                className="flex h-11 w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60"
                value={form.businessProfile}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    businessProfile: event.target.value,
                  }))
                }
              >
                {businessProfileOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Start month
              <select
                className="flex h-11 w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60"
                value={form.startMonth}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    startMonth: Number(event.target.value),
                  }))
                }
              >
                {monthOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Start year
              <Input
                required
                min={2000}
                max={2100}
                type="number"
                value={form.startYear}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    startYear: Number(event.target.value),
                  }))
                }
              />
            </label>

            <label className="grid gap-2 text-sm font-medium md:col-span-2">
              Notes
              <Textarea
                value={form.notes}
                onChange={(event) =>
                  setForm((current) => ({ ...current, notes: event.target.value }))
                }
                placeholder="Short planning context, owner goals, or assumptions to capture before detailed inputs."
              />
            </label>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Default scenario</CardTitle>
              <CardDescription>
                The Implementation PRD expects a base scenario. This flow seeds
                it immediately so the business opens into a real workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="grid gap-2 text-sm font-medium">
                Scenario name
                <Input
                  required
                  value={form.scenarioName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      scenarioName: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="grid gap-2 text-sm font-medium">
                Scenario notes
                <Textarea
                  value={form.scenarioNotes}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      scenarioNotes: event.target.value,
                    }))
                  }
                  placeholder="Optional note for the initial draft scenario."
                />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Locked v1 defaults</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Currency stays on `USD` and country stays on `US` in v1.</p>
              <p>Wizard handoff remains a later sprint, so this route opens the manual workspace directly.</p>
              {error ? (
                <p className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              <Button
                className="w-full"
                disabled={isSubmitting || isRouting}
                type="submit"
              >
                {isSubmitting || isRouting
                  ? "Creating business..."
                  : "Create business and base scenario"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
