import { describe, it, expect, beforeEach } from "vitest";
import {
  loadScripts,
  resetPage,
  setUrl,
  pageMarkup,
  cardTitles,
} from "./helpers/page.js";

// Render the browse page (real markup) with an optional query string, then run
// listings.js + results.js the way the page does.
async function openBrowsePage(query = "") {
  resetPage(pageMarkup("browsepage.html"));
  setUrl("/browsepage.html" + query);
  await loadScripts(["listings.js", "results.js"]);
}

const countText = () => document.getElementById("results-count").textContent;
const cardCount = () => document.querySelectorAll(".result-box").length;
const dropdown = (id) => document.getElementById(id);
const optionsOf = (id) =>
  Array.from(dropdown(id).parentElement.querySelectorAll(".dropdown-content a"));
const chooseOption = (id, dataValue) => {
  const option = optionsOf(id).find((a) => a.dataset.value === dataValue);
  if (!option) throw new Error("No option " + dataValue + " in " + id);
  option.click();
};

describe("results page", () => {
  describe("initial render", () => {
    beforeEach(async () => {
      await openBrowsePage();
    });

    it("shows every listing when no filters are set", () => {
      expect(cardCount()).toBe(9);
      expect(countText()).toBe("9 homes found");
    });

    it("renders each card with its price, distance, and detail link", () => {
      const first = document.querySelector(".results .listing-link");

      expect(first.getAttribute("href")).toBe("housepage.html?id=1");
      expect(first.getAttribute("target")).toBe("_blank");
      expect(first.querySelector(".result-heading").textContent).toBe(
        "1 Bed 1 Bath - Apartment Round"
      );
      expect(first.querySelector(".result-price").textContent).toBe(
        "from $2,600 a month"
      );
      expect(first.querySelector(".result-distance").textContent).toBe(
        "~1.3 km from UBC"
      );
      expect(first.querySelector(".result-img").getAttribute("src")).toBe(
        "images/result-img-1.png"
      );
      expect(first.querySelector(".result-img").getAttribute("alt")).toBe(
        "1 Bed 1 Bath - Apartment Round"
      );
    });

    it("keeps the listings in source order", () => {
      expect(cardTitles()[0]).toBe("1 Bed 1 Bath - Apartment Round");
      expect(cardTitles()[8]).toBe("Private Room for Rent");
    });
  });

  describe("keyword search", () => {
    beforeEach(async () => {
      await openBrowsePage();
    });

    function search(text) {
      document.querySelector(".search-bar").value = text;
      document.querySelector(".search-button").click();
    }

    it("matches on the listing title", () => {
      search("house");

      expect(cardTitles()).toEqual(["2 Beds 2 Baths House", "1 Bed 1 Bath - House"]);
      expect(countText()).toBe("2 homes found");
    });

    it("matches on the listing type", () => {
      search("room");

      // "room" also appears inside "bedroom" titles, which is intended:
      // the search is a plain substring match over title + type.
      expect(cardTitles()).toContain("Private Room for Rent");
      expect(cardCount()).toBe(3);
    });

    it("requires every term to match", () => {
      search("private room");

      expect(cardTitles()).toEqual(["Private Room for Rent"]);
      expect(countText()).toBe("1 home found");
    });

    it("ignores case and surrounding whitespace", () => {
      search("   HOUSE  ");

      expect(cardCount()).toBe(2);
    });

    it("collapses extra spaces between terms", () => {
      search("private     room");

      expect(cardCount()).toBe(1);
    });

    it("searches on Enter as well as the button", () => {
      const bar = document.querySelector(".search-bar");
      bar.value = "house";
      bar.dispatchEvent(
        new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true })
      );

      expect(cardCount()).toBe(2);
    });

    it("ignores other keys", () => {
      const bar = document.querySelector(".search-bar");
      bar.value = "house";
      bar.dispatchEvent(
        new window.KeyboardEvent("keydown", { key: "a", bubbles: true })
      );

      expect(cardCount()).toBe(9);
    });

    it("explains when nothing matches", () => {
      search("castle");

      expect(cardCount()).toBe(0);
      expect(countText()).toBe("0 homes found");
      expect(document.querySelector(".no-results").textContent).toBe(
        "No homes match your search. Try clearing a filter or a different keyword."
      );
    });

    it("returns to the full list when the search is cleared", () => {
      search("castle");
      search("");

      expect(cardCount()).toBe(9);
    });
  });

  describe("filter dropdowns", () => {
    beforeEach(async () => {
      await openBrowsePage();
    });

    it("filters by minimum bedrooms", () => {
      chooseOption("dropdown1", ">2 bedrooms");

      expect(cardCount()).toBe(4);
      expect(cardTitles().every((t) => !t.startsWith("1 Bed"))).toBe(true);
      expect(dropdown("dropdown1").textContent).toBe(">2 bedrooms");
    });

    it("filters by budget", () => {
      chooseOption("dropdown2", "<$2500");

      expect(cardTitles()).toEqual([
        "1 Bed 1 Bath - Apartment",
        "1 Bed 1 Bath - House",
        "Private Room for Rent",
      ]);
    });

    it("filters by distance from UBC", () => {
      chooseOption("dropdown3", "<1 km");

      expect(cardCount()).toBe(4);
      expect(countText()).toBe("4 homes found");
    });

    it("includes listings exactly at the distance limit", () => {
      chooseOption("dropdown3", "<0.5 km");

      // 0.5 km listings qualify — the bound is inclusive.
      expect(cardTitles()).toEqual([
        "1 Bed 1 Bath - Apartment",
        "2 Beds 2 Baths House",
        "Private Room for Rent",
      ]);
    });

    it("combines filters with each other", () => {
      chooseOption("dropdown1", ">2 bedrooms");
      chooseOption("dropdown3", "<1 km");

      expect(cardTitles()).toEqual(["2 Beds 2 Baths House"]);
    });

    it("combines filters with the keyword search", () => {
      document.querySelector(".search-bar").value = "apartment";
      document.querySelector(".search-button").click();
      chooseOption("dropdown2", "<$3000");

      expect(cardTitles()).toEqual([
        "1 Bed 1 Bath - Apartment Round",
        "1 Bed 1 Bath - Apartment",
      ]);
    });

    it("replaces a filter when a different option is picked", () => {
      chooseOption("dropdown2", "<$2000");
      expect(cardCount()).toBe(2);

      chooseOption("dropdown2", "<$3000");
      expect(cardCount()).toBe(4);
    });

    it("can filter down to nothing", () => {
      chooseOption("dropdown1", ">3 bedrooms");

      expect(cardCount()).toBe(0);
      expect(document.querySelector(".no-results")).not.toBeNull();
    });
  });

  describe("dropdown open/close behaviour", () => {
    beforeEach(async () => {
      await openBrowsePage();
    });

    const menuOf = (id) => dropdown(id).nextElementSibling;

    it("opens and closes on repeated clicks of its button", () => {
      dropdown("dropdown1").click();
      expect(menuOf("dropdown1").classList.contains("show")).toBe(true);

      dropdown("dropdown1").click();
      expect(menuOf("dropdown1").classList.contains("show")).toBe(false);
    });

    it("closes when clicking elsewhere on the page", () => {
      dropdown("dropdown1").click();
      document.querySelector(".search-prompt").click();

      expect(menuOf("dropdown1").classList.contains("show")).toBe(false);
    });

    it("closes after an option is chosen", () => {
      dropdown("dropdown2").click();
      chooseOption("dropdown2", "<$2000");

      expect(menuOf("dropdown2").classList.contains("show")).toBe(false);
    });
  });

  describe("filters prefilled from the URL", () => {
    it("applies a keyword from ?q", async () => {
      await openBrowsePage("?q=house");

      expect(cardCount()).toBe(2);
      expect(document.querySelector(".search-bar").value).toBe("house");
    });

    it("applies ?beds and labels the dropdown", async () => {
      await openBrowsePage("?beds=" + encodeURIComponent(">2 bedrooms"));

      expect(cardCount()).toBe(4);
      expect(dropdown("dropdown1").textContent).toBe(">2 bedrooms");
    });

    it("applies ?price and labels the dropdown", async () => {
      await openBrowsePage("?price=" + encodeURIComponent("<$2500"));

      expect(cardCount()).toBe(3);
      expect(dropdown("dropdown2").textContent).toBe("<$2500");
    });

    it("applies ?dist and labels the dropdown", async () => {
      await openBrowsePage("?dist=" + encodeURIComponent("<0.5 km"));

      expect(cardCount()).toBe(3);
      expect(dropdown("dropdown3").textContent).toBe("<0.5 km");
    });

    it("applies several parameters together", async () => {
      await openBrowsePage(
        "?q=house&beds=" +
          encodeURIComponent(">2 bedrooms") +
          "&dist=" +
          encodeURIComponent("<1 km")
      );

      expect(cardTitles()).toEqual(["2 Beds 2 Baths House"]);
    });

    it("accepts a bare number as well as a decorated label", async () => {
      await openBrowsePage("?price=2500");

      expect(cardCount()).toBe(3);
    });

    it("still filters when the value matches no dropdown option", async () => {
      await openBrowsePage("?beds=" + encodeURIComponent(">9 bedrooms"));

      expect(cardCount()).toBe(0);
    });

    it("ignores a parameter with no number in it", async () => {
      await openBrowsePage("?beds=lots&price=cheap&dist=near");

      expect(cardCount()).toBe(9);
    });

    it("ignores empty parameters", async () => {
      await openBrowsePage("?q=&beds=&price=&dist=");

      expect(cardCount()).toBe(9);
    });
  });

  describe("clearing filters", () => {
    it("restores every listing and resets the controls", async () => {
      await openBrowsePage("?q=house");
      chooseOption("dropdown1", ">2 bedrooms");
      chooseOption("dropdown2", "<$3000");
      chooseOption("dropdown3", "<1 km");
      expect(cardCount()).toBe(0);

      document.getElementById("reset-filters").click();

      expect(cardCount()).toBe(9);
      expect(countText()).toBe("9 homes found");
      expect(document.querySelector(".search-bar").value).toBe("");
      expect(dropdown("dropdown1").textContent).toBe(" --Number of Bedrooms-- v");
      expect(dropdown("dropdown2").textContent).toBe(" --Total Room Budget-- v");
      expect(dropdown("dropdown3").textContent).toBe(" --Distance from UBC-- v");
    });

    it("leaves the page usable for a new search afterwards", async () => {
      await openBrowsePage("?q=house");
      document.getElementById("reset-filters").click();

      document.querySelector(".search-bar").value = "room";
      document.querySelector(".search-button").click();

      expect(cardCount()).toBe(3);
    });
  });

  describe("pages with only some of the controls", () => {
    it("renders results with no count, search box, dropdowns, or reset link", async () => {
      resetPage('<div class="results"></div>');
      setUrl("/somepage.html");

      await loadScripts(["listings.js", "results.js"]);

      expect(cardCount()).toBe(9);
    });

    it("searches on Enter when there is no search button", async () => {
      resetPage(
        '<input class="search-bar"><div class="results"></div>' +
          '<span id="results-count"></span>'
      );
      setUrl("/somepage.html");
      await loadScripts(["listings.js", "results.js"]);

      const bar = document.querySelector(".search-bar");
      bar.value = "house";
      bar.dispatchEvent(
        new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true })
      );

      expect(cardCount()).toBe(2);
    });

    it("applies a URL filter even when the dropdown has no options to label", async () => {
      resetPage(
        '<div class="dropdown"><button id="dropdown1" class="dropbtn">Beds</button>' +
          '<div class="dropdown-content"></div></div>' +
          '<div class="results"></div>'
      );
      setUrl("/somepage.html?beds=" + encodeURIComponent(">2 bedrooms"));

      await loadScripts(["listings.js", "results.js"]);

      expect(cardCount()).toBe(4);
      expect(dropdown("dropdown1").textContent).toBe("Beds");
    });

    it("toggles a dropdown that controls no filter without changing results", async () => {
      resetPage(
        '<div class="dropdown"><button id="sort" class="dropbtn">Sort</button>' +
          '<div class="dropdown-content"><a href="#" data-value="Newest">Newest</a></div>' +
          "</div><div class=\"results\"></div>"
      );
      setUrl("/somepage.html");
      await loadScripts(["listings.js", "results.js"]);

      const menu = document.querySelector(".dropdown-content");
      document.getElementById("sort").click();
      expect(menu.classList.contains("show")).toBe(true);

      menu.querySelector("a").click();

      expect(document.getElementById("sort").textContent).toBe("Newest");
      expect(menu.classList.contains("show")).toBe(false);
      expect(cardCount()).toBe(9);
    });
  });

  describe("pages without a results area", () => {
    it("does nothing instead of failing", async () => {
      resetPage('<div class="search"><input class="search-bar"></div>');
      setUrl("/homepage.html?q=house");

      await expect(loadScripts(["listings.js", "results.js"])).resolves.toBeUndefined();
      expect(document.querySelector(".result-box")).toBeNull();
    });
  });

  describe("pages with no listings data", () => {
    it("reports zero results rather than crashing", async () => {
      resetPage(pageMarkup("browsepage.html"));
      setUrl("/browsepage.html");

      await loadScripts(["results.js"]); // listings.js deliberately not loaded

      expect(countText()).toBe("0 homes found");
      expect(document.querySelector(".no-results")).not.toBeNull();
    });
  });
});
