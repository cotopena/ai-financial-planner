import type { Route } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/75 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
            FP
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              AI Financial Planner
            </p>
            <p className="text-sm text-foreground">
              Deterministic planning, AI-guided setup.
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="/pricing"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/app"
            prefetch={false}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Workspace
          </Link>
          <Link
            href="/legal/privacy"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="ghost">
            <Link href={"/sign-in" as Route}>Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={"/sign-up" as Route}>Start planning</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
