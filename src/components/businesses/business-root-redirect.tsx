"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import type { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { PageIntro } from "@/components/workspace/page-intro";

export function BusinessRootRedirect({ businessId }: { businessId: string }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const business = useQuery(
    api.businesses.get,
    isLoaded && isSignedIn
      ? {
          businessId: businessId as Id<"businesses">,
        }
      : "skip",
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn || business === undefined) {
      return;
    }

    const destination =
      business.scenarios.find((scenario) => scenario.isBase)?._id ??
      business.scenarios[0]?._id;

    router.replace(
      destination
        ? `/app/businesses/${businessId}/scenarios/${destination}/overview`
        : `/app/businesses/${businessId}/scenarios`,
    );
  }, [business, businessId, isLoaded, isSignedIn, router]);

  return (
    <PageIntro
      eyebrow="Business redirect"
      title="Opening your business workspace"
      description="Finding the base scenario for this business in Convex."
    />
  );
}
