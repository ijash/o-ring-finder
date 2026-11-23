import path from "node:path";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "oring-logo.png", "pwa-192x192.png", "pwa-512x512.png"],
      manifest: {
        id: "/o-ring-finder/",
        start_url: "/o-ring-finder/",
        scope: "/o-ring-finder/",
        name: "O-Ring Size Chart & Finder | AS568, JIS, Metric Sizes",
        short_name: "O-Ring Finder",
        description:
          "O-Ring size chart & code finder tool. Search and filter 3,822 standard O-ring sizes across AS568, JIS B 2401, and Metric standards by ID, OD, and CS in mm and inches.",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        icons: [
          {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff2}"],
        clientsClaim: true,
        skipWaiting: true,
        navigateFallbackDenylist: [/^\/o-ring-finder\/google[a-z0-9]+\.html$/],
      },
    }),
  ],
  base: "/o-ring-finder/",
  resolve: {
    alias: {
      assets: path.resolve(import.meta.dirname, "./src/assets"),
      components: path.resolve(import.meta.dirname, "./src/components"),
      contexts: path.resolve(import.meta.dirname, "./src/contexts"),
      data: path.resolve(import.meta.dirname, "./src/data"),
      locales: path.resolve(import.meta.dirname, "./src/locales"),
      utils: path.resolve(import.meta.dirname, "./src/utils"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          "import",
          "global-builtin",
          "color-functions",
          "if-function",
        ],
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    testTimeout: 15000,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/@types/**",
        "src/vite-env.d.ts",
        "src/setupTests.ts",
        "src/index.tsx",
      ],
      thresholds: {
        statements: 80,
        lines: 80,
        functions: 80,
        branches: 75,
      },
    },
  },
});
