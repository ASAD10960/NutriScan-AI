"""Paths, limits and the AI-engine settings (env vars, .env file, or saved from the Profile page)."""
import json #It stores structured data as key-value pairs. 
import os #An operating system (OS) is the main software that manages your computer.
from pathlib import Path  #pathlib is a modern, convenient way to work with paths in Python.

BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR / "backend"
FRONTEND_DIR = BASE_DIR / "frontend"
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = DATA_DIR / "uploads"
DB_PATH = DATA_DIR / "nutriscan.db"
SETTINGS_PATH = DATA_DIR / "settings.json"
CATALOG_PATH = BACKEND_DIR / "nutrition_catalog.json"

HOST = os.environ.get("NUTRISCAN_HOST", "127.0.0.1")
PORT = int(os.environ.get("NUTRISCAN_PORT", "8000"))

MAX_UPLOAD_BYTES = 5 * 1024 * 1024          # 5 MB, as stated on the scan screen
MIN_DIMENSION = 128
MAX_DIMENSION = 8000
ALLOWED_FORMATS = {"JPEG": "image/jpeg", "PNG": "image/png", "WEBP": "image/webp"}

DEFAULT_MODEL = "claude-sonnet-5-5"
SESSION_DAYS = 30

DATA_DIR.mkdir(exist_ok=True)
UPLOAD_DIR.mkdir(exist_ok=True)


def _load_dotenv():
    env_file = BASE_DIR / ".env"
    if not env_file.exists():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_dotenv()


def get_settings():
    saved = {}
    if SETTINGS_PATH.exists():
        try:
            saved = json.loads(SETTINGS_PATH.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            saved = {}
    return {
        "api_key": saved.get("api_key") or os.environ.get("ANTHROPIC_API_KEY", ""),
        "model": saved.get("model") or os.environ.get("ANTHROPIC_MODEL", DEFAULT_MODEL),
        "key_source": "profile" if saved.get("api_key") else ("environment" if os.environ.get("ANTHROPIC_API_KEY") else None),
    }


def save_settings(api_key=None, model=None):
    saved = {}
    if SETTINGS_PATH.exists():
        try:
            saved = json.loads(SETTINGS_PATH.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            saved = {}
    if api_key is not None:
        saved["api_key"] = api_key.strip()
    if model is not None:
        saved["model"] = model.strip()
    SETTINGS_PATH.write_text(json.dumps(saved, indent=2), encoding="utf-8")
