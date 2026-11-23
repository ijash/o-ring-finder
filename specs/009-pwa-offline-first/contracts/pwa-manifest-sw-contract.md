# Contract: Web App Manifest & Service Worker Specification

**Feature**: `009-pwa-offline-first`  
**Date**: 2026-11-23

## 1. Web App Manifest Contract (`dist/manifest.webmanifest`)

The emitted manifest MUST satisfy the following JSON schema contract:

```json
{
  "id": "/o-ring-finder/",
  "name": "O-Ring Size Chart & Finder | AS568, JIS, Metric Sizes",
  "short_name": "O-Ring Finder",
  "description": "O-Ring size chart & code finder tool. Search and filter 3,822 standard O-ring sizes across AS568, JIS B 2401, and Metric standards by ID, OD, and CS in mm and inches.",
  "theme_color": "#0f172a",
  "background_color": "#0f172a",
  "display": "standalone",
  "start_url": "/o-ring-finder/",
  "scope": "/o-ring-finder/",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

## 2. Service Worker Lifecycle Contract (`dist/sw.js`)

- **Registration Scope**: `/o-ring-finder/`
- **Cache Name Prefix**: `workbox-precache`
- **Precache Glob**: `**/*.{js,css,html,ico,png,svg,json,woff2}`
- **Activation Strategy**: `skipWaiting: true`, `clientsClaim: true`
- **Navigate Fallback**: `/o-ring-finder/index.html`
- **Denylist**: Exclude verification files matching `/google[a-z0-9]+\.html$/`

## 3. Hook Interface Contract (`useOnlineStatus`)

```typescript
export function useOnlineStatus(): boolean;
```
- Returns `true` when online (`navigator.onLine === true`), `false` when offline.
- Subscribes to `window.addEventListener("online", handler)` and `window.addEventListener("offline", handler)`.
- Removes both listeners on unmount.
