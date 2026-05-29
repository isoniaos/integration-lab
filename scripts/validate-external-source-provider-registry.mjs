#!/usr/bin/env node

import { readFileSync } from "node:fs";

const registryPath = process.argv[2];

if (!registryPath) {
  console.error(
    "Usage: node scripts/validate-external-source-provider-registry.mjs <registry.json>",
  );
  process.exit(2);
}

const errors = [];
let registry;

try {
  registry = JSON.parse(readFileSync(registryPath, "utf8"));
} catch (error) {
  console.error(`Registry is not parseable JSON: ${error.message}`);
  process.exit(1);
}

// Copied from @isonia/types external-source-model-dto.ts because Integration Lab
// has no package tooling. The type package remains the canonical DTO source.
const SOURCE_CATEGORIES = new Set([
  "execution",
  "offchain_governance_signal",
  "governor_governance",
  "governance_platform",
  "dao_framework",
  "organization_runtime",
  "discussion",
  "work_artifact",
  "manual_record",
  "ai_extraction",
]);

const SOURCE_RECORD_TYPES = new Set([
  "transaction",
  "contract_event",
  "proposal",
  "vote",
  "delegation",
  "payment",
  "discussion_thread",
  "message",
  "work_artifact",
  "manual_note",
  "ai_extraction",
]);

const ADAPTER_MATURITY_LABELS = new Set([
  "research",
  "adapter-spec",
  "read-only-lab",
  "read-only-preview",
  "evidence-mapped",
  "write-lab",
  "write-preview",
  "managed-execution",
  "unsupported",
]);

const AUTHORITY_CLAIM_VALUES = new Set([
  "none",
  "context_only",
  "evidence_only",
  "external_authority",
  "modeled_authority",
  "execution_authority",
  "manual_assertion",
]);

const EVIDENCE_CLAIM_KINDS = new Set([
  "transaction_executed",
  "proposal_existed",
  "vote_occurred",
  "delegation_observed",
  "payment_sent",
  "work_artifact_delivered",
  "discussion_occurred",
  "ai_summary_generated",
  "accountability_unresolved",
]);

const EVIDENCE_CONFIDENCE_VALUES = new Set(["unknown", "low", "medium", "high"]);

const FRESHNESS_STATES = new Set([
  "fresh",
  "stale",
  "unknown",
  "not_checked",
  "rate_limited",
  "auth_required",
  "permission_denied",
  "source_unavailable",
  "schema_changed",
  "parse_failed",
  "mismatch",
  "partial",
]);

const VISIBILITY_VALUES = new Set([
  "public",
  "organization_restricted",
  "private",
  "redacted",
  "unknown",
]);

const ACCESS_MODES = new Set([
  "public",
  "credentialed",
  "delegated",
  "manual",
  "export",
  "webhook",
  "read_only",
  "write_capable",
]);

const CAPABILITY_KINDS = new Set([
  "link",
  "import",
  "sync",
  "verify",
  "ai_extract",
  "write",
  "execute",
]);

const CONSERVATIVE_PUBLIC_CLAIM_STATUSES = new Set([
  "no_provider_support_claim",
  "lab_evidence_only",
  "research_only",
]);

const ELEVATED_AUTHORITY_CLAIMS = new Set([
  "external_authority",
  "modeled_authority",
  "execution_authority",
]);

const SUSPICIOUS_CLAIM_PATTERNS = [
  /\bsupported\b/i,
  /\bproduction ready\b/i,
  /\bproduction readiness\b/i,
  /\bpublic beta ready\b/i,
  /\bpublic beta readiness\b/i,
  /\baudit ready\b/i,
  /\baudit readiness\b/i,
  /\blegal ready\b/i,
  /\blegal readiness\b/i,
  /\bSaaS ready\b/i,
  /\bSaaS readiness\b/i,
  /\bprovider complete\b/i,
  /\bprovider-complete\b/i,
  /\bprovider completeness\b/i,
  /\bprovider support\b/i,
  /\bautomatic execution\b/i,
  /\bautomatic external execution\b/i,
  /\bAI governs\b/i,
  /\bIsoniaOS authority\b/i,
];

const ACTIVE_WRITE_POSTURE_RE =
  /\b(?:write enabled|writes enabled|write-capable|write capable|active write|can write|will write|execute enabled|can execute|will execute|automatic execution|automatic external execution)\b/i;

const requiredTopLevelFields = [
  "schemaVersion",
  "status",
  "authorityBoundary",
  "publicClaimStatus",
  "entries",
];

for (const field of requiredTopLevelFields) {
  if (!(field in registry)) {
    errors.push(`Missing top-level field: ${field}`);
  }
}

if (!CONSERVATIVE_PUBLIC_CLAIM_STATUSES.has(registry?.publicClaimStatus)) {
  errors.push("publicClaimStatus must be conservative");
}

if (!Array.isArray(registry?.entries) || registry.entries.length === 0) {
  errors.push("entries must be a non-empty array");
} else {
  validateEntries(registry.entries);
}

validateSuspiciousClaimWording(registry);

if (errors.length > 0) {
  console.error(`Provider registry validation failed for ${registryPath}:`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Provider registry validation passed: ${registryPath}`);

function validateEntries(entries) {
  const entryIds = new Set();
  const requiredEntryFields = [
    "entryId",
    "displayName",
    "providerFamily",
    "sourceCategory",
    "primaryRecordTypes",
    "defaultAuthorityClaim",
    "defaultEvidenceClaims",
    "visibility",
    "accessModes",
    "freshnessAndFailureNotes",
    "adapterMaturity",
    "capabilities",
    "readOnlyWritePosture",
    "knownLimits",
    "nextEvidenceNeeded",
    "publicClaimStatus",
  ];

  entries.forEach((entry, index) => {
    const entryPath = `entries[${index}]`;

    if (!isPlainObject(entry)) {
      errors.push(`${entryPath} must be an object`);
      return;
    }

    for (const field of requiredEntryFields) {
      if (!(field in entry)) {
        errors.push(`${entryPath} missing required field: ${field}`);
      }
    }

    if (!hasText(entry.entryId)) {
      errors.push(`${entryPath}.entryId must be a non-empty string`);
    } else if (entryIds.has(entry.entryId)) {
      errors.push(`${entryPath}.entryId must be unique: ${entry.entryId}`);
    } else {
      entryIds.add(entry.entryId);
    }

    if (!SOURCE_CATEGORIES.has(entry.sourceCategory)) {
      errors.push(`${entryPath}.sourceCategory must use a known source category`);
    }

    validateEnumArray(
      `${entryPath}.primaryRecordTypes`,
      entry.primaryRecordTypes,
      SOURCE_RECORD_TYPES,
    );

    validateAuthorityClaim(`${entryPath}.defaultAuthorityClaim`, entry.defaultAuthorityClaim);
    validateEvidenceClaims(`${entryPath}.defaultEvidenceClaims`, entry.defaultEvidenceClaims);
    validateVisibility(`${entryPath}.visibility`, entry.visibility);
    validateEnumArray(`${entryPath}.accessModes`, entry.accessModes, ACCESS_MODES);

    if (!ADAPTER_MATURITY_LABELS.has(entry.adapterMaturity)) {
      errors.push(`${entryPath}.adapterMaturity must use a known adapter maturity label`);
    }

    validateFreshnessAndFailureNotes(
      `${entryPath}.freshnessAndFailureNotes`,
      entry.freshnessAndFailureNotes,
    );
    validateCapabilities(`${entryPath}.capabilities`, entry.capabilities);

    if (!hasText(entry.readOnlyWritePosture)) {
      errors.push(`${entryPath}.readOnlyWritePosture must be a non-empty string`);
    } else if (ACTIVE_WRITE_POSTURE_RE.test(entry.readOnlyWritePosture)) {
      errors.push(`${entryPath}.readOnlyWritePosture implies active writes or execution`);
    }

    validateNonEmptyTextArray(`${entryPath}.knownLimits`, entry.knownLimits);
    validateNonEmptyTextArray(`${entryPath}.nextEvidenceNeeded`, entry.nextEvidenceNeeded);

    if (!CONSERVATIVE_PUBLIC_CLAIM_STATUSES.has(entry.publicClaimStatus)) {
      errors.push(`${entryPath}.publicClaimStatus must be conservative`);
    }
  });
}

function validateAuthorityClaim(path, authorityClaim) {
  if (!isPlainObject(authorityClaim)) {
    errors.push(`${path} must be an object`);
    return;
  }

  if (!AUTHORITY_CLAIM_VALUES.has(authorityClaim.value)) {
    errors.push(`${path}.value must use a known authority claim value`);
  }

  if (!hasText(authorityClaim.scope)) {
    errors.push(`${path}.scope must be present`);
  }

  if (ELEVATED_AUTHORITY_CLAIMS.has(authorityClaim.value)) {
    if (!hasText(authorityClaim.sourceBoundary)) {
      errors.push(`${path}.sourceBoundary must explain elevated authority scope`);
    }
    if (!hasText(authorityClaim.reason)) {
      errors.push(`${path}.reason must explain elevated authority scope`);
    }
    if (/\b(?:global|unbounded|default)\b/i.test(authorityClaim.scope)) {
      errors.push(`${path}.scope must not be broad or unbounded`);
    }
  }
}

function validateEvidenceClaims(path, evidenceClaims) {
  if (!Array.isArray(evidenceClaims) || evidenceClaims.length === 0) {
    errors.push(`${path} must be a non-empty array`);
    return;
  }

  evidenceClaims.forEach((claim, index) => {
    const claimPath = `${path}[${index}]`;
    if (!isPlainObject(claim)) {
      errors.push(`${claimPath} must be an object`);
      return;
    }

    if (!EVIDENCE_CLAIM_KINDS.has(claim.kind)) {
      errors.push(`${claimPath}.kind must use a known evidence claim kind`);
    }
    if (!EVIDENCE_CONFIDENCE_VALUES.has(claim.confidence)) {
      errors.push(`${claimPath}.confidence must use a known confidence value`);
    }
    if (!hasText(claim.subject)) {
      errors.push(`${claimPath}.subject must be present`);
    }
  });
}

function validateVisibility(path, visibility) {
  if (!isPlainObject(visibility)) {
    errors.push(`${path} must be an object`);
    return;
  }

  for (const field of ["value", "rawVisibility", "summaryVisibility"]) {
    if (field in visibility && !VISIBILITY_VALUES.has(visibility[field])) {
      errors.push(`${path}.${field} must use a known visibility value`);
    }
  }

  if (!VISIBILITY_VALUES.has(visibility.value)) {
    errors.push(`${path}.value must use a known visibility value`);
  }
}

function validateFreshnessAndFailureNotes(path, notes) {
  if (!isPlainObject(notes)) {
    errors.push(`${path} must be an object`);
    return;
  }

  if (!FRESHNESS_STATES.has(notes.defaultState)) {
    errors.push(`${path}.defaultState must use a known freshness state`);
  }

  validateEnumArray(`${path}.failureStates`, notes.failureStates, FRESHNESS_STATES);
  validateNonEmptyTextArray(`${path}.notes`, notes.notes);
}

function validateCapabilities(path, capabilities) {
  if (!Array.isArray(capabilities) || capabilities.length === 0) {
    errors.push(`${path} must be a non-empty array`);
    return;
  }

  capabilities.forEach((capability, index) => {
    const capabilityPath = `${path}[${index}]`;
    if (!isPlainObject(capability)) {
      errors.push(`${capabilityPath} must be an object`);
      return;
    }

    if (!CAPABILITY_KINDS.has(capability.kind)) {
      errors.push(`${capabilityPath}.kind must use a known capability kind`);
    }

    if (typeof capability.enabled !== "boolean") {
      errors.push(`${capabilityPath}.enabled must be a boolean`);
    }

    if (
      ["write", "execute"].includes(capability.kind) &&
      (capability.enabled === true || capability.writeEnabled === true)
    ) {
      errors.push(`${capabilityPath} must not enable write or execute capability`);
    }

    if (capability.writeEnabled === true) {
      errors.push(`${capabilityPath}.writeEnabled must not be true in the registry baseline`);
    }

    if ("recordTypes" in capability) {
      validateEnumArray(`${capabilityPath}.recordTypes`, capability.recordTypes, SOURCE_RECORD_TYPES);
    }
  });
}

function validateEnumArray(path, values, allowedValues) {
  if (!Array.isArray(values) || values.length === 0) {
    errors.push(`${path} must be a non-empty array`);
    return;
  }

  values.forEach((value, index) => {
    if (!allowedValues.has(value)) {
      errors.push(`${path}[${index}] must use a known value`);
    }
  });
}

function validateNonEmptyTextArray(path, values) {
  if (!Array.isArray(values) || values.length === 0) {
    errors.push(`${path} must be a non-empty array`);
    return;
  }

  values.forEach((value, index) => {
    if (!hasText(value)) {
      errors.push(`${path}[${index}] must be a non-empty string`);
    }
  });
}

function validateSuspiciousClaimWording(value) {
  for (const leaf of collectLeaves(value)) {
    if (typeof leaf.value !== "string") {
      continue;
    }

    for (const pattern of SUSPICIOUS_CLAIM_PATTERNS) {
      if (pattern.test(leaf.value)) {
        errors.push(`${formatPath(leaf.path)} contains suspicious public-claim wording`);
      }
    }
  }
}

function collectLeaves(value, path = []) {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectLeaves(item, [...path, index]));
  }

  if (isPlainObject(value)) {
    return Object.entries(value).flatMap(([key, item]) => collectLeaves(item, [...path, key]));
  }

  return [{ path, value }];
}

function formatPath(path) {
  return path
    .map((part) => (typeof part === "number" ? `[${part}]` : part))
    .join(".")
    .replaceAll(".[", "[");
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}
