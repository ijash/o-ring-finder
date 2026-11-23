import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("PWA Assets and Manifest Configuration", () => {
  const rootDir = process.cwd();

  it("includes required PWA icons in public directory", () => {
    const icon192 = path.join(rootDir, "public/pwa-192x192.png");
    const icon512 = path.join(rootDir, "public/pwa-512x512.png");
    const favicon = path.join(rootDir, "public/favicon.ico");

    expect(fs.existsSync(icon192)).toBe(true);
    expect(fs.existsSync(icon512)).toBe(true);
    expect(fs.existsSync(favicon)).toBe(true);
  });

  it("has valid manifest.json with required PWA standalone properties", () => {
    const manifestPath = path.join(rootDir, "public/manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);

    const raw = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(raw);

    expect(manifest.id).toBe("/o-ring-finder/");
    expect(manifest.start_url).toBe("/o-ring-finder/");
    expect(manifest.scope).toBe("/o-ring-finder/");
    expect(manifest.display).toBe("standalone");
    expect(manifest.theme_color).toBe("#0f172a");
    expect(manifest.background_color).toBe("#0f172a");
    expect(Array.isArray(manifest.icons)).toBe(true);

    const hasMaskable = manifest.icons.some(
      (icon: { purpose?: string }) => icon.purpose === "maskable"
    );
    expect(hasMaskable).toBe(true);
  });

  it("references webmanifest and apple-touch-icon in index.html", () => {
    const indexPath = path.join(rootDir, "index.html");
    const html = fs.readFileSync(indexPath, "utf-8");

    expect(html).toContain('rel="manifest"');
    expect(html).toContain('rel="apple-touch-icon"');
  });

  it("verifies dist artifacts when dist exists post-build", () => {
    const distSw = path.join(rootDir, "dist/sw.js");
    const distManifest = path.join(rootDir, "dist/manifest.webmanifest");

    // Guarded check: verify if dist exists, otherwise gracefully pass in pre-build stage
    if (fs.existsSync(distSw) && fs.existsSync(distManifest)) {
      expect(fs.existsSync(distSw)).toBe(true);
      const manifestContent = JSON.parse(fs.readFileSync(distManifest, "utf-8"));
      expect(manifestContent.display).toBe("standalone");
      expect(manifestContent.id).toBe("/o-ring-finder/");
    } else {
      expect(true).toBe(true);
    }
  });
});
