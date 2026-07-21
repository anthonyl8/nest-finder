// Results page: render listings from listings.js and drive keyword search +
// bedroom / budget / distance filters. Depends on window.LISTINGS.

(function () {
  "use strict";

  // Current filter state. null means "no constraint".
  var state = {
    q: "",
    minBeds: null,
    maxPrice: null,
    maxDist: null,
  };

  // Pull the first number out of a dropdown data-value like ">2 bedrooms",
  // "<$2500", or "<1.5 km".
  function parseNumber(value) {
    var match = String(value).match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : null;
  }

  function formatPrice(price) {
    return "$" + price.toLocaleString("en-US");
  }

  // Decide whether a listing passes the current filters.
  function matches(listing) {
    if (state.minBeds !== null && listing.beds < state.minBeds) return false;
    if (state.maxPrice !== null && listing.price >= state.maxPrice) return false;
    if (state.maxDist !== null && listing.distance > state.maxDist) return false;

    if (state.q) {
      var haystack = (listing.title + " " + listing.type).toLowerCase();
      var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      // Every search term must appear somewhere in the title/type.
      for (var i = 0; i < terms.length; i++) {
        if (haystack.indexOf(terms[i]) === -1) return false;
      }
    }
    return true;
  }

  function listingCard(listing) {
    return (
      '<a class="listing-link" href="housepage.html" target="_blank">' +
      '<div class="result-box">' +
      '<img class="result-img" src="' + listing.image + '" alt="' + listing.title + '">' +
      '<div class="result-text">' +
      '<p class="result-heading">' + listing.title + "</p>" +
      '<p class="result-price">from <u><strong>' + formatPrice(listing.price) + "</strong></u> a month</p>" +
      '<p class="result-distance">~' + listing.distance + " km from UBC</p>" +
      "</div></div></a>"
    );
  }

  function render() {
    var results = document.querySelector(".results");
    var countEl = document.getElementById("results-count");
    if (!results) return;

    var matched = (window.LISTINGS || []).filter(matches);

    if (countEl) {
      countEl.textContent =
        matched.length +
        (matched.length === 1 ? " home found" : " homes found");
    }

    if (matched.length === 0) {
      results.innerHTML =
        '<p class="no-results">No homes match your search. Try clearing a filter or a different keyword.</p>';
      return;
    }

    results.innerHTML = matched.map(listingCard).join("");
  }

  // Wire up search box, filter dropdowns, and the reset control.
  function init() {
    if (!document.querySelector(".results")) return;

    // Prefill state from URL params (so search can flow in from the browse page).
    var params = new URLSearchParams(window.location.search);
    if (params.get("q")) state.q = params.get("q");
    if (params.get("beds")) state.minBeds = parseNumber(params.get("beds"));
    if (params.get("price")) state.maxPrice = parseNumber(params.get("price"));
    if (params.get("dist")) state.maxDist = parseNumber(params.get("dist"));

    var searchBar = document.querySelector(".search-bar");
    var searchButton = document.querySelector(".search-button");

    if (searchBar) {
      searchBar.value = state.q;
      var runSearch = function () {
        state.q = searchBar.value.trim();
        render();
      };
      if (searchButton) {
        searchButton.addEventListener("click", function (e) {
          e.preventDefault();
          runSearch();
        });
      }
      searchBar.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          runSearch();
        }
      });
    }

    // Map each dropdown to the state field it controls.
    var dropdownFields = {
      dropdown1: "minBeds",
      dropdown2: "maxPrice",
      dropdown3: "maxDist",
    };

    // Toggle a dropdown open/closed.
    document.querySelectorAll(".dropbtn").forEach(function (button) {
      button.addEventListener("click", function () {
        this.nextElementSibling.classList.toggle("show");
      });
      // Reflect any pre-filled filter in the button label.
      var field = dropdownFields[button.id];
      if (field && state[field] !== null) {
        var selected = button.parentElement.querySelector(
          '.dropdown-content a[data-value]'
        );
        // Find the option whose number matches the pre-filled value.
        button.parentElement
          .querySelectorAll(".dropdown-content a")
          .forEach(function (a) {
            if (parseNumber(a.dataset.value) === state[field]) selected = a;
          });
        if (selected) button.textContent = selected.dataset.value;
      }
    });

    // Selecting an option sets the matching filter and re-renders.
    document.querySelectorAll(".dropdown-content a").forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        var dropdown = this.closest(".dropdown");
        var button = dropdown.querySelector(".dropbtn");
        var field = dropdownFields[button.id];

        button.textContent = this.dataset.value;
        if (field) state[field] = parseNumber(this.dataset.value);

        dropdown.querySelector(".dropdown-content").classList.remove("show");
        render();
      });
    });

    // Reset button clears everything.
    var reset = document.getElementById("reset-filters");
    if (reset) {
      reset.addEventListener("click", function (e) {
        e.preventDefault();
        state.q = "";
        state.minBeds = null;
        state.maxPrice = null;
        state.maxDist = null;
        if (searchBar) searchBar.value = "";
        document.getElementById("dropdown1").innerHTML =
          " --Number of Bedrooms-- <strong>v</strong>";
        document.getElementById("dropdown2").innerHTML =
          " --Total Room Budget-- <strong>v</strong>";
        document.getElementById("dropdown3").innerHTML =
          " --Distance from UBC-- <strong>v</strong>";
        render();
      });
    }

    // Close dropdowns when clicking outside.
    window.addEventListener("click", function (event) {
      if (!event.target.matches(".dropbtn")) {
        document
          .querySelectorAll(".dropdown-content.show")
          .forEach(function (dd) {
            dd.classList.remove("show");
          });
      }
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
