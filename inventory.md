# Integration Lab Inventory

Last reviewed: 2026-05-30

This inventory classifies current Integration Lab records after the core surface
normalization sequence. The lab is evidence, QA, scenario, and provider-research
space only. It is not protocol authority, product runtime configuration, provider
completeness evidence, or readiness evidence for production, audit, public beta,
legal, SaaS, grant, ISO launch, or token launch claims.

## Classification Key

- current lab evidence/template: active lab input, evidence shape, or workflow
  note.
- historical note: retained history or changelog context, not active guidance.
- stale-updated historical evidence: contained active old vocabulary or stale
  posture before the normalization sequence and is now retained as current lab
  evidence plus task history.
- stale and quarantined/review-only: retained only for review, not active use.
- intentionally out of scope: not changed because the task explicitly excludes
  the surface or no public/product behavior changed.

## Inventory

| Item | Classification | Disposition |
| --- | --- | --- |
| `README.md` | current lab guidance | Records active `Iso*` / `ISONIA_*` vocabulary, App Core deployment-array boundary, inventory link, and local checklist pointer. |
| `AGENTS.md` | current lab guidance | Records local instructions for normalized protocol names, App Core `deployments[]`, and local/demo target labeling. |
| `CHANGELOG.md` | historical note | Existing alpha history remains history; Unreleased records current documentation changes. |
| `sepolia/README.md` | current lab guidance | Clarifies live Sepolia templates use `IsoCore`, `IsoProposals`, optional `IsoOrgExecutor`, `ISONIA_*`, and array-based App Core deployment captures. |
| `sepolia/environment.example.md` | current lab evidence/template | Live-run environment checklist only; no secrets or runtime config authority. |
| `sepolia/deployment-manifest.example.json` | current lab evidence/template | Active contract keys use `isoCore` and `isoProposals`; App Core runtime capture is `deployments[]` keyed by `chainId`. |
| `sepolia/managed-execution-manifest.example.json` | current lab evidence/template | Uses `Iso*` / `ISONIA_*` names, source/provenance labels, deployment-array App Core runtime evidence, and explicit no-authority/no-provider-completeness disclosure. |
| `sepolia/managed-execution-runbook.md` | current lab guidance | Uses `Iso*` names and preserves live Sepolia versus pinned-fork evidence split. |
| `forks/README.md` | current lab guidance | Fork guidance names selected `IsoCore`, `IsoProposals`, and optional `IsoOrgExecutor` addresses. |
| `forks/sepolia-fork.example.json` | current lab evidence/template | Active fork contract keys use `isoCore` and `isoProposals`. |
| `forks/sepolia-managed-execution-fork.example.json` | current lab evidence/template | Active fork contract keys use `isoCore`, `isoProposals`, and `isoOrgExecutor`. |
| `evidence/README.md` | current lab guidance | Uses provider maturity labels and evidence gates before any product integration claim. |
| `evidence/external-resource-fixtures.example.json` | current lab evidence/template | Generic accountability evidence shape; provider records remain context with trust boundaries. |
| `evidence/managed-execution-external-resources.example.json` | current lab evidence/template | Canonical receipt boundary names `IsoProposals`. |
| `provider-registry/README.md` | current lab guidance | Explains the external source/provider registry boundary, DTO vocabulary alignment, and local validation command. |
| `provider-registry/external-source-provider-registry.example.json` | current lab evidence/template | Conservative machine-readable registry for source categories, record types, authority/evidence posture, visibility/access, freshness/failure concerns, maturity labels, known limits, and next evidence needed. |
| `scenarios/README.md` | current lab guidance | Includes the normalized local-stack checklist as lab evidence capture, not setup authority. |
| `scenarios/v0.8-sepolia-accountability-smoke.md` | current lab evidence/template | Accountability smoke scenario remains current; provider links are optional evidence/context only. |
| `scenarios/v0.8-sepolia-managed-execution-smoke.md` | current lab evidence/template | Uses `Iso*` names and preserves no-readiness/no-provider-completeness boundary. |
| `scenarios/normalized-local-stack-checklist.md` | current lab evidence/template | Added lab-local validation sequence for normalized local stack evidence capture. |
| `scripts/README.md` | current lab guidance | Validator description covers stale-name rejection and source/trust-boundary requirements. |
| `scripts/validate-sepolia-managed-execution-manifest.mjs` | current lab validator | Expects `Iso*` / `ISONIA_*`, rejects stale `Gov*` / `GOV_*` active fields, validates App Core deployment arrays, and enforces source/trust-boundary labels. |
| `scripts/validate-external-source-provider-registry.mjs` | current lab validator | Validates the provider registry shape, DTO vocabulary allowlists, conservative public-claim status, authority boundaries, and disabled write/execute posture. |
| `snapshot/README.md` | current provider note | Includes maturity label and evidence needed before a Snapshot integration claim. |
| `snapshot/testnet-space-checklist.md` | current provider note | Includes unverified-field-note status and required evidence gate. |
| `safe/README.md` | current provider note | Includes maturity label and evidence needed before a Safe integration claim. |
| `safe/sepolia-safe-proof-checklist.md` | current provider note | Includes field-note status and required evidence gate. |
| `tally/README.md` | current provider note | Includes compatibility-research status and evidence needed before a Tally integration claim. |
| `tally/governor-compatibility-notes.md` | current provider note | Includes compatibility-research status and evidence gate; Governor terminology remains provider-specific, not stale `Gov*` protocol naming. |
| `agora/README.md` | current provider note | Includes research-note status and evidence needed before an Agora integration claim. |
| `agora/agora-research-notes.md` | current provider note | Includes unverified-research status and evidence gate. |

## Stale Reference Disposition

Active old protocol names and config fields were updated in current templates,
scripts, and scenario/runbook docs:

- `GovCore`, `GovProposals`, `govCore`, `govProposals`;
- `GOV_CORE_ADDRESS`, `GOV_PROPOSALS_ADDRESS`;
- `govCoreAddress`, `govProposalsAddress`;
- old local package tag references inside the managed execution example.

Remaining allowed matches are generic domain words such as `governance`, provider
terms such as `Governor`, historical changelog headings, and validator/docs text
that explicitly describes rejecting stale `Gov*` / `GOV_*` fields.

No stale items are currently quarantined. If future stale run artifacts
are added for review-only purposes, keep them clearly marked as
`stale and quarantined/review-only` and do not use them as current templates.

## Intentionally Out Of Scope

- Public `docs` were not updated because no public user, developer, operator, or
  public claim surface changed.
- Core product repositories were not modified.
- Live Sepolia deployment automation, provider SDKs, provider API keys, RPC
  secrets, private keys, mnemonics, production manifests, ISO token material,
  SaaS material, and launch/readiness material remain out of scope.
