import type { ReactNode } from "react";
import { AppChrome } from "@/components/layout/app-chrome";
import { ConfigurationStatus } from "@/components/layout/configuration-status";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppChrome configurationStatus={<ConfigurationStatus />}>
      {children}
    </AppChrome>
  );
}
