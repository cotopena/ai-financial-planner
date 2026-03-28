import { integrationStatus } from "@/lib/env";
import { ConfigurationStatusCard } from "@/components/layout/configuration-status-card";

export function ConfigurationStatus() {
  return <ConfigurationStatusCard items={integrationStatus} />;
}
