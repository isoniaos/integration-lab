# Snapshot Read-Only Offchain Governance Signal Fixtures

This directory contains synthetic Snapshot offchain governance-signal fixtures
for Integration Lab validation.

The fixture pack is safe-to-commit example material only. It is not live
Snapshot API, GraphQL, IPFS, ENS, wallet, or discussion data; not customer data;
not a Snapshot adapter; not product UI; and not a write, vote-submission,
signing, proposal-creation, wallet-connection, space-administration, strategy
management, or execution path.

## Files

- `read-only-offchain-governance-signal.example.json` contains synthetic cases
  for proposal existence evidence, vote occurrence evidence, discussion context,
  page/API/cache mismatch, strategy/voting-power partial context,
  source-unavailable state, and manual link-only evidence.

## Validation

Run from the Integration Lab repository root:

```bash
node scripts/validate-snapshot-read-only-offchain-fixtures.mjs snapshot/fixtures/read-only-offchain-governance-signal.example.json
```

The validator checks JSON shape, DTO vocabulary, authority/evidence posture,
freshness and mismatch declarations, identity and value shapes, no-secret
hygiene, no enabled write/vote/signing/administration/execution capabilities,
and conservative public-claim wording.

## Boundary

These fixtures establish only a synthetic lab baseline for the private Snapshot
read-only offchain governance-signal model. They do not establish Snapshot
product availability. Real Snapshot proposal/page, vote, space strategy, cache,
API, and linked discussion fixtures remain future evidence work and must be
safe-to-commit before they are added.
