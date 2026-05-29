# Safe

This directory documents Safe proof workflows for Sepolia scenarios.

Safe transaction records can prove execution or multisig workflow context. They
are not automatically IsoniaOS governance authority unless explicitly modeled by
the protocol or a scoped product integration.

## Current Maturity

Adapter-spec evidence in Integration Lab. This repository does not claim Safe
integration support or Safe authority over IsoniaOS protocol state.

## Fixture Plan

Use `read-only-execution-evidence-fixture-plan.md` for the lab-facing plan for
future Safe transaction-service, explorer/RPC, normalized source/record,
evidence-claim, mismatch, stale, unavailable, and manual link-only fixtures.
The plan is not a product adapter and does not add a Safe API client.

## Evidence Needed Before Integration Claim

- Current Safe Sepolia app or transaction-service URLs for a completed run.
- Fixture-backed normalized source, record, evidence, mismatch, stale, and
  manual link-only cases.
- Source labels that distinguish Safe workflow state from IsoniaOS protocol
  state.
- Product-owned model or adapter that defines any supported Safe field mapping.
- Tests or reviewed run evidence in the owning product repository.
