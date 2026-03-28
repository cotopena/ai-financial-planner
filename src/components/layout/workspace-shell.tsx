"use client";

import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { AuthMenu } from "@/components/auth/auth-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buildScenarioNav } from "@/lib/route-data";
import { formatStageLabel } from "@/lib/business-options";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

function formatSubscriptionBadge(remaining: number | undefined) {
  if (remaining === undefined) {
    return "Usage mock";
  }

  return `${remaining} left`;
}

export function WorkspaceShell({
  businessId,
  scenarioId,
  children,
}: {
  businessId: string;
  scenarioId: string;
  children: ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const nav = buildScenarioNav({ businessId, scenarioId });
  const scenarioData = useQuery(
    api.scenarios.get,
    isLoaded && isSignedIn
      ? {
          scenarioId: scenarioId as Id<"scenarios">,
        }
      : "skip",
  );
  const subscription = useQuery(
    api.billing.getCurrentSubscription,
    isLoaded && isSignedIn ? {} : "skip",
  );

  const businessLabel =
    scenarioData?.business.name ?? `Business ${businessId.slice(-6)}`;
  const scenarioLabel =
    scenarioData?.scenario.name ?? `Scenario ${scenarioId.slice(-6)}`;
  const stageLabel = scenarioData
    ? formatStageLabel(scenarioData.business.businessStage)
    : "Loading";

  return (
    <div className="app-shell-gradient min-h-screen">
      <header className="border-b border-border/60 bg-background/75 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:px-8">
          <div className="grid gap-3 sm:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Business
              </p>
              <p className="font-medium">{businessLabel}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Scenario
              </p>
              <p className="font-medium">{scenarioLabel}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Workspace status
              </p>
              <p className="font-medium">
                {isLoaded ? scenarioData?.scenario.status ?? "Loading..." : "Loading..."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Last calc
              </p>
              <p className="font-medium">Snapshot pipeline pending</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" variant="ghost">
              <Link href={`/app/businesses/${businessId}/settings`}>
                Business settings
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/app/businesses/${businessId}/scenarios`}>
                All scenarios
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link
                href={`/app/businesses/${businessId}/scenarios/${scenarioId}/exports`}
              >
                Export center
              </Link>
            </Button>
            <AuthMenu />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[240px_1fr_320px] xl:px-8">
        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workspace map</CardTitle>
              <CardDescription>
                PRD route structure with real business and scenario metadata in
                the shell.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  className="block rounded-2xl px-3 py-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  {item.label}
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business context</CardTitle>
              <CardDescription>
                Business shell is live. Assumption-entry screens remain later
                sprint work.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="font-medium text-foreground">{businessLabel}</p>
                <p className="mt-1">{stageLabel}</p>
              </div>
              <Button asChild className="w-full" variant="secondary">
                <Link
                  href={`/app/businesses/${businessId}/scenarios/${scenarioId}/wizard/step-1`}
                >
                  Open wizard scaffold
                </Link>
              </Button>
            </CardContent>
          </Card>
        </aside>

        <main className="space-y-6">{children}</main>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>AI panel</CardTitle>
                  <CardDescription>
                    Persistent contextual assistant placeholder.
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {formatSubscriptionBadge(subscription?.aiActionsRemaining)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="font-medium">What ships in Sprint 0</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Authenticated business and scenario CRUD now runs end to end
                  through Convex, while AI approvals remain a later sprint.
                </p>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  AI proposes changes and waits for explicit approval before
                  assumptions mutate.
                </p>
                <Separator />
                <p>
                  Usage meter appears here, in billing, and in the workspace
                  footer.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer parity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Workbook parity version: `v1-foundation`</p>
              <p>
                Legal disclaimer and usage meter intentionally remain visible in
                the shell.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
