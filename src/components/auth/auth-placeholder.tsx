import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AuthPlaceholder({
  title,
  action,
}: {
  title: string;
  action: string;
}) {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <Badge className="w-fit" variant="outline">
          Clerk placeholder
        </Badge>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and
          `CLERK_JWT_ISSUER_DOMAIN` to render the live Clerk flow here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>{action} is wired into the route structure, but auth is intentionally inert until env values are configured.</p>
        <p>The app shell and Convex auth config are already set up to accept Clerk once those values exist.</p>
      </CardContent>
    </Card>
  );
}
