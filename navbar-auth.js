// Navbar behaviour: notification (bell) dropdown, user-profile dropdown, and a
// convenience log in / log out button beside the icons.
// Depends on auth.js (window.Auth). Include both on any page with a navbar.

document.addEventListener("DOMContentLoaded", function () {
  var container = document.querySelector(".navbar-icons");
  if (!container || typeof window.Auth === "undefined") {
    return;
  }

  var user = Auth.currentUser();

  var bellIcon = container.querySelector('img[src*="Bell"]');
  var userIcon = container.querySelector('img[src*="user-icon"]');

  function doLogout() {
    Auth.logout();
    window.location.assign("homepage.html");
  }

  // Close every open dropdown box in the navbar.
  function closeAll() {
    container.querySelectorAll(".navbar-box.show").forEach(function (b) {
      b.classList.remove("show");
    });
  }

  // Wrap an icon so a dropdown box can be anchored beneath it, and toggle the
  // box when the icon is clicked.
  function attachBox(icon, box) {
    if (!icon) return;
    var item = document.createElement("span");
    item.className = "navbar-item";
    icon.parentNode.insertBefore(item, icon);
    item.appendChild(icon);
    item.appendChild(box);

    icon.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = box.classList.contains("show");
      closeAll();
      if (!isOpen) box.classList.add("show");
    });
    // Clicks inside the box shouldn't bubble up and close it.
    box.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  // --- Notification (bell): logged-in users only. ---
  if (user) {
    var bellBox = document.createElement("div");
    bellBox.className = "navbar-box navbar-box-notif";
    bellBox.innerHTML =
      '<span class="navbar-box-close" role="button" aria-label="Close">&times;</span>' +
      '<p class="navbar-box-text">Currently no announcements</p>';
    bellBox.querySelector(".navbar-box-close").addEventListener("click", function () {
      bellBox.classList.remove("show");
    });
    attachBox(bellIcon, bellBox);
  } else if (bellIcon) {
    // Not logged in: no notifications, so hide the bell entirely.
    bellIcon.style.display = "none";
  }

  // --- User profile box: email + logout, or "not logged in" + login. ---
  var userBox = document.createElement("div");
  userBox.className = "navbar-box";
  var userText = document.createElement("p");
  userText.className = "navbar-box-text";

  if (user) {
    userText.textContent = user.email;
    var boxLogout = document.createElement("button");
    boxLogout.className = "navbar-auth-btn";
    boxLogout.type = "button";
    boxLogout.textContent = "Log out";
    boxLogout.addEventListener("click", doLogout);
    userBox.appendChild(userText);
    userBox.appendChild(boxLogout);
  } else {
    userText.textContent = "Not logged in";
    var boxLogin = document.createElement("a");
    boxLogin.className = "navbar-auth-btn";
    boxLogin.href = "login.html";
    boxLogin.textContent = "Log in";
    userBox.appendChild(userText);
    userBox.appendChild(boxLogin);
  }
  attachBox(userIcon, userBox);

  // --- Convenience button beside the icons (no email text). ---
  var beside = document.createElement("div");
  beside.className = "navbar-auth";
  if (user) {
    var logout = document.createElement("button");
    logout.className = "navbar-auth-btn";
    logout.type = "button";
    logout.textContent = "Log out";
    logout.addEventListener("click", doLogout);
    beside.appendChild(logout);
  } else {
    var login = document.createElement("a");
    login.className = "navbar-auth-btn";
    login.href = "login.html";
    login.textContent = "Log in";
    beside.appendChild(login);
  }
  container.appendChild(beside);

  // Clicking anywhere else closes any open dropdown.
  document.addEventListener("click", closeAll);
});
