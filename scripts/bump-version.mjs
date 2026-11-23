#!/usr/bin/env node
/**
 * bump-version.mjs
 *
 * Usage:
 *   node scripts/bump-version.mjs <patch|minor>
 *   ./scripts/bump-version.mjs <patch|minor>
 *
 * Description:
 *   Safe Semantic Version bumper updating package.json.
 *   Enforces Constitution v1.1.0 Principle XI:
 *     - Autonomous minor and patch version bumps permitted.
 *     - Major bumps strictly blocked (requires explicit user authorization).
 *
 * Exit codes:
 *   0: Version successfully bumped and package.json updated.
 *   1: Invalid argument or attempt to bump major version.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const REPO_ROOT = resolve(import.meta.dirname, "..");
const PKG_PATH = resolve(REPO_ROOT, "package.json");

function bumpVersion() {
  const bumpType = process.argv[2]?.toLowerCase();

  if (!bumpType || (bumpType !== "patch" && bumpType !== "minor")) {
    if (bumpType === "major") {
      console.error(
        "❌ ERROR: Major version bumps are BLOCKED autonomously.\n" +
          "   Per Constitution v1.1.0 Principle XI: Agents MUST NEVER execute a major version bump autonomously.\n" +
          "   Major bumps require explicit user authorization."
      );
    } else {
      console.error(
        "❌ Usage: node scripts/bump-version.mjs <patch|minor>\n" +
          "   Provided: " +
          (bumpType || "none")
      );
    }
    process.exit(1);
  }

  const pkgContent = readFileSync(PKG_PATH, "utf-8");
  const pkg = JSON.parse(pkgContent);
  const currentVersion = pkg.version;

  const parts = currentVersion.split(".").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    console.error(`❌ Invalid current version in package.json: ${currentVersion}`);
    process.exit(1);
  }

  let [major, minor, patch] = parts;
  if (bumpType === "minor") {
    minor += 1;
    patch = 0;
  } else if (bumpType === "patch") {
    patch += 1;
  }

  const nextVersion = `${major}.${minor}.${patch}`;
  pkg.version = nextVersion;

  writeFileSync(PKG_PATH, `${JSON.stringify(pkg, null, 2)}\n`, "utf-8");

  console.log(`✓ Successfully bumped version: ${currentVersion} → ${nextVersion}`);
  console.log("\nConventional Commit Template:");
  console.log("-----------------------------------------");
  if (bumpType === "minor") {
    console.log(`feat: bump version to ${nextVersion}\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`);
  } else {
    console.log(`fix: bump version to ${nextVersion}\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`);
  }
  console.log("-----------------------------------------");
}

bumpVersion();
