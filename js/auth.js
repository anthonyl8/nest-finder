// Client-side authentication for NestFinder.
// This is a static site with no server, so accounts are stored in the
// browser's localStorage. Passwords are hashed (demo-grade, not secure
// transport) so plaintext passwords are never written to storage.

(function (global) {
  "use strict";

  var USERS_KEY = "nestfinder_users";
  var SESSION_KEY = "nestfinder_session";

  // Lightweight, dependency-free string hash (FNV-1a). Not cryptographically
  // secure — adequate only for a demo without a backend.
  function hash(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ("0000000" + h.toString(16)).slice(-8);
  }

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  var Auth = {
    // Register a new account. Returns { ok, error }.
    register: function (email, password) {
      email = normalizeEmail(email);

      if (!email || !password) {
        return { ok: false, error: "Please enter both an email and a password." };
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { ok: false, error: "Please enter a valid email address." };
      }
      if (password.length < 6) {
        return { ok: false, error: "Password must be at least 6 characters." };
      }

      var users = loadUsers();
      if (users[email]) {
        return { ok: false, error: "An account with this email already exists." };
      }

      users[email] = { email: email, passwordHash: hash(password) };
      saveUsers(users);
      return { ok: true };
    },

    // Verify credentials and start a session. Returns { ok, error }.
    login: function (email, password) {
      email = normalizeEmail(email);

      var users = loadUsers();
      var user = users[email];
      if (!user || user.passwordHash !== hash(password)) {
        return { ok: false, error: "Incorrect email or password." };
      }

      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: email }));
      return { ok: true };
    },

    logout: function () {
      localStorage.removeItem(SESSION_KEY);
    },

    currentUser: function () {
      try {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
      } catch (e) {
        return null;
      }
    },
  };

  global.Auth = Auth;
})(window);
