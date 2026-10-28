"""SQLite persistence: users, sessions, analyses, corrections and saved meals."""
import json
import sqlite3
import threading
from datetime import datetime, timezone

import config

_lock = threading.Lock()

SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    preferences TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS analyses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    image_path TEXT,
    original_filename TEXT,
    status TEXT NOT NULL,
    failure_reason TEXT,
    model_name TEXT,
    model_version TEXT,
    quality TEXT,
    items TEXT NOT NULL DEFAULT '[]',
    review_reasons TEXT NOT NULL DEFAULT '[]',
    notes TEXT,
    started_at TEXT,
    completed_at TEXT,
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS corrections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    analysis_id TEXT NOT NULL,
    field TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS meals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    analysis_id TEXT,
    name TEXT NOT NULL,
    meal_type TEXT NOT NULL,
    captured_at TEXT NOT NULL,
    items TEXT NOT NULL,
    totals TEXT NOT NULL,
    image_path TEXT,
    model_version TEXT,
    nutrition_source TEXT,
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_meals_user ON meals(user_id, captured_at);
"""

JSON_FIELDS = {"preferences", "quality", "items", "review_reasons", "totals", "nutrition_source"}


def now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _connect():
    conn = sqlite3.connect(config.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def _decode(row):
    if row is None:
        return None
    out = dict(row)
    for key in JSON_FIELDS & out.keys():
        if isinstance(out[key], str):
            try:
                out[key] = json.loads(out[key])
            except json.JSONDecodeError:
                pass
    return out


def _encode(args):
    return tuple(json.dumps(a) if isinstance(a, (dict, list)) else a for a in args)


def init():
    with _lock:
        conn = _connect()
        conn.executescript(SCHEMA)
        conn.commit()
        conn.close()


def query(sql, args=()):
    with _lock:
        conn = _connect()
        rows = conn.execute(sql, _encode(args)).fetchall()
        conn.close()
    return [_decode(r) for r in rows]


def one(sql, args=()):
    rows = query(sql, args)
    return rows[0] if rows else None


def run(sql, args=()):
    with _lock:
        conn = _connect()
        cur = conn.execute(sql, _encode(args))
        conn.commit()
        count = cur.rowcount
        conn.close()
    return count
