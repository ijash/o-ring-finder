# Data Model: SEO Optimization & URL Deep-Linking

**Feature**: `specs/007-seo-optimization` | **Branch**: `feat/seo-optimization` | **Date**: 2026-11-23

## State & Data Flow Models

### 1. URL Query Parameter Mapping (`URLSearchParams` ↔ `IDataFilter`)

| URL Query Param | `IDataFilter` Field | Data Type | Validation & Coercion Rules | Default / Omitted Value |
|-----------------|---------------------|-----------|-----------------------------|-------------------------|
| `code` | `code` | `string` | Trim whitespace; case-insensitive search substring | `undefined` (omitted if empty) |
| `unit` | `unit` | `MeasurementUnit` | Value in `["mm", "inch"]` (`MeasurementUnit.MM` or `MeasurementUnit.INCH`) | `MeasurementUnit.MM` |
| `minId` | `minId` | `number` | Positive finite number (`> 0`); ignore if `NaN` | `undefined` |
| `maxId` | `maxId` | `number` | Positive finite number (`> 0`); ignore if `NaN` | `undefined` |
| `minOd` | `minOd` | `number` | Positive finite number (`> 0`); ignore if `NaN` | `undefined` |
| `maxOd` | `maxOd` | `number` | Positive finite number (`> 0`); ignore if `NaN` | `undefined` |
| `minCs` | `minCs` | `number` | Positive finite number (`> 0`); ignore if `NaN` | `undefined` |
| `maxCs` | `maxCs` | `number` | Positive finite number (`> 0`); ignore if `NaN` | `undefined` |
| `lng` | `i18n.language` | `string` | Optional language code (`"en"` or `"id"`) | Active i18n language |

### 2. URL State Synchronization Lifecycle

```text
[ Browser Initial Load ]
  │
  ├─► window.location.search (?code=010&unit=inch&minId=5)
  │     │
  │     ▼
  │   [ parseUrlFilters(search: string): IDataFilter ]
  │     │ (Validates params, sanitizes numbers, detects unit)
  │     ▼
  ├─► FilterContext: initializes state with parsed filter
  │     │
  │     ├─► InputSection: pre-populates form controls (unit select, text/number inputs)
  │     └─► TableSection: filters 3,822 catalog records to match query parameters
  │
[ User Filter Change ]
  │
  ├─► User types code / dimension or switches unit
  │     │
  │     ▼
  │   [ setFilter(updatedFilter) ]
  │     │
  │     ▼
  │   [ syncFilterToUrl(filter: IDataFilter): void ]
  │     │
  │     ├─► Serializes active non-empty filters into URLSearchParams
  │     ├─► Omits default unit ('mm') and undefined/empty keys
  │     └─► window.history.replaceState({}, '', nextUrl)
  │
[ User Clears Filters ]
  │
  ├─► User clicks "Clear filter"
  │     │
  │     ▼
  │   [ handleClear() ]
  │     │
  │     ├─► form.reset(); reset inputs to empty
  │     ├─► setFilter({ unit: currentUnit })
  │     └─► window.history.replaceState({}, '', pathname + (?unit=inch if non-default))
```

---

## 3. Schema.org JSON-LD Entity Graph

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://ijash.github.io/o-ring-finder/#webapp",
      "name": "O-Ring Size Chart & Finder",
      "url": "https://ijash.github.io/o-ring-finder/",
      "description": "Interactive O-ring size chart and finder for AS568, JIS B 2401, and Metric sizes. Filter and search 3,822 O-ring dimensions by ID, OD, and CS in mm and inches.",
      "applicationCategory": "EngineeringApplication",
      "operatingSystem": "All",
      "inLanguage": ["en", "id"],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://ijash.github.io/o-ring-finder/?code={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Dataset",
      "@id": "https://ijash.github.io/o-ring-finder/#dataset",
      "name": "Standard O-Ring Dimensions Catalog (AS568, JIS B 2401, Metric)",
      "description": "Technical dimensional specifications for 3,822 O-rings including Inside Diameter (ID), Outside Diameter (OD), and Cross Section (CS) in millimeters and inches.",
      "license": "https://opensource.org/licenses/MIT",
      "variableMeasured": ["Inside Diameter (ID)", "Outside Diameter (OD)", "Cross Section (CS)"]
    },
    {
      "@type": "FAQPage",
      "@id": "https://ijash.github.io/o-ring-finder/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the difference between AS568, JIS, and Metric O-rings?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AS568 is the Aerospace Standard inch-based O-ring sizing system commonly used in North America. JIS B 2401 is the Japanese Industrial Standard series categorized by application (P for dynamic, G for static, S for special). Metric O-rings are defined by nominal millimeter dimensions (Inside Diameter x Cross Section) widely used in ISO 3601 global machinery."
          }
        },
        {
          "@type": "Question",
          "name": "How do you measure an O-ring?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Measure three primary dimensions: 1. Inside Diameter (ID) - distance between inner walls. 2. Cross Section (CS) - thickness/diameter of the rubber cord. 3. Outside Diameter (OD) - distance across outer edges, calculated as OD = ID + (2 x CS)."
          }
        },
        {
          "@type": "Question",
          "name": "How to convert O-ring measurements between millimeters and inches?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Multiply inches by 25.4 to get millimeters (mm = inch x 25.4). Divide millimeters by 25.4 to get inches (inch = mm / 25.4)."
          }
        }
      ]
    }
  ]
}
```

---

## 4. FAQ Component & Localization Schema

### FAQ Item Structure
```typescript
export interface FaqItem {
  id: string;
  questionKey: string;
  answerKey: string;
}
```

### i18n Translation Keys (`globals.json`)
```json
"faq": {
  "sectionTitle": "O-Ring Sizing Guide & FAQ",
  "sectionSubtitle": "Frequently asked questions about O-ring standards, measurements, and conversions.",
  "q1": {
    "question": "What is the difference between AS568, JIS B 2401, and Metric O-ring standards?",
    "answer": "AS568 is the North American standard based on fractional inches with standardized dash numbers. JIS B 2401 is the Japanese standard categorized into P (dynamic/packing), G (static/gasket), S (special dimensions), and V (vacuum) series. Metric O-rings are specified directly in millimeters (Inside Diameter × Cross Section) following international standards such as ISO 3601."
  },
  "q2": {
    "question": "How do I accurately measure an O-ring?",
    "answer": "To identify an O-ring, measure two critical dimensions using a vernier caliper: Inside Diameter (ID) across the inner opening, and Cross Section (CS) across the cord thickness. Outside Diameter (OD) can be verified using the formula: OD = ID + (2 × CS)."
  },
  "q3": {
    "question": "How do I calculate Outer Diameter (OD) from ID and CS?",
    "answer": "The relationship is: Outer Diameter (OD) = Inside Diameter (ID) + 2 × Cross Section (CS). For example, an O-ring with 10 mm ID and 2 mm CS has an OD of 10 + 2(2) = 14 mm."
  },
  "q4": {
    "question": "How do I convert between millimeters and inches?",
    "answer": "1 inch equals exactly 25.4 millimeters. To convert inches to millimeters, multiply by 25.4. To convert millimeters to inches, divide by 25.4 (or multiply by 0.03937)."
  }
}
```
Indonesian locale (`src/locales/id/globals.json`) maintains 100% exact key parity with authentic engineering phrasing.
