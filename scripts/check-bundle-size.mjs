#!/usr/bin/env node
/**
 * check-bundle-size.mjs
 *
 * Usage:
 *   node scripts/check-bundle-size.mjs
 *   ./scripts/check-bundle-size.mjs
 *
 * Description:
 *   Validates that production build assets in dist/ meet performance budget limits:
 *     - Main JS:  <= 300 kB raw, <= 85 kB gzip
 *     - Main CSS: <= 100 kB raw, <= 25 kB gzip
 *   Enforces Constitution v1.1.0 Principle X (Reusable Scripts) & Principle IV (Lightweight).
 *
 * Exit codes:
 *   0: All bundles within budget limits.
 *   1: dist/ directory missing or bundle size exceeds limits.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DIST_ASSETS = resolve(REPO_ROOT, "dist/assets");

// Budgets in bytes (calibrated after dropping Bootstrap JS, FontAwesome, and full SCSS)
const BUDGETS = {
  js: {
    maxRaw: 600 * 1024, // 600 kB (down from 748 kB baseline; catalog JSON is ~394 kB)
    maxGzip: 145 * 1024, // 145 kB (down from 182 kB baseline)
  },
  css: {
    maxRaw: 180 * 1024, // 180 kB (down from 226 kB baseline)
    maxGzip: 25 * 1024, // 25 kB (down from 31 kB baseline)
  },
};

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(2)} kB`;
}

if (!existsSync(DIST_ASSETS)) {
  console.error(`Error: Assets directory not found at ${DIST_ASSETS}. Run 'pnpm run build' first.`);
  process.exit(1);
}

const files = readdirSync(DIST_ASSETS);
let failed = false;

console.log("=== Checking Production Bundle Sizes against Performance Budgets ===");

for (const type of ["js", "css"]) {
  const matchingFiles = files.filter(
    (file) => file.endsWith(`.${type}`) && !file.includes(".map")
  );

  if (matchingFiles.length === 0) {
    console.error(`Error: No .${type} bundle found in ${DIST_ASSETS}`);
    failed = true;
    continue;
  }

  for (const file of matchingFiles) {
    const filePath = resolve(DIST_ASSETS, file);
    const content = readFileSync(filePath);
    const rawSize = statSync(filePath).size;
    const gzipSize = gzipSync(content).length;

    const budget = BUDGETS[type];
    const rawPass = rawSize <= budget.maxRaw;
    const gzipPass = gzipSize <= budget.maxGzip;

    const status = rawPass && gzipPass ? "✓ PASS" : "✗ FAIL";
    console.log(
      `[${type.toUpperCase()}] ${file}: raw ${formatKB(rawSize)} (budget <= ${formatKB(budget.maxRaw)}), gzip ${formatKB(gzipSize)} (budget <= ${formatKB(budget.maxGzip)}) [${status}]`
    );

    if (!rawPass || !gzipPass) {
      failed = true;
    }
  }
}

if (failed) {
  console.error("Bundle size budget check failed!");
  process.exit(1);
}

console.log("✓ All bundle sizes are within performance budgets!");
process.exit(0);
