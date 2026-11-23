# Data Model: PWA & Offline-First Support

**Feature**: `009-pwa-offline-first`  
**Date**: 2026-11-23

## Entities & Interfaces

### 1. OnlineStatus

Represents client network connectivity state observed via standard browser APIs.

```typescript
export interface OnlineStatusState {
  isOnline: boolean;
}
```

- **Source of truth**: `navigator.onLine`
- **Events**: Window `online` and `offline` event listeners with cleanup on unmount
- **Validation**: Boolean flag, non-null, reactive across browser network transitions

### 2. WebAppManifest

Schema conforming to W3C Web App Manifest specification.

```typescript
export interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: "any" | "maskable" | "any maskable";
}

export interface WebAppManifest {
  id: string; // "/o-ring-finder/"
  start_url: string; // "/o-ring-finder/"
  scope: string; // "/o-ring-finder/"
  name: string; // "O-Ring Size Chart & Finder"
  short_name: string; // "O-Ring Finder"
  description: string;
  display: "standalone";
  theme_color: string; // "#0f172a"
  background_color: string; // "#0f172a"
  icons: ManifestIcon[];
}
```

### 3. Localization Keys (`footer.offline`)

Bilingual status labels added to `src/locales/{en,id}/globals.json`.

```json
{
  "footer": {
    "offlineStatus": "Working Offline (Cached Catalog)",
    "onlineStatus": "Online"
  }
}
```
- **EN**: `"Working Offline (Cached Catalog)"`
- **ID**: `"Mode Luring (Katalog Tersimpan)"`
