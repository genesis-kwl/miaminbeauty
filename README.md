# Mia Min Beauty — prototype

Landing page + AI concierge chatbot for Mia Min Beauty NYC. Prototype for review.

## Stack

- **Static site** — `index.html` at root (React + Babel-standalone via CDN)
- **AI proxy** — `api/complete.py` (Vercel Python serverless function) proxies chatbot calls to the Anthropic Messages API. API key held server-side only.

## Deploy

Connected to Vercel. Pushes to `main` trigger auto-deploy.

### Required env var (Vercel dashboard → Project Settings → Environment Variables)

- `ANTHROPIC_API_KEY` — Anthropic API key (production)

### Optional

- `CHATBOT_MODEL` — default `claude-haiku-4-5-20251001`. Override to `claude-sonnet-4-6` or `claude-opus-4-7` if needed.
- `MAX_TOKENS` — default `400`.

## Local dev

A Python stdlib local server is kept in the Gen2 Lab copy (`~/Gen2/lab/prototype/F01_miaminbeauty/proxy.py`) for offline iteration. This repo targets Vercel only.

## Source

Originally designed in Claude Design (claude.ai/design). Handoff bundle preserved at `_source_handoff/` for provenance.
