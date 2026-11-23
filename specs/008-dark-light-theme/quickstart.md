# Quickstart & Verification Guide: Dark and Light Theme Mode

**Feature**: Dark and Light Theme Mode  
**Branch**: `feat/dark-light-theme`  
**Date**: 2026-11-23  

## Overview
This guide defines runnable validation procedures for testing the Dark and Light Theme implementation end-to-end.

---

## 1. Automated Verification Commands

Run existing and new automated checks:

```bash
# 1. Type check
pnpm run check

# 2. Automated test suite (all tests passing + coverage)
pnpm test

# 3. Bilingual i18n parity check
node scripts/check-i18n-parity.mjs

# 4. Production bundle size check
node scripts/check-bundle-size.mjs

# 5. Full 5/5 quality gates verification
./scripts/verify-gates.sh
```

---

## 2. Manual & Visual Validation Scenarios

### Scenario A: Zero-FOUC Cold Page Load
1. Open DevTools Application tab -> Local Storage.
2. Set key `oring_theme` to value `"dark"`.
3. Hard-reload the page (`Ctrl + Shift + R`).
4. **Expected Result**: Page renders immediately with dark background and dark navbar. No momentary white flash (FOUC) occurs. `<html data-bs-theme="dark">` is set synchronously on pre-paint.

### Scenario B: Navbar Theme Toggle Interaction
1. Start in Light Mode. Note Sun/Moon button icon in navbar.
2. Click the theme toggle button.
3. **Expected Result**:
   - `data-bs-theme` attribute on `<html>` updates immediately from `"light"` to `"dark"`.
   - `<meta name="theme-color">` updates to dark color `#1a1d20`.
   - Navbar toggle icon switches from Moon to Sun.
   - `localStorage.getItem("oring_theme")` equals `"dark"`.
   - Visual layout remains identical (0 geometry shift, 0 pixel movement of surrounding navbar elements).

### Scenario C: Component Readability & Contrast in Dark Mode
1. Ensure Dark Mode is active.
2. Inspect the following components:
   - **Filter input fields**: Dark background, light input text, clear focus border.
   - **Table header**: Dark background, white/light text, clear sort indicators.
   - **Table rows**: High-contrast text, alternating row contrast, hover highlight is visible and readable.
   - **FAQ section**: Cards have dark background, primary color question headers, readable body answers.
   - **Footer**: Readable contrast against dark backdrop.

### Scenario D: Realistic 3D O-Ring Visualization in Modal
1. In Dark Mode, click any table row to open the O-ring detail modal.
2. Inspect the SVG visualization:
   - Dot-grid backdrop and soft radial glow are visible against dark container.
   - Black rubber O-ring has realistic 3D specular highlight and drop shadow.
   - Dimension arrows and text (OD, ID, CS) render with high-contrast light blue lines and legible labels.
3. Switch back to Light Mode while modal is open.
4. **Expected Result**: Visualization smoothly transitions to light dot-grid and light-mode dimension colors without changing container dimensions or closing the modal.
