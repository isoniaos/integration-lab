# Sepolia Managed Execution Smoke Runbook

## Purpose

Use this runbook to prepare a live Sepolia managed execution field test for
IsoniaOS v0.8. This document intentionally avoids live deployment commands,
provider API calls, secrets, and core repository imports.

## Preflight

- Confirm the target run is on Sepolia chain id `11155111`.
- Confirm the selected deployment includes `IsoCore` and `IsoProposals`.
- Confirm whether the organization uses direct execution or an org-scoped
  executor.
- Confirm Control Plane address capture uses `ISONIA_CORE_ADDRESS` and
  `ISONIA_PROPOSALS_ADDRESS`.
- Confirm App Core runtime deployment capture uses `deployments[]` keyed by
  `chainId` with `isoCoreAddress` and `isoProposalsAddress`.
- Confirm Control Plane is configured from explicit protocol profile and
  capability metadata, not package version strings.
- Confirm App Core reads from the selected Control Plane endpoint.
- Confirm funded wallets, RPC credentials, and provider accounts are available
  for the operator when the live run is actually performed.
- Keep private keys, seed phrases, RPC credentials, API keys, and provider
  tokens out of this repository.

## Manifest Preparation

1. Copy `sepolia/managed-execution-manifest.example.json` to a run-specific
   local file.
2. Replace every example-only address, hash, block number, id, and URL.
3. Set `contracts.isoOrgExecutor` to the `IsoOrgExecutor` address when managed
   execution is enabled. Use an empty string, `null`, or the zero address only
   when the run is explicitly direct execution.
4. Record the organization id and expected `IsoOrgExecutor` address.
5. Record the protocol profile and deployment capability metadata that Control
   Plane will receive.
6. Record final target, selector, and value permission rules.
7. Record the proposal identity fields before execution.
8. Record canonical execution receipt fields after execution.
9. Run the manifest validator before using the file as QA input.

Validator:

```bash
node scripts/validate-sepolia-managed-execution-manifest.mjs sepolia/managed-execution-manifest.example.json
```

## Live Sepolia Flow

1. Select or deploy the Sepolia IsoniaOS protocol deployment for the run.
2. Verify `IsoCore`, `IsoProposals`, and optional `IsoOrgExecutor` addresses on a
   block explorer.
3. Configure or confirm the org-scoped executor if the run uses managed
   execution.
4. Configure or confirm execution permission rules:
   - target address enabled;
   - action selector enabled;
   - value limit permits the requested value.
5. Prepare the target contract:
   - Ownable-style lane: owner is `IsoProposals` for direct execution or the
     `IsoOrgExecutor` for managed execution.
   - AccessControl-style lane: record only as future or optional evidence until
     the exact role handoff path is validated.
6. Create or select the proposal with the final action fields:
   `targetAddress`, `value`, `actionSelector`, `dataHash`, and `metadataUri`.
7. Complete the required approval route.
8. Execute the proposal directly or through the org-scoped executor.
9. Capture the canonical `ProposalExecuted` receipt emitted by `IsoProposals`.
10. Run or resume Control Plane indexing for the selected deployment.
11. Verify Control Plane surfaces direct or managed execution proof.
12. Verify App Core renders public archive, accountability, and managed
    execution evidence.

## Evidence Capture

Capture these records in a run-specific evidence file:

- deployment manifest;
- organization id;
- proposal id;
- final target, value, selector, data hash, and metadata URI;
- permission rule evidence for target, selector, and value;
- execution transaction hash and block number;
- canonical `ProposalExecuted` receipt fields;
- Control Plane response captures or URLs;
- App Core public route or screenshot reference;
- external resource links with trust boundaries.

Use:

```txt
evidence/managed-execution-external-resources.example.json
```

as the shape reference.

## Provider Boundary Notes

- Snapshot testnet spaces and proposal links are signaling or discussion
  evidence.
- Safe Sepolia transaction links are workflow or transaction proof evidence.
- Tally is a Governor compatibility research lane unless a compatible path is
  explicitly validated and scoped.
- Agora is a research lane unless a compatible governor or client integration
  path is explicitly validated and scoped.
- Block explorers prove transaction, block, address, or log visibility only.
- GitHub and Discourse links are implementation, release, discussion, or
  decision context.

## Fork Replay

Use live Sepolia for real wallet, explorer, and provider UX/API validation.
Use a pinned Sepolia fork for deterministic replay, projection checks, and
read-model rebuilding.

Fork-only transactions are not visible to external providers. Do not use a
fork-only transaction hash as Snapshot, Safe, Tally, Agora, or explorer proof
for a live Sepolia run.

## Failure Handling

When the run fails, record the observed gap rather than changing the scenario
or manifest to hide it. Useful failure categories include missing permission
rules, mismatched selectors, unexpected executor address, missing canonical
receipt indexing, stale provider state, and App Core display gaps.
