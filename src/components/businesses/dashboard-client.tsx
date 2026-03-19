"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
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
import {
  formatProfileLabel,
  formatStageLabel,
  formatStartPeriod,
} from "@/lib/business-options";

function formatPlanLabel(planKey: string | null | undefined) {
  if (!planKey) {
    return "Subscription mock";
  }

  return `${planKey.charAt(0).toUpperCase()}${planKey.slice(1)} plan`;
}

export function DashboardClient() {
  const businesses = useQuery(api.businesses.listByUser);
  const subscription = useQuery(api.billing.getCurrentSubscription);

  if (businesses === undefined) {
    return (
      <div className="space-y-6">
        <PageIntro
          eyebrow="Business dashboard"
          title="My Businesses"
          description="Loading the signed-in business portfolio from Convex."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Business dashboard"
        title="My Businesses"
        description="Signed-in dashboard backed by Convex business and scenario records instead of static mock cards."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Businesses</p>
            <p className="mt-1 text-2xl font-semibold">{businesses.length}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Active scenarios</p>
            <p className="mt-1 text-2xl font-semibold">
              {businesses.reduce(
                (total, business) => total + business.activeScenarioCount,
                0,
              )}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Subscription</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatPlanLabel(subscription?.planKey)}
            </p>
          </div>
        </div>
      </PageIntro>

      {businesses.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No businesses yet</CardTitle>
            <CardDescription>
              Create a business shell and seed a base scenario to start the
              authenticated workspace flow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/app/businesses/new">Create your first business</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
        {businesses.map((business) => {
          const openHref = business.baseScenarioId
            ? `/app/businesses/${business._id}/scenarios/${business.baseScenarioId}/overview`
            : `/app/businesses/${business._id}/scenarios`;

          return (
            <Card key={business._id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{business.name}</CardTitle>
                  <Badge
                    variant={
                      business.businessStage === "startup" ? "default" : "outline"
                    }
                  >
                    {formatStageLabel(business.businessStage)}
                  </Badge>
                </div>
                <CardDescription>
                  {business.companyName}
                  {business.baseScenarioName
                    ? ` • Base scenario: ${business.baseScenarioName}`
                    : " • No scenario created yet"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-muted-foreground">Profile</p>
                    <p className="mt-1 font-semibold">
                      {formatProfileLabel(business.businessProfile)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-muted-foreground">Start period</p>
                    <p className="mt-1 font-semibold">
                      {formatStartPeriod(business.startMonth, business.startYear)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-muted-foreground">Scenarios</p>
                    <p className="mt-1 font-semibold">{business.scenarioCount}</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-muted-foreground">Workspace status</p>
                    <p className="mt-1 font-semibold">
                      {business.baseScenarioStatus ?? "Business shell only"}
                    </p>
                  </div>
                </div>

                <p className="rounded-2xl border border-dashed border-border/70 bg-background/40 px-4 py-3 text-sm text-muted-foreground">
                  Financial KPI cards remain part of the reporting sprint. This
                  dashboard now shows real business metadata and scenario links.
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button asChild className="flex-1" size="sm">
                    <Link href={openHref}>
                      {business.baseScenarioId ? "Open base scenario" : "Open scenarios"}
                    </Link>
                  </Button>
                  <Button asChild className="flex-1" size="sm" variant="outline">
                    <Link href={`/app/businesses/${business._id}/scenarios`}>
                      Scenarios
                    </Link>
                  </Button>
                  <Button asChild className="flex-1" size="sm" variant="ghost">
                    <Link href={`/app/businesses/${business._id}/settings`}>
                      Settings
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
