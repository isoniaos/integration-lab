# Snapshot Read-Only Offchain Governance Signal Fixture Plan

## Status

Lab-facing fixture plan only.
Not a product adapter.
Not a Snapshot provider support claim.
Not a production, audit, public beta, legal, SaaS, grant, ISO/token launch, or
provider-completeness readiness claim.
No write, vote submission, signing, wallet connection, proposal creation, space
administration, strategy management, or execution path is added here.

This plan aligns Integration Lab fixture work with the private workspace spec at
`private-docs/strategy/snapshot-read-only-offchain-governance-signal-adapter-spec.md`.
The private strategy spec remains the source for authority, visibility,
freshness, mismatch, and adoption gates.

## Fixture Inventory

Snapshot fixture coverage now has a synthetic lab baseline under
`fixtures/read-only-offchain-governance-signal.example.json` and a
dependency-free validator at
`../scripts/validate-snapshot-read-only-offchain-fixtures.mjs`.

No live Snapshot fixture capture, API client, adapter implementation, product
workflow, write path, vote-submission path, signing path, or execution path is
present.

| Fixture | Purpose | Current status |
| --- | --- | --- |
| Snapshot proposal response/page fixture | Capture proposal identity, space, URL, title/body hash or content reference, source-reported state, timing, result view, and discussion refs when safe to commit. | synthetic baseline exists; live capture planned |
| Snapshot votes response fixture | Capture vote identity, voter source identity, choice, choice label, choice payload, voting power, strategy refs, and signature refs when safe to commit. | synthetic baseline exists; live capture planned |
| Snapshot space/settings/strategy fixture | Capture space identity, URL, network context, settings, strategy refs, and strategy payload hash where available. | synthetic baseline exists; live capture planned |
| Optional discussion-link fixture | Capture linked forum/comment/thread URL and visibility boundary without treating it as approval. | synthetic baseline exists; live capture planned |
| Expected normalized `ExternalSourceDto` | Define Snapshot source identity, access, visibility, trust boundary, and freshness state. | synthetic baseline exists |
| Expected normalized `SourceRecordDto` for proposal | Define bounded proposal record shape, authority posture, evidence claims, and provenance. | synthetic baseline exists |
| Expected normalized `SourceRecordDto` for vote | Define bounded vote record shape, authority posture, evidence claims, and provenance. | synthetic baseline exists |
| Expected `EvidenceClaimDto` for proposal existence | Define `proposal_existed` evidence only when the fixture supports it. | synthetic baseline exists |
| Expected `EvidenceClaimDto` for vote occurrence | Define `vote_occurred` evidence only when the fixture supports it. | synthetic baseline exists |
| Mismatch case fixture | Preserve disagreement between page/API/cache, expected normalized fields, strategy context, discussion link, or content hash. | synthetic baseline exists; expanded live mismatch capture planned |
| Stale/source-unavailable case fixture | Exercise stale, unavailable, rate-limited, auth, permission, schema, parse, partial, and unknown states. | synthetic baseline exists |
| Manual link-only case fixture | Represent URL-only Snapshot space, proposal, or discussion evidence without API import or verification. | synthetic baseline exists |

## Placeholder Fixture Field List

Snapshot source identity fields:

- `sourceId`;
- `provider = "snapshot"`;
- `displayName`;
- `spaceId` or `spaceSlug`;
- `spaceUrl`;
- `proposalId`;
- `proposalUrl`;
- `chainId` or network context when reported;
- `votingStrategyRefs`;
- `snapshotBlockOrTimestamp`;
- `discussionRefs`;
- `apiOrGraphqlBoundary`;
- `contentHash` or IPFS/content boundary;
- `trustBoundary`;
- `accessMode`;
- `visibility`;
- `freshness`.

Snapshot record fields:

- `sourceId`;
- `recordId`;
- `spaceId`;
- `spaceUrl`;
- `proposalId`;
- `proposalUrl`;
- `voteId`;
- `voter`;
- `choice`;
- `choiceLabel`;
- `choicePayload`;
- `votingPower`;
- `votingStrategyRefs`;
- `strategyPayloadHash`;
- `quorumOrThresholdAsReported`;
- `resultAsReported`;
- `stateAsReported`;
- `startAt`;
- `endAt`;
- `createdAt`;
- `updatedAt`;
- `snapshotBlock`;
- `snapshotTimestamp`;
- `discussionUrl`;
- `ipfsHash`;
- `contentHash`;
- `author`;
- `signatureRef`;
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

Snapshot evidence must distinguish these surfaces:

- Snapshot space identity and settings;
- Snapshot proposal page;
- Snapshot vote record;
- Snapshot voting strategy and reported scores;
- Snapshot result/state view;
- Snapshot API or GraphQL response if later used;
- IPFS/content hash or payload boundary if later captured;
- linked discussion source;
- manual operator note or link-only record.

These surfaces can disagree, be cached differently, become stale, or disappear.
Snapshot records remain offchain signaling or discussion context unless a future
product-owned model explicitly maps a field.

## Validation Expectations

Future fixture validation should check:

- schema version and fixture type;
- expected `sourceCategory = "offchain_governance_signal"`;
- expected `provider = "snapshot"`;
- expected space id/slug and proposal id when present;
- URL/domain shape for Snapshot and linked discussion refs;
- normalized `ExternalSourceDto` and `SourceRecordDto` required fields;
- `authorityClaim.value = "context_only"` by default;
- evidence claims limited to `proposal_existed`, `vote_occurred`, and
  `discussion_occurred` unless explicitly reviewed;
- no default `modeled_authority`, `execution_authority`, or Snapshot-evidence
  `manual_assertion`;
- no write, vote submission, signing, wallet connection, proposal creation,
  space administration, or execution capability fields;
- stale/error/unknown states are representable;
- strategy-reported voting power and result views remain source-boundary
  context;
- no committed credentials, wallet secrets, private keys, API tokens, customer
  private data, or private interpretation notes.

The current validator covers the synthetic baseline. Live/testnet fixture
capture remains future work and should extend the validator only as concrete
safe-to-commit cases require it.

## Negative And Mismatch Fixtures

Planned negative fixtures:

- Snapshot proposal URL and proposal ID do not match.
- Space ID or slug mismatch.
- Voting strategy differs from expected fixture.
- Vote choice does not match reported choice label.
- Result as reported differs from recomputed fixture expectation.
- Proposal state differs between page, API, or cache.
- Discussion URL points to an unrelated thread.
- Snapshot block or timestamp is missing or inconsistent.
- Voting power cannot be reproduced from captured strategy context.
- Author or voter identity is source-specific and not mapped to an IsoniaOS
  identity.
- Proposal content hash or IPFS/content reference differs from expected payload
  hash.
- Source is stale, unavailable, rate-limited, auth-required, permission-denied,
  schema-changed, parse-failed, partial, or unknown.

Mismatch fixtures should preserve both observed sides and avoid silently
choosing one as truth.

## Current Status

- Private Snapshot read-only offchain governance-signal adapter spec exists in
  `private-docs/strategy/`.
- This Integration Lab fixture plan, synthetic fixture pack, and dependency-free
  validator exist.
- The provider registry classifies the Snapshot entry as `adapter-spec` evidence
  when the spec, fixture plan, synthetic fixtures, and validator are present,
  while keeping write, execute, vote submission, signing, proposal creation, and
  space administration disabled.
- No Snapshot adapter, API client, UI, Control Plane ingestion, SDK API, App
  Core runtime behavior, write path, vote submission path, signing path,
  proposal creation flow, space administration flow, or execution path exists.

## Next Evidence Needed

- Capture safe-to-commit Snapshot proposal/page, vote, and space/settings
  strategy fixtures when later allowed.
- Capture matching page/API/cache and linked discussion fixtures when later
  allowed.
- Review strategy and voting power reproducibility.
- Review identity mapping for voters and authors.
- Align future read-only adapter tests with the synthetic fixture pack.
- Draft source-boundary warning copy for any future read-only UI.

## No-Support Boundary

This fixture plan does not establish Snapshot availability in any product
surface. It does not make public claims, readiness claims, authority claims,
write claims, vote-submission claims, signing claims, execution claims, or
provider-completeness claims. Integration Lab records are evidence and planning
material only.
