import Link from "next/link";
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
import { dashboardBusinesses } from "@/lib/mock-data";

export default function AppDashboardPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Business dashboard"
        title="My Businesses"
        description="Post-login landing route scaffolded for business cards, status filters, and scenario entry points."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {dashboardBusinesses.map((business) => (
          <Card key={business.name}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{business.name}</CardTitle>
                <Badge variant="outline">{business.stage}</Badge>
              </div>
              <CardDescription>{business.scenario}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="text-muted-foreground">Ending cash</p>
                  <p className="mt-1 font-semibold">{business.endingCash}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="text-muted-foreground">Year 1 revenue</p>
                  <p className="mt-1 font-semibold">{business.yearOneRevenue}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4 text-sm">
                Status: <span className="font-medium">{business.status}</span>
              </div>
              <div className="flex gap-3">
                <Button asChild className="flex-1" size="sm">
                  <Link href="/app/businesses/demo-business/scenarios/demo-scenario/overview">
                    Open
                  </Link>
                </Button>
                <Button asChild className="flex-1" size="sm" variant="outline">
                  <Link href="/app/businesses/demo-business/scenarios">
                    Scenarios
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
