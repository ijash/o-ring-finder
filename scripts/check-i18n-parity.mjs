#!/usr/bin/env node
/**
 * check-i18n-parity.mjs
 *
 * Usage:
 *   node scripts/check-i18n-parity.mjs
 *   ./scripts/check-i18n-parity.mjs
 *
 * Description:
 *   Validates 100% key parity and non-empty string values between:
 *     - src/locales/en/globals.json
 *     - src/locales/id/globals.json
 *   Enforces Constitution v1.1.0 Principle IX (Bilingual Parity).
 *
 * Exit codes:
 *   0: 100% bidirectional parity verified and all values valid.
 *   1: Discrepancies, missing keys, or empty values detected.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const REPO_ROOT = resolve(import.meta.dirname, "..");
const EN_PATH = resolve(REPO_ROOT, "src/locales/en/globals.json");
const ID_PATH = resolve(REPO_ROOT, "src/locales/id/globals.json");

function flattenKeys(obj, prefix = "") {
  const map = new Map();
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const nested = flattenKeys(val, fullKey);
      nested.forEach((v, k) => map.set(k, v));
    } else {
      map.set(fullKey, val);
    }
  }
  return map;
}

function runParityCheck() {
  console.log("=== Checking i18n Translation Parity (EN ↔ ID) ===");

  const enData = JSON.parse(readFileSync(EN_PATH, "utf-8"));
  const idData = JSON.parse(readFileSync(ID_PATH, "utf-8"));

  const enKeys = flattenKeys(enData);
  const idKeys = flattenKeys(idData);

  let hasErrors = false;

  // Check missing in ID
  const missingInId = [];
  for (const k of enKeys.keys()) {
    if (!idKeys.has(k)) {
      missingInId.push(k);
    }
  }

  // Check missing in EN
  const missingInEn = [];
  for (const k of idKeys.keys()) {
    if (!enKeys.has(k)) {
      missingInEn.push(k);
    }
  }

  // Check empty values
  const emptyInEn = [];
  for (const [k, v] of enKeys.entries()) {
    if (typeof v !== "string" || v.trim().length === 0) {
      emptyInEn.push(k);
    }
  }

  const emptyInId = [];
  for (const [k, v] of idKeys.entries()) {
    if (typeof v !== "string" || v.trim().length === 0) {
      emptyInId.push(k);
    }
  }

  if (missingInId.length > 0) {
    hasErrors = true;
    console.error("❌ Keys present in EN but missing in ID:");
    missingInId.forEach((k) => console.error(`   - ${k}`));
  }

  if (missingInEn.length > 0) {
    hasErrors = true;
    console.error("❌ Keys present in ID but missing in EN:");
    missingInEn.forEach((k) => console.error(`   - ${k}`));
  }

  if (emptyInEn.length > 0) {
    hasErrors = true;
    console.error("❌ Empty or non-string values in EN:");
    emptyInEn.forEach((k) => console.error(`   - ${k}`));
  }

  if (emptyInId.length > 0) {
    hasErrors = true;
    console.error("❌ Empty or non-string values in ID:");
    emptyInId.forEach((k) => console.error(`   - ${k}`));
  }

  if (hasErrors) {
    console.error("FAILED: i18n translation parity check failed.");
    process.exit(1);
  }

  console.log(
    `✓ 100% key parity verified (${enKeys.size} leaf keys in both EN and ID).`
  );
  console.log("✓ All translation strings are populated and non-empty.");
}

runParityCheck();
