# Safe Read-Only Execution Evidence Fixtures

This directory contains synthetic Safe execution/evidence fixtures for
Integration Lab validation.

The fixture pack is safe-to-commit example material only. It is not live Safe
API data, not customer data, not a Safe adapter, not product UI, and not a
write, signing, approval, transaction-submission, module-installation,
guard-installation, or execution path.

## Files

- `read-only-execution-evidence.example.json` contains synthetic cases for an
  executed transaction, bounded payment evidence, Safe service versus chain
  mismatch, source-unavailable state, and manual link-only evidence.

## Validation

Run from the Integration Lab repository root:

```bash
node scripts/validate-safe-read-only-execution-fixtures.mjs safe/fixtures/read-only-execution-evidence.example.json
```

The validator checks JSON shape, DTO vocabulary, authority/evidence posture,
freshness and mismatch declarations, no-secret hygiene, no enabled write or
execution capabilities, and conservative public-claim wording.

## Boundary

These fixtures establish only a synthetic lab baseline for the private Safe
read-only evidence model. They do not establish Safe provider availability in
any product surface. Real Safe transaction-service, explorer, or chain fixtures
remain future evidence work and must be safe-to-commit before they are added.
