# Snapshot

This directory documents Snapshot testnet workflows for the integration lab.

Snapshot records are signaling and discussion evidence unless IsoniaOS
explicitly models them as governance authority in a scoped product integration.

## Current Maturity

Adapter-spec evidence in Integration Lab. Current Snapshot workflow details and
live fixtures are not verified in this repository, and this directory does not
claim Snapshot product integration support.

## Fixtures

Use `read-only-offchain-governance-signal-fixture-plan.md` for the lab-facing
fixture plan. Synthetic fixture examples live under `fixtures/`, and the local
validator command is documented in `../scripts/README.md`.

The synthetic fixture pack covers proposal existence evidence, vote occurrence
evidence, discussion context, page/API/cache mismatch, strategy/voting-power
partial context, source-unavailable state, and manual link-only evidence. It is
not a product adapter and does not add a Snapshot API client.

## Boundary

- Snapshot proposals can provide off-chain signaling context.
- Snapshot space metadata can help label source context.
- Snapshot records must not be silently treated as on-chain IsoniaOS authority.
- Any production Snapshot integration must be scoped in a product repository,
  not inferred from this lab.

## Evidence Needed Before Integration Claim

- Safe-to-commit Snapshot proposal/page, vote, and space/settings strategy
  fixtures from live/testnet records when later allowed.
- Matching page/API/cache and linked discussion fixtures with source labels.
- Product-owned mapping that states which Snapshot fields, if any, are
  authoritative for a specific IsoniaOS product field.
- Tests or reviewed adapter behavior in the owning product repository.
