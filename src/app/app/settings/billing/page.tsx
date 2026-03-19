"use client";

import { useQuery } from "convex/react";
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
import { api } from "../../../../../convex/_generated/api";
import { pricingPlans } from "@/lib/mock-data";

function formatPlanName(planKey: string | undefined) {
  if (!planKey) {
    return "Builder";
  }

  return `${planKey.charAt(0).toUpperCase()}${planKey.slice(1)}`;
}

export default function BillingPage() {
  const subscription = useQuery(api.billing.getCurrentSubscription);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Billing"
        title="Plan usage and billing"
        description="Stripe checkout, portal access, and AI usage meter scaffolded from the implementation PRD."
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Usage meter</CardTitle>
              <CardDescription>
                This same meter also appears in the workspace footer and AI panel header.
              </CardDescription>
            </div>
            <Badge variant="outline">{formatPlanName(subscription?.planKey)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          {[
            ["Used", String(subscription?.aiActionsUsed ?? 0)],
            ["Remaining", String(subscription?.aiActionsRemaining ?? 0)],
            [
              "Reset",
              subscription?.currentPeriodEnd
                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                : "Pending",
            ],
            ["State", subscription?.status ?? "Subscription mock"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-border/70 bg-background/70 p-4"
            >
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 font-semibold">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {pricingPlans.map((plan) => (
          <Card key={plan.key}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{plan.name}</CardTitle>
                <Badge variant="outline">{plan.price} / month</Badge>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Checkout session stub</Button>
              <Button className="w-full" variant="outline">
                Stripe portal stub
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
