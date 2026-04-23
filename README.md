# Star Classification

Interactive explainer for **spectral types O B A F G K M**: slide through main-sequence classes from cool red **M** dwarfs to hot blue **O** stars, see how temperature and visuals change, and compare **stellar lifespans** (log-scale bar chart) with a **blackbody spectrum** curve for the selected class. Article copy and imagery sit in a stylized **holographic-style** stats panel.

## UI highlights

- [Home page](https://star-classification.netlify.app/) with project links, social links/icons, and a styled side panel.
- Shared animated header/nav theme across pages.
- Top-right Ko-fi support shortcut (coffee emoji badge) in the header.
- Added star class pictures/artwork and social/logo icons to enrich the visuals.
- Interactive charts:
  - **Lifespan** comparison across spectral classes
  - **Blackbody spectrum** for the currently selected class

## Stack

- **Flask** + **Jinja** templates (`/`, `/star-classes`), static assets under `static/`.
- **Chart.js** (pinned, with SRI) for the lifespan and spectrum charts.
- **Google Fonts** + local font utility classes (`static/fonts.css`) for display typography.
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
| `templates/` | `home.html`, `star-classes.html`, and `includes/site_meta.html` |
| `static/` | CSS, JS, images/icons (`static/img/`), and `fonts.css` utility classes |
| `scripts/build_static.py` | Static export script for Netlify builds |
| `netlify.toml` | Netlify build/publish configuration |
