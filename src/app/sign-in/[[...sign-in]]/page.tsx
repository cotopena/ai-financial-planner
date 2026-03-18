import { SignIn } from "@clerk/nextjs";
import { AuthPlaceholder } from "@/components/auth/auth-placeholder";
import { SiteShell } from "@/components/layout/site-shell";
import { featureFlags } from "@/lib/env";

export default function SignInPage() {
  return (
    <SiteShell>
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        {featureFlags.clerkUiConfigured ? (
          <SignIn path="/sign-in" routing="path" />
        ) : (
          <AuthPlaceholder
            action="Sign-in"
            title="Sign-in route scaffolded for Clerk"
          />
        )}
      </div>
    </SiteShell>
  );
}
