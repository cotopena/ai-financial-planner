/* eslint-disable @typescript-eslint/no-explicit-any */

import { ConvexError } from "convex/values";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type DbCtx = QueryCtx | MutationCtx;

export async function getCurrentUser(ctx: DbCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  return ctx.db
    .query("users")
    .withIndex("by_auth_subject", (q: any) =>
      q.eq("authSubject", identity.subject),
    )
    .unique();
}

export async function ensureCurrentUser(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError("Unauthorized");
  }

  const existing = await ctx.db
    .query("users")
    .withIndex("by_auth_subject", (q: any) =>
      q.eq("authSubject", identity.subject),
    )
    .unique();

  if (existing) {
    await ctx.db.patch(existing._id, {
      email: identity.email ?? existing.email,
      fullName: identity.name ?? existing.fullName,
      lastSeenAt: Date.now(),
    });

    return (await ctx.db.get(existing._id)) as Doc<"users">;
  }

  const now = Date.now();
  const userId = await ctx.db.insert("users", {
    authSubject: identity.subject,
    email: identity.email ?? "unknown@example.com",
    fullName: identity.name ?? identity.givenName ?? "New user",
    defaultPlanKey: "builder",
    lastSeenAt: now,
  });

  await ctx.db.insert("subscriptions", {
    userId,
    planKey: "builder",
    status: "trialing",
    currentPeriodStart: now,
    currentPeriodEnd: now + 30 * 24 * 60 * 60 * 1000,
    aiActionLimit: 60,
    aiActionsUsed: 0,
    lastResetAt: now,
  });

  return (await ctx.db.get(userId)) as Doc<"users">;
}

export async function requireOwnedBusiness(
  ctx: DbCtx,
  businessId: Id<"businesses">,
) {
  const user = await getCurrentUser(ctx);

  if (!user) {
    throw new ConvexError("Unauthorized");
  }

  const business = await ctx.db.get(businessId);

  if (!business || business.userId !== user._id) {
    throw new ConvexError("Business not found");
  }

  return { user, business };
}

export async function requireOwnedScenario(
  ctx: DbCtx,
  scenarioId: Id<"scenarios">,
) {
  const user = await getCurrentUser(ctx);

  if (!user) {
    throw new ConvexError("Unauthorized");
  }

  const scenario = await ctx.db.get(scenarioId);

  if (!scenario) {
    throw new ConvexError("Scenario not found");
  }

  const business = await ctx.db.get(scenario.businessId);

  if (!business || business.userId !== user._id) {
    throw new ConvexError("Scenario not found");
  }

  return { user, business, scenario };
}
