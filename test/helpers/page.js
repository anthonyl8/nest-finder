// Test harness for NestFinder's browser scripts.
//
// The site's scripts are plain <script> files: they run immediately, attach
// things to `window`, and do their work inside a DOMContentLoaded handler.
// These helpers reproduce that lifecycle inside jsdom:
//
//   1. resetPage()            - fresh document body, empty storage, clean URL
//   2. loadScripts([...])     - evaluate the given source files, in page order
//   3. ...which then fires DOMContentLoaded so the handlers run
//
// Each loadScripts() call re-evaluates the sources from scratch (via
// vi.resetModules), so module-private state — such as the filter state in
// results.js — never leaks between tests.

import { vi } from "vitest";
import fs from "node:fs";
import path from "node:path";

// Repo root. Under the jsdom environment `import.meta.url` is a page URL rather
// than a file URL, so derive the root from this file's directory.
const ROOT = path.resolve(import.meta.dirname, "..", "..");

// Static import map: every script the pages load. Keeping these as literal
// imports lets the bundler resolve them and keeps coverage attribution intact.
const SOURCES = {
  "auth.js": () => import("../../js/auth.js"),
  "house.js": () => import("../../js/house.js"),
  "listings.js": () => import("../../js/listings.js"),
  "navbar-auth.js": () => import("../../js/navbar-auth.js"),
  "results.js": () => import("../../js/results.js"),
};

/**
 * Load site scripts in the order a page lists them, then fire DOMContentLoaded.
 *
 * DOMContentLoaded handlers are captured rather than registered, because the
 * jsdom document is shared by every test in a file and real registrations would
 * pile up across loads.
 *
 * @param {string[]} files source file names, e.g. ["listings.js", "results.js"]
 */
export async function loadScripts(files) {
  const captured = [];
  const realAddEventListener = document.addEventListener.bind(document);
  const spy = vi
    .spyOn(document, "addEventListener")
    .mockImplementation((type, listener, options) => {
      if (type === "DOMContentLoaded") {
        captured.push(listener);
      } else {
        realAddEventListener(type, listener, options);
      }
    });

  try {
    vi.resetModules();
    for (const file of files) {
      const load = SOURCES[file];
      if (!load) throw new Error("Unknown source file: " + file);
      await load();
    }
  } finally {
    spy.mockRestore();
  }

  // The browser fires this once, after all scripts have been evaluated.
  for (const listener of captured) {
    listener(new window.Event("DOMContentLoaded"));
  }
}

/**
 * Body markup of a real page, with its <script> tags stripped (loadScripts
 * supplies those). Using the shipped HTML keeps the tests honest: if the markup
 * a script depends on is renamed, these tests fail.
 *
 * @param {string} file e.g. "browsepage.html"
 */
export function pageMarkup(file) {
  const html = fs.readFileSync(path.join(ROOT, "pages", file), "utf8");
  const parsed = new DOMParser().parseFromString(html, "text/html");
  parsed.querySelectorAll("script").forEach((script) => script.remove());
  return parsed.body.innerHTML;
}

/** Reset the document, storage, and URL between tests. */
export function resetPage(bodyHtml = "") {
  document.body.innerHTML = bodyHtml;
  document.title = "";
  localStorage.clear();
  setUrl("/");
  delete window.LISTINGS;
  delete window.Auth;
}

/** Point the page at a URL so scripts see the expected query string. */
export function setUrl(url) {
  window.history.replaceState({}, "", url);
}

/** Seed a logged-in session the way auth.js would. */
export function signIn(email = "student@ubc.ca") {
  localStorage.setItem("nestfinder_session", JSON.stringify({ email: email }));
}

/** Text of every rendered result/listing card heading, in order. */
export function cardTitles(root = document) {
  return Array.from(root.querySelectorAll(".result-heading")).map(
    (el) => el.textContent
  );
}
