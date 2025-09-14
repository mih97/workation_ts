import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "tests/**/*.{test,spec}.{js,ts}",
      "src/**/*.{test,spec}.{js,ts}"
    ],
    exclude: [
      "node_modules",
      "dist"
    ]
  }
});