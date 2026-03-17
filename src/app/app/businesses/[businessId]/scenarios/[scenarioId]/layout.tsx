import type { ReactNode } from "react";
import { WorkspaceShell } from "@/components/layout/workspace-shell";

export default async function ScenarioLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ businessId: string; scenarioId: string }>;
}) {
  const { businessId, scenarioId } = await params;

  return (
    <WorkspaceShell businessId={businessId} scenarioId={scenarioId}>
      {children}
    </WorkspaceShell>
  );
}
