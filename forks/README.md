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
