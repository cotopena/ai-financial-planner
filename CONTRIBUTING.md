# Contributing

Thanks for considering a contribution to AI Financial Planner.

This project is still in active MVP development. Small, focused contributions are the easiest to review and merge.

## Before You Start

- Search existing issues and pull requests before opening new work.
- For anything larger than a small bug fix or docs edit, open an issue first so scope and direction are clear.
- Keep changes narrow. A focused PR is much easier to review than a mixed refactor plus feature change.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run convex:codegen
npm run dev
```

If you need a local Convex dev session:

```bash
npm run dev:convex
```

## Development Expectations

- Match the existing code style and file organization.
- Do not commit secrets, credentials, or local `.env` files.
- Do not add maintainer-only workflow artifacts or private planning docs to this repository.
- Prefer incremental changes over large rewrites.

## Verification

Run the checks that match your change. For most code changes, that means:

```bash
npm run convex:codegen
npm run lint
npm run typecheck
npm run build
```

If you touch the finance engine, also run:

```bash
npm run parity:revenue
```

If you have `gitleaks` installed, run:

```bash
npm run secrets:scan
```

## Pull Requests

Use a branch with a short, descriptive name.

A good pull request should:

- explain the problem being solved
- describe the approach taken
- list the verification steps you ran
- call out risks, follow-up work, or deliberate omissions
- stay scoped to one logical change

## Security

Do not open a public issue for a security vulnerability. Follow [SECURITY.md](./SECURITY.md) instead.

## Licensing

By submitting a contribution, you agree that your contribution will be licensed under the repository's current license.
