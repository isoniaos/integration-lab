# Evidence

This directory contains templates for external resource evidence.

Evidence can support QA, demos, and presentations. It must not silently redefine
IsoniaOS governance authority.

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
