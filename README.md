# IsoniaOS Integration Lab

Integration Lab is the isolated QA, field-validation, and presentation-evidence repository for IsoniaOS. It records live Sepolia workflows, pinned Sepolia fork replay inputs, provider research, evidence templates, and scenario notes without polluting core product repositories.

Integration Lab is not governance authority, an audited contract package, a runtime dependency source, or proof that any external integration is complete. The public developer overview is in [site/developers/integration-lab.md](https://github.com/isoniaos/docs/blob/main/site/developers/integration-lab.md).

## Installation

There is no package manager or dependency install step in the current baseline.

Node.js is only required for the current manifest validation script:

```bash
node --version
```

## Configuration

Configuration and evidence are stored as repository-local notes and JSON templates:

- `sepolia/` for live Sepolia templates and runbooks.
- `forks/` for pinned Sepolia fork replay notes.
- `evidence/` for external evidence fixture templates.
- `scenarios/` for QA and presentation scenarios.
- `snapshot/`, `safe/`, `tally/`, and `agora/` for provider-specific research notes.
- `inventory.md` for the current lab inventory and stale-reference disposition.

Active protocol evidence uses `IsoCore`, `IsoProposals`, optional `IsoOrgExecutor`, `isoCoreAddress`, `isoProposalsAddress`, `ISONIA_CORE_ADDRESS`, and `ISONIA_PROPOSALS_ADDRESS`. App Core runtime deployment captures are array-based and keyed by `chainId`. Optional local proposal target fields are local/demo evidence only, not protocol core contract fields.

Do not commit RPC secrets, provider API keys, private keys, mnemonics, customer data, or private production manifests. Lab manifests are evidence and QA inputs only; core repositories must not import them as runtime configuration.

## Run / Usage

Validate the managed execution smoke manifest example:

```bash
node scripts/validate-sepolia-managed-execution-manifest.mjs sepolia/managed-execution-manifest.example.json
```

Use the directory READMEs for scenario-specific workflow notes. Use `scenarios/normalized-local-stack-checklist.md` for lab-local evidence capture when validating the normalized local stack; command ownership remains with the owning repositories.

## Troubleshooting

- If manifest validation fails, fix the JSON shape, Sepolia chain ID, address/hash formats, source disclosure, and `authority: false` defaults before using the fixture.
- Keep live Sepolia evidence separate from pinned-fork replay evidence.
- Do not use fork-only transactions as public block explorer or provider proof.
- Do not infer product integration support from Snapshot, Safe, Tally, Agora, GitHub, Discourse, or block explorer notes in this lab.

## Contribution

Read [`AGENTS.md`](AGENTS.md) before editing. Keep provider records clearly labeled as evidence, context, compatibility experiments, or field notes. Do not import lab fixtures, manifests, provider assumptions, helper scripts, or presentation scenarios into core product repositories.

Update the smallest relevant local note and the public docs repository when provider workflow, public setup, operator guidance, or public claims change.

## License

No repository-local license file is currently present.
