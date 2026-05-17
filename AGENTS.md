# AGENTS.md - IsoniaOS Integration Lab

This repository follows the workspace-level IsoniaOS development guide.

## Repository Purpose

`integration-lab` is a documentation-first integration, QA, and presentation
lab. It validates IsoniaOS behavior against live Sepolia, pinned Sepolia forks,
and external DAO tooling workflows.

It is not a core product repository, contract package, SDK, app package, or
source of governance authority.

## Boundaries

- Do not import lab-only fixtures, manifests, provider assumptions, or helper
  scripts into core product repositories.
- Do not claim Snapshot, Safe, Tally, or Agora integration is production-ready
  unless a scoped product integration has been implemented elsewhere.
- Do not add package tooling or dependency pins unless actual lab scripts are
  introduced.
- Do not create Git tags unless explicitly instructed.
- Do not write audited contracts here.

## Documentation Rules

- Write all documentation and comments in English.
- Keep provider records clearly labeled as evidence, context, or compatibility
  experiments.
- Keep live Sepolia and pinned-fork assumptions separate.
- When public behavior or provider workflow changes, update the relevant
  checklist in the same change.

## Validation

For documentation-only changes, run:

```bash
git diff --check
```

If package tooling is added later, also run the relevant lint, typecheck, or
test command documented with that tooling.
