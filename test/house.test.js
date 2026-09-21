import { describe, it, expect } from "vitest";
import { loadScripts, resetPage, setUrl, pageMarkup, cardTitles } from "./helpers/page.js";

// Render the house detail page (real markup) for a given ?id=, then run
// listings.js + house.js the way the page does.
async function openHousePage(query = "") {
  resetPage(pageMarkup("housepage.html"));
  setUrl("/housepage.html" + query);
  await loadScripts(["listings.js", "house.js"]);
}

const text = (selector) => document.querySelector(selector).textContent;
const moreLinks = () =>
  Array.from(document.querySelectorAll(".more-listings .listing-link")).map((a) =>
    a.getAttribute("href")
  );

describe("house detail page", () => {
  describe("the requested listing", () => {
    it("fills in the detail section from ?id=", async () => {
      await openHousePage("?id=5");

      expect(text(".listing-title")).toBe("1 Bed 1 Bath - House");
      expect(text(".description")).toContain("Affordable 1 bedroom in a shared house");
      expect(text(".desc-distance")).toBe("~1.2 km from UBC");
      expect(document.querySelector(".house-image").getAttribute("src")).toBe(
        "../images/result-img-5.jpeg"
      );
      expect(document.querySelector(".house-image").getAttribute("alt")).toBe(
        "1 Bed 1 Bath - House"
      );
    });

    it("uses the listing title as the page title", async () => {
      await openHousePage("?id=9");

      expect(document.title).toBe("Private Room for Rent");
    });

    it("prices every redirect button", async () => {
      await openHousePage("?id=7");

      const labels = Array.from(document.querySelectorAll(".redirect-button")).map(
        (button) => button.textContent
      );
      expect(labels).toEqual(["$5,995/Month", "$5,995/Month"]);
    });

    it("formats prices under a thousand without a separator", async () => {
      await openHousePage("?id=5");

      expect(document.getElementById("fb-button").textContent).toBe("$750/Month");
    });

    it("points the Facebook link at the listing's external URL", async () => {
      await openHousePage("?id=1");

      expect(document.getElementById("fb-link").getAttribute("href")).toBe(
        "https://www.facebook.com/share/196dEAFhPW/"
      );
    });
  });

  describe("falling back to the first listing", () => {
    it("when no id is given", async () => {
      await openHousePage();

      expect(text(".listing-title")).toBe("1 Bed 1 Bath - Apartment Round");
    });

    it("when the id is not a number", async () => {
      await openHousePage("?id=not-a-number");

      expect(text(".listing-title")).toBe("1 Bed 1 Bath - Apartment Round");
    });

    it("when no listing has that id", async () => {
      await openHousePage("?id=999");

      expect(text(".listing-title")).toBe("1 Bed 1 Bath - Apartment Round");
      expect(document.title).toBe("1 Bed 1 Bath - Apartment Round");
    });
  });

  describe("the More Listings strip", () => {
    it("shows four other listings", async () => {
      await openHousePage("?id=5");

      expect(moreLinks()).toEqual([
        "housepage.html?id=1",
        "housepage.html?id=2",
        "housepage.html?id=3",
        "housepage.html?id=4",
      ]);
    });

    it("never includes the listing being viewed", async () => {
      await openHousePage("?id=2");

      expect(moreLinks()).not.toContain("housepage.html?id=2");
      expect(cardTitles(document.querySelector(".more-listings"))).not.toContain(
        "2 Bed/2 Bath Apartment"
      );
    });

    it("renders each card with a price and distance", async () => {
      await openHousePage("?id=1");

      const first = document.querySelector(".more-listings .listing-link");
      expect(first.querySelector(".result-heading").textContent).toBe(
        "2 Bed/2 Bath Apartment"
      );
      expect(first.querySelector(".result-price").textContent).toBe(
        "from $4,100 a month"
      );
      expect(first.querySelector(".result-distance").textContent).toBe(
        "~1.5 km from UBC"
      );
      expect(first.querySelector(".result-img").getAttribute("src")).toBe(
        "../images/result-img-2.png"
      );
    });

    it("replaces any previously rendered cards", async () => {
      await openHousePage("?id=1");
      expect(document.querySelectorAll(".more-listings .result-box")).toHaveLength(4);

      await openHousePage("?id=3");
      expect(document.querySelectorAll(".more-listings .result-box")).toHaveLength(4);
    });
  });

  describe("pages missing parts of the detail markup", () => {
    it("fills in whatever is present and skips the rest", async () => {
      resetPage('<p class="listing-title">placeholder</p>');
      setUrl("/housepage.html?id=9");

      await loadScripts(["listings.js", "house.js"]);

      expect(text(".listing-title")).toBe("Private Room for Rent");
      expect(document.title).toBe("Private Room for Rent");
    });

    it("works on a page with no detail elements at all", async () => {
      resetPage("<main></main>");
      setUrl("/housepage.html?id=4");

      await expect(loadScripts(["listings.js", "house.js"])).resolves.toBeUndefined();
      expect(document.title).toBe("2 Beds 2 Baths House");
    });
  });

  describe("when listings data is missing", () => {
    it("leaves the static markup alone instead of crashing", async () => {
      resetPage(pageMarkup("housepage.html"));
      setUrl("/housepage.html?id=5");

      await loadScripts(["house.js"]); // listings.js deliberately not loaded

      expect(document.querySelector(".more-listings").innerHTML).toBe("");
      expect(text(".listing-title")).toBe("1 Bed 1 Bath - Apartment Round");
    });
  });
});
