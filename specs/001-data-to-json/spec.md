# Feature Specification: Data to JSON Transformation

**Feature Branch**: `refactor/data-to-json`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "Stay on the current branch refactor/data-to-json (do not create a new branch). Read .specify/memory/constitution.md, .specify/memory/roadmap.md, and inspect all files in src/data/ and wherever src/data is imported across src/. Create the specification for the first roadmap item: transforming src/data (AS568, JIS, and Common Metric HTML-table datasets) into lightweight, strictly typed JSON data files, removing runtime DOM/HTML parsing (document.createElement / innerHTML), and ensuring immutable mm <-> inch unit conversion with 100% data parity against the current parsed output. Focus strictly on WHAT needs to change, acceptance criteria, data integrity verification, and edge cases. Follow Principle VII: do not assume anything—list any ambiguities (such as JSON schema shape, decimal precision rules, or whether to preserve StandardData class vs. pure helper functions) as open questions for /speckit.clarify."

## Clarifications

### Session 2026-11-23

- Q: What exact decimal precision rounding rules should be applied for inch unit conversions? → A: Preserve legacy 3 decimal places precision (`toFixed(3)` parsed back to number) for exact parity.
- Q: What format and structure should the generated JSON data files use on disk? → A: Flat array per standard file (`as568.json`, `jis.json`, `metric.json` each containing `Array<{ standard, code, cs, id, od }>`).
- Q: What data access contract should be exposed to consumers (`TableSection`, `TableRowsComponent`, etc.)? → A: Replace legacy `StandardData` class with pure functional helpers/accessors (e.g. `getStandardData(standard, unit)` or equivalent pure function), migrating consumers per Principle I.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Instant Catalog Access Without DOM Parsing Overhead (Priority: P1)

As a user searching for standard O-rings (AS568, JIS, Common Metric), I want the application to load catalog records instantly without client-side DOM document creation or HTML string parsing delays, so that search and filtering are responsive and available immediately upon page load.

**Why this priority**: Core value proposition of the refactor. Eliminating runtime DOM parsing removes CPU overhead, bundle bloat, and browser-dependent parsing quirks while preserving full catalog usability.

**Independent Test**: Can be fully tested by loading O-ring data from static structured JSON representations without calling browser DOM APIs, verifying identical row counts and values against the legacy parsed datasets.

**Acceptance Scenarios**:

1. **Given** the application initializes, **When** O-ring catalog datasets are queried for AS568, JIS, or Common Metric standards, **Then** records are retrieved from pre-structured data files without creating synthetic DOM elements or parsing HTML tables at runtime.
2. **Given** standard datasets are loaded, **When** comparing extracted records against legacy output, **Then** all standard codes, cross-sections (CS), inside diameters (ID), and outside diameters (OD) match legacy values with 100% parity.

---

### User Story 2 - Accurate and Immutable Unit Conversion (Priority: P2)

As a mechanical designer or engineer browsing O-ring sizes, I want to toggle between millimeters (`mm`) and inches (`″`), so that I can evaluate sizes in my required unit system with consistent rounding precision and without mutative side-effects on the underlying catalog dataset.

**Why this priority**: Crucial for cross-regional engineering workflows where standard dimensions are designed in millimeters or inches. Conversions must be deterministic, mathematically accurate, and immutable.

**Independent Test**: Can be tested by querying catalog data in `mm`, requesting conversion to `″`, and verifying that the original dataset in memory remains unmodified while converted values match specified precision targets.

**Acceptance Scenarios**:

1. **Given** a catalog query with unit set to millimeters (`mm`), **When** data representations are retrieved, **Then** dimensions (CS, ID, OD) are provided in millimeters with unit tag `mm`.
2. **Given** a catalog query with unit set to inches (`″`), **When** data representations are retrieved, **Then** dimensions are converted using standard millimeter-to-inch ratio (`1 / 25.4`) to exact defined decimal precision with unit tag `″`.
3. **Given** repeated alternating unit requests (`mm` -> `″` -> `mm`), **When** records are evaluated, **Then** millimeter values do not drift or accumulate rounding errors because conversions do not mutate source records.

---

### User Story 3 - Seamless Catalog Consumption by UI Consumers (Priority: P3)

As a frontend component developer, I want the dataset provider interface to maintain consumer contract compatibility, so that existing search, filter, and table components continue to work without breaking functional regressions.

**Why this priority**: Prevents ripple effects and UI regressions across `TableSection`, `TableRowsComponent`, `FilterContext`, and search modals during the data layer refactoring.

**Independent Test**: Can be tested by verifying that filter criteria (by standard, code substring, min/max dimension bounds) applied to converted data produce identical filtered subsets compared to the existing implementation.

**Acceptance Scenarios**:

1. **Given** active dimensional filters (`minCs`, `maxCs`, `minId`, `maxId`, `minOd`, `maxOd`), **When** filtering is evaluated across standard datasets, **Then** the filtered record subset matches existing filter results.
2. **Given** tabular rendering components, **When** standard headers and records are requested, **Then** standard names, codes, and numerical dimensions are supplied in the expected column order.

---

### Edge Cases

- **Non-numeric or malformed data in source tables**: Legacy HTML tables contain empty cells, string labels ("skipped"), or header tags. Static data generation must resolve all values at compile/build time; runtime data must contain zero NaN values.
- **Floating point conversion drift**: Repeated conversions could degrade numbers if stored as mutable state. Converted values must be computed immutably from base reference values on demand or pre-computed.
- **Extreme dimension queries**: Queries filtering near zero or maximum bounds must handle boundary inclusiveness identically in both `mm` and `″`.
- **Case and special characters in codes**: Codes like `1A-P10`, `001`, or metric codes with dashes must preserve exact string formatting.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST supply complete catalog datasets for AS568, JIS, and Common Metric standards stored as pre-structured, lightweight JSON data files without embedded HTML markup.
- **FR-002**: System MUST eliminate all runtime DOM manipulation (`document.createElement`, `innerHTML`, `HTMLTableElement` traversal) used for dataset initialization.
- **FR-003**: System MUST provide 100% data parity for every record between legacy parsed output and the new JSON dataset (matching standard identifier, code string, CS, ID, and OD).
- **FR-004**: System MUST provide immutable unit conversion between millimeters (`mm`) and inches (`″`) where base records remain unaltered regardless of how many times unit conversions are requested.
- **FR-005**: Converted dimensions in inches MUST be rounded to exactly 3 decimal places using numeric `toFixed(3)` conversion preserving legacy parity.
- **FR-006**: Data storage MUST be partitioned into separate flat JSON arrays per standard (`as568.json`, `jis.json`, `metric.json`), each containing records with shape `{ standard: string, code: string, cs: number, id: number, od: number }`.
- **FR-007**: Data access MUST be provided via pure functional accessors (e.g., `getStandardData(standard, unit)`), replacing the stateful/DOM-dependent `StandardData` class across consumer components (`TableSection`, `TableRowsComponent`).
- **FR-008**: System MUST provide standard table column header definitions matching existing display contracts ("Standard", "Code", "ID", "OD", "CS").

### Key Entities *(include if feature involves data)*

- **Standard Catalog Entry**: A single O-ring specification containing:
  - `standard`: The governing specification standard (e.g., AS568, JIS, Common Metric).
  - `code`: The alphanumeric standard part code (e.g., "001", "P-10", "1.5x20").
  - `cs`: Cross section nominal dimension (numeric).
  - `id`: Inside diameter nominal dimension (numeric).
  - `od`: Outside diameter nominal dimension (numeric).
- **Dimensioned Representation**: An entity produced when presenting a catalog entry in a specific unit system, adding:
  - `unit`: Unit of measurement (`mm` or `″`).
  - Adjusted numeric values for `cs`, `id`, and `od` reflecting the selected unit.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% data parity: 0 mismatched records, dimensions, or codes across all AS568, JIS, and Common Metric entries compared to legacy parsed output.
- **SC-002**: Zero runtime DOM parsing API calls (`document.createElement`, `innerHTML`) executed during data loading or querying.
- **SC-003**: Data initialization time reduced to near-instantaneous memory load (eliminating DOM tree construction and table parsing loops).
- **SC-004**: Source code bundle size for data modules reduced significantly by removing redundant HTML string markup and large string templates.
- **SC-005**: 100% test pass rate for existing filter and search operations across all standard catalog datasets.

## Assumptions

- Millimeter (`mm`) is the base canonical unit for dimensional storage in source JSON files, matching the legacy raw table base values.
- Dimension conversion factor from millimeters to inches is `1 / 25.4` (0.03937007874015748).
- Data files can be bundled or imported directly as JSON into the Vite/TypeScript build without additional external network requests.
- Catalog data is static and read-only at runtime; no user writes or persistent mutations occur to catalog entries.
