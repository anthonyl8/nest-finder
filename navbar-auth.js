// Renders the logged-in user and a logout button in the navbar.
// Depends on auth.js (window.Auth). Include both on any page with a navbar.

document.addEventListener("DOMContentLoaded", function () {
  var container = document.querySelector(".navbar-icons");
  if (!container || typeof window.Auth === "undefined") {
    return;
  }

  var user = Auth.currentUser();

  var wrap = document.createElement("div");
  wrap.className = "navbar-auth";

  if (user) {
    var name = document.createElement("span");
    name.className = "navbar-user";
    name.textContent = user.email;

    var logout = document.createElement("button");
    logout.className = "navbar-auth-btn";
    logout.type = "button";
    logout.textContent = "Log out";
    logout.addEventListener("click", function () {
      Auth.logout();
      window.location.assign("homepage.html");
    });

    wrap.appendChild(name);
    wrap.appendChild(logout);
  } else {
    var login = document.createElement("a");
    login.className = "navbar-auth-btn";
    login.href = "login.html";
    login.textContent = "Log in";
    wrap.appendChild(login);
  }

  container.appendChild(wrap);
});
