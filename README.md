# VC Intelligence — Precision AI Scout

A thesis-first VC sourcing and enrichment platform. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Company Discovery** — Search + faceted filters (stage, sector, thesis score) with sortable table
- **Company Profiles** — Full profile with thesis scoring, tags, signals timeline, notes
- **Live Enrichment** — Click "Enrich from web" to pull real data via Jina AI reader + Google Gemini AI extraction
- **Lists** — Create lists, add/remove companies, export CSV or JSON
- **Saved Searches** — Save and re-run searches with match previews
- All state (lists, notes, saved searches, enrichment cache) persisted in `localStorage`

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Google Generative AI (Gemini)** (server-side enrichment only)
- **Jina AI Reader** (free web scraping, no key needed for basic use)
- **Lucide React** icons

## Setup

### 1. Clone & install

```bash
git clone <your-repo>
cd vc-intelligence
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```
GEMINI_API_KEY=your-gemini-api-key-here
```

> ⚠️ The API key is **only used server-side** in `app/api/enrich/route.ts` — it is never exposed to the browser.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
npm install -g vercel
vercel deploy
```

In the Vercel dashboard, add the environment variable:
- `GEMINI_API_KEY` = your key

## Enrichment Architecture

```
Browser                    Server (Next.js API Route)
  |                                  |
  |-- POST /api/enrich { domain } -->|
  |                                  |-- fetch https://r.jina.ai/{domain}
  |                                  |-- fetch https://r.jina.ai/{domain}/about
  |                                  |-- POST Google Gemini (extract fields)
  |<-- { summary, whatTheyDo, ... } -|
  |-- cache in localStorage          |
```

The enrichment pipeline:
1. Jina AI reader converts public web pages to clean text (no API key required for basic use)
2. Google Gemini 2.0 Flash extracts structured fields (summary, what they do, keywords, signals)
3. Results cached in localStorage per company to avoid redundant API calls

## Project Structure

```
app/
  page.tsx                  # Redirect → /companies
  layout.tsx                # Root layout
  globals.css               # Design tokens, global styles
  companies/
    page.tsx                # Search + filter + table
    [id]/page.tsx           # Company profile + enrichment
  lists/page.tsx            # List management + export
  saved/page.tsx            # Saved searches
  api/
    enrich/route.ts         # Server-side enrichment endpoint
components/
  Sidebar.tsx               # Navigation
  ThesisScoreBadge.tsx      # Score bar + number
lib/
  mock-data.ts              # 20 seeded companies
  types.ts                  # TypeScript interfaces
```

## Design

Dark intelligence terminal aesthetic — deep navy/black background, DM Mono for data, Outfit for UI, amber/gold accents for actions and highlights.
