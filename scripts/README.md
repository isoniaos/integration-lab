# Scripts

This directory contains lab-only helper scripts.

No package tooling or runtime dependency pins are included in the baseline. Do
not add dependencies just to mirror `demo-stack` or core repositories.

Current scripts:

- `validate-sepolia-managed-execution-manifest.mjs` validates the managed
  execution smoke manifest shape without npm dependencies.

Usage:

```bash
node scripts/validate-sepolia-managed-execution-manifest.mjs sepolia/managed-execution-manifest.example.json
```

When adding scripts:

- keep them lab-only;
- document required environment variables;
- avoid committing credentials;
- pin dependencies only when scripts actually consume them;
- add lint, typecheck, or test commands for the new tooling;
- keep generated evidence separate from core product configuration.
