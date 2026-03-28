import "server-only";

import { env } from "@/lib/env";

export function isLocalManualVerificationEnabled() {
  const appUrl = env.NEXT_PUBLIC_APP_URL;

  return (
    process.env.NODE_ENV !== "production" &&
    Boolean(process.env.CONVEX_DEPLOYMENT?.startsWith("dev:")) &&
    (appUrl.includes("localhost") || appUrl.includes("127.0.0.1"))
  );
}
