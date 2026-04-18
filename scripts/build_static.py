"""
Render Jinja templates to dist/ for Netlify static hosting.
Set SITE_URL to the public origin (Netlify sets DEPLOY_PRIME_URL or URL on build).
"""
from __future__ import annotations

import os
import shutil
import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

os.chdir(_ROOT)

from flask import render_template  # noqa: E402

from app import app  # noqa: E402


def _site_url() -> str:
    for key in ("SITE_URL", "DEPLOY_PRIME_URL", "URL"):
        v = os.environ.get(key, "").strip()
        if v:
            return v.rstrip("/")
    return "http://127.0.0.1:8888"


def main() -> None:
    site = _site_url()
    dist = _ROOT / "dist"
    if dist.is_dir():
        shutil.rmtree(dist)
    dist.mkdir(parents=True)
    static_root = _ROOT / "static"
    if not static_root.is_dir():
        raise SystemExit(f"Missing static directory: {static_root}")
    shutil.copytree(static_root, dist / "static")

    base = f"{site}/"
    with app.app_context():
        with app.test_request_context("/", base_url=base):
            (dist / "index.html").write_text(
                render_template("home.html"), encoding="utf-8"
            )
        with app.test_request_context("/star-classes", base_url=base):
            sc = dist / "star-classes"
            sc.mkdir()
            (sc / "index.html").write_text(
                render_template("star-classes.html"), encoding="utf-8"
            )

    print(f"Static site written to {dist} (SITE_URL={site})")


if __name__ == "__main__":
    main()
