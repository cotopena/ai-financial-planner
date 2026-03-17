import { SiteShell } from "@/components/layout/site-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>
              Placeholder privacy route required by the implementation PRD for paid launch readiness.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>This route is scaffolded so billing, auth, and AI surfaces have a canonical legal destination.</p>
            <p>Production retention, processor, and export details should be filled once integrations are live.</p>
          </CardContent>
        </Card>
      </div>
    </SiteShell>
  );
}
