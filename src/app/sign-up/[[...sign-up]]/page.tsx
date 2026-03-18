import { SignUp } from "@clerk/nextjs";
import { AuthPlaceholder } from "@/components/auth/auth-placeholder";
import { SiteShell } from "@/components/layout/site-shell";
import { featureFlags } from "@/lib/env";

export default function SignUpPage() {
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        {featureFlags.clerkUiConfigured ? (
          <SignUp path="/sign-up" routing="path" />
        ) : (
          <AuthPlaceholder
            action="Sign-up"
            title="Sign-up route scaffolded for Clerk"
          />
        )}
      </div>
    </SiteShell>
  );
}
