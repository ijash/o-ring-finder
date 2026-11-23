# Performance & Interface Contracts: Lightweight Performance Optimization

**Feature**: `specs/006-lightweight-performance` | **Branch**: `perf/lightweight-optimization` | **Date**: 2026-11-23

## 1. Bundle Budget Contract (`check-bundle-size.mjs`)

Enforced via automated build checks:

| Asset Type | Maximum Raw Size | Maximum Gzip Size | Pre-Optimization Baseline |
|------------|------------------|-------------------|---------------------------|
| Main JS Bundle (`dist/assets/index-*.js`) | ≤ 300 kB | ≤ 85 kB | 747.53 kB raw / 181.57 kB gzip |
| Main CSS Bundle (`dist/assets/index-*.css`) | ≤ 100 kB | ≤ 25 kB | 225.21 kB raw / 30.59 kB gzip |
| Total Initial Transfer (JS + CSS + HTML) | ≤ 400 kB | ≤ 110 kB | 973.59 kB raw / 212.59 kB gzip |

Exit code convention:
- `0`: All bundles within budget limits.
- `1`: One or more assets exceed budget threshold; prints breakdown to stderr.

## 2. Icon Component Contract (`src/components/common/icons.tsx`)

```typescript
export interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number | string;
}

export const IconCircle: React.FC<IconProps>;
export const IconLanguage: React.FC<IconProps>;
export const IconEraser: React.FC<IconProps>;
```
Visual Contract:
- `viewBox`: `0 0 512 512` (Circle), `0 0 640 512` (Language), `0 0 576 512` (Eraser)
- Sizing: default `width="1em" height="1em"`
- Coloring: `fill="currentColor"` (inherits parent text color)
- ARIA: `aria-hidden="true"` by default unless labelled

## 3. Language Dropdown Accessibility Contract (`src/components/header/languageDropdown.tsx`)

```typescript
export default function LanguageDropdown(): React.JSX.Element;
```
DOM & Event Contract:
- Button element:
  - `type="button"`
  - `aria-expanded`: `"true"` when open, `"false"` when closed
  - `aria-label`: localized `"Select language"`
  - Click toggles open/closed
- Menu element:
  - Class: `.dropdown-menu.dropdown-menu-end` (adds `.show` when open)
  - Closes on click outside the component container
  - Closes on `Escape` key press
  - Closes after selecting a language option
- Zero dependence on Bootstrap JS or Popper.js.
