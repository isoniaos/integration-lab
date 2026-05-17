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

The local `demo-stack` remains a quick local launch helper. It is useful for
developer iteration, but it is not the integration authority for this lab.

External records such as Snapshot proposals, Safe transactions, Tally pages,
Agora links, block explorer pages, GitHub issues, and Discourse threads remain
evidence or context unless IsoniaOS explicitly models them as governance
authority.

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
scripts/    Placeholder for future lab-only helper scripts.
```

## Authority Boundary

The EVM protocol remains the source of truth for IsoniaOS governance authority.
The Control Plane may index, explain, cache, and visualize that state. App Core
may present it. This lab may capture evidence around it.

This repository must not redefine governance authority, bypass protocol
semantics, or introduce provider-specific assumptions into the core product
surface.
