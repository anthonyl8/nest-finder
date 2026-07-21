#!/usr/bin/env python3
"""Tiny static file server for NestFinder that disables caching.

The default `python3 -m http.server` lets the browser cache HTML/JS, so edits
sometimes don't show up until a hard refresh. This server sends no-cache
headers on every response so you always get the latest files during development.

Usage:  python3 serve.py [port]   (default port 8000)
"""

import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    server = HTTPServer(("", port), NoCacheHandler)
    print("Serving NestFinder (no-cache) on port %d" % port)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
