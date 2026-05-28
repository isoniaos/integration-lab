# Normalized Local Stack Validation Checklist

## Purpose

Use this checklist to capture lab-local evidence that the normalized local stack
still lines up across contracts, Control Plane, App Core, SDK, shared types, and
Theme Default. This is a validation sequence and evidence guide only; it is not
product runtime setup documentation and must not be imported by core
repositories.

## Boundaries

- Command ownership stays in the owning repository docs.
- Lab evidence must name `IsoCore`, `IsoProposals`, optional `IsoOrgExecutor`,
  `ISONIA_CORE_ADDRESS`, `ISONIA_PROPOSALS_ADDRESS`, `isoCoreAddress`, and
  `isoProposalsAddress`.
- App Core runtime captures must use `deployments[]` keyed by `chainId`.
- Optional proposal target addresses are local/demo evidence only.
- Do not commit secrets, RPC keys, private keys, mnemonics, customer data, or
  private production manifests.
- Do not treat this checklist as production, audit, public beta, legal, SaaS,
  grant, token launch, ISO launch, or provider-completeness readiness evidence.

## Evidence Capture Sequence

1. Record the workspace commit/source references used for the run.
2. In `evm-contracts`, follow the owning repository docs for local core deploy,
   optional demo deploy, and optional demo seed. Capture `IsoCore`,
   `IsoProposals`, optional `IsoOrgExecutor`, and any local/demo target
   addresses with a trust-boundary note.
3. In `control-plane`, follow the owning repository docs for migration/start,
   indexing, and projection validation. Capture the configured
   `ISONIA_CORE_ADDRESS` and `ISONIA_PROPOSALS_ADDRESS`, diagnostics output, and
   any stale/error state.
4. In `app-core`, follow the owning repository docs for environment fallback or
   runtime config loading. Capture the selected `activeChainId`,
   `deployments[]`, `isoCoreAddress`, `isoProposalsAddress`, and the diagnostics
   page showing `IsoCore` and `IsoProposals`.
5. From the private workspace root, run the relevant package build checks for
   `@isonia/types`, `@isonia/sdk`, and `@isonia/theme-default` when this
   checklist is used as preflight evidence.
6. Keep live Sepolia evidence and pinned-fork evidence in separate files. Do not
   use fork-only transactions as public block explorer or provider proof.

## Pass Criteria

- Contract, Control Plane, SDK/App Core DTO, and App Core display names all use
  the normalized `Iso*` / `iso*` / `ISONIA_*` vocabulary.
- App Core evidence uses deployment arrays keyed by `chainId`.
- Optional local/demo target evidence is labeled as local/demo and not as
  protocol core.
- Control Plane and App Core evidence preserves source labels and trust
  boundaries.
- No provider note is promoted into product integration support or protocol
  authority.

## Failure Notes

Record failures as observations. Useful categories include stale active names,
address mismatch, missing diagnostics, missing indexer projection, wrong chain,
wallet/RPC failure, App Core display gap, or accidental mixing of live Sepolia
and pinned-fork evidence.
