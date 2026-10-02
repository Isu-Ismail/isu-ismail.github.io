#!/usr/bin/env python3
"""Serves the admin/ folder as plain static files for local use only.

Usage:
    python admin/serve.py [port]   # default port 8787

This is NOT meant to be deployed or exposed to the internet — it's a thin
static file server so ES module imports (which browsers refuse to load from
file:// URLs) work over http://localhost. All actual reads/writes go straight
from the browser to Firebase (Firestore + Storage + Auth); this script never
touches your Firebase project.
"""
import http.server
import socketserver
import sys
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8787
ROOT = Path(__file__).resolve().parent


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        # Avoid aggressively cached stale JS while you're iterating locally.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
        print(f"Admin panel: http://127.0.0.1:{PORT}/login.html")
        print("Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
