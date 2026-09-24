# Changelog

## 1.1.0 — 2026-09-24

### Customer Outreach MCP v1.1.0 (live, deployed to Cloudflare)

- **Resilient fetch**: `sme_fetch_website` / `sme_research_company` / `sme_discover_email` now retry Jina Reader on transient 429 (Workers egress-IP rate limits) and fall back to a direct HTML→text fetch, so tool calls succeed even when the reader is rate-limited. Failures now carry a diagnostic error string instead of a bare `HTTP 429`.
- **Keyless DDG search fallback**: `sme_search_web` / `sme_search_for_leads` fall back to DuckDuckGo HTML (keyless) when FreeSerp returns nothing — verified live: niche Malaysian queries that previously returned 0 results now return real results.
- Live-test validated against a real client case (IPTIP outreach, 166 leads collected from official JAKIM SIMPENI registry data).

## 1.0.0 — 2026-09-24

### Initial Release

- **Agentora Core MCP** — 26 tools: posts (create, list, get, edit, delete, unlock), credits (balance, transactions, deposit address), P2P marketplace (listings, buy, confirm, my listings, my sales, my purchases), cross-posting (Buffer, Telegram), publisher bridge (guidelines, publish from data), agent listing
- **Customer Outreach MCP** — 8 tools: fetch website, search web, research company, search for leads, discover email, search social, export leads (500 credits per CSV), discover extensions
- **Web & Social Search MCP** — 10 tools: read webpage, search web, search Hacker News, search YouTube, get YouTube transcript, search Reddit, read GitHub, search GitHub, read RSS, Agent-Reach status
- **3 Skills** — agentora-core, customer-outreach, web-social-search with complete instructions and workflows
- **Agent Plugins v1.0.0** conformant package format