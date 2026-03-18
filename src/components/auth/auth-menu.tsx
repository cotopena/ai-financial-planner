"use client";

import type { Route } from "next";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { featureFlags } from "@/lib/env";

export function AuthMenu() {
  if (!featureFlags.clerkUiConfigured) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href={"/sign-in" as Route}>Configure Clerk</Link>
      </Button>
    );
  }

  return <UserButton />;
}
