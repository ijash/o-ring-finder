import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("SEO Static Metadata & Structured Data", () => {
  const rootDir = path.resolve(__dirname, "../..");
  const indexHtml = fs.readFileSync(path.join(rootDir, "index.html"), "utf-8");
  const robotsTxt = fs.readFileSync(path.join(rootDir, "public/robots.txt"), "utf-8");
  const sitemapXml = fs.readFileSync(path.join(rootDir, "public/sitemap.xml"), "utf-8");

  it("contains high-intent title and single meta description in index.html", () => {
    expect(indexHtml).toMatch(/<title>O-Ring Size Chart &amp; Finder/);
    const metaDescMatches = indexHtml.match(/<meta\s+name="description"/gi);
    expect(metaDescMatches).toHaveLength(1);
    expect(indexHtml).toContain("AS568");
    expect(indexHtml).toContain("JIS");
    expect(indexHtml).toContain("Metric");
  });

  it("contains canonical and hreflang links in index.html", () => {
    expect(indexHtml).toContain('<link rel="canonical" href="https://ijash.github.io/o-ring-finder/" />');
    expect(indexHtml).toContain('hreflang="en" href="https://ijash.github.io/o-ring-finder/?lng=en"');
    expect(indexHtml).toContain('hreflang="id" href="https://ijash.github.io/o-ring-finder/?lng=id"');
    expect(indexHtml).toContain('hreflang="x-default" href="https://ijash.github.io/o-ring-finder/"');
  });

  it("contains Open Graph and Twitter Card tags in index.html", () => {
    expect(indexHtml).toContain('property="og:type" content="website"');
    expect(indexHtml).toContain('property="og:title"');
    expect(indexHtml).toContain('property="og:image" content="https://ijash.github.io/o-ring-finder/og-image.png"');
    expect(indexHtml).toContain('property="og:image:width" content="1200"');
    expect(indexHtml).toContain('property="og:image:height" content="630"');
    expect(indexHtml).toContain('name="twitter:card" content="summary_large_image"');
  });

  it("contains valid JSON-LD graph with WebApplication, Dataset, and FAQPage", () => {
    const jsonLdMatch = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(jsonLdMatch).toBeTruthy();
    expect(jsonLdMatch?.[1]).toBeDefined();
    const parsed = JSON.parse(jsonLdMatch?.[1] ?? "{}");
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(Array.isArray(parsed["@graph"])).toBe(true);

    const types = parsed["@graph"].map((item: { "@type": string }) => item["@type"]);
    expect(types).toContain("WebApplication");
    expect(types).toContain("Dataset");
    expect(types).toContain("FAQPage");

    const webApp = parsed["@graph"].find((item: { "@type": string }) => item["@type"] === "WebApplication");
    expect(webApp.potentialAction["@type"]).toBe("SearchAction");
    expect(webApp.potentialAction.target.urlTemplate).toContain("?code={search_term_string}");

    const dataset = parsed["@graph"].find((item: { "@type": string }) => item["@type"] === "Dataset");
    expect(dataset.license).toBe("https://www.gnu.org/licenses/gpl-3.0.html");
    expect(dataset.creator).toEqual({
      "@type": "Person",
      name: "Ijash",
      url: "https://github.com/ijash",
    });
  });

  it("contains rich noscript content in index.html", () => {
    expect(indexHtml).toMatch(/<noscript>[\s\S]*?O-Ring Size Chart &amp; Finder[\s\S]*?<\/noscript>/);
  });

  it("robots.txt declares sitemap.xml", () => {
    expect(robotsTxt).toContain("Sitemap: https://ijash.github.io/o-ring-finder/sitemap.xml");
  });

  it("sitemap.xml contains valid XML structure with language alternates", () => {
    expect(sitemapXml).toContain("<loc>https://ijash.github.io/o-ring-finder/</loc>");
    expect(sitemapXml).toContain('hreflang="en"');
    expect(sitemapXml).toContain('hreflang="id"');
  });

  it("verifies single meta description in document head without duplicate tags", () => {
    const metaDescriptions = document.querySelectorAll('meta[name="description"]');
    expect(metaDescriptions.length).toBeLessThanOrEqual(1);
  });
});
