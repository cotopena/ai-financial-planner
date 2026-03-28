"use client";

import { useAuth } from "@clerk/nextjs";
import type { FormEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
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
  formatStartPeriod,
  monthOptions,
} from "@/lib/business-options";

type BusinessSettingsFormState = {
  name: string;
  companyName: string;
  preparerName: string;
  businessProfile: string;
  businessStage: string;
  startMonth: number;
  startYear: number;
  notes: string;
};

export function BusinessSettingsForm({ businessId }: { businessId: string }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const business = useQuery(
    api.businesses.get,
    isLoaded && isSignedIn
      ? {
          businessId: businessId as Id<"businesses">,
        }
      : "skip",
  );
  const updateBusiness = useMutation(api.businesses.updateMeta);
  const [form, setForm] = useState<BusinessSettingsFormState | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isRouting, startTransition] = useTransition();

  useEffect(() => {
    if (!business) {
      return;
    }

    setForm({
      name: business.name,
      companyName: business.companyName,
      preparerName: business.preparerName ?? "",
      businessProfile: business.businessProfile,
      businessStage: business.businessStage,
      startMonth: business.startMonth,
      startYear: business.startYear,
      notes: business.notes ?? "",
    });
  }, [business]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form) {
      return;
    }

    setError(null);
    setStatusMessage(null);
    setIsSaving(true);

    try {
      await updateBusiness({
        businessId: businessId as Id<"businesses">,
        name: form.name.trim(),
        companyName: form.companyName.trim(),
        preparerName: form.preparerName.trim() || undefined,
        businessProfile: form.businessProfile,
        businessStage: form.businessStage,
        startMonth: form.startMonth,
        startYear: form.startYear,
        notes: form.notes.trim() || undefined,
      });

      setStatusMessage("Business details saved.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save business settings.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleArchiveToggle() {
    if (!business) {
      return;
    }

    setError(null);
    setStatusMessage(null);
    setIsArchiving(true);

    try {
      const archive = !Boolean(business.archivedAt);

      await updateBusiness({
        businessId: businessId as Id<"businesses">,
        archive,
      });

      if (archive) {
        startTransition(() => {
          router.push("/app");
        });
        return;
      }

      setStatusMessage("Business restored.");
    } catch (archiveError) {
      setError(
        archiveError instanceof Error
          ? archiveError.message
          : "Unable to update archive state.",
      );
    } finally {
      setIsArchiving(false);
    }
  }

  if (!isLoaded || !isSignedIn || business === undefined || !form) {
    return (
      <PageIntro
        eyebrow="Business settings"
        title="Business metadata"
        description="Loading the current business record from Convex."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Business settings"
        title={business.name}
        description="Rename the business shell, adjust core metadata, or archive it from the authenticated owner-scoped record."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Scenarios</p>
            <p className="mt-1 text-2xl font-semibold">{business.scenarios.length}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Start period</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatStartPeriod(business.startMonth, business.startYear)}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Archive state</p>
            <p className="mt-1 text-2xl font-semibold">
              {business.archivedAt ? "Archived" : "Active"}
            </p>
          </div>
        </div>
      </PageIntro>

      <form className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]" onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Business details</CardTitle>
            <CardDescription>
              These fields map directly to the `businesses` table.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium md:col-span-2">
              Business model name
              <Input
                required
                value={form.name}
                onChange={(event) =>
                  setForm((current) =>
                    current ? { ...current, name: event.target.value } : current,
                  )
                }
              />
            </label>

            <label className="grid gap-2 text-sm font-medium md:col-span-2">
              Company name
              <Input
                required
                value={form.companyName}
                onChange={(event) =>
                  setForm((current) =>
                    current
                      ? { ...current, companyName: event.target.value }
                      : current,
                  )
                }
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Preparer name
              <Input
                value={form.preparerName}
                onChange={(event) =>
                  setForm((current) =>
                    current
                      ? { ...current, preparerName: event.target.value }
                      : current,
                  )
                }
              />
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Business stage
              <select
                className="flex h-11 w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60"
                value={form.businessStage}
                onChange={(event) =>
                  setForm((current) =>
                    current
                      ? { ...current, businessStage: event.target.value }
                      : current,
                  )
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
                  setForm((current) =>
                    current
                      ? { ...current, businessProfile: event.target.value }
                      : current,
                  )
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
                  setForm((current) =>
                    current
                      ? { ...current, startMonth: Number(event.target.value) }
                      : current,
                  )
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
                  setForm((current) =>
                    current
                      ? { ...current, startYear: Number(event.target.value) }
                      : current,
                  )
                }
              />
            </label>

            <label className="grid gap-2 text-sm font-medium md:col-span-2">
              Notes
              <Textarea
                value={form.notes}
                onChange={(event) =>
                  setForm((current) =>
                    current ? { ...current, notes: event.target.value } : current,
                  )
                }
              />
            </label>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Save state</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Currency and region remain locked to `USD` / `US` in v1.</p>
              {statusMessage ? (
                <p className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-foreground">
                  {statusMessage}
                </p>
              ) : null}
              {error ? (
                <p className="rounded-2xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-destructive">
                  {error}
                </p>
              ) : null}
              <Button
                className="w-full"
                disabled={isSaving || isArchiving || isRouting}
                type="submit"
              >
                {isSaving ? "Saving..." : "Save business details"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Archive</CardTitle>
              <CardDescription>
                Archiving removes the business from the dashboard without
                deleting its scenarios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                disabled={isSaving || isArchiving || isRouting}
                onClick={handleArchiveToggle}
                type="button"
                variant={business.archivedAt ? "secondary" : "destructive"}
              >
                {isArchiving
                  ? "Updating..."
                  : business.archivedAt
                    ? "Restore business"
                    : "Archive business"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
