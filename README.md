# Star Classification

Interactive explainer for **spectral types O B A F G K M**: slide through main-sequence classes from cool red **M** dwarfs to hot blue **O** stars, see how temperature and visuals change, and compare **stellar lifespans** (log-scale bar chart) with a **blackbody spectrum** curve for the selected class. Article copy and imagery sit in a stylized **holographic-style** stats panel.

## Stack

- **Flask** + **Jinja** templates (`/`, `/star-classes`), static assets under `static/`.
- **Chart.js** (pinned, with SRI) for the lifespan and spectrum charts.
- **`scripts/build_static.py`** — renders templates into `dist/` so the site can be deployed as **static HTML on Netlify** (`netlify.toml`). Flask is used at **build time** only on Netlify.
- Related sim: **[Time Dilation](https://time-dilation.netlify.app/)** (linked from the app; Flask route `/time-dilation` redirects there).

## Run locally

```bash
python -m pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:5000/` (home) and `/star-classes`.

## Static build (Netlify / preview)

```bash
set SITE_URL=https://YOURSITE.netlify.app
python scripts/build_static.py
```

Outputs `dist/` with `index.html`, `star-classes/index.html`, and copied `static/`.

## Repo layout

| Path | Role |
|------|------|
| `app.py` | Flask routes |
| `templates/` | HTML + `includes/site_meta.html` for meta / OG |
| `static/` | CSS, JS, images (`static/img/` for class artwork) |
