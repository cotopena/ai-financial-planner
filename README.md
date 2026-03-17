# AI Financial Planner

Sprint 0 foundation for the locked v1 stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style component baseline
- Convex backend surface and schema
- Clerk integration points
- Stripe integration points
- Shared TypeScript calculation engine skeleton

The product and implementation source of truth live in:

- `MVP PRD — AI Financial Planner (v1).md`
- `Implementation PRD - AI Financial Planner (v1).md`

## Local setup

```bash
npm install
cp .env.example .env.local
npm run convex:codegen
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run convex:codegen
npm run lint
npm run typecheck
npm run build
```

## External services

This scaffold expects these services to be configured before the app is fully usable:

- Convex deployment URL
- Clerk publishable key and JWT issuer
- Stripe publishable and secret keys
- OpenAI API key for later AI flows

Without those values, the app renders configuration placeholders instead of live auth, billing, and AI behavior.
