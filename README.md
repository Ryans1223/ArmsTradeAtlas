  # Arms Trade Atlas

An interactive data journalism site visualizing global arms exports and imports from 1914 to the present, built with SIPRI Trend Indicator Value data.

**Source:** SIPRI Arms Transfers Database, accessed 2024. TIV values are a SIPRI-defined proxy for transfer volume; they are not equivalent to financial sales prices.

---

## Tech stack

- **Frontend:** React 18, Vite, TypeScript, D3.js, TopoJSON, Tailwind CSS, Zustand
- **Backend:** Node.js, Express, TypeScript, Zod, pino
- **Data pipeline:** Node.js ingestion script, papaparse
- **Monorepo:** pnpm workspaces

---

## Getting started

### Prerequisites

- Node.js 20 or later
- pnpm 9 or later (`npm install -g pnpm`)

### Install dependencies

```bash
pnpm install
```

### Quick start with sample data (no SIPRI account required)

A sample dataset is included at `data/raw/sample-data.csv` with ~120 historically documented transfers covering all five case studies. To run the map immediately:

```bash
cd packages/data && npx tsx src/ingest.ts ../../data/raw/sample-data.csv
```

This generates the processed JSON files in `data/processed/` and the map will be populated.

### Full SIPRI dataset (recommended for production)

1. Go to sipri.org/databases/armstransfers
2. Register for a free account (required for bulk exports)
3. Export the full Arms Transfers Database as a CSV file
4. Place the CSV at `data/raw/sipri-export.csv`

```bash
cd packages/data && npx tsx src/ingest.ts ../../data/raw/sipri-export.csv
```

The ingestion script handles SIPRI's standard CSV export format. Expected column names: `Supplier`, `Recipient`, `Year`, `Total TIV`, `Armament category`, `Weapon description`.

```bash
pnpm ingest data/raw/sipri-export.csv
```

This will output three files to `data/processed/`:
- `flows.json`: all (supplier, recipient, year, TIV, category) tuples
- `country_totals.json`: per-country, per-year export and import aggregates
- `top_partners.json`: per-country top partners by decade
- `metadata.json`: coverage and citation information

### Start development servers

In two terminals (or use `pnpm dev` which runs both in parallel):

```bash
# Terminal 1: API server on port 3001
cd apps/api && pnpm dev

# Terminal 2: Vite dev server on port 3000
cd apps/web && pnpm dev
```

Or from the root:

```bash
pnpm dev
```

Then open http://localhost:3000.

---

## Project structure

```
arms-trade-atlas/
  apps/
    web/          React + Vite frontend
    api/          Node + Express backend
  packages/
    data/         SIPRI ingestion scripts
    types/        Shared TypeScript types
  data/
    raw/          SIPRI raw downloads (gitignored)
    processed/    Cleaned JSON served by the API
```

---

## Deployment

- **Frontend:** Deploy `apps/web/dist` to Vercel
- **Backend:** Deploy `apps/api` to Render or Fly.io; set `PORT` environment variable
- The processed JSON files should be bundled with the API or served from object storage

---

## Data citation

> SIPRI Arms Transfers Database. Stockholm International Peace Research Institute (SIPRI). Available at sipri.org/databases/armstransfers. TIV values are a SIPRI-defined proxy for transfer volume calculated in constant 1990 US dollars; they are not equivalent to financial sales prices or procurement costs.

---

## Case studies

Five scrollytelling narratives are included:

1. US arms to Iran under the Shah (1953 to 1979)
2. Soviet weapons to Egypt and Syria (1955 to 1991)
3. Cold War proxy war in Angola (1975 to 1991)
4. US military aid to Ukraine (2022 to present)
5. US arms transfers to Israel (1948 to present)
