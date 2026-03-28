import { notFound } from "next/navigation";
import { ReportingSeedClient } from "@/components/dev/reporting-seed-client";
import { env } from "@/lib/env";
import { isLocalManualVerificationEnabled } from "@/lib/local-dev";

export default function ReportingSeedPage() {
  if (!isLocalManualVerificationEnabled()) {
    notFound();
  }

  return (
    <ReportingSeedClient
      appUrl={env.NEXT_PUBLIC_APP_URL}
      convexUrl={env.NEXT_PUBLIC_CONVEX_URL ?? null}
      convexDeployment={process.env.CONVEX_DEPLOYMENT ?? null}
    />
  );
}
