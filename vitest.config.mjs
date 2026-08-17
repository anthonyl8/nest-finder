import { defineConfig } from "vitest/config";

// The site is a plain static bundle of <script> files, so tests run against a
// jsdom document and load each source file the way a browser would.
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["test/**/*.test.js"],
    setupFiles: ["test/setup/storage.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Only the site's own scripts — not the test harness or config.
      include: ["auth.js", "house.js", "listings.js", "navbar-auth.js", "results.js"],
    },
  },
});
