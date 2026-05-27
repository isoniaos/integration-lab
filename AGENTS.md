# IsoniaOS Integration Lab Agent Instructions

## Scope

This repository owns isolated integration, QA, field-validation, and presentation-evidence material for IsoniaOS. It may contain Sepolia manifests, pinned Sepolia fork configs, provider workflow notes, external evidence templates, validation scripts, scenarios, and field notes.

It does not own core protocol behavior, audited contracts, Control Plane internals, SDK APIs, App Core product logic, public production configuration, SaaS behavior, or governance authority.

## Workspace Instruction Chain

When working inside the private IsoniaOS workspace, read:

1. `../AGENTS.md`
2. `../CURRENT_ROADMAP.md`
3. relevant `../private-docs/` index, governance, roadmap, and migration docs
4. this repository `AGENTS.md`
5. this repository local README files and `README.md`
6. current source/config files before editing

If this repository is cloned standalone, use this file as the local agent entry point and avoid relying on private workspace-only paths.

## Stack and Commands

- Markdown scenario and provider notes
- JSON evidence and manifest templates
- Dependency-free Node.js validation script in `scripts/`

Useful commands:

```bash
node scripts/validate-sepolia-managed-execution-manifest.mjs sepolia/managed-execution-manifest.example.json
git diff --check
```

No package manager tooling is currently declared.

## Development Principles

- Keep lab-only fixtures, manifests, provider assumptions, helper scripts, and presentation scenarios out of core product repositories.
- Keep live Sepolia evidence separate from pinned-fork replay evidence.
- Label provider records as evidence, context, compatibility experiments, or field notes.
- Preserve source labels, provenance, stale/error/unknown states, and trust boundaries.
- Use active protocol names in current lab content: `IsoCore`, `IsoProposals`, optional `IsoOrgExecutor`, `isoCoreAddress`, `isoProposalsAddress`, `ISONIA_CORE_ADDRESS`, and `ISONIA_PROPOSALS_ADDRESS`.
- Keep App Core runtime deployment captures array-based and keyed by `chainId`.
- Label optional local proposal demo targets as local/demo evidence, not protocol core contracts.
- Do not treat external provider records or manual accountability notes as protocol truth by default.
- Do not add production runtime dependencies or package pins unless actual lab scripts require them.
- Do not claim Snapshot, Safe, Tally, Agora, GitHub, Discourse, block explorer, or other provider integration completeness without scoped product implementation and documentation elsewhere.
- Do not make production, audit, public beta, legal, SaaS, provider-completeness, grant, ISO launch, or token launch readiness claims.

## Documentation Rules

Update the relevant scenario, provider README, evidence template, or script README when public behavior, provider workflow, validation rules, or evidence requirements change.

Update the public docs repository only when a public user, developer, operator, or public-claim surface changes. Do not publish private strategy or provider credentials.

## Testing and Validation

For documentation-only changes, run:

```bash
git diff --check
```

For managed execution manifest changes, also run:

```bash
node scripts/validate-sepolia-managed-execution-manifest.mjs sepolia/managed-execution-manifest.example.json
```

If package tooling is added later, document and run the relevant lint, typecheck, or test command.
