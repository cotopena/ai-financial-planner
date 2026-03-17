import { v } from "convex/values";
import { action, httpAction } from "./_generated/server";

const planKey = v.union(v.literal("builder"), v.literal("pro"));

export const createCheckoutSession = action({
  args: {
    planKey,
  },
  handler: async (_ctx, args) => {
    const configured = Boolean(
      process.env.STRIPE_SECRET_KEY &&
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    );

    return {
      planKey: args.planKey,
      configured,
      checkoutUrl: configured ? "https://checkout.stripe.com/pay/placeholder" : null,
      note: configured
        ? "Replace placeholder checkout URL with a real Stripe session."
        : "Set Stripe environment variables to enable checkout.",
    };
  },
});

export const createPortalSession = action({
  args: {},
  handler: async () => {
    const configured = Boolean(process.env.STRIPE_SECRET_KEY);

    return {
      configured,
      portalUrl: configured ? "https://billing.stripe.com/p/session/placeholder" : null,
      note: configured
        ? "Replace placeholder portal URL with a real Stripe Billing Portal session."
        : "Set STRIPE_SECRET_KEY to enable the portal action.",
    };
  },
});

export const stripeWebhook = httpAction(async (_ctx, request) => {
  const configured = Boolean(process.env.STRIPE_WEBHOOK_SECRET);
  const body = await request.text();

  return Response.json(
    {
      configured,
      receivedBytes: body.length,
      note: configured
        ? "Webhook route is registered. Event verification and subscription sync remain a later sprint task."
        : "Set STRIPE_WEBHOOK_SECRET to enable webhook verification.",
    },
    {
      status: 200,
    },
  );
});
