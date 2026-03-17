import Link from "next/link";
import { ConfigurationStatus } from "@/components/layout/configuration-status";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingPlans } from "@/lib/mock-data";

export default function LandingPage() {
  return (
    <SiteShell>
      <section className="surface-grid">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_0.9fr] lg:px-8 lg:py-24">
          <div className="space-y-8">
            <Badge variant="secondary">Locked MVP foundation</Badge>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
                MBA-style financial planning for small business owners, rebuilt as a deterministic web product.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                The workbook is the parity oracle. The app is a Convex-backed Next.js workspace with a shared TypeScript calculation engine and AI approval flows layered on top.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/app">Open workspace scaffold</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">See plans</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                "3-year planning horizon with all 36 months visible",
                "AI-guided onboarding with explicit approval before changes apply",
                "PDF and CSV exports from day one of the paid product",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-border/70 bg-background/75 p-5 text-sm leading-6 text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <ConfigurationStatus />
            <Card>
              <CardHeader>
                <CardTitle>Sprint 0 delivered</CardTitle>
                <CardDescription>
                  Project foundation, route scaffold, Convex surface, and engine package skeleton.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Next.js App Router with Tailwind and shadcn-style primitives.</p>
                <p>Convex schema, queries, mutations, actions, and Stripe `httpAction` stub.</p>
                <p>Shared engine folders for normalization, modules, orchestrator, and parity fixtures.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
              <CardContent className="space-y-2">
                {plan.highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3 text-sm"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
