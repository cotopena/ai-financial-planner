import { notFound } from "next/navigation";
import { FoundationSeedClient } from "@/components/dev/foundation-seed-client";
import { env } from "@/lib/env";
import { isLocalManualVerificationEnabled } from "@/lib/local-dev";

export default function FoundationSeedPage() {
  if (!isLocalManualVerificationEnabled()) {
    notFound();
  }

  return (
    <FoundationSeedClient
      appUrl={env.NEXT_PUBLIC_APP_URL}
      convexUrl={env.NEXT_PUBLIC_CONVEX_URL ?? null}
      convexDeployment={process.env.CONVEX_DEPLOYMENT ?? null}
    />
  );
}
