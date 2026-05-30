# Snapshot Testnet Space Checklist

Current maturity: unverified field-note checklist. It is suitable for planning
evidence capture, not for claiming Snapshot integration support.

For the fixture inventory and future validation expectations, use
`read-only-offchain-governance-signal-fixture-plan.md`. This checklist remains
for field-note capture planning only.

## Practical Prerequisites

- A wallet controlled by the test operator.
- Snapshot account access.
- Testnet space setup path confirmed for the current Snapshot workflow.
- ENS or testnet naming requirements checked if Snapshot requires them for the
  selected workflow.
- Voting strategy and proposal settings recorded.

## Smoke Workflow

1. Create or select a Snapshot testnet space.
2. Record the space URL and owner or controller address.
3. Create a test proposal, discussion, or signaling record.
4. Link the Snapshot record from the scenario evidence file.
5. Label the source as off-chain context unless a scoped integration says
   otherwise.

## Trust Boundary

Snapshot records are evidence or context for the integration lab. They are not
automatically IsoniaOS governance authority. The source label should make this
clear in every scenario that references Snapshot.

## Managed Execution Smoke Usage

For the managed execution smoke scenario, record Snapshot testnet space,
proposal, or discussion links only as off-chain signaling or discussion
context. Snapshot must not be used as proof that the Isonia proposal was
approved, executed, or authorized unless a future scoped product integration
explicitly models that authority.

## Evidence Needed Before Integration Claim

- Safe-to-commit Snapshot proposal/page, vote, and space/settings strategy
  fixtures from a current testnet run when later allowed.
- Source labels and trust-boundary text preserved in the run evidence.
- Product-owned adapter or client behavior that consumes Snapshot records.
- Documentation stating the exact authority scope, exclusions, and residual
  risks.
