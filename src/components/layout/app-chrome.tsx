import type { ReactNode } from "react";
import Link from "next/link";
import { AuthMenu } from "@/components/auth/auth-menu";
import { ConfigurationStatus } from "@/components/layout/configuration-status";
import { Badge } from "@/components/ui/badge";
import { appNavItems } from "@/lib/route-data";
import { usageSnapshot } from "@/lib/mock-data";

export function AppChrome({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell-gradient min-h-screen">
      <header className="border-b border-border/60 bg-background/75 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Authenticated workspace
            </p>
            <h1 className="text-xl font-semibold">AI Financial Planner</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline">{usageSnapshot.planName} plan</Badge>
            <AuthMenu />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="space-y-4">
          <div className="surface-card p-3">
            <div className="space-y-1 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                App navigation
              </p>
              <p className="text-sm text-muted-foreground">
                Core routes scaffolded from the implementation PRD.
              </p>
            </div>
            <nav className="space-y-1">
              {appNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-2xl px-3 py-3 transition-colors hover:bg-accent"
                >
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              ))}
            </nav>
          </div>
          <ConfigurationStatus />
        </aside>

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
