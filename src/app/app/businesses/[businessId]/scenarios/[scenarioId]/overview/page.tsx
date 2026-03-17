import { PageIntro } from "@/components/workspace/page-intro";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const metrics = [
  { label: "Revenue", value: "$412k" },
  { label: "Gross Margin %", value: "62%" },
  { label: "Net Income", value: "$41k" },
  { label: "Ending Cash", value: "$84k" },
  { label: "Max LOC", value: "$18k" },
  { label: "DSCR", value: "1.18" },
] as const;

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Scenario overview"
        title="Executive summary"
        description="Default scenario home for KPI cards, charts, alerts, and exported summary context."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Charts placeholder</CardTitle>
            <CardDescription>
              Revenue, ending cash, net income, and scenario comparison mini-chart land here.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {["Revenue by month", "Ending cash by month", "Net income by month", "Scenario comparison"].map((item) => (
              <div
                key={item}
                className="surface-grid rounded-3xl border border-border/70 bg-background/75 p-6 text-sm text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Explainable warning cards derived from the deterministic model outputs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Cash shortfall watch", "Margin too low", "Break-even not met"].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
              >
                <span className="text-sm">{item}</span>
                <Badge variant="outline">Pending engine</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
