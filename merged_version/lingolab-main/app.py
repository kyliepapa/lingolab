import json
from pathlib import Path

from flask import Flask, abort, jsonify, request, send_from_directory
from flask_cors import CORS

import sentence_builder as sb

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
LANGUAGE_FILE = DATA_DIR / "language.json"

ALLOWED_STATIC_SUFFIXES = {
    ".html",
    ".css",
    ".js",
    ".json",
    ".png",
    ".svg",
    ".jpg",
    ".jpeg",
    ".webp",
    ".ico",
    ".woff",
    ".woff2",
}

PUBLIC_URL = "http://127.0.0.1:5000"

app = Flask(__name__)
CORS(app)


def _save_language(data):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    LANGUAGE_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")


def _load_saved_language():
    if not LANGUAGE_FILE.is_file():
        return None
    return json.loads(LANGUAGE_FILE.read_text(encoding="utf-8"))


def _safe_static_path(relative: str) -> Path | None:
    if not relative or ".." in relative.replace("\\", "/").split("/"):
        return None
    candidate = (ROOT / relative).resolve()
    try:
        candidate.relative_to(ROOT.resolve())
    except ValueError:
        return None
    if not candidate.is_file():
        return None
    if candidate.suffix.lower() not in ALLOWED_STATIC_SUFFIXES:
        return None
    return candidate


@app.post("/api/language")
def post_language():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Expected JSON object"}), 400
    sb.apply_language_config(data)
    _save_language(data)
    return jsonify({"ok": True})


@app.get("/api/language")
def get_language():
    data = _load_saved_language()
    if data is None:
        return jsonify({"error": "No language saved yet"}), 404
    return jsonify(data)


@app.get("/api/sentences")
def get_sentences():
    saved = _load_saved_language()
    if saved:
        sb.apply_language_config(saved)
    else:
        return jsonify({"error": "No language saved yet"}), 404
    return jsonify(sb.build_sentence_package())


@app.post("/api/sentences")
def post_sentences():
    data = request.get_json(silent=True)
    if isinstance(data, dict):
        sb.apply_language_config(data)
        _save_language(data)
    elif _load_saved_language():
        sb.apply_language_config(_load_saved_language())
    else:
        return jsonify({"error": "No language config provided or saved"}), 400
    try:
        return jsonify(sb.build_sentence_package())
    except Exception as exc:  # noqa: BLE001 — return build errors to the client
        return jsonify({"error": str(exc)}), 500


@app.get("/")
def serve_home():
    return send_from_directory(ROOT, "index.html")


@app.get("/<path:resource>")
def serve_static(resource: str):
    if resource.startswith("api/") or resource == "api":
        abort(404)
    target = _safe_static_path(resource)
    if target is None:
        abort(404)
    return send_from_directory(ROOT, resource)


if __name__ == "__main__":
    print()
    print("  LingoLab is running.")
    print(f"  Open in your browser: {PUBLIC_URL}/")
    print("  (Ctrl+C to stop)")
    print()
    app.run(host="127.0.0.1", port=5000, debug=True)