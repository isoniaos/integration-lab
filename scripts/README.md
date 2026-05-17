# Scripts

This directory is reserved for future lab-only helper scripts.

No package tooling or runtime dependency pins are included in the baseline. Do
not add dependencies just to mirror `demo-stack` or core repositories.

If scripts are added later:

- keep them lab-only;
- document required environment variables;
- avoid committing credentials;
- pin dependencies only when scripts actually consume them;
- add lint, typecheck, or test commands for the new tooling;
- keep generated evidence separate from core product configuration.
