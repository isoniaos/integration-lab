# Scenarios

This directory contains versioned integration, QA, and presentation scenarios.

Scenarios should describe observable workflows and evidence requirements. They
must not claim that external provider records are IsoniaOS governance authority
unless that authority is explicitly modeled by the protocol and documented in
core product specifications.

Use live Sepolia scenarios for public-tool behavior and pinned Sepolia fork
scenarios for deterministic replay or read-model validation.

Current v0.8 scenarios:

- `v0.8-sepolia-accountability-smoke.md` covers public accountability evidence.
- `v0.8-sepolia-managed-execution-smoke.md` covers org-scoped managed execution,
  canonical execution receipts, and read-model/display validation.
- `normalized-local-stack-checklist.md` captures lab-local validation evidence
  for the normalized local stack without becoming product runtime setup docs.
