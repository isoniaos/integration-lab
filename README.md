# IsoniaOS Integration Lab

This repository is an isolated integration, QA, and presentation lab for
IsoniaOS real-world scenarios.

It exists to validate IsoniaOS behavior against public testnet conditions and
external DAO tooling without polluting core product repositories.

## Scope

The lab is for:

- live Sepolia smoke tests;
- pinned Sepolia fork replay;
- provider workflow notes;
- demo evidence capture;
- presentation and QA checklists.

The lab is not:

- the source of product authority;
- an audited contract package;
- a replacement for `demo-stack`;
- a dependency source for core repositories;
- proof that any external integration is production-complete.

Core product repositories must not import lab-only contracts, fixtures,
deployment manifests, provider assumptions, or evidence records from this
repository.

## Real-World Baseline

Live Sepolia is used for real-world smoke tests because public chains, wallets,
explorers, and external DAO tools behave differently from local deterministic
stacks.

Pinned Sepolia forks are used for deterministic replay and read-model
validation. A fork can replay chain state at a chosen block, but it does not
prove that external provider APIs or UIs will detect fork-only transactions.

The old local `demo-stack` path is archived. Do not treat it as current launch,
self-hosting, or integration authority for this lab.

External records such as Snapshot proposals, Safe transactions, Tally pages,
Agora links, block explorer pages, GitHub issues, and Discourse threads remain
evidence or context unless IsoniaOS explicitly models them as governance
authority.

## v0.8 Managed Execution Smoke Kit

The managed execution smoke kit prepares a Sepolia field test for the v0.8
org-scoped execution path without deploying contracts or calling provider APIs
from this repository.

Key files:

- `scenarios/v0.8-sepolia-managed-execution-smoke.md` describes the field-test
  flow and pass criteria.
- `sepolia/managed-execution-manifest.example.json` captures the run shape,
  protocol metadata, permission rules, proposal identity, canonical execution
  receipt, and source disclosure.
- `sepolia/managed-execution-runbook.md` gives operator steps for a future live
  Sepolia run.
- `forks/sepolia-managed-execution-fork.example.json` separates live provider
  validation from deterministic fork replay.
- `evidence/managed-execution-external-resources.example.json` templates
  provider, explorer, discussion, Control Plane, and App Core evidence.
- `scripts/validate-sepolia-managed-execution-manifest.mjs` validates the
  manifest shape without npm dependencies.

Validate the example manifest with:

```bash
node scripts/validate-sepolia-managed-execution-manifest.mjs sepolia/managed-execution-manifest.example.json
```

## Repository Layout

```txt
scenarios/  Versioned QA and presentation scenarios.
sepolia/    Live Sepolia manifest and environment templates.
forks/      Sepolia fork replay notes and example pinning data.
snapshot/   Snapshot testnet workflow notes.
safe/       Safe Sepolia proof workflow notes.
tally/      Governor compatibility experiment notes.
agora/      Agora research and linking notes.
evidence/   External evidence fixture templates.
scripts/    Lab-only helper scripts with no package dependency requirement.
```

## Authority Boundary

The EVM protocol remains the source of truth for IsoniaOS governance authority.
The Control Plane may index, explain, cache, and visualize that state. App Core
may present it. This lab may capture evidence around it.

This repository must not redefine governance authority, bypass protocol
semantics, or introduce provider-specific assumptions into the core product
surface.
