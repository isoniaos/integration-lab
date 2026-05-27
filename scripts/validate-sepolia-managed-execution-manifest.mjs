#!/usr/bin/env node

import { readFileSync } from "node:fs";

const manifestPath = process.argv[2];

if (!manifestPath) {
  console.error(
    "Usage: node scripts/validate-sepolia-managed-execution-manifest.mjs <manifest.json>",
  );
  process.exit(2);
}

const errors = [];
let manifest;

try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch (error) {
  console.error(`Manifest is not parseable JSON: ${error.message}`);
  process.exit(1);
}

const requiredTopLevelSections = [
  "schemaVersion",
  "scenario",
  "network",
  "protocolDeployment",
  "contracts",
  "organization",
  "controlPlaneRuntime",
  "appCoreRuntime",
  "executionRules",
  "managedTargetScenarios",
  "proposalIdentity",
  "canonicalExecutionReceipt",
  "externalResources",
  "sourceDisclosure",
];

const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const BYTES4_RE = /^0x[a-fA-F0-9]{8}$/;
const BYTES32_RE = /^0x[a-fA-F0-9]{64}$/;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const STALE_ACTIVE_TOKEN_RE =
  /\b(?:GovCore|GovProposals|GovTypes|GovErrors|IGovCore|govCore|govProposals|govCoreAddress|govProposalsAddress|GOV_CORE_ADDRESS|GOV_PROPOSALS_ADDRESS)\b/;

for (const section of requiredTopLevelSections) {
  if (!(section in manifest)) {
    errors.push(`Missing top-level section: ${section}`);
  }
}

if (manifest?.network?.chainId !== 11155111) {
  errors.push("network.chainId must be 11155111 for Sepolia");
}

if (manifest?.network?.name !== "sepolia") {
  errors.push('network.name must be "sepolia"');
}

validateRequiredAddress("contracts.isoCore", manifest?.contracts?.isoCore);
validateRequiredAddress("contracts.isoProposals", manifest?.contracts?.isoProposals);
validateOptionalAddress("contracts.isoOrgExecutor", manifest?.contracts?.isoOrgExecutor);
validateRequiredAddress(
  "controlPlaneRuntime.ISONIA_CORE_ADDRESS",
  manifest?.controlPlaneRuntime?.ISONIA_CORE_ADDRESS,
);
validateRequiredAddress(
  "controlPlaneRuntime.ISONIA_PROPOSALS_ADDRESS",
  manifest?.controlPlaneRuntime?.ISONIA_PROPOSALS_ADDRESS,
);

if (!hasText(manifest?.protocolDeployment?.sourceLabel)) {
  errors.push("protocolDeployment.sourceLabel must be present");
}

if (!hasText(manifest?.protocolDeployment?.provenance)) {
  errors.push("protocolDeployment.provenance must be present");
}

if (!hasText(manifest?.controlPlaneRuntime?.sourceLabel)) {
  errors.push("controlPlaneRuntime.sourceLabel must be present");
}

if (!hasText(manifest?.appCoreRuntime?.sourceLabel)) {
  errors.push("appCoreRuntime.sourceLabel must be present");
}

validateAppCoreRuntime(manifest?.appCoreRuntime, manifest?.network?.chainId);

const valueLimits = manifest?.executionRules?.valueLimits;
if (!isPlainObject(valueLimits)) {
  errors.push("executionRules.valueLimits must be present");
} else {
  for (const field of ["minWei", "maxWei", "perProposalMaxWei"]) {
    if (!isSafeUnsignedValue(valueLimits[field])) {
      errors.push(
        `executionRules.valueLimits.${field} must be a non-negative safe integer or decimal string`,
      );
    }
  }
  if (!hasText(valueLimits.ruleSource)) {
    errors.push("executionRules.valueLimits.ruleSource must be present");
  }
  if (!hasText(valueLimits.trustBoundary)) {
    errors.push("executionRules.valueLimits.trustBoundary must be present");
  }
}

validateRuleEvidenceArray("executionRules.targets", manifest?.executionRules?.targets);
validateRuleEvidenceArray("executionRules.selectors", manifest?.executionRules?.selectors);

if (!isSafeUnsignedValue(manifest?.proposalIdentity?.value)) {
  errors.push("proposalIdentity.value must be a non-negative safe integer or decimal string");
}

if (!isSafeUnsignedValue(manifest?.canonicalExecutionReceipt?.value)) {
  errors.push(
    "canonicalExecutionReceipt.value must be a non-negative safe integer or decimal string",
  );
}

validateExecutionIdentityMatches();

const leafValues = collectLeaves(manifest);
const reportedStalePaths = new Set();
for (const leaf of leafValues) {
  const key = leaf.path[leaf.path.length - 1] ?? "";
  const normalizedKey = normalizeKey(key);
  const displayPath = formatPath(leaf.path);

  for (let index = 0; index < leaf.path.length; index += 1) {
    const pathPart = leaf.path[index];
    if (typeof pathPart !== "string") {
      continue;
    }

    const stalePath = formatPath(leaf.path.slice(0, index + 1));
    if (isStaleActiveFieldName(pathPart) && !reportedStalePaths.has(stalePath)) {
      reportedStalePaths.add(stalePath);
      errors.push(`${stalePath} uses stale Gov*/GOV_* active vocabulary`);
    }
  }

  if (typeof leaf.value === "string" && STALE_ACTIVE_TOKEN_RE.test(leaf.value)) {
    errors.push(`${displayPath} contains stale Gov*/GOV_* active vocabulary`);
  }

  if (isAddressKey(normalizedKey)) {
    if (isOptionalExecutorKey(normalizedKey)) {
      validateOptionalAddress(displayPath, leaf.value);
    } else {
      validateRequiredAddress(displayPath, leaf.value);
    }
  }

  if (normalizedKey === "actionselector") {
    validateBytes4(displayPath, leaf.value);
  }

  if (normalizedKey === "datahash" || normalizedKey === "roleid") {
    validateBytes32(displayPath, leaf.value);
  }

  if (normalizedKey === "txhash" && !isEmpty(leaf.value) && !BYTES32_RE.test(leaf.value)) {
    errors.push(`${displayPath} must be a bytes32-shaped transaction hash when present`);
  }

  if (isSuspiciousSecretKey(normalizedKey)) {
    errors.push(`${displayPath} looks like a secret or provider credential key and must not be committed`);
  }

  if (
    ["authority", "authoritative", "isauthoritative", "externalrecordsauthority"].includes(
      normalizedKey,
    ) &&
    leaf.value === true
  ) {
    errors.push(`${displayPath} must not claim authority by default`);
  }
}

if (manifest?.sourceDisclosure?.externalRecordsAuthority !== false) {
  errors.push("sourceDisclosure.externalRecordsAuthority must be false");
}

if (manifest?.sourceDisclosure?.runtimeConfigurationAuthority !== false) {
  errors.push("sourceDisclosure.runtimeConfigurationAuthority must be false");
}

if (manifest?.sourceDisclosure?.providerCompletenessClaim !== false) {
  errors.push("sourceDisclosure.providerCompletenessClaim must be false");
}

if (manifest?.sourceDisclosure?.manualAccountabilityUpdatesAreProtocolTruth !== false) {
  errors.push("sourceDisclosure.manualAccountabilityUpdatesAreProtocolTruth must be false");
}

if (!Array.isArray(manifest?.externalResources)) {
  errors.push("externalResources must be an array");
} else {
  manifest.externalResources.forEach((resource, index) => {
    if (!hasText(resource?.type)) {
      errors.push(`externalResources[${index}].type must be present`);
    }
    if (!hasText(resource?.label)) {
      errors.push(`externalResources[${index}].label must be present`);
    }
    if (resource?.authority !== false) {
      errors.push(`externalResources[${index}].authority must be false by default`);
    }
    if (!hasText(resource?.trustBoundary)) {
      errors.push(`externalResources[${index}].trustBoundary must be present`);
    }
  });
}

if (errors.length > 0) {
  console.error(`Manifest validation failed for ${manifestPath}:`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Manifest validation passed: ${manifestPath}`);

function validateRequiredAddress(path, value) {
  if (typeof value !== "string" || !ADDRESS_RE.test(value)) {
    errors.push(`${path} must be an address-shaped string`);
  }
}

function validateOptionalAddress(path, value) {
  if (isEmpty(value) || value === ZERO_ADDRESS) {
    return;
  }

  validateRequiredAddress(path, value);
}

function validateBytes4(path, value) {
  if (typeof value !== "string" || !BYTES4_RE.test(value)) {
    errors.push(`${path} must be a bytes4-shaped string`);
  }
}

function validateBytes32(path, value) {
  if (typeof value !== "string" || !BYTES32_RE.test(value)) {
    errors.push(`${path} must be a bytes32-shaped string`);
  }
}

function validateAppCoreRuntime(appCoreRuntime, expectedChainId) {
  if (!isPlainObject(appCoreRuntime)) {
    errors.push("appCoreRuntime must be present");
    return;
  }

  if (appCoreRuntime.activeChainId !== expectedChainId) {
    errors.push("appCoreRuntime.activeChainId must match network.chainId");
  }

  if (!Array.isArray(appCoreRuntime.deployments) || appCoreRuntime.deployments.length === 0) {
    errors.push("appCoreRuntime.deployments must be a non-empty array");
    return;
  }

  for (const [index, deployment] of appCoreRuntime.deployments.entries()) {
    if (!isPlainObject(deployment)) {
      errors.push(`appCoreRuntime.deployments[${index}] must be an object`);
      continue;
    }

    if (deployment.chainId !== expectedChainId) {
      errors.push(`appCoreRuntime.deployments[${index}].chainId must match network.chainId`);
    }

    validateRequiredAddress(
      `appCoreRuntime.deployments[${index}].isoCoreAddress`,
      deployment.isoCoreAddress,
    );
    validateRequiredAddress(
      `appCoreRuntime.deployments[${index}].isoProposalsAddress`,
      deployment.isoProposalsAddress,
    );

    if (
      isAddress(manifest?.contracts?.isoCore) &&
      isAddress(deployment.isoCoreAddress) &&
      deployment.isoCoreAddress.toLowerCase() !== manifest.contracts.isoCore.toLowerCase()
    ) {
      errors.push(
        `appCoreRuntime.deployments[${index}].isoCoreAddress must match contracts.isoCore`,
      );
    }

    if (
      isAddress(manifest?.contracts?.isoProposals) &&
      isAddress(deployment.isoProposalsAddress) &&
      deployment.isoProposalsAddress.toLowerCase() !== manifest.contracts.isoProposals.toLowerCase()
    ) {
      errors.push(
        `appCoreRuntime.deployments[${index}].isoProposalsAddress must match contracts.isoProposals`,
      );
    }
  }
}

function validateRuleEvidenceArray(path, rules) {
  if (!Array.isArray(rules) || rules.length === 0) {
    errors.push(`${path} must be a non-empty array`);
    return;
  }

  rules.forEach((rule, index) => {
    if (!hasText(rule?.ruleSource)) {
      errors.push(`${path}[${index}].ruleSource must be present`);
    }
    if (!hasText(rule?.trustBoundary)) {
      errors.push(`${path}[${index}].trustBoundary must be present`);
    }
  });
}

function validateExecutionIdentityMatches() {
  const proposalIdentity = manifest?.proposalIdentity;
  const receipt = manifest?.canonicalExecutionReceipt;
  if (!isPlainObject(proposalIdentity) || !isPlainObject(receipt)) {
    return;
  }

  const fields = ["proposalId", "targetAddress", "value", "actionSelector", "dataHash"];
  for (const field of fields) {
    if (proposalIdentity[field] !== receipt[field]) {
      errors.push(`canonicalExecutionReceipt.${field} must match proposalIdentity.${field}`);
    }
  }
}

function isSafeUnsignedValue(value) {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value >= 0;
  }

  if (typeof value === "string") {
    return /^[0-9]+$/.test(value);
  }

  return false;
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

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatPath(path) {
  return path
    .map((part) => (typeof part === "number" ? `[${part}]` : part))
    .join(".")
    .replaceAll(".[", "[");
}

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isAddressKey(normalizedKey) {
  return (
    normalizedKey === "isocore" ||
    normalizedKey === "isoproposals" ||
    normalizedKey === "isoorgexecutor" ||
    normalizedKey.endsWith("address")
  );
}

function isOptionalExecutorKey(normalizedKey) {
  return normalizedKey === "isoorgexecutor" || normalizedKey === "managedexecutoraddress";
}

function isStaleActiveFieldName(key) {
  return STALE_ACTIVE_TOKEN_RE.test(String(key));
}

function isSuspiciousSecretKey(normalizedKey) {
  return (
    normalizedKey === "apikey" ||
    normalizedKey === "privatekey" ||
    normalizedKey === "secret" ||
    normalizedKey === "secrets" ||
    normalizedKey === "password" ||
    normalizedKey === "mnemonic" ||
    normalizedKey === "seedphrase" ||
    normalizedKey === "accesstoken" ||
    normalizedKey === "refreshtoken" ||
    normalizedKey === "bearertoken" ||
    normalizedKey === "providerapikey" ||
    normalizedKey === "rpcurl" ||
    normalizedKey === "rpcendpoint" ||
    normalizedKey.endsWith("apikey") ||
    normalizedKey.endsWith("secret") ||
    normalizedKey.endsWith("credential") ||
    normalizedKey.endsWith("credentials")
  );
}

function isEmpty(value) {
  return value === null || value === undefined || value === "";
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isAddress(value) {
  return typeof value === "string" && ADDRESS_RE.test(value);
}
