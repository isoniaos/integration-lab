# Safe Read-Only Execution Evidence Fixture Plan

## Status

Lab-facing fixture plan only.
Not a product adapter.
Not a Safe provider support claim.
Not a production, audit, public beta, legal, SaaS, grant, ISO/token launch, or
provider-completeness readiness claim.
No write, signing, approval, module installation, guard installation,
transaction submission, or execution path is added here.

This plan aligns Integration Lab fixture work with the private workspace spec at
`private-docs/strategy/safe-read-only-execution-evidence-adapter-spec.md`. The
private strategy spec remains the source for authority, visibility, freshness,
mismatch, and adoption gates.

## Fixture Inventory

Future Safe fixture coverage should include:

| Fixture | Purpose | Current status |
| --- | --- | --- |
| Safe transaction service response | Capture Safe workflow metadata such as Safe tx hash, nonce, confirmations, status, target, value, operation, and execution link when available. | planned, not captured |
| Block explorer or RPC transaction | Capture chain transaction, receipt/log, block, sender/executor, target, value, calldata hash, and event evidence. | planned, not captured |
| Expected normalized `ExternalSourceDto` | Define Safe execution source identity, access, visibility, trust boundary, and freshness state. | planned, not captured |
| Expected normalized `SourceRecordDto` | Define normalized transaction, contract event, payment, or manual note record. | planned, not captured |
| Expected `EvidenceClaimDto` | Define bounded evidence such as `transaction_executed` or `payment_sent`. | planned, not captured |
| Mismatch case | Preserve disagreement between Safe service, Safe app, explorer/RPC, and expected normalized fields. | planned, not captured |
| Stale/source-unavailable case | Exercise stale, unavailable, rate-limited, auth, permission, schema, parse, partial, and unknown states. | planned, not captured |
| Manual link-only case | Represent URL/hash-only lab evidence without API import or verification. | planned, not captured |

No JSON fixture is added in this task, so no new validator is added. Future
JSON fixture work should stay dependency-free unless a scoped task justifies
tooling.

## Placeholder Fixture Field List

Safe source identity fields:

- `sourceId`;
- `provider = "safe"`;
- `displayName`;
- `chainId`;
- `safeAddress`;
- Safe service/API boundary reference;
- Safe app/UI boundary reference;
- block explorer or RPC boundary reference;
- `trustBoundary`;
- `accessMode`;
- `visibility`;
- `freshness`.

Safe record fields:

- `sourceId`;
- `recordId`;
- `chainId`;
- `safeAddress`;
- `safeTxHash`;
- `txHash`;
- `nonce`;
- `operation`;
- `to`;
- `value`;
- `dataHash`;
- `actionSelector`;
- `executor`;
- `module`;
- `guard`;
- `threshold`;
- `owners`;
- `confirmations`;
- `status`;
- `blockNumber`;
- `blockTimestamp`;
- `observedAt`;
- `fetchedAt`;
- `payloadHash`;
- `canonicalUrl`;
- `rawRef`;
- `authorityClaim`;
- `evidenceClaims`;
- `freshness`;
- `visibility`.

These are candidate fields, not a requirement that every record contains every
field. Required, optional, and provider-dependent fields should follow the
private strategy spec.

## Source Boundary Notes

Safe evidence must distinguish these surfaces:

- Safe account state;
- Safe transaction service response;
- Safe app view;
- RPC transaction or receipt result;
- block explorer transaction/log page;
- manual operator note or link-only record.

These surfaces can disagree or become stale. Safe records remain external
execution evidence unless a future product-owned model explicitly maps a field.

## Validation Expectations

Future fixture validation should check:

- schema version and fixture type;
- expected `chainId`;
- expected `safeAddress`;
- Safe transaction hash and chain transaction hash shape when present;
- normalized `ExternalSourceDto` and `SourceRecordDto` required fields;
- `authorityClaim.value = "evidence_only"` by default;
- evidence claims limited to `transaction_executed` and bounded
  `payment_sent` unless explicitly reviewed;
- no `modeled_authority`, `execution_authority`, or Safe-evidence
  `manual_assertion` defaults;
- stale/error/unknown states are representable;
- raw provider labels are not used as authority;
- no committed credentials, secrets, private keys, RPC secrets, or customer
  private data.

Validation should reject write or execution capability fields in Safe fixture
records unless a separate future gated task explicitly changes scope.

## Negative And Mismatch Fixtures

Planned negative fixtures:

- Safe service reports executed but chain transaction is missing.
- Chain transaction exists but Safe service does not show it.
- Safe transaction hash and transaction hash do not map as expected.
- Chain ID mismatch.
- Safe address mismatch.
- Target, value, action selector, or data hash mismatch.
- Block explorer decoded view differs from raw transaction data.
- Module, guard, or threshold meaning cannot be determined.
- Signer or owner list is stale or source-dependent.
- Source is stale, unavailable, rate-limited, auth-required, permission-denied,
  schema-changed, parse-failed, partial, or unknown.

Mismatch fixtures should preserve both observed sides and avoid silently
choosing one as truth.

## Current Status

- Private Safe read-only execution/evidence adapter spec exists in
  `private-docs/strategy/`.
- This Integration Lab fixture plan exists.
- The provider registry can classify the Safe entry as `adapter-spec` evidence
  once the registry is updated and validated.
- No Safe adapter, API client, UI, Control Plane ingestion, SDK API, App Core
  runtime behavior, write path, execution path, signing path, module
  installation, or guard installation exists.

## Next Evidence Needed

- Capture a safe-to-commit Safe transaction service response fixture.
- Capture a block explorer or RPC transaction/receipt fixture for the same
  transaction.
- Add expected normalized `ExternalSourceDto`, `SourceRecordDto`, and
  `EvidenceClaimDto` fixtures.
- Add mismatch fixtures for Safe service versus chain disagreement.
- Add stale/source-unavailable and manual link-only fixtures.
- Add a small dependency-free validator only after concrete JSON fixtures
  exist.
- Review Safe module, guard, threshold, owner, and confirmation semantics before
  any verification wording is stronger than evidence/context.

## No-Support Boundary

This fixture plan does not establish Safe availability in any product surface.
It does not make public claims, readiness claims, authority claims, write
claims, execution claims, or provider-completeness claims. Integration Lab
records are evidence and planning material only.
