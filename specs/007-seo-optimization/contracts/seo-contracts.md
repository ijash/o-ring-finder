# SEO, URL & Markup Interface Contracts

**Feature**: `specs/007-seo-optimization` | **Branch**: `feat/seo-optimization` | **Date**: 2026-11-23

## 1. URL Query Parameter Contract (`src/utils/urlParams.ts` & `FilterContext`)

### Query String Interface
```typescript
export interface UrlFilterParams {
  code?: string;
  unit?: "mm" | "inch";
  minId?: number;
  maxId?: number;
  minOd?: number;
  maxOd?: number;
  minCs?: number;
  maxCs?: number;
}
```

### Parsing Contract
- Function: `parseUrlFilters(search: string): Partial<IDataFilter>`
  - Inputs: query string (e.g., `"?code=010&unit=inch&minId=5.5"`)
  - Output: sanitized `Partial<IDataFilter>` object
  - Rules:
    - `code`: trimmed; empty string ignored.
    - `unit`: strictly `"mm"` or `"inch"`; defaults to `MeasurementUnit.MM` if omitted or invalid.
    - `minId`, `maxId`, `minOd`, `maxOd`, `minCs`, `maxCs`: parsed via `Number()`; ignored if `isNaN` or `< 0`.

### Serialization Contract
- Function: `syncFilterToUrl(filter: IDataFilter): void`
  - Encodes non-default, non-empty filter properties into query string using native `URLSearchParams`.
  - Preserves current pathname (`window.location.pathname`).
  - Calls `window.history.replaceState(null, "", nextUrl)`.
  - Cleans up trailing `?` if no filters are active.

---

## 2. Document Head & Metadata Contract (`index.html` & `Title`)

### Meta Elements in `index.html`
- Canonical:
  ```html
  <link rel="canonical" href="https://ijash.github.io/o-ring-finder/" />
  ```
- Language Alternates:
  ```html
  <link rel="alternate" hreflang="en" href="https://ijash.github.io/o-ring-finder/?lng=en" />
  <link rel="alternate" hreflang="id" href="https://ijash.github.io/o-ring-finder/?lng=id" />
  <link rel="alternate" hreflang="x-default" href="https://ijash.github.io/o-ring-finder/" />
  ```
- Open Graph:
  ```html
  <meta property="og:type" content="website" />
  <meta property="og:title" content="O-Ring Size Chart & Finder | AS568, JIS, Metric Sizes" />
  <meta property="og:description" content="Search and filter 3,822 standard O-ring sizes across AS568, JIS B 2401, and Metric standards by Inside Diameter (ID), Outside Diameter (OD), and Cross Section (CS)." />
  <meta property="og:url" content="https://ijash.github.io/o-ring-finder/" />
  <meta property="og:image" content="https://ijash.github.io/o-ring-finder/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="O-Ring Size Finder" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:locale:alternate" content="id_ID" />
  ```
- Twitter Card:
  ```html
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="O-Ring Size Chart & Finder | AS568, JIS, Metric Sizes" />
  <meta name="twitter:description" content="Search and filter 3,822 standard O-ring sizes across AS568, JIS B 2401, and Metric standards by ID, OD, and CS." />
  <meta name="twitter:image" content="https://ijash.github.io/o-ring-finder/og-image.png" />
  ```

---

## 3. Robots & Sitemap Contract (`public/robots.txt` & `public/sitemap.xml`)

### `public/robots.txt`
```text
User-agent: *
Disallow:

Sitemap: https://ijash.github.io/o-ring-finder/sitemap.xml
```

### `public/sitemap.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://ijash.github.io/o-ring-finder/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://ijash.github.io/o-ring-finder/?lng=en"/>
    <xhtml:link rel="alternate" hreflang="id" href="https://ijash.github.io/o-ring-finder/?lng=id"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://ijash.github.io/o-ring-finder/"/>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## 4. Semantic Landmark & Layout Contract

```html
<!-- DOM Hierarchy Contract -->
<div id="root">
  <header>
    <nav class="navbar ...">...</nav>
    <div class="position-relative text-center ...">...</h1></div>
  </header>
  <main class="container">
    <section aria-label="Filter Controls"><form>...</form></section>
    <section aria-label="O-Ring Table"><table>...</table></section>
    <section aria-label="O-Ring Sizing FAQ & Reference"><details>...</details></section>
  </main>
  <footer>
    <div class="text-center small text-muted">
      <p class="mb-1">...</p>
      <p class="mb-1">...</p>
      <p class="mb-0">...</p>
    </div>
  </footer>
</div>
```
- `<header>`, `<main>`, `<footer>` rendered as root sibling elements.
- No `<header>` or `<footer>` nested within `<main>`.
- Zero `<p>` tags nested inside `<small>`.
