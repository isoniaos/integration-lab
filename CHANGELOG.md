# Changelog

All notable changes to this repository will be documented in this file.

This repository follows SemVer for releases, but Git tags use a leading `v`.

## Unreleased

### Added

- Safe read-only execution evidence fixture plan aligned with the private
  adapter spec, without adding a Safe adapter, API client, write path, or
  execution path.
- Lab inventory and normalized local-stack validation checklist for evidence
  capture after the core surface normalization handoff.
- External source provider registry baseline with a dependency-free validator
  for conservative provider/source planning evidence.
- v0.8 Sepolia managed execution smoke scenario, runbook, manifest template,
  pinned fork template, external evidence fixture, and dependency-free manifest
  validator.
- Provider boundary updates for Snapshot, Safe, Tally, Agora, block explorer,
  GitHub, and Discourse evidence in managed execution field tests.

### Changed

- Updated the Safe provider-registry entry to `adapter-spec` maturity based on
  the private spec and fixture plan while keeping write and execute
  capabilities disabled.
- Aligned active lab templates, scenarios, runbooks, fork configs, and validator
  rules with `Iso*`, `iso*`, and `ISONIA_*` protocol vocabulary.
- Marked provider notes with maturity labels and evidence gates before any
  product integration claim.
- Updated active README, inventory, and normalized local-stack wording so
  completed normalization evidence is not presented as the next handoff.

## v0.8.0-alpha.1

### Added

- Initial v0.8 Sepolia integration-lab documentation baseline.
- Live Sepolia manifest template and environment checklist.
- Pinned Sepolia fork template for deterministic replay notes.
- Provider boundary notes for Snapshot, Safe, Tally, Agora, block explorers,
  GitHub, and Discourse.
- External evidence fixture template for QA and presentation records.
