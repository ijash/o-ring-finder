# Quickstart & Verification Guide: Data to JSON Transformation

**Feature**: `001-data-to-json`  
**Date**: 2026-11-23

This guide provides runnable instructions to verify the data transformation, parity validation, type check, unit tests, and build.

## Prerequisites
- Node.js >= 18
- pnpm >= 8

---

## 1. Automated Verification Commands

Run the full project test suite and quality gates:

```bash
# 1. Type Check (Strict TypeScript - Principle II)
npx tsc --noEmit

# 2. Automated Unit Tests (Principle IX)
pnpm test -- --watchAll=false

# 3. Production Build Validation
pnpm build
```

---

## 2. Parity Verification Scenarios

### Scenario 1: Row Count & Record Integrity
Validate that all records from legacy HTML tables exist in the new JSON files:
- `src/data/as568.json`: 394 records
- `src/data/jis.json`: 339 records
- `src/data/metric.json`: 188 records
- Every record has non-empty `code`, finite positive `cs`, `id`, `od`, and matching `standard` enum.

### Scenario 2: Dimension & Unit Conversion Parity
For known O-rings, check conversion matching:
- **AS568-001**:
  - `mm`: `cs: 1.78`, `id: 0.74`, `od: 4.3`
  - `inch`: `cs: 0.070`, `id: 0.029`, `od: 0.169`
- **JIS P-3**:
  - `mm`: `cs: 1.9`, `id: 2.8`, `od: 6.6`
  - `inch`: `cs: 0.075`, `id: 0.110`, `od: 0.260`
- **Metric 1.5x20**:
  - `mm`: `cs: 1.5`, `id: 20`, `od: 23`
  - `inch`: `cs: 0.059`, `id: 0.787`, `od: 0.906`

### Scenario 3: Immutability Test
Calling `convertToUnit(baseRecords, MeasurementUnit.INCH)` and subsequently inspecting `baseRecords` confirms:
- Base records retain original millimeter values (`cs`, `id`, `od`).
- No properties were added or mutated on input objects.

---

## 3. Manual UI Verification
Start the development server:
```bash
pnpm start
```
1. Open browser at `http://localhost:3000`.
2. Verify all O-rings render cleanly in the main table.
3. Toggle between `mm` and `″` (inches) in the unit selector.
4. Verify table headers, values, and search modal reflect converted measurements without error or lag.
5. Filter by ID / OD / CS ranges; verify matching entries display as expected.
