import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IntegrationStatusItem } from "@/lib/env";

export function ConfigurationStatusCard({
  items,
}: {
  items: readonly IntegrationStatusItem[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration status</CardTitle>
        <CardDescription>
          Sprint 0 ships real integration points but keeps live services
          optional until credentials are added.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-background/70 p-4"
          >
            <div className="space-y-1">
              <p className="font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">
                {item.envVars.join(", ")}
              </p>
            </div>
            <Badge variant={item.configured ? "default" : "outline"}>
              {item.configured ? "Ready" : "Pending"}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
