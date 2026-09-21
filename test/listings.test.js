// The listings are hand-maintained data that both the results page and the
// house page render directly, so a malformed entry breaks the site rather than
// just looking wrong. These checks guard the shape of that data.

import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { loadScripts, resetPage } from "./helpers/page.js";

const ROOT = path.resolve(import.meta.dirname, "..");

describe("listings data", () => {
  let listings;

  beforeAll(async () => {
    resetPage();
    await loadScripts(["listings.js"]);
    listings = window.LISTINGS;
  });

  it("is a non-empty array on window", () => {
    expect(Array.isArray(listings)).toBe(true);
    expect(listings.length).toBeGreaterThan(0);
  });

  it("gives every listing a unique id", () => {
    const ids = listings.map((listing) => listing.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => Number.isInteger(id) && id > 0)).toBe(true);
  });

  it("gives every listing the fields both pages render", () => {
    for (const listing of listings) {
      expect(Object.keys(listing).sort()).toEqual([
        "baths",
        "beds",
        "description",
        "distance",
        "id",
        "image",
        "link",
        "price",
        "title",
        "type",
      ]);
    }
  });

  it("uses sensible numbers for beds, baths, price, and distance", () => {
    for (const listing of listings) {
      expect(Number.isInteger(listing.beds), listing.title).toBe(true);
      expect(listing.beds).toBeGreaterThan(0);
      expect(Number.isInteger(listing.baths), listing.title).toBe(true);
      expect(listing.baths).toBeGreaterThan(0);
      expect(listing.price).toBeGreaterThan(0);
      expect(listing.distance).toBeGreaterThan(0);
    }
  });

  it("uses a known listing type", () => {
    for (const listing of listings) {
      expect(["apartment", "house", "room"]).toContain(listing.type);
    }
  });

  it("has a non-empty title and description", () => {
    for (const listing of listings) {
      expect(listing.title.trim().length).toBeGreaterThan(0);
      expect(listing.description.trim().length).toBeGreaterThan(0);
    }
  });

  it("links out over https", () => {
    for (const listing of listings) {
      expect(listing.link, listing.title).toMatch(/^https:\/\//);
    }
  });

  it("points at an image file that exists in the repo", () => {
    for (const listing of listings) {
      // Image paths are written the way the browser resolves them: relative to
      // the page that renders them, which lives in pages/.
      expect(listing.image).toMatch(/^\.\.\/images\//);
      const onDisk = path.join(ROOT, "pages", listing.image);
      expect(fs.existsSync(onDisk), listing.image).toBe(true);
    }
  });
});
