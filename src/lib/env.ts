const env = {
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_JWT_ISSUER_DOMAIN: process.env.CLERK_JWT_ISSUER_DOMAIN,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};

export const featureFlags = {
  clerkConfigured: Boolean(
    env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && env.CLERK_JWT_ISSUER_DOMAIN,
  ),
  convexConfigured: Boolean(
    env.NEXT_PUBLIC_CONVEX_URL && env.CONVEX_DEPLOYMENT,
  ),
  stripeConfigured: Boolean(
    env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
      env.STRIPE_SECRET_KEY &&
      env.STRIPE_WEBHOOK_SECRET,
  ),
  openAiConfigured: Boolean(env.OPENAI_API_KEY),
};

export const integrationStatus = [
  {
    key: "convex",
    label: "Convex",
    configured: featureFlags.convexConfigured,
    envVars: ["NEXT_PUBLIC_CONVEX_URL", "CONVEX_DEPLOYMENT"],
  },
  {
    key: "clerk",
    label: "Clerk",
    configured: featureFlags.clerkConfigured,
    envVars: [
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      "CLERK_JWT_ISSUER_DOMAIN",
    ],
  },
  {
    key: "stripe",
    label: "Stripe",
    configured: featureFlags.stripeConfigured,
    envVars: [
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      "STRIPE_SECRET_KEY",
      "STRIPE_WEBHOOK_SECRET",
    ],
  },
  {
    key: "openai",
    label: "OpenAI",
    configured: featureFlags.openAiConfigured,
    envVars: ["OPENAI_API_KEY"],
  },
] as const;

export { env };
