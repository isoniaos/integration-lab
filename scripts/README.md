# Scripts

This directory contains lab-only helper scripts.

No package tooling or runtime dependency pins are included in the baseline. Do
not add dependencies just to mirror archived demo stack material or core
repositories.

Current scripts:

- `validate-sepolia-managed-execution-manifest.mjs` validates the managed
  execution smoke manifest shape without npm dependencies. It rejects stale
  `Gov*` / `GOV_*` active fields, unsafe authority defaults, invalid addresses
  or hashes, wrong Sepolia chain identity, and missing source or trust-boundary
  labels.
- `validate-external-source-provider-registry.mjs` validates the external
  source provider registry shape without npm dependencies. It checks DTO
  vocabulary allowlists, required registry fields, conservative public-claim
  status, scoped authority posture, visibility/access values, disabled
  write/execute capabilities, and suspicious claim wording.
- `validate-safe-read-only-execution-fixtures.mjs` validates the synthetic Safe
  read-only execution/evidence fixture pack without npm dependencies. It checks
  shape, authority/evidence posture, freshness and mismatch declarations,
  address/hash/block-number shapes, no-secret hygiene, no enabled write or
  execution capabilities, and conservative public-claim wording.
- `validate-snapshot-read-only-offchain-fixtures.mjs` validates the synthetic
  Snapshot read-only offchain governance-signal fixture pack without npm
  dependencies. It checks shape, authority/evidence posture, freshness and
  mismatch declarations, identity/value shapes, no-secret hygiene, no enabled
  write/vote/signing/administration/execution capabilities, and conservative
  public-claim wording.

Usage:

```bash
node scripts/validate-sepolia-managed-execution-manifest.mjs sepolia/managed-execution-manifest.example.json
```

```bash
node scripts/validate-external-source-provider-registry.mjs provider-registry/external-source-provider-registry.example.json
```

```bash
node scripts/validate-safe-read-only-execution-fixtures.mjs safe/fixtures/read-only-execution-evidence.example.json
```

```bash
node scripts/validate-snapshot-read-only-offchain-fixtures.mjs snapshot/fixtures/read-only-offchain-governance-signal.example.json
```

When adding scripts:

- keep them lab-only;
- document required environment variables;
- avoid committing credentials;
- pin dependencies only when scripts actually consume them;
- add lint, typecheck, or test commands for the new tooling;
- keep generated evidence separate from core product configuration.
