# Evidence

This directory contains templates for external resource evidence.

Evidence can support QA, demos, and presentations. It must not silently redefine
IsoniaOS governance authority.

Use `../provider-registry/` for the machine-readable source/provider planning
baseline. Evidence fixtures remain run-specific records; the registry records
source families, boundaries, maturity labels, known limits, and next evidence
needed before adapter work is scoped.

## Provider Boundaries

Snapshot records are off-chain signaling or discussion context unless explicitly
modeled as authority.

Safe records are transaction workflow or execution proof. They are not
automatically governance authority.

Tally records are Governor compatibility evidence unless a supported product
integration is scoped.

Agora records are research or linking context unless a compatible governance
contract or client integration is scoped.

Block explorer records are transaction proof only. Explorer UI is not
governance authority.

GitHub and Discourse records are discussion, implementation, or decision-making
context. They do not become protocol authority by being linked from a scenario.

## Provider Maturity Labels

Current lab notes are evidence templates or research notes, not integration
support claims:

- Snapshot: unverified field-note checklist; needs current testnet run evidence
  and product-owned mapping before any integration claim.
- Safe: Sepolia transaction-proof checklist; needs product-owned field mapping
  and tests before any integration claim.
- Tally: Governor compatibility research; needs a verified compatible contract
  or adapter model before any integration claim.
- Agora: research and linking lane; needs current compatibility evidence and a
  product-owned model before any integration claim.
- Block explorers: transaction/log visibility evidence only; explorer UI labels
  are not protocol authority.
- GitHub and Discourse: implementation or discussion context only.

## Block Explorer Checklist

Practical prerequisites:

- Sepolia transaction hash.
- Sepolia block explorer base URL.
- Contract or address page when relevant.
- Verification status recorded when contract source display matters.

Boundary:

- A block explorer can prove that a transaction, block, address, or log is
  visible through that explorer.
- Explorer UI labels, decoded views, or comments are not IsoniaOS governance
  authority.

## GitHub and Discourse Checklist

Practical prerequisites:

- Public issue, pull request, commit, release, or discussion URL.
- Discourse topic URL when a forum thread is used.
- Source label explaining whether the record is implementation context,
  governance discussion, release context, or presentation context.

Boundary:

- GitHub and Discourse records are context. They do not override protocol state,
  Control Plane projections, or documented product semantics.

## Evidence Hygiene

- Prefer public URLs where possible.
- Keep credentials and private provider tokens out of the repository.
- Label each source by trust boundary.
- Record whether evidence came from live Sepolia or a pinned fork.
- Do not mix fork-only transaction records with public provider proof.

## Managed Execution Evidence

Use `managed-execution-external-resources.example.json` when capturing the
v0.8 managed execution smoke run. Required internal evidence includes the
proposal identity, permission rule evidence, canonical `ProposalExecuted`
receipt fields, Control Plane read output, and App Core display output.

External resources in that fixture default to `"authority": false`. Change that
only if a future scoped product change explicitly models the external source as
authority and updates the product documentation.
