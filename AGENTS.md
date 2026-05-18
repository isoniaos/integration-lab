# AGENTS.md - IsoniaOS Integration Lab

These rules apply to Codex and other AI agents working in `integration-lab`.

## Repository Purpose

`integration-lab` is the isolated real-world validation repository for IsoniaOS.

It records QA, presentation, and field-validation work against live Sepolia, pinned Sepolia forks, and external DAO tooling workflows.

It is not a core product repository, contract package, SDK, app package, or source of governance authority.

## Scope

Use this repository for:

- Sepolia deployment manifests;
- pinned Sepolia fork configs;
- Snapshot testnet workflow notes;
- Safe Sepolia proof workflow;
- Tally / Governor compatibility experiments;
- Agora research lane;
- GitHub, Discourse, and block explorer evidence fixtures;
- provider checklists and provider gap notes;
- QA field notes;
- presentation scenarios.

## Boundaries

- Do not import lab-only fixtures, manifests, provider assumptions, helper scripts, or presentation scenarios into core product repositories.
- Do not define core governance authority here.
- Do not write audited contracts here.
- Do not add production runtime dependencies or package pins unless actual lab scripts require them.
- Do not create Git tags unless explicitly instructed.
- Do not claim Snapshot, Safe, Tally, Agora, GitHub, Discourse, block explorer, or any other provider integration is complete or production-ready unless a scoped product integration has been implemented and documented elsewhere.

## Evidence and Trust Rules

- Keep provider records clearly labeled as evidence, context, compatibility experiments, or field notes.
- Keep live Sepolia and pinned-fork assumptions separate.
- Keep source labels, provenance, stale/error/unknown states, and trust boundaries visible.
- Do not treat external provider records as IsoniaOS authority by default.
- Do not treat manual accountability updates as protocol truth.

## Documentation Rules

- Write all documentation and comments in English.
- Update the relevant checklist or field note when public behavior or provider workflow changes.
- Do not make production, audit, public beta, SaaS, legal, provider-completeness, or ISO launch-readiness claims.

## Validation

For documentation-only changes, run:

```bash
git diff --check
```

If package tooling is added later, also run the relevant lint, typecheck, or test command documented with that tooling.
