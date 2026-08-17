# NestFinder

NestFinder is a web app that helps students find housing near UBC. It brings
listings together in one place so you can search, filter, and compare homes —
by number of bedrooms, monthly budget, and distance from campus — instead of
hopping between different marketplaces.

The app runs entirely in the browser (HTML, CSS, and vanilla JavaScript). It
needs no database or backend server — accounts and listings are handled on the
client side, so it's easy to run locally.

## Technical Features

- **Account registration & login** — create an account and sign in. Accounts
  are stored in the browser (`localStorage`); passwords are hashed before being
  saved, never stored in plain text.
- **Auth-aware navigation** — the homepage buttons know whether you're signed
  in: logged-in users go straight to browsing, logged-out users are sent to
  register/login.
- **Login-gated browsing** — the Browse page is available to signed-in users
  only; visiting it while logged out redirects to the login page.
- **Combined browse experience** — one page shows the "Browse NestFinder"
  banner, keyword search, filter settings, and the full list of homes.
- **Keyword search** — search listings by title or type (apartment, house,
  room).
- **Filters** — narrow results by:
  - Number of bedrooms (at least 1 / 2 / 3)
  - Monthly budget (under $2000 / $2500 / $3000)
  - Distance from UBC (within 0.5 / 1 / 1.5 / 2 / 2.5 km)
  - Filters combine, show a live result count, and can be cleared in one click.
- **Per-listing detail pages** — each home opens its own detail view with a
  photo, description, price, distance, external listing link, and a "More
  Listings" strip.
- **Navbar tools** — a notification dropdown (for signed-in users), a user
  profile dropdown showing your account, and a convenient log in / log out
  button.
- **FAQ** — an accordion on the homepage answering common questions.

## Project structure

| File | Purpose |
|------|---------|
| `homepage.html` | Landing page: intro, auth-aware buttons, FAQ |
| `login.html` | Sign in to an existing account |
| `register.html` | Create a new account |
| `browsepage.html` | Browse page (login required): banner, search, filters, listing grid |
| `housepage.html` | House detail view (`housepage.html?id=<id>`) |
| `auth.js` | Client-side authentication (register / login / logout / session) |
| `navbar-auth.js` | Navbar behaviour: notification & profile dropdowns, login/logout button |
| `listings.js` | Housing listing data |
| `results.js` | Renders the browse grid and drives search + filtering |
| `house.js` | Renders the house detail page and "More Listings" |
| `style.css` | Site-wide styles |
| `serve.py` | Small no-cache static file server for local development |
| `start.sh` | Convenience launcher — starts the server and opens the homepage |
| `test/` | Automated tests (see [Testing](#testing)) |

## Running the app

**Requirements:** Python 3 (pre-installed on macOS) and a web browser.

From the project folder, run:

```bash
./start.sh
```

This starts a local server and opens `http://localhost:8000/homepage.html` in
your browser. Press `Ctrl+C` to stop it.

To use a different port:

```bash
./start.sh 3000
```

Or start the server directly without auto-opening a browser:

```bash
python3 serve.py 8000
```

> **Tip:** run the app through the server (`http://localhost`) rather than
> opening the HTML files directly (`file://`). The server sends no-cache
> headers, so your latest changes always show up without a hard refresh.

## Testing

The site itself needs no build step, but the tests run on Node (18+) with
[Vitest](https://vitest.dev) and [jsdom](https://github.com/jsdom/jsdom).

Install the dev dependencies once:

```bash
npm install
```

Then run the suite:

```bash
npm test
```

Other useful commands:

```bash
npm run test:watch
```

```bash
npm run coverage
```

`npm run coverage` prints a summary and writes a browsable HTML report to
`coverage/index.html`.

### How the tests work

The site's scripts are plain `<script>` files rather than modules, so the tests
reproduce a browser page instead of importing functions:

1. The real page markup is loaded from `browsepage.html` / `housepage.html`
   (with its `<script>` tags stripped) into a jsdom document — so a renamed
   class or id in the HTML fails the tests rather than silently breaking the
   site.
2. `test/helpers/page.js` evaluates the site's scripts in page order and then
   fires `DOMContentLoaded`, the same lifecycle a browser gives them. Each load
   is a fresh evaluation, so filter state never leaks between tests.
3. `test/setup/storage.js` supplies an in-memory `localStorage`, since accounts
   and sessions live there.

| Test file | Covers |
|-----------|--------|
| `test/auth.test.js` | Registration rules, login, sessions, password hashing |
| `test/results.test.js` | Browse grid rendering, keyword search, filters, URL parameters, clearing |
| `test/house.test.js` | Detail page population, `?id=` lookup and fallback, "More Listings" |
| `test/navbar-auth.test.js` | Notification and profile dropdowns, log in / log out controls |
| `test/listings.test.js` | Shape and integrity of the listing data |

## Notes & limitations

- **Accounts are per-browser.** Because data lives in `localStorage`, an account
  you register in one browser or device won't exist in another, and clearing
  browser data removes it. There is no shared user database.
- **Demo-grade security.** The password hash is a simple, non-cryptographic hash
  suitable for a prototype — not for production use.
- **Listings are sample data** defined in `listings.js`. Making listings shared
  and persistent across devices would require a real backend with a database.
