import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingPlans } from "@/lib/mock-data";

export default function PricingPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-4">
          <Badge variant="secondary">Pricing</Badge>
          <h1 className="text-4xl font-semibold tracking-tight">Builder and Pro plans from day one.</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Both plans include the deterministic engine, exports, and AI assistance. The difference is usage allowance and iteration speed.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {pricingPlans.map((plan) => (
            <Card key={plan.key}>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
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
              <CardFooter>
                <Button className="w-full">Checkout placeholder</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
