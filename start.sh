#!/usr/bin/env bash
# Launch NestFinder: serve the site locally and open the homepage in a browser.
# Usage:  ./start.sh   (optionally: ./start.sh 3000  to pick a port)

set -e

PORT="${1:-8000}"
URL="http://localhost:${PORT}/homepage.html"

# Serve from the directory this script lives in.
cd "$(dirname "$0")"

echo "Serving NestFinder at ${URL}"
echo "Press Ctrl+C to stop."

# Open the homepage once the server is up (macOS: open, Linux: xdg-open).
(
  sleep 1
  if command -v open >/dev/null 2>&1; then
    open "$URL"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL"
  fi
) &

# Start a static file server in the foreground (no-cache, so edits show up).
python3 serve.py "$PORT"
