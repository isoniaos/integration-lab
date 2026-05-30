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

## Run Attempts

### 2026-05-30 - Local integrated proposal-to-proof preflight

Scope:

- Workspace root plus `types`, `sdk`, `evm-contracts`, `control-plane`,
  `app-core`, and `integration-lab`.
- Local chain `31337` on `http://127.0.0.1:8545`.
- Existing local Control Plane API on `http://127.0.0.1:3000`.
- Existing local App Core dev server on `http://localhost:5173`.

Baseline checks:

- `git -c safe.directory=* status --short`: clean before the task.
- `corepack pnpm --version`: `10.33.2`.
- `node --version`: `v24.13.1`.
- `corepack pnpm --filter @isonia/types build`: passed.
- `corepack pnpm --filter @isonia/types typecheck`: passed.
- `corepack pnpm --filter @isonia/sdk build`: passed.
- `corepack pnpm --filter @isonia/sdk test`: passed, 33 tests.
- `corepack pnpm --filter @isonia/sdk typecheck`: passed.
- `corepack pnpm --filter @isonia/evm-contracts test`: passed, 79 tests
  total, with Hardhat code-size warnings in the Solidity test harness.
- `corepack pnpm --filter @isonia/control-plane build`: passed.
- `corepack pnpm --filter @isonia/control-plane test`: initially failed
  because `src/system/system.controller.spec.ts` depended on ambient local
  `ISONIA_*` capability environment; after isolating those env vars in the
  test, rerun passed, 13 suites and 100 tests.
- `corepack pnpm --filter @isonia/app-core typecheck`: passed.
- `corepack pnpm --filter @isonia/app-core test`: passed.
- `corepack pnpm --filter @isonia/app-core build`: passed, with existing Vite
  chunk-size warnings.

Protocol deploy and seed:

- `corepack pnpm node:local`: a local node was already listening on port
  `8545`; `eth_chainId` returned `0x7a69` (`31337`). The pre-existing process
  was used and intentionally not stopped.
- `corepack pnpm deploy:core:local`: passed. Hardhat Ignition resumed existing
  local deployment state and reported protocol-core addresses
  `IsoCore = 0x610178dA211FEF7D417bC0e6FeD39F05609AD788` and
  `IsoProposals = 0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e`, plus existing
  demo-local module addresses.
- `corepack pnpm deploy:demo:local`: passed with nothing new to deploy from
  existing Ignition state.
- `corepack pnpm seed:demo:local`: passed and produced demo-local runtime
  evidence:
  `IsoCore = 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`,
  `IsoProposals = 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853`,
  `DemoTarget = 0x5FbDB2315678afecb367f032d93F642f64180aa3`,
  `IsoOrgExecutor` examples for orgs `4`, `5`, and `6`, and executed proposal
  ids `7`, `8`, and `9` for the Ownable, AccessControl, and AccessManager
  target-pattern organizations.

Control Plane indexing and projection:

- `corepack pnpm db:migrate` with `CHAIN_ID=31337`, `RPC_URL` set to the local
  node, `ISONIA_CORE_ADDRESS=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`,
  `ISONIA_PROPOSALS_ADDRESS=0xa513E6E4b8f2a923D98304ec87F64353C4D5C853`, and
  `ISONIA_PROTOCOL_PROFILE=current`: passed.
- `corepack pnpm indexer:once` with the same env: passed with `No safe blocks
  to index`, because the existing local worker/API process had already indexed
  the run.
- `corepack pnpm projections:rebuild` with the same env: passed and rebuilt
  projections from `148` events.
- `GET /v1/version`: returned chain `31337` and the seeded demo-local
  `isoCoreAddress` / `isoProposalsAddress`.
- `GET /v1/diagnostics/indexer`: reported API, indexer, and projections
  running; contracts `isoCore` and `isoProposals` configured; raw event counts
  `processed=148`, `failed=0`, `orphaned=0`; projection backlog `0`.

SDK, App Core, and read-path checks:

- SDK client read against `http://127.0.0.1:3000` passed for version,
  diagnostics, org `4`, proposal `7`, and accountability. Observed
  `proposal7Status=executed`, `proposal7ExecutionMode=managed`, and
  `accountabilityStatus=completed`.
- `GET /v1/orgs/4/overview`: returned active organization
  `ownable-target-local`, one body, three roles, three active mandates, and
  latest proposal `7`.
- `GET /v1/orgs/4/execution-permissions`: returned enabled target
  `0x5fc8d32690cc91d4c39d9d3abcbd16989f875707`, selector `0x5bcecd74`, and
  max value `1000000000000000000`.
- `GET /v1/orgs/4/managed-execution`: returned executor
  `0x0b306bf915c4d645ff596e518faf3f9669b97016`.
- `GET /v1/orgs/4/proposals/7`: returned executed managed proposal data with
  canonical execution receipt transaction
  `0xc7ae1a04e359cb9667ffa5b0ed763f291e3a4113616ab4b111e639e9db34f665`.
- `GET /v1/orgs/4/proposals/7/accountability`: returned completed
  accountability with linked confirmed transaction evidence.
- `GET /v1/orgs/4/archive`: returned one executed proposal with
  `evidenceCount=1` and the derived read-model source disclosure.
- `GET http://localhost:5173`: returned HTTP `200`.

Observed limits and blockers:

- Browser-based App Core visual diagnostics verification was not completed.
  The in-app Browser runtime failed twice before navigation with
  `windows sandbox failed: spawn setup refresh`. App Core was reachable over
  HTTP, and App Core typecheck/test/build passed, but the diagnostics page was
  not visually verified in this run.
- The existing local Control Plane/App Core/Hardhat processes were already
  running before this task. They were used for validation and intentionally
  left running.
- The seeded simple org `2` exposed proposal, decision, and accountability
  read models, but organization/archive endpoints for org `2` returned `404` in
  this reused local state. The managed execution org `4` did validate the
  organization, proposal, execution receipt, archive, and accountability path.

Roadmap decision:

- The local integrated flow is partially validated, not fully validated. Do
  not mark the workspace roadmap local integrated end-to-end checkbox complete
  from this run because App Core visual diagnostics were blocked and the local
  state was reused rather than a clean controlled process set.
