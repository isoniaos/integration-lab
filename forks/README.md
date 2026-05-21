# Forks

This directory contains pinned Sepolia fork notes.

Pinned forks are useful for deterministic replay, projection testing, route
explanation validation, and read-model rebuilding. They are not proof that
external provider APIs or UIs will observe fork-only transactions.

## Forking Rules

- Pin the Sepolia block number.
- Record the upstream RPC provider used for the fork.
- Record the selected deployment addresses.
- Keep fork evidence separate from live Sepolia evidence.
- Do not treat fork-only transactions as public external-provider proof.

## Common Uses

- Rebuild Control Plane read models from known raw events.
- Reproduce route explanation behavior.
- Validate proposal lifecycle projections.
- Demonstrate deterministic state transitions for QA.

## Managed Execution Replay

Use `sepolia-managed-execution-fork.example.json` to pin replay inputs for the
managed execution smoke scenario.

Live Sepolia is the path for wallet behavior, public block explorer visibility,
and provider UX/API validation. A pinned Sepolia fork is the path for
deterministic raw event replay, projection rebuilds, and read-model validation.

Transactions created on the fork are not visible to external providers. Do not
use fork-only transaction hashes as Snapshot, Safe, Tally, Agora, or block
explorer proof for a live run.
