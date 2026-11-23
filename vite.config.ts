import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  base: "/o-ring-finder/",
  resolve: {
    alias: {
      assets: path.resolve(import.meta.dirname, "./src/assets"),
      components: path.resolve(import.meta.dirname, "./src/components"),
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
  },
});
