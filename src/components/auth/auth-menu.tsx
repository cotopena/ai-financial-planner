"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { featureFlags } from "@/lib/env";

export function AuthMenu() {
  if (!featureFlags.clerkConfigured) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Configure Clerk</Link>
      </Button>
    );
  }

  return <UserButton />;
}
