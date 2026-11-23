# Data Model: Dark and Light Theme Mode

**Feature**: Dark and Light Theme Mode  
**Branch**: `feat/dark-light-theme`  
**Date**: 2026-11-23  

## Entities & Type Definitions

### 1. `Theme`
Represents the active resolved visual color mode applied to the DOM.

```typescript
export type Theme = "light" | "dark";
```

- **Validation Rules**: Must be strictly either `"light"` or `"dark"`. Magic strings or arbitrary values are forbidden.
- **Default Resolution**:
  1. `localStorage.getItem("oring_theme")` if value is `"light"` or `"dark"`.
  2. Fallback to `window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"`.

---

### 2. `ThemeContextValue`
Contract exposed by `ThemeContext` via `useTheme` hook.

```typescript
export interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}
```

- `theme`: Current active theme (`"light"` or `"dark"`).
- `isDark`: Convenience boolean (`theme === "dark"`).
- `toggleTheme()`: Toggles between `"light"` and `"dark"`, writing new value to `localStorage` and `data-bs-theme`.
- `setTheme(theme)`: Sets explicit theme, updating `localStorage` and DOM.

---

### 3. Storage Model (`localStorage`)

- **Key**: `"oring_theme"`
- **Values**: `"light" | "dark"`
- **Lifecycle**:
  - Read synchronously during HTML pre-paint inline script.
  - Read during `ThemeContext` initialization.
  - Written on every user theme toggle.
  - Safe error handling wrapped in `try/catch` for restricted privacy browsing environments.

---

### 4. DOM Color Mode Tokens & State Sync

| Entity / Target | Light Mode Value | Dark Mode Value | Sync Trigger |
| :--- | :--- | :--- | :--- |
| `document.documentElement` (`<html data-bs-theme="...">`) | `"light"` | `"dark"` | Pre-paint script + `useTheme` effect |
| `<meta name="theme-color">` | `#2fa4e7` (Cerulean Primary) | `#1a1d20` (Dark Surface) | Pre-paint script + `useTheme` effect |
| Navbar toggle icon | Moon (`IconMoon`) | Sun (`IconSun`) | React re-render from `theme` state |
| Navbar toggle aria-label | `t("theme.toggleToDark")` | `t("theme.toggleToLight")` | React re-render + active locale |
| `RingVisualization` backdrop | Light gradient + `#e2e8f0` dots | Deep slate gradient + `#334155` dots | React prop / `isDark` check |
| `RingVisualization` dimension text/lines | `#336E90` / `#3388B9` | `#79c7f7` / `#54b2e9` | React prop / `isDark` check |

---

### 5. Localization Data Model (`globals.json`)

Added keys under `"theme"` in `src/locales/en/globals.json` and `src/locales/id/globals.json`:

```json
{
  "theme": {
    "toggle": "Toggle color theme",
    "toggleToDark": "Switch to dark mode",
    "toggleToLight": "Switch to light mode",
    "currentMode": "Current theme: {{mode}}"
  }
}
```
100% parity strictly required between `en` and `id`.
