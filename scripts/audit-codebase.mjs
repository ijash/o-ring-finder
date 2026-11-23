#!/usr/bin/env node
/**
 * audit-codebase.mjs
 *
 * Usage:
 *   node scripts/audit-codebase.mjs
 *   ./scripts/audit-codebase.mjs
 *
 * Description:
 *   Fast, token-saving codebase hygiene and strict type-safety audit.
 *   Enforces Constitution v1.1.0 Principles:
 *     - Principle II: Strict Type Safety (no explicit any, @ts-ignore, @ts-nocheck)
 *     - Principle III: Codebase Cleanup (no console.log, no dead/legacy files)
 *     - Principle IV: Single lockfile (no package-lock.json, no yarn.lock)
 *
 * Exit codes:
 *   0: Audit clean, no violations detected.
 *   1: Violations found.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const SRC_DIR = resolve(REPO_ROOT, "src");

const FORBIDDEN_FILES = [
  "README.old.md",
  "package-lock.json",
  "yarn.lock",
  "src/setupTests.js",
];

function collectSourceFiles(dir, files = []) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      collectSourceFiles(fullPath, files);
    } else if (/\.(ts|tsx|js|mjs)$/.test(entry)) {
      files.push(fullPath);
    }
  }
  return files;
}

function auditCodebase() {
  console.log("=== Running Codebase Hygiene & Strict Type-Safety Audit ===");

  let violationCount = 0;

  // 1. Check legacy/forbidden files
  for (const file of FORBIDDEN_FILES) {
    const target = join(REPO_ROOT, file);
    if (existsSync(target)) {
      console.error(`❌ Prohibited legacy artifact found: ${file}`);
      violationCount++;
    }
  }

  // 2. Scan source files for forbidden patterns
  const srcFiles = collectSourceFiles(SRC_DIR);

  const PATTERNS = [
    {
      regex: /@ts-(ignore|nocheck|expect-error)/,
      label: "TypeScript suppression annotation (@ts-ignore / @ts-nocheck / @ts-expect-error)",
    },
    {
      regex: /\bconsole\.log\s*\(/,
      label: "console.log statement",
    },
    {
      regex: /:\s*any\b|as\s+any\b|<any>/,
      label: "explicit any type escape hatch",
    },
  ];

  for (const filePath of srcFiles) {
    const relativePath = filePath.replace(`${REPO_ROOT}/`, "");
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? "";
      const lineNum = i + 1;

      // Skip comment-only lines for pattern matching
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
        // Exception: @ts-ignore is inside comments
        if (/@ts-(ignore|nocheck|expect-error)/.test(line)) {
          console.error(`❌ [${relativePath}:${lineNum}] Forbidden TypeScript suppression: ${trimmed}`);
          violationCount++;
        }
        continue;
      }

      for (const pattern of PATTERNS) {
        if (pattern.regex.test(line)) {
          console.error(`❌ [${relativePath}:${lineNum}] Forbidden ${pattern.label}: ${trimmed}`);
          violationCount++;
        }
      }
    }
  }

  if (violationCount > 0) {
    console.error(`\nFAILED: Found ${violationCount} codebase hygiene/type-safety violation(s).`);
    process.exit(1);
  }

  console.log(`✓ Scanned ${srcFiles.length} source files.`);
  console.log("✓ Zero prohibited legacy files, console.log statements, or type escape hatches detected.");
}

auditCodebase();
