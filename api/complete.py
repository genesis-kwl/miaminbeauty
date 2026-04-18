"""
Vercel Python serverless function — POST /api/complete

Proxies chatbot messages to Anthropic API. API key held server-side
(ANTHROPIC_API_KEY env var set in Vercel dashboard, never in the repo).

Env vars (set in Vercel project settings):
- ANTHROPIC_API_KEY    required
- CHATBOT_MODEL        default claude-haiku-4-5-20251001
- MAX_TOKENS           default 400
"""
import json
import os
import urllib.request
import urllib.error
from http.server import BaseHTTPRequestHandler


MODEL = os.environ.get("CHATBOT_MODEL", "claude-haiku-4-5-20251001")
MAX_TOKENS = int(os.environ.get("MAX_TOKENS", "400"))


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            return self._json_error(500, "ANTHROPIC_API_KEY not set on the server")

        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length).decode("utf-8") if length else "{}"
            body = json.loads(raw)
            messages = body.get("messages", [])
            system = body.get("system", "")

            upstream_body = json.dumps({
                "model": MODEL,
                "max_tokens": MAX_TOKENS,
                "system": system,
                "messages": messages,
            }).encode("utf-8")

            req = urllib.request.Request(
                "https://api.anthropic.com/v1/messages",
                data=upstream_body,
                headers={
                    "Content-Type": "application/json",
                    "x-api-key": api_key,
                    "anthropic-version": "2023-06-01",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            text = "".join(
                block.get("text", "")
                for block in data.get("content", [])
                if block.get("type") == "text"
            )
            return self._json_ok({"text": text, "model": MODEL})
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")
            return self._json_error(502, f"Anthropic {e.code}: {err_body}")
        except Exception as e:
            return self._json_error(500, f"Proxy error: {type(e).__name__}: {e}")

    def _json_ok(self, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _json_error(self, status, msg):
        body = json.dumps({"error": msg}).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
