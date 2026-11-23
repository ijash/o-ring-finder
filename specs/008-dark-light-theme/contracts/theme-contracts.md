# Interface Contracts: Dark and Light Theme Mode

**Feature**: Dark and Light Theme Mode  
**Branch**: `feat/dark-light-theme`  
**Date**: 2026-11-23  

## 1. ThemeContext API Contract

Exposed from `src/contexts/ThemeContext.tsx` and re-exported via `src/contexts/index.ts`.

```typescript
import { createContext, useContext, ReactNode } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element;

export function useTheme(): ThemeContextValue;
```

**Guard Condition**: Calling `useTheme()` outside of `ThemeProvider` MUST throw an explicit runtime error:
`"useTheme must be used within a ThemeProvider"`.

---

## 2. DOM Contract & Anti-FOUC Head Script

Placed in `<head>` of `index.html` immediately before stylesheets:

```html
<script>
  (function () {
    try {
      var stored = localStorage.getItem('oring_theme');
      var theme = stored === 'dark' || stored === 'light'
        ? stored
        : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-bs-theme', theme);
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', theme === 'dark' ? '#1a1d20' : '#2fa4e7');
      }
    } catch (e) {}
  })();
</script>
```

---

## 3. Localization Contract (`globals.json`)

Both `src/locales/en/globals.json` and `src/locales/id/globals.json` MUST contain matching keys:

### English (`en/globals.json`):
```json
"theme": {
  "toggle": "Toggle color theme",
  "toggleToDark": "Switch to dark mode",
  "toggleToLight": "Switch to light mode"
}
```

### Indonesian (`id/globals.json`):
```json
"theme": {
  "toggle": "Ganti tema warna",
  "toggleToDark": "Beralih ke mode gelap",
  "toggleToLight": "Beralih ke mode terang"
}
```

---

## 4. Navbar Theme Toggle Component Contract

`src/components/header/themeToggle.tsx`:

```typescript
export function ThemeToggle(): JSX.Element;
```

- Accessible `<button type="button" className="btn btn-primary btn-sm me-2">` matching `LanguageDropdown` height, padding, and border radius.
- Renders `IconMoon` when theme is `light` (accessible label: `t("theme.toggleToDark")`).
- Renders `IconSun` when theme is `dark` (accessible label: `t("theme.toggleToLight")`).
- Zero layout shift: exact same dimensions (31px height, matching Bootstrap `btn-sm`).

---

## 5. RingVisualization Component Contract

`src/components/modal/visualization.tsx`:

```typescript
export interface ViewportDimensions {
  width: number;
  height: number;
}

export interface VisualizationProps {
  ringDimensions: DataRepresentation;
  dimensions: ViewportDimensions;
}

export const RingVisualization: React.FC<VisualizationProps>;
```

- Props interface remains strictly identical (zero breaking changes for consumers).
- Internally consumes `useTheme()` or checks `document.documentElement.getAttribute('data-bs-theme')` to render high-contrast dark-mode SVG palettes.
- Renders realistic 3D toroidal O-ring with specular gradient highlights, ambient drop-shadow, subtle dot grid, and high-contrast dimension lines/text.
