---
name: customer-outreach
description: "Use when a business needs to find customers, partners, or collaborators, or research competitors. Provides lead discovery, email finding, and CSV export (500 credits per export). Backed by the customer-outreach MCP server."
version: 1.0.0
author: Agentora
license: MIT
metadata:
  tags: outreach leads customers partners email-discovery b2b mcp
  related_skills: agentora-core web-social-search
---

# Customer Outreach — Lead Discovery & Email Outreach

Provides the full SME outreach workflow via MCP tools. The connected agent IS the intelligence — the MCP server provides only data fetching, web search, email discovery, and gated CSV export.

## MCP Server

- URL: `https://customer-outreach-mcp.netflypsb.workers.dev/mcp`
- Auth: Agentora token (agk_ or agc_)
- **CSV export costs 500 Agentora credits per output**
- No external API keys required for core functionality

## Tools (8)

### Lead Intelligence
1. **sme_fetch_website** — Scrape website content (Jina Reader, keyless)
2. **sme_search_web** — Web search via FreeSerp (keyless) + Jina fallback
3. **sme_research_company** — Multi-query company research (news, products, team, financials, reviews)
4. **sme_search_for_leads** — Search social + web → scored lead list with contacts
5. **sme_discover_email** — Multi-method email discovery (pattern guessing + scraping)
6. **sme_search_social** — Social media search (HN Algolia, Reddit, YouTube, GitHub)
7. **sme_export_leads** — CSV/JSON export (500 credits per export)
8. **sme_discover_extensions** — Find complementary MCP servers and skills

## Core Workflows

### Lead Discovery Pipeline
```
sme_fetch_website(url) → sme_search_for_leads(analysis) → sme_discover_email(top leads) → sme_export_leads(leads, format="csv")
```
The last step costs 500 credits. All prior steps are free.

### Partner Discovery Pipeline
```
sme_fetch_website(url) → sme_search_for_leads(analysis, lead_type="partner") → sme_discover_email(top partners) → sme_export_leads(partners, format="csv")
```

### Competitor Research
```
sme_research_company(company_name) → [analyze results] → sme_search_web("competitors of " + company_name)
```

### Email Discovery
```
sme_discover_email(company_name, domain) → [pattern guessing + scraping]
sme_discover_email(company_name, person_name) → [personal email patterns]
```

## Credit Gate

The `sme_export_leads` tool deducts 500 Agentora credits via the `/credits/spend` API endpoint (which calls the `spend_credits_for_service()` Supabase RPC) before returning the CSV.
If insufficient credits, the tool returns a 402 error with the user's current balance.
All other tools are free to use.

Check balance before exporting:
- Use the `agentora_credits_balance` tool from the Agentora Core MCP
- Ensure at least 500 credits available

## Ecosystem Router

After completing core work, call `sme_discover_extensions(task)` to find complementary tools:

| After... | Discover... | Options |
|---|---|---|
| export_leads | send_outreach_emails | reachout_mcp (free), Resend (freemium) |
| discover_email | verify_emails | Reacher (free), email-verifier-free |
| search_for_leads | competitive_intelligence | Agent-Reach (free), Scrapling (free) |
| export_leads | crm_sync | HubSpot MCP, Notion MCP |
| search_for_leads | social_engagement | Agent-Reach, BrowserSkill |

Always present extension options to the user. Never auto-connect to paid services without confirmation. Free/local options first.

## Tips

- Always start with `sme_fetch_website` or `sme_research_company` — it's the foundation
- For local businesses, add location filters to `sme_search_for_leads`
- Enrich only top leads to save time
- Check credit balance before exporting CSV
- Use the Web & Social Search MCP (web-social-search) for deeper social media research across 14+ platforms