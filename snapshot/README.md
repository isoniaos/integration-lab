# Snapshot

This directory documents Snapshot testnet workflows for the integration lab.

Snapshot records are signaling and discussion evidence unless IsoniaOS
explicitly models them as governance authority in a scoped product integration.

## Current Maturity

Adapter-spec evidence in Integration Lab. Current Snapshot workflow details and
live fixtures are not verified in this repository, and this directory does not
claim Snapshot product integration support.

## Fixture Plan

Use `read-only-offchain-governance-signal-fixture-plan.md` for the lab-facing
plan for future Snapshot proposal/page, vote, space/settings strategy,
discussion-link, normalized source/record, evidence-claim, mismatch, stale,
unavailable, and manual link-only fixtures. The plan is not a product adapter
and does not add a Snapshot API client.

## Boundary

- Snapshot proposals can provide off-chain signaling context.
- Snapshot space metadata can help label source context.
- Snapshot records must not be silently treated as on-chain IsoniaOS authority.
- Any production Snapshot integration must be scoped in a product repository,
  not inferred from this lab.

## Evidence Needed Before Integration Claim

- Safe-to-commit Snapshot proposal/page, vote, and space/settings strategy
  fixtures.
- Captured Snapshot proposal/discussion URLs with source labels.
- Dependency-free fixture validation after concrete JSON fixtures exist.
- Product-owned mapping that states which Snapshot fields, if any, are
  authoritative for a specific IsoniaOS product field.
- Tests or reviewed adapter behavior in the owning product repository.
