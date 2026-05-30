#!/usr/bin/env node

import { readFileSync } from "node:fs";

const fixturePath = process.argv[2];

if (!fixturePath) {
  console.error(
    "Usage: node scripts/validate-snapshot-read-only-offchain-fixtures.mjs <fixtures.json>",
  );
  process.exit(2);
}

const errors = [];
let fixturePack;

try {
  fixturePack = JSON.parse(readFileSync(fixturePath, "utf8"));
} catch (error) {
  console.error(`Snapshot fixture pack is not parseable JSON: ${error.message}`);
  process.exit(1);
}

// Copied from @isonia/types external-source-model-dto.ts because Integration Lab
// has no package tooling. The type package remains the canonical DTO source.
const SOURCE_CATEGORIES = new Set(["offchain_governance_signal"]);

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

const NON_CURRENT_FRESHNESS_STATES = new Set([
  "stale",
  "unknown",
  "not_checked",
  "rate_limited",
  "auth_required",
  "permission_denied",
  "source_unavailable",
  "schema_changed",
  "parse_failed",
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

const CASE_KINDS = new Set([
  "proposal_existence",
  "vote_occurrence",
  "discussion_context",
  "page_api_cache_mismatch",
  "strategy_voting_power_mismatch",
  "stale_or_unavailable",
  "manual_link_only",
]);

const REQUIRED_CASE_KINDS = new Set(CASE_KINDS);

const EXPECTED_VALIDATION_STATUSES = new Set([
  "valid_positive_fixture",
  "valid_negative_mismatch_fixture",
  "valid_partial_strategy_fixture",
  "valid_stale_fixture",
  "valid_manual_link_fixture",
]);

const BLOCKED_AUTHORITY_CLAIMS = new Set([
  "modeled_authority",
  "execution_authority",
  "manual_assertion",
]);

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const BYTES32_RE = /^0x[a-fA-F0-9]{64}$/;
const SNAPSHOT_ID_RE = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{2,127}$/;
const ISO_TIMESTAMP_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

const SECRET_KEY_RE =
  /(?:privatekey|mnemonic|seedphrase|apikey|accesstoken|bearertoken|refreshtoken|walletsecret|password|secret)$/i;
const SECRET_TEXT_RE =
  /\b(?:private key|mnemonic|seed phrase|api key|access token|bearer token|refresh token|wallet secret)\b/i;
const SECRET_BEARING_URL_RE =
  /^https?:\/\/(?:[^/@\s]+:[^/@\s]+@|[^\s?]+[?&](?:api[_-]?key|access[_-]?token|token|secret|key)=)/i;

const ACTIVE_WRITE_POSTURE_RE =
  /\b(?:write enabled|writes enabled|write-capable|write capable|active write|can write|will write|execute enabled|can execute|will execute|sign enabled|signing enabled|submit vote enabled|vote submission enabled|proposal creation enabled|space administration enabled|wallet connection enabled|strategy management enabled)\b/i;

const FORBIDDEN_CAPABILITY_KEYS = new Set([
  "write",
  "execute",
  "sign",
  "submitvote",
  "votesubmission",
  "proposalcreation",
  "spaceadministration",
  "walletconnection",
  "strategymanagement",
]);

const SUSPICIOUS_CLAIM_PATTERNS = [
  /\bsupported\b/i,
  /\bprovider support\b/i,
  /\bprovider complete\b/i,
  /\bprovider-complete\b/i,
  /\bproduction ready\b/i,
  /\bproduction readiness\b/i,
  /\baudit ready\b/i,
  /\baudit readiness\b/i,
  /\bpublic beta ready\b/i,
  /\bpublic beta readiness\b/i,
  /\blegal ready\b/i,
  /\blegal readiness\b/i,
  /\bSaaS ready\b/i,
  /\bSaaS readiness\b/i,
  /\bautomatic execution\b/i,
  /\bautomatic external execution\b/i,
  /\bIsoniaOS authority\b/i,
  /\bSnapshot approval\b/i,
  /\bapproved by IsoniaOS\b/i,
  /\bexecution authorized\b/i,
];

const CONSERVATIVE_DISCLAIMER_RE =
  /\b(?:no|not|without|unsupported|does not|do not|must not|cannot|never|no_provider_support_claim)\b/i;

validateTopLevel(fixturePack);

if (Array.isArray(fixturePack?.cases)) {
  validateCases(fixturePack.cases);
}

validateLeaves(fixturePack);
validateClaimWording(fixturePack);
validateForbiddenCapabilities(fixturePack);

if (errors.length > 0) {
  console.error(`Snapshot fixture validation failed for ${fixturePath}:`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Snapshot fixture validation passed: ${fixturePath}`);

function validateTopLevel(pack) {
  const requiredTopLevelFields = [
    "schemaVersion",
    "status",
    "providerFamily",
    "sourceCategory",
    "fixtureBoundary",
    "publicClaimStatus",
    "cases",
  ];

  if (!isPlainObject(pack)) {
    errors.push("fixture pack must be an object");
    return;
  }

  for (const field of requiredTopLevelFields) {
    if (!(field in pack)) {
      errors.push(`Missing top-level field: ${field}`);
    }
  }

  if (pack.providerFamily !== "snapshot") {
    errors.push('providerFamily must be "snapshot"');
  }

  if (!SOURCE_CATEGORIES.has(pack.sourceCategory)) {
    errors.push('sourceCategory must be "offchain_governance_signal"');
  }

  if (pack.publicClaimStatus !== "no_provider_support_claim") {
    errors.push('publicClaimStatus must be "no_provider_support_claim"');
  }

  if (!Array.isArray(pack.cases) || pack.cases.length === 0) {
    errors.push("cases must be a non-empty array");
  }
}

function validateCases(cases) {
  const caseIds = new Set();
  const presentCaseKinds = new Set();
  const requiredCaseFields = [
    "caseId",
    "title",
    "purpose",
    "caseKind",
    "sourceCategory",
    "fixtureStatus",
    "providerFamily",
    "readOnlyWritePosture",
    "publicClaimStatus",
    "expectedExternalSource",
    "expectedSourceRecords",
    "expectedEvidenceClaims",
    "expectedValidation",
    "knownLimits",
  ];

  cases.forEach((testCase, index) => {
    const casePath = `cases[${index}]`;

    if (!isPlainObject(testCase)) {
      errors.push(`${casePath} must be an object`);
      return;
    }

    for (const field of requiredCaseFields) {
      if (!(field in testCase)) {
        errors.push(`${casePath} missing required field: ${field}`);
      }
    }

    if (!hasText(testCase.caseId)) {
      errors.push(`${casePath}.caseId must be a non-empty string`);
    } else if (caseIds.has(testCase.caseId)) {
      errors.push(`${casePath}.caseId must be unique: ${testCase.caseId}`);
    } else {
      caseIds.add(testCase.caseId);
    }

    if (!CASE_KINDS.has(testCase.caseKind)) {
      errors.push(`${casePath}.caseKind must be known`);
    } else {
      presentCaseKinds.add(testCase.caseKind);
    }

    if (testCase.providerFamily !== "snapshot") {
      errors.push(`${casePath}.providerFamily must be "snapshot"`);
    }

    if (testCase.sourceCategory !== "offchain_governance_signal") {
      errors.push(`${casePath}.sourceCategory must be "offchain_governance_signal"`);
    }

    if (testCase.publicClaimStatus !== "no_provider_support_claim") {
      errors.push(`${casePath}.publicClaimStatus must be "no_provider_support_claim"`);
    }

    validateReadOnlyPosture(`${casePath}.readOnlyWritePosture`, testCase.readOnlyWritePosture);
    validateExternalSource(`${casePath}.expectedExternalSource`, testCase.expectedExternalSource);
    validateSourceRecords(`${casePath}.expectedSourceRecords`, testCase.expectedSourceRecords);
    validateEvidenceClaims(`${casePath}.expectedEvidenceClaims`, testCase.expectedEvidenceClaims, {
      allowEmpty: true,
    });
    validateExpectedValidation(`${casePath}.expectedValidation`, testCase.expectedValidation);
    validateNonEmptyTextArray(`${casePath}.knownLimits`, testCase.knownLimits);
    validateCaseSpecificRules(casePath, testCase);
  });

  for (const requiredKind of REQUIRED_CASE_KINDS) {
    if (!presentCaseKinds.has(requiredKind)) {
      errors.push(`cases must include a ${requiredKind} fixture`);
    }
  }
}

function validateExternalSource(path, source) {
  if (!isPlainObject(source)) {
    errors.push(`${path} must be an object`);
    return;
  }

  if (!hasText(source.sourceId)) {
    errors.push(`${path}.sourceId must be present`);
  }
  if (source.provider !== "snapshot") {
    errors.push(`${path}.provider must be "snapshot"`);
  }
  if (source.category !== "offchain_governance_signal") {
    errors.push(`${path}.category must be "offchain_governance_signal"`);
  }
  if (!ACCESS_MODES.has(source.accessMode)) {
    errors.push(`${path}.accessMode must use a known access mode`);
  }
  validateVisibility(`${path}.visibility`, source.visibility);
  validateFreshness(`${path}.freshness`, source.freshness);
  validateTrustBoundary(`${path}.trustBoundary`, source.trustBoundary);
}

function validateTrustBoundary(path, trustBoundary) {
  if (!isPlainObject(trustBoundary)) {
    errors.push(`${path} must be an object`);
    return;
  }

  for (const field of ["boundaryId", "sourceId", "authorityScope"]) {
    if (!hasText(trustBoundary[field])) {
      errors.push(`${path}.${field} must be present`);
    }
  }

  if (trustBoundary.reviewRequired !== true) {
    errors.push(`${path}.reviewRequired must be true`);
  }
}

function validateSourceRecords(path, records) {
  if (!Array.isArray(records) || records.length === 0) {
    errors.push(`${path} must be a non-empty array`);
    return;
  }

  records.forEach((record, index) => {
    const recordPath = `${path}[${index}]`;

    if (!isPlainObject(record)) {
      errors.push(`${recordPath} must be an object`);
      return;
    }

    for (const field of [
      "sourceId",
      "recordId",
      "type",
      "authorityClaim",
      "evidenceClaims",
      "freshness",
      "visibility",
    ]) {
      if (!(field in record)) {
        errors.push(`${recordPath} missing required field: ${field}`);
      }
    }

    if (!SOURCE_RECORD_TYPES.has(record.type)) {
      errors.push(`${recordPath}.type must use a known source record type`);
    }

    validateAuthorityClaim(`${recordPath}.authorityClaim`, record.authorityClaim);
    validateEvidenceClaims(`${recordPath}.evidenceClaims`, record.evidenceClaims, {
      allowEmpty: true,
    });
    validateFreshness(`${recordPath}.freshness`, record.freshness);
    validateVisibility(`${recordPath}.visibility`, record.visibility);
  });
}

function validateAuthorityClaim(path, authorityClaim) {
  if (!isPlainObject(authorityClaim)) {
    errors.push(`${path} must be an object`);
    return;
  }

  if (!AUTHORITY_CLAIM_VALUES.has(authorityClaim.value)) {
    errors.push(`${path}.value must use a known authority claim value`);
    return;
  }

  if (BLOCKED_AUTHORITY_CLAIMS.has(authorityClaim.value)) {
    errors.push(`${path}.value must not be ${authorityClaim.value} for Snapshot fixtures`);
  }

  if (authorityClaim.value === "external_authority") {
    if (!hasText(authorityClaim.sourceBoundary)) {
      errors.push(`${path}.sourceBoundary must explain external authority scope`);
    }
    if (!hasText(authorityClaim.reason)) {
      errors.push(`${path}.reason must explain external authority scope`);
    }
  }

  if (!hasText(authorityClaim.scope)) {
    errors.push(`${path}.scope must be present`);
  }
}

function validateEvidenceClaims(path, evidenceClaims, options = {}) {
  if (!Array.isArray(evidenceClaims)) {
    errors.push(`${path} must be an array`);
    return;
  }

  if (evidenceClaims.length === 0 && options.allowEmpty !== true) {
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
    if (!hasText(claim.sourceRecordId)) {
      errors.push(`${claimPath}.sourceRecordId must be present`);
    }
  });
}

function validateFreshness(path, freshness) {
  if (!isPlainObject(freshness)) {
    errors.push(`${path} must be an object`);
    return;
  }

  if (!FRESHNESS_STATES.has(freshness.state)) {
    errors.push(`${path}.state must use a known freshness state`);
  }
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
}

function validateExpectedValidation(path, expectedValidation) {
  if (!isPlainObject(expectedValidation)) {
    errors.push(`${path} must be an object`);
    return;
  }

  if (!EXPECTED_VALIDATION_STATUSES.has(expectedValidation.status)) {
    errors.push(`${path}.status must use a known fixture validation status`);
  }
}

function validateCaseSpecificRules(casePath, testCase) {
  if (testCase.caseKind === "proposal_existence") {
    if (!caseHasEvidenceKind(testCase, "proposal_existed")) {
      errors.push(`${casePath} proposal existence case must include proposal_existed`);
    }
    if (!caseHasRecordType(testCase, "proposal")) {
      errors.push(`${casePath} proposal existence case must include a proposal source record`);
    }
  }

  if (testCase.caseKind === "vote_occurrence") {
    if (!caseHasEvidenceKind(testCase, "vote_occurred")) {
      errors.push(`${casePath} vote occurrence case must include vote_occurred`);
    }
    if (hasApprovalOrExecutionClaim(testCase)) {
      errors.push(`${casePath} vote occurrence case must not claim approval, execution, or accepted governance intent`);
    }
  }

  if (testCase.caseKind === "discussion_context") {
    const hasDiscussionClaim = caseHasEvidenceKind(testCase, "discussion_occurred");
    const hasContextOnlyRecord = collectAuthorityClaims(testCase).some(
      (authorityClaim) => authorityClaim.value === "context_only",
    );
    if (!hasDiscussionClaim && !hasContextOnlyRecord) {
      errors.push(`${casePath} discussion case must include discussion_occurred or explicit context-only posture`);
    }
    if (hasApprovalOrExecutionClaim(testCase)) {
      errors.push(`${casePath} discussion case must not claim approval, vote, execution, or authority`);
    }
  }

  if (testCase.caseKind === "page_api_cache_mismatch") {
    validateMismatchCase(casePath, testCase);
  }

  if (testCase.caseKind === "strategy_voting_power_mismatch") {
    const hasStrategyRefs = collectObjects(testCase).some(
      (leaf) =>
        Array.isArray(leaf.value.votingStrategyRefs) && leaf.value.votingStrategyRefs.length > 0,
    );
    const hasVotingPower = collectLeaves(testCase).some(
      (leaf) => ["votingpower", "votingpowerasreported"].includes(normalizeKey(leaf.path[leaf.path.length - 1])) && isNumericValue(leaf.value),
    );
    const hasStrategyHash = collectLeaves(testCase).some(
      (leaf) => ["strategypayloadhash", "strategycontexthash"].includes(normalizeKey(leaf.path[leaf.path.length - 1])) && isBytes32(leaf.value),
    );
    const hasReproducibilityStatus = caseHasTextKey(testCase, "reproducibilityStatus");
    const hasPartialOrMismatch = collectFreshnessObjects(testCase).some((freshness) =>
      ["partial", "mismatch"].includes(freshness.state),
    );

    if (!hasStrategyRefs) {
      errors.push(`${casePath} strategy/voting-power case must include votingStrategyRefs`);
    }
    if (!hasVotingPower) {
      errors.push(`${casePath} strategy/voting-power case must include votingPowerAsReported or votingPower`);
    }
    if (!hasStrategyHash) {
      errors.push(`${casePath} strategy/voting-power case must include strategyPayloadHash or strategyContextHash`);
    }
    if (!hasReproducibilityStatus) {
      errors.push(`${casePath} strategy/voting-power case must include reproducibilityStatus`);
    }
    if (!hasPartialOrMismatch) {
      errors.push(`${casePath} strategy/voting-power case must declare partial or mismatch freshness`);
    }
    if (!caseHasFreshnessReason(testCase) && !caseHasTextKey(testCase, "reason")) {
      errors.push(`${casePath} strategy/voting-power case must include a reason`);
    }
    if (collectAuthorityClaims(testCase).some((authorityClaim) => authorityClaim.value === "external_authority")) {
      errors.push(`${casePath} strategy/voting-power case must not elevate voting power to external_authority`);
    }
  }

  if (testCase.caseKind === "stale_or_unavailable") {
    const nonCurrentFreshness = collectFreshnessObjects(testCase).filter((freshness) =>
      NON_CURRENT_FRESHNESS_STATES.has(freshness.state),
    );
    if (nonCurrentFreshness.length === 0) {
      errors.push(`${casePath} stale/unavailable case must include a non-current freshness state`);
    }
    if (!nonCurrentFreshness.some((freshness) => hasText(freshness.reason))) {
      errors.push(`${casePath} stale/unavailable case must include a freshness reason`);
    }
  }

  if (testCase.caseKind === "manual_link_only") {
    if (testCase?.expectedExternalSource?.accessMode !== "manual") {
      errors.push(`${casePath} manual link-only case must use manual accessMode`);
    }
    if (Array.isArray(testCase.expectedEvidenceClaims) && testCase.expectedEvidenceClaims.length > 0) {
      errors.push(`${casePath} manual link-only case must not include evidence claims`);
    }
    for (const leaf of collectLeaves(testCase)) {
      const normalizedKey = normalizeKey(leaf.path[leaf.path.length - 1]);
      if (
        [
          "imported",
          "synced",
          "verified",
          "votesubmitted",
          "signed",
          "isimported",
          "issynced",
          "isverified",
        ].includes(normalizedKey) &&
        leaf.value === true
      ) {
        errors.push(`${formatPath(leaf.path)} must not be true for manual link-only evidence`);
      }
      if (
        ["recordstatus", "status", "fixturestatus"].includes(normalizedKey) &&
        typeof leaf.value === "string" &&
        /^(?:imported|synced|verified|vote_submitted|signed)$/i.test(leaf.value)
      ) {
        errors.push(`${formatPath(leaf.path)} must not claim imported, synced, verified, vote-submitted, or signed posture`);
      }
    }
  }
}

function validateMismatchCase(casePath, testCase) {
  const mismatchLeaves = collectLeaves(testCase).filter(
    (leaf) => leaf.path[leaf.path.length - 1] === "state" && leaf.value === "mismatch",
  );
  if (mismatchLeaves.length === 0) {
    errors.push(`${casePath} mismatch case must declare freshness.state = "mismatch"`);
  }
  if (!caseHasTextKey(testCase, "mismatchReason") && !caseHasFreshnessReason(testCase)) {
    errors.push(`${casePath} mismatch case must include a mismatch reason`);
  }
}

function validateReadOnlyPosture(path, value) {
  if (!hasText(value)) {
    errors.push(`${path} must be a non-empty string`);
    return;
  }

  if (ACTIVE_WRITE_POSTURE_RE.test(value)) {
    errors.push(`${path} implies active writes, voting, signing, administration, or execution`);
  }
}

function validateLeaves(value) {
  for (const leaf of collectLeaves(value)) {
    const normalizedKey = normalizeKey(leaf.path[leaf.path.length - 1]);
    const displayPath = formatPath(leaf.path);

    if (SECRET_KEY_RE.test(normalizedKey)) {
      errors.push(`${displayPath} looks like a secret or credential key and must not be committed`);
    }

    if (typeof leaf.value === "string") {
      if (SECRET_TEXT_RE.test(leaf.value)) {
        errors.push(`${displayPath} contains suspicious secret or credential text`);
      }
      if (SECRET_BEARING_URL_RE.test(leaf.value)) {
        errors.push(`${displayPath} contains a secret-bearing URL`);
      }
      if (
        ["rpcurl", "rpcendpoint"].includes(normalizedKey) &&
        SECRET_BEARING_URL_RE.test(leaf.value)
      ) {
        errors.push(`${displayPath} contains a secret-bearing RPC URL`);
      }
    }

    if (isAddressKey(normalizedKey) && !isEmpty(leaf.value) && !ADDRESS_RE.test(leaf.value)) {
      errors.push(`${displayPath} must be an address-shaped string`);
    }

    if (isHashKey(normalizedKey) && !isEmpty(leaf.value) && !BYTES32_RE.test(leaf.value)) {
      errors.push(`${displayPath} must be a bytes32-shaped hash`);
    }

    if (isSnapshotIdKey(normalizedKey) && !isEmpty(leaf.value) && !isSnapshotId(leaf.value)) {
      errors.push(`${displayPath} must be a Snapshot ID-shaped string`);
    }

    if (isUrlKey(normalizedKey) && !isEmpty(leaf.value) && !isValidUrl(leaf.value)) {
      errors.push(`${displayPath} must be an http(s) URL`);
    }

    if (isTimestampKey(normalizedKey) && !isEmpty(leaf.value) && !isTimestampValue(leaf.value)) {
      errors.push(`${displayPath} must be an ISO timestamp string or non-negative timestamp number`);
    }

    if (isVotingPowerKey(normalizedKey) && !isEmpty(leaf.value) && !isNumericValue(leaf.value)) {
      errors.push(`${displayPath} must be a numeric voting-power value`);
    }
  }
}

function validateClaimWording(value) {
  for (const leaf of collectLeaves(value)) {
    if (typeof leaf.value !== "string") {
      continue;
    }

    for (const pattern of SUSPICIOUS_CLAIM_PATTERNS) {
      if (pattern.test(leaf.value) && !CONSERVATIVE_DISCLAIMER_RE.test(leaf.value)) {
        errors.push(`${formatPath(leaf.path)} contains misleading support, readiness, or authority wording`);
      }
    }
  }
}

function validateForbiddenCapabilities(value) {
  for (const leaf of collectLeaves(value)) {
    const normalizedKey = normalizeKey(leaf.path[leaf.path.length - 1]);
    const displayPath = formatPath(leaf.path);

    if (normalizedKey === "writeenabled" && leaf.value === true) {
      errors.push(`${displayPath} must not enable writes`);
    }

    if (FORBIDDEN_CAPABILITY_KEYS.has(normalizedKey) && leaf.value === true) {
      errors.push(`${displayPath} must not enable ${normalizedKey}`);
    }
  }

  for (const objectLeaf of collectObjects(value)) {
    const object = objectLeaf.value;
    if (!hasText(object.kind)) {
      continue;
    }

    const kind = normalizeKey(object.kind);
    if (FORBIDDEN_CAPABILITY_KEYS.has(kind) && object.enabled === true) {
      errors.push(`${formatPath(objectLeaf.path)} must not enable ${object.kind} capability`);
    }
  }
}

function caseHasEvidenceKind(testCase, kind) {
  return collectLeaves(testCase).some(
    (leaf) => leaf.path[leaf.path.length - 1] === "kind" && leaf.value === kind,
  );
}

function caseHasRecordType(testCase, type) {
  return collectLeaves(testCase).some(
    (leaf) => leaf.path[leaf.path.length - 1] === "type" && leaf.value === type,
  );
}

function caseHasTextKey(testCase, key) {
  return collectLeaves(testCase).some(
    (leaf) => leaf.path[leaf.path.length - 1] === key && hasText(leaf.value),
  );
}

function caseHasFreshnessReason(testCase) {
  return collectFreshnessObjects(testCase).some((freshness) => hasText(freshness.reason));
}

function collectFreshnessObjects(value) {
  return collectObjects(value)
    .map((leaf) => leaf.value)
    .filter((object) => FRESHNESS_STATES.has(object.state));
}

function collectAuthorityClaims(value) {
  return collectObjects(value)
    .map((leaf) => leaf.value)
    .filter((object) => AUTHORITY_CLAIM_VALUES.has(object.value));
}

function hasApprovalOrExecutionClaim(testCase) {
  return collectLeaves(testCase).some((leaf) => {
    if (typeof leaf.value !== "string") {
      return false;
    }
    if (CONSERVATIVE_DISCLAIMER_RE.test(leaf.value)) {
      return false;
    }
    return /\b(?:proves?|establishes?|confirms?|authorizes?|accepts?|accepted|decides?)\s+(?:approval|execution|execution authorization|governance intent|policy compliance|authority)\b/i.test(
      leaf.value,
    );
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

function collectLeaves(value, path = []) {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectLeaves(item, [...path, index]));
  }

  if (isPlainObject(value)) {
    return Object.entries(value).flatMap(([key, item]) => collectLeaves(item, [...path, key]));
  }

  return [{ path, value }];
}

function collectObjects(value, path = []) {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectObjects(item, [...path, index]));
  }

  if (isPlainObject(value)) {
    return [
      { path, value },
      ...Object.entries(value).flatMap(([key, item]) => collectObjects(item, [...path, key])),
    ];
  }

  return [];
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEmpty(value) {
  return value === null || value === undefined || value === "";
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isAddressKey(normalizedKey) {
  return (
    normalizedKey === "author" ||
    normalizedKey === "voter" ||
    normalizedKey.endsWith("address")
  );
}

function isHashKey(normalizedKey) {
  return (
    normalizedKey === "contenthash" ||
    normalizedKey === "payloadhash" ||
    normalizedKey === "strategypayloadhash" ||
    normalizedKey === "strategycontexthash"
  );
}

function isSnapshotIdKey(normalizedKey) {
  return normalizedKey === "proposalid" || normalizedKey === "voteid";
}

function isUrlKey(normalizedKey) {
  return normalizedKey === "url" || normalizedKey.endsWith("url");
}

function isTimestampKey(normalizedKey) {
  return (
    normalizedKey.endsWith("at") ||
    normalizedKey === "snapshottimestamp" ||
    normalizedKey === "startat" ||
    normalizedKey === "endat"
  );
}

function isVotingPowerKey(normalizedKey) {
  return normalizedKey === "votingpower" || normalizedKey === "votingpowerasreported";
}

function isTimestampValue(value) {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value >= 0;
  }
  return typeof value === "string" && ISO_TIMESTAMP_RE.test(value);
}

function isNumericValue(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0;
  }
  return typeof value === "string" && /^(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/.test(value);
}

function isBytes32(value) {
  return typeof value === "string" && BYTES32_RE.test(value);
}

function isSnapshotId(value) {
  return typeof value === "string" && (BYTES32_RE.test(value) || SNAPSHOT_ID_RE.test(value));
}

function isValidUrl(value) {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function formatPath(path) {
  return path
    .map((part) => (typeof part === "number" ? `[${part}]` : part))
    .join(".")
    .replaceAll(".[", "[");
}
