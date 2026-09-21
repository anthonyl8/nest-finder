// House detail page: populate the listing detail and the "More Listings" strip
// from window.LISTINGS, based on the ?id=... URL parameter.

(function () {
  "use strict";

  function formatPrice(price) {
    return "$" + price.toLocaleString("en-US");
  }

  function moreListingCard(listing) {
    return (
      '<a class="listing-link" href="housepage.html?id=' + listing.id + '">' +
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
    var listings = window.LISTINGS || [];
    if (!listings.length) return;

    // Find the requested listing; fall back to the first one.
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get("id"), 10);
    var listing =
      listings.filter(function (l) {
        return l.id === id;
      })[0] || listings[0];

    // Populate the detail section.
    document.title = listing.title;

    var image = document.querySelector(".house-image");
    if (image) {
      image.src = listing.image;
      image.alt = listing.title;
    }

    var title = document.querySelector(".listing-title");
    if (title) title.textContent = listing.title;

    var description = document.querySelector(".description");
    if (description) description.textContent = listing.description;

    var distance = document.querySelector(".desc-distance");
    if (distance) distance.textContent = "~" + listing.distance + " km from UBC";

    var priceLabel = formatPrice(listing.price) + "/Month";
    document.querySelectorAll(".redirect-button").forEach(function (btn) {
      btn.textContent = priceLabel;
    });

    var fbLink = document.getElementById("fb-link");
    if (fbLink) fbLink.href = listing.link;

    // Render up to 4 other listings in the "More Listings" strip.
    var more = document.querySelector(".more-listings");
    if (more) {
      var others = listings.filter(function (l) {
        return l.id !== listing.id;
      });
      more.innerHTML = others.slice(0, 4).map(moreListingCard).join("");
    }
  }

  document.addEventListener("DOMContentLoaded", render);
})();
