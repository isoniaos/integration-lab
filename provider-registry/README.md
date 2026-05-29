# External Source Provider Registry

This directory records a conservative, machine-readable registry for external
source and provider planning in Integration Lab.

The registry is lab evidence and planning material only. It does not add
adapters, product UI, runtime behavior, write paths, execution paths, or public
availability claims for any provider/source family.

## Files

- `external-source-provider-registry.example.json` is the baseline registry.

The registry uses the external source DTO vocabulary from `@isonia/types` for
source categories, source record types, adapter maturity labels, authority
claims, freshness/failure states, visibility values, access modes, and
capability kinds.

Integration Lab has no package manager tooling, so the local validator copies
literal allowlists from the DTO vocabulary. The `@isonia/types` package remains
the canonical type source.

## Validation

Run from the repository root:

```bash
node scripts/validate-external-source-provider-registry.mjs provider-registry/external-source-provider-registry.example.json
```

The validator checks shape, enum vocabulary, conservative public-claim status,
authority boundaries, disabled write/execute capability posture, and suspicious
claim wording in registry text.

## Boundary

Registry entries can describe source categories, record types, evidence posture,
access/visibility concerns, freshness and failure risks, known limits, and next
evidence needed.

Registry entries must not be treated as provider implementation specs by
themselves. Future provider work still needs scoped adapter specs, fixture
evidence, source-boundary copy, and product-owned implementation where relevant.
