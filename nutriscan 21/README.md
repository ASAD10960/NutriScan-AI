# NutriScan AI

Snap or upload a meal photo, get the detected foods with confidence and on-image boxes, adjust portions or swap foods, see calories/protein/carbs/fat/fiber, save meals to history, and track trends against your goals.

Built for one person running it locally: a Python standard-library web server, SQLite, and Pillow on the back end, and a plain HTML/CSS/JavaScript single-page app on the front end. No build step, no framework install.

## Run it

You need Python 3.10 or newer.

```
./run.sh            # macOS / Linux
run.bat             # Windows
# or manually:
pip install -r requirements.txt
python backend/server.py
```

Open http://127.0.0.1:8000, create an account, and start scanning.

## Real image recognition vs demo mode

Food recognition uses Claude's vision model. Add an Anthropic API key either on the **Profile** page (stored in `data/settings.json`) or in a `.env` file (copy `.env.example`). The key never leaves your machine except in calls to `api.anthropic.com`.

Without a key the app runs in **demo mode**: it reads food names from the file name (for example `roti_dal_rice_salad.jpg` or `paneer-naan.png`), uses default serving sizes, and always asks you to confirm. Everything else works the same, so you can try the full flow offline. **Profile → Load a sample week** fills history and charts with example meals.

The model only identifies foods, positions, and estimated grams. It must pick from the nutrition catalog, and nutrition is always calculated on the server from `backend/nutrition_catalog.json` (71 common Indian and international foods, per 100 g). Foods not in the catalog are shown as *unsupported* and left out of totals instead of guessed.

## What's where

```
backend/
  server.py        HTTP server, routing, API endpoints, static files
  detector.py      Claude vision adapter + filename demo detector
  imaging.py       Upload decoding, validation, quality check (brightness, contrast, blur)
  nutrition.py     Deterministic nutrition maths, uncertainty ranges, review rules
  nutrition_catalog.json   Versioned food catalog (source + version on every result)
  auth.py, db.py, config.py
frontend/
  index.html, style.css, app.js   The whole UI (hash-routed SPA)
data/              Created on first run: SQLite DB, stored meal images, settings
```

## API

| Method | Path | Purpose |
|---|---|---|
| GET | /api/health | Health, active engine, nutrition source |
| POST | /api/v1/auth/signup, /login, /logout | Accounts and bearer-token sessions |
| GET/PUT | /api/v1/me | Profile and daily targets |
| DELETE | /api/v1/me/data | Delete all meals, analyses and images |
| GET/PUT | /api/v1/settings/engine | AI key (masked) and model |
| GET | /api/v1/foods?q= | Catalog search |
| POST | /api/v1/quality-check | Image validation and quality feedback |
| POST | /api/v1/analyze | Run detection and nutrition on an image |
| GET | /api/v1/analyses/{id} (+ /image) | Analysis result / stored image |
| POST | /api/v1/analyses/{id}/corrections | Change foods or grams; logs each correction |
| POST/GET | /api/v1/meals | Save (idempotent) / list with search and meal type |
| GET/DELETE | /api/v1/meals/{id} | Meal detail / delete meal with its image |
| GET | /api/v1/summary?days= | Trends, averages, macro split, streak, top foods |
| POST | /api/v1/demo/seed | Sample week of meals |

Analyses move through the PRD states: `ANALYZING → NEEDS_CONFIRMATION` (low confidence, unknown food, default portion, or demo mode) `→ CALCULATED → SAVED`, or `FAILED` with a reason and retry.

## How it maps to the PRD

US-01 upload/camera with format, size, dimension and quality checks. US-02 staged processing screen with cancel and retry. US-03 labels, confidence and bounding boxes on the photo. US-04 per-item and total nutrition with units and serving basis. US-05 authenticated server-side history with detail view and delete. US-06 confidence badges, calorie ranges for uncertain portions, "How this was calculated", and in-place corrections that recalculate on the server.

## Limitations

Values are estimates from reference data, not medical advice. Portions come from a single photo, so check the grams. Google/Apple sign-in buttons are placeholders (no OAuth). Single-user local setup: no HTTPS, rate limiting, or background job queue.
