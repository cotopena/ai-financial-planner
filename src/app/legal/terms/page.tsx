import { SiteShell } from "@/components/layout/site-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TermsPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Terms</CardTitle>
            <CardDescription>
              Placeholder legal route required by the implementation PRD for paid launch readiness.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>This scaffold reserves the production terms route and keeps it visible in the public footer.</p>
            <p>Final legal copy, disclosures, and billing language should land in Sprint 8 before beta readiness.</p>
          </CardContent>
        </Card>
      </div>
    </SiteShell>
  );
}
