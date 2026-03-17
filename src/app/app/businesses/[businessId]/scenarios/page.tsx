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

const scenarios = [
  { name: "Base case", status: "draft", isBase: true },
  { name: "Best case", status: "draft", isBase: false },
  { name: "Worst case", status: "draft", isBase: false },
] as const;

export default async function BusinessScenarioListPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Scenario list"
        title="Scenario management"
        description="Scenario CRUD route scaffolded from the PRD, ready for base, best, worst, and custom branches."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <Card key={scenario.name}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{scenario.name}</CardTitle>
                <Badge variant={scenario.isBase ? "default" : "outline"}>
                  {scenario.isBase ? "Base" : scenario.status}
                </Badge>
              </div>
              <CardDescription>Versioning and clone stubs are in Convex.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link
                  href={`/app/businesses/${businessId}/scenarios/demo-scenario/overview`}
                >
                  Open workspace
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
