import { describe, it, expect, beforeEach } from "vitest";
import { loadScripts, resetPage, setUrl, pageMarkup, signIn } from "./helpers/page.js";

// Render a page with a navbar, then run auth.js + navbar-auth.js.
async function openNavbar({ loggedIn = false, markup = pageMarkup("browsepage.html") } = {}) {
  resetPage(markup);
  if (loggedIn) signIn("student@ubc.ca");
  await loadScripts(["auth.js", "navbar-auth.js"]);
}

const icons = () => document.querySelector(".navbar-icons");
const bellIcon = () => document.querySelector('.navbar-icons img[src*="Bell"]');
const userIcon = () => document.querySelector('.navbar-icons img[src*="user-icon"]');
const boxOf = (icon) => icon.closest(".navbar-item").querySelector(".navbar-box");
const isOpen = (box) => box.classList.contains("show");
const besideButton = () => document.querySelector(".navbar-auth .navbar-auth-btn");

describe("navbar auth controls", () => {
  describe("signed out", () => {
    beforeEach(async () => {
      await openNavbar({ loggedIn: false });
    });

    it("hides the bell, since there is nothing to notify about", () => {
      expect(bellIcon().style.display).toBe("none");
      expect(document.querySelector(".navbar-box-notif")).toBeNull();
    });

    it("offers a log in link beside the icons", () => {
      expect(besideButton().tagName).toBe("A");
      expect(besideButton().textContent).toBe("Log in");
      expect(besideButton().getAttribute("href")).toBe("login.html");
    });

    it("says so in the profile box, with a way to log in", () => {
      const box = boxOf(userIcon());

      expect(box.querySelector(".navbar-box-text").textContent).toBe("Not logged in");
      expect(box.querySelector(".navbar-auth-btn").getAttribute("href")).toBe(
        "login.html"
      );
    });

    it("still opens the profile box on click", () => {
      userIcon().click();

      expect(isOpen(boxOf(userIcon()))).toBe(true);
    });
  });

  describe("signed in", () => {
    beforeEach(async () => {
      await openNavbar({ loggedIn: true });
    });

    it("keeps the bell visible and gives it a notification box", () => {
      expect(bellIcon().style.display).toBe("");
      expect(boxOf(bellIcon()).textContent).toContain("Currently no announcements");
    });

    it("shows the signed-in email in the profile box", () => {
      const box = boxOf(userIcon());

      expect(box.querySelector(".navbar-box-text").textContent).toBe("student@ubc.ca");
      expect(box.querySelector(".navbar-auth-btn").textContent).toBe("Log out");
    });

    it("offers a log out button beside the icons", () => {
      expect(besideButton().tagName).toBe("BUTTON");
      expect(besideButton().type).toBe("button");
      expect(besideButton().textContent).toBe("Log out");
    });

    it("ends the session when logging out", () => {
      // Logging out redirects to homepage.html. jsdom does not implement
      // cross-document navigation, so park the page there first — then the
      // redirect is a same-URL no-op and the session change is what's tested.
      setUrl("/homepage.html");

      besideButton().click();

      expect(localStorage.getItem("nestfinder_session")).toBeNull();
      expect(window.Auth.currentUser()).toBeNull();
    });

    it("also logs out from inside the profile box", () => {
      setUrl("/homepage.html");

      boxOf(userIcon()).querySelector(".navbar-auth-btn").click();

      expect(window.Auth.currentUser()).toBeNull();
    });
  });

  describe("dropdown behaviour", () => {
    beforeEach(async () => {
      await openNavbar({ loggedIn: true });
    });

    it("opens and closes a box on repeated icon clicks", () => {
      const box = boxOf(bellIcon());

      bellIcon().click();
      expect(isOpen(box)).toBe(true);

      bellIcon().click();
      expect(isOpen(box)).toBe(false);
    });

    it("keeps only one box open at a time", () => {
      bellIcon().click();
      userIcon().click();

      expect(isOpen(boxOf(bellIcon()))).toBe(false);
      expect(isOpen(boxOf(userIcon()))).toBe(true);
    });

    it("closes an open box when clicking elsewhere", () => {
      userIcon().click();
      document.body.click();

      expect(isOpen(boxOf(userIcon()))).toBe(false);
    });

    it("stays open when clicking inside the box", () => {
      userIcon().click();
      boxOf(userIcon()).querySelector(".navbar-box-text").click();

      expect(isOpen(boxOf(userIcon()))).toBe(true);
    });

    it("closes the notification box via its × control", () => {
      bellIcon().click();
      boxOf(bellIcon()).querySelector(".navbar-box-close").click();

      expect(isOpen(boxOf(bellIcon()))).toBe(false);
    });
  });

  describe("pages the script should skip", () => {
    it("does nothing when the page has no navbar", async () => {
      resetPage("<main><p>No navbar here</p></main>");
      signIn();

      await expect(loadScripts(["auth.js", "navbar-auth.js"])).resolves.toBeUndefined();
      expect(document.querySelector(".navbar-auth")).toBeNull();
    });

    it("still adds the auth button when the navbar has no icons", async () => {
      await openNavbar({
        loggedIn: true,
        markup: '<header class="navbar"><div class="navbar-icons"></div></header>',
      });

      expect(besideButton().textContent).toBe("Log out");
      expect(document.querySelector(".navbar-item")).toBeNull();
    });

    it("has no bell to hide when signed out and the navbar has no icons", async () => {
      await openNavbar({
        loggedIn: false,
        markup: '<header class="navbar"><div class="navbar-icons"></div></header>',
      });

      expect(besideButton().textContent).toBe("Log in");
      expect(document.querySelector(".navbar-box")).toBeNull();
    });

    it("does nothing when auth.js was not included", async () => {
      resetPage(pageMarkup("browsepage.html"));
      signIn();

      await loadScripts(["navbar-auth.js"]); // auth.js deliberately not loaded

      expect(document.querySelector(".navbar-auth")).toBeNull();
      expect(document.querySelector(".navbar-box")).toBeNull();
      expect(icons().querySelectorAll("img")).toHaveLength(2);
    });
  });
});
