# Sepolia

This directory contains live Sepolia templates for the integration lab.

Live Sepolia is used to validate behavior under public testnet conditions:
wallets, RPC providers, block explorers, external DAO tools, and public links.

Do not treat a live Sepolia record as an audited production deployment. Do not
import these manifests into core product repositories as runtime configuration.

## Expected Records

- Deployment or selected-contract manifest.
- Managed execution smoke manifest when testing org-scoped execution.
- Environment prerequisites.
- Public explorer links.
- External provider links used as evidence or context.

## Managed Execution Smoke Kit

Use `managed-execution-manifest.example.json` and
`managed-execution-runbook.md` for the v0.8 Sepolia managed execution field
test. The manifest records protocol deployment metadata, Control Plane
capability metadata, permission rules, proposal identity, canonical execution
receipt fields, and source disclosure.

The manifest is lab evidence and QA input only. Core repositories must not
import it as runtime configuration.

## Authority Boundary

Sepolia transactions can prove that a transaction occurred on a public testnet.
They do not by themselves change the IsoniaOS product authority model. Authority
still comes from the protocol state and the documented product semantics.
