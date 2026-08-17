import { describe, it, expect, beforeEach } from "vitest";
import { loadScripts, resetPage } from "./helpers/page.js";

const USERS_KEY = "nestfinder_users";
const SESSION_KEY = "nestfinder_session";

function storedUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
}

describe("Auth", () => {
  beforeEach(async () => {
    resetPage();
    await loadScripts(["auth.js"]);
  });

  describe("register", () => {
    it("requires both an email and a password", () => {
      expect(window.Auth.register("", "hunter2")).toEqual({
        ok: false,
        error: "Please enter both an email and a password.",
      });
      expect(window.Auth.register("student@ubc.ca", "")).toEqual({
        ok: false,
        error: "Please enter both an email and a password.",
      });
      expect(window.Auth.register(undefined, undefined).ok).toBe(false);
      expect(storedUsers()).toEqual({});
    });

    it("rejects malformed email addresses", () => {
      for (const email of ["student", "student@ubc", "@ubc.ca", "a b@ubc.ca"]) {
        expect(window.Auth.register(email, "hunter2")).toEqual({
          ok: false,
          error: "Please enter a valid email address.",
        });
      }
    });

    it("rejects passwords shorter than 6 characters", () => {
      expect(window.Auth.register("student@ubc.ca", "short")).toEqual({
        ok: false,
        error: "Password must be at least 6 characters.",
      });
      // Exactly 6 is allowed — the boundary is inclusive.
      expect(window.Auth.register("student@ubc.ca", "sixchr").ok).toBe(true);
    });

    it("creates an account and never stores the plaintext password", () => {
      expect(window.Auth.register("student@ubc.ca", "hunter2")).toEqual({ ok: true });

      const record = storedUsers()["student@ubc.ca"];
      expect(record.email).toBe("student@ubc.ca");
      expect(record.passwordHash).toMatch(/^[0-9a-f]{8}$/);
      expect(localStorage.getItem(USERS_KEY)).not.toContain("hunter2");
    });

    it("hashes different passwords to different values", () => {
      window.Auth.register("a@ubc.ca", "hunter2");
      window.Auth.register("b@ubc.ca", "password1");

      const users = storedUsers();
      expect(users["a@ubc.ca"].passwordHash).not.toBe(users["b@ubc.ca"].passwordHash);
    });

    it("normalizes the email by trimming and lowercasing", () => {
      expect(window.Auth.register("  Student@UBC.ca  ", "hunter2").ok).toBe(true);
      expect(Object.keys(storedUsers())).toEqual(["student@ubc.ca"]);
    });

    it("rejects a duplicate account regardless of case", () => {
      window.Auth.register("student@ubc.ca", "hunter2");

      expect(window.Auth.register("STUDENT@ubc.ca", "different")).toEqual({
        ok: false,
        error: "An account with this email already exists.",
      });
      expect(Object.keys(storedUsers())).toHaveLength(1);
    });

    it("recovers from a corrupted user store instead of throwing", () => {
      localStorage.setItem(USERS_KEY, "not json");

      expect(window.Auth.register("student@ubc.ca", "hunter2")).toEqual({ ok: true });
      expect(storedUsers()["student@ubc.ca"]).toBeDefined();
    });
  });

  describe("login", () => {
    beforeEach(() => {
      window.Auth.register("student@ubc.ca", "hunter2");
    });

    it("signs in with correct credentials and starts a session", () => {
      expect(window.Auth.login("student@ubc.ca", "hunter2")).toEqual({ ok: true });
      expect(window.Auth.currentUser()).toEqual({ email: "student@ubc.ca" });
    });

    it("accepts the email in any case, with surrounding whitespace", () => {
      expect(window.Auth.login("  STUDENT@UBC.ca ", "hunter2").ok).toBe(true);
      expect(window.Auth.currentUser().email).toBe("student@ubc.ca");
    });

    it("rejects an unknown email without revealing which field was wrong", () => {
      expect(window.Auth.login("nobody@ubc.ca", "hunter2")).toEqual({
        ok: false,
        error: "Incorrect email or password.",
      });
      expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    });

    it("rejects a wrong password with the same message", () => {
      expect(window.Auth.login("student@ubc.ca", "wrongpass")).toEqual({
        ok: false,
        error: "Incorrect email or password.",
      });
      expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    });
  });

  describe("session", () => {
    it("reports no user before logging in", () => {
      expect(window.Auth.currentUser()).toBeNull();
    });

    it("clears the session on logout", () => {
      window.Auth.register("student@ubc.ca", "hunter2");
      window.Auth.login("student@ubc.ca", "hunter2");

      window.Auth.logout();

      expect(window.Auth.currentUser()).toBeNull();
      expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    });

    it("logging out twice is harmless", () => {
      window.Auth.logout();
      window.Auth.logout();
      expect(window.Auth.currentUser()).toBeNull();
    });

    it("treats a corrupted session as logged out", () => {
      localStorage.setItem(SESSION_KEY, "{ not json");
      expect(window.Auth.currentUser()).toBeNull();
    });

    it("leaves registered accounts intact after logout", () => {
      window.Auth.register("student@ubc.ca", "hunter2");
      window.Auth.login("student@ubc.ca", "hunter2");
      window.Auth.logout();

      expect(window.Auth.login("student@ubc.ca", "hunter2").ok).toBe(true);
    });
  });
});
