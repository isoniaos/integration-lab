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

validateRequiredAddress("contracts.govCore", manifest?.contracts?.govCore);
validateRequiredAddress("contracts.govProposals", manifest?.contracts?.govProposals);
validateOptionalAddress("contracts.orgExecutor", manifest?.contracts?.orgExecutor);

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
}

if (!isSafeUnsignedValue(manifest?.proposalIdentity?.value)) {
  errors.push("proposalIdentity.value must be a non-negative safe integer or decimal string");
}

if (!isSafeUnsignedValue(manifest?.canonicalExecutionReceipt?.value)) {
  errors.push(
    "canonicalExecutionReceipt.value must be a non-negative safe integer or decimal string",
  );
}

const leafValues = collectLeaves(manifest);
for (const leaf of leafValues) {
  const key = leaf.path[leaf.path.length - 1] ?? "";
  const normalizedKey = normalizeKey(key);
  const displayPath = formatPath(leaf.path);

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

if (!Array.isArray(manifest?.externalResources)) {
  errors.push("externalResources must be an array");
} else {
  manifest.externalResources.forEach((resource, index) => {
    if (resource?.authority !== false) {
      errors.push(`externalResources[${index}].authority must be false by default`);
    }
    if (!resource?.trustBoundary) {
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
    normalizedKey === "govcore" ||
    normalizedKey === "govproposals" ||
    normalizedKey === "orgexecutor" ||
    normalizedKey.endsWith("address")
  );
}

function isOptionalExecutorKey(normalizedKey) {
  return normalizedKey === "orgexecutor" || normalizedKey === "managedexecutoraddress";
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
