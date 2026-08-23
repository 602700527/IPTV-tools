# Contributing

Thanks for considering a contribution to cfworker2.

## Code style & conventions

All code style, naming conventions, async patterns, and database query patterns are documented in [`AGENTS.md`](./AGENTS.md). Read it first — it is the source of truth and is enforced via code review.

Quick rules of thumb:
- 2-space indent, no tabs, no semicolons, single quotes
- Always use prepared statements (`db.prepare(...).bind(...)`)
- Use `ctx.waitUntil()` for non-blocking background work
- One change, one commit message, one PR

## Proposing changes

For non-trivial changes (new features, breaking changes, schema migrations), open a change proposal under `openspec/changes/<short-name>/` following the existing templates (see `openspec/changes/archive/` for examples). The proposal must include:

- `proposal.md` — why and what
- `tasks.md` — checklist of small commits
- (optional) `design.md` — for architectural decisions

Bug fixes and tiny improvements don't need a spec — just open a PR with a clear description.

## Setting up locally

```bash
npm install
cp .dev.vars.example .dev.vars   # then fill in real secrets
npm run dev                       # http://localhost:8787
npm run init-db                   # one-time D1 schema apply
```

See [`README.md`](./README.md) for deployment and the full setup walkthrough.

## Reporting bugs

Open a GitHub issue with:
- What you expected vs what happened
- Reproduction steps (URL, request, response)
- Wrangler / Node version (`wrangler --version`, `node --version`)

## License

By contributing, you agree your contributions are licensed under the [MIT License](./LICENSE).