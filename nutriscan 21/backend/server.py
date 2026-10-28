"""NutriScan AI - API server + static frontend host.

Pure Python standard library (plus Pillow). Run:  python backend/server.py
"""
import json
import mimetypes
import random
import re
import sys
import traceback
import uuid
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))

import auth          # noqa: E402
import config        # noqa: E402
import db            # noqa: E402
import detector      # noqa: E402
import imaging       # noqa: E402
import nutrition     # noqa: E402

MEAL_TYPES = ("breakfast", "lunch", "dinner", "snack")
ROUTES = []


class ApiError(Exception):
    def __init__(self, status, code, message, extra=None):
        super().__init__(message)
        self.status, self.code, self.message, self.extra = status, code, message, extra or {}


def route(method, pattern, public=False):
    regex = re.compile("^" + re.sub(r"{(\w+)}", r"(?P<\1>[^/]+)", pattern) + "$")

    def wrap(fn):
        ROUTES.append((method, regex, fn, public))
        return fn
    return wrap


class Request:
    def __init__(self, handler, params, query, body, user, token):
        self.handler, self.params, self.query, self.body, self.user, self.token = handler, params, query, body, user, token

    def q(self, key, default=None):
        return self.query.get(key, [default])[0]


# ================================================================== helpers
def get_analysis(req, analysis_id):
    row = db.one("SELECT * FROM analyses WHERE id = ? AND user_id = ?", (analysis_id, req.user["id"]))
    if not row:
        raise ApiError(404, "not_found", "That analysis doesn't exist or belongs to another account.")
    return row


def analysis_public(row):
    items = row["items"] or []
    return {
        "analysis_id": row["id"],
        "status": row["status"],
        "failure_reason": row["failure_reason"],
        "model": {"name": row["model_name"], "version": row["model_version"]},
        "image_url": f"/api/v1/analyses/{row['id']}/image" if row["image_path"] else None,
        "original_filename": row["original_filename"],
        "quality": row["quality"],
        "items": items,
        "total": nutrition.totals(items),
        "review_reasons": row["review_reasons"] or [],
        "notes": row["notes"],
        "nutrition_source": nutrition.source_meta(),
        "started_at": row["started_at"],
        "completed_at": row["completed_at"],
        "meal_id": (db.one("SELECT id FROM meals WHERE analysis_id = ?", (row["id"],)) or {}).get("id"),
    }


def meal_public(m):
    return {
        "id": m["id"], "name": m["name"], "meal_type": m["meal_type"], "captured_at": m["captured_at"],
        "items": m["items"], "totals": m["totals"], "model_version": m["model_version"],
        "nutrition_source": m["nutrition_source"], "analysis_id": m["analysis_id"],
        "image_url": f"/api/v1/analyses/{m['analysis_id']}/image" if m["image_path"] and m["analysis_id"] else None,
        "created_at": m["created_at"],
    }


def guess_meal_type(tz_minutes):
    hour = (datetime.now(timezone.utc) + timedelta(minutes=tz_minutes)).hour
    if 5 <= hour < 11:
        return "breakfast"
    if 11 <= hour < 16:
        return "lunch"
    if 16 <= hour < 19:
        return "snack"
    return "dinner"


# ==================================================================== auth
@route("GET", "/api/health", public=True)
def health(req):
    return {"status": "ok", "engine": detector.engine_info(), "nutrition_source": nutrition.source_meta(),
            "time": db.now_iso()}


@route("POST", "/api/v1/auth/signup", public=True)
def signup(req):
    b = req.body
    return auth.signup(b.get("name"), b.get("email"), b.get("password"))


@route("POST", "/api/v1/auth/login", public=True)
def login(req):
    return auth.login(req.body.get("email"), req.body.get("password"))


@route("POST", "/api/v1/auth/logout")
def logout(req):
    auth.logout(req.token)
    return {"ok": True}


@route("GET", "/api/v1/me")
def me(req):
    return {"user": auth.public_user(req.user), "engine": detector.engine_info()}


@route("PUT", "/api/v1/me")
def update_me(req):
    b = req.body
    name = (b.get("name") or req.user["name"]).strip()
    if len(name) < 2:
        raise ApiError(422, "invalid_name", "Enter your name (at least 2 characters).")
    prefs = {**auth.DEFAULT_PREFERENCES, **(req.user.get("preferences") or {})}
    limits = {"calorie_goal": ("Calorie goal", 800, 6000), "protein_goal_g": ("Protein goal", 10, 400),
              "carbs_goal_g": ("Carbs goal", 20, 900), "fat_goal_g": ("Fat goal", 10, 300),
              "fiber_goal_g": ("Fiber goal", 5, 100)}
    for key, (label, lo, hi) in limits.items():
        if key in (b.get("preferences") or {}):
            try:
                value = float(b["preferences"][key])
            except (TypeError, ValueError):
                raise ApiError(422, "invalid_goal", f"{label} must be a number.")
            if not lo <= value <= hi:
                raise ApiError(422, "invalid_goal", f"{label} must be between {lo} and {hi}.")
            prefs[key] = round(value)
    for key in ("profile",):
        if key in (b.get("preferences") or {}):
            prefs[key] = b["preferences"][key]
    db.run("UPDATE users SET name = ?, preferences = ? WHERE id = ?", (name, prefs, req.user["id"]))
    return {"user": auth.public_user(db.one("SELECT * FROM users WHERE id = ?", (req.user["id"],)))}


@route("DELETE", "/api/v1/me/data")
def delete_my_data(req):
    uid = req.user["id"]
    for a in db.query("SELECT image_path FROM analyses WHERE user_id = ?", (uid,)):
        if a["image_path"]:
            Path(config.UPLOAD_DIR / a["image_path"]).unlink(missing_ok=True)
    db.run("DELETE FROM corrections WHERE analysis_id IN (SELECT id FROM analyses WHERE user_id = ?)", (uid,))
    meals = db.run("DELETE FROM meals WHERE user_id = ?", (uid,))
    db.run("DELETE FROM analyses WHERE user_id = ?", (uid,))
    return {"deleted_meals": meals}


# ================================================================= engine
@route("GET", "/api/v1/settings/engine")
def get_engine(req):
    s = config.get_settings()
    masked = (s["api_key"][:7] + "…" + s["api_key"][-4:]) if s["api_key"] else ""
    return {"engine": detector.engine_info(), "api_key_masked": masked, "model": s["model"]}


@route("PUT", "/api/v1/settings/engine")
def put_engine(req):
    key = req.body.get("api_key")
    if key is not None and key and not key.startswith("sk-"):
        raise ApiError(422, "invalid_key", "That doesn't look like an Anthropic API key (it should start with “sk-”).")
    config.save_settings(api_key=key, model=req.body.get("model"))
    return get_engine(req)


# ================================================================== foods
@route("GET", "/api/v1/foods")
def foods(req):
    return {"foods": nutrition.search(req.q("q", ""), int(req.q("limit", 12))), "source": nutrition.source_meta()}


# =============================================================== analysis
@route("POST", "/api/v1/quality-check")
def quality_check(req):
    try:
        img, fmt = imaging.load(imaging.decode_data_url(req.body.get("image")))
    except imaging.ImageError as e:
        raise ApiError(422, e.code, e.message)
    return {"valid": True, "format": fmt, "quality": imaging.assess(img)}


@route("POST", "/api/v1/analyze")
def analyze(req):
    started = db.now_iso()
    filename = (req.body.get("filename") or "photo.jpg")[:120]
    try:
        img, _ = imaging.load(imaging.decode_data_url(req.body.get("image")))
    except imaging.ImageError as e:
        raise ApiError(422, e.code, e.message)

    analysis_id = str(uuid.uuid4())
    image_name = f"{analysis_id}.jpg"
    (config.UPLOAD_DIR / image_name).write_bytes(imaging.to_jpeg_bytes(img, max_side=1600))
    quality = imaging.assess(img)
    engine = detector.engine_info()
    db.run("""INSERT INTO analyses (id, user_id, image_path, original_filename, status, model_name, model_version,
              quality, started_at, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)""",
           (analysis_id, req.user["id"], image_name, filename, "ANALYZING", engine["name"], engine["model"],
            quality, started, started))
    try:
        result = detector.detect(img, filename)
    except detector.DetectorError as e:
        db.run("UPDATE analyses SET status='FAILED', failure_reason=?, completed_at=? WHERE id=?",
               (e.message, db.now_iso(), analysis_id))
        return analysis_public(get_analysis(req, analysis_id))

    items = [nutrition.build_item(r) for r in result["items"]]
    reasons = nutrition.review_reasons(items, demo_mode=result.get("demo"))
    if not result["is_food"] and not items:
        reasons = ["No food was found in this photo. Retake it with the plate in view, or add foods manually."]
    status = "NEEDS_CONFIRMATION" if reasons else "CALCULATED"
    db.run("UPDATE analyses SET status=?, items=?, review_reasons=?, notes=?, completed_at=? WHERE id=?",
           (status, items, reasons, result.get("notes"), db.now_iso(), analysis_id))
    return analysis_public(get_analysis(req, analysis_id))


@route("GET", "/api/v1/analyses/{id}")
def get_analysis_route(req):
    return analysis_public(get_analysis(req, req.params["id"]))


@route("POST", "/api/v1/analyses/{id}/corrections")
def corrections(req):
    row = get_analysis(req, req.params["id"])
    if row["status"] == "SAVED":
        raise ApiError(409, "already_saved", "This meal is already saved. Delete it from history to change it.")
    old = {i["id"]: i for i in (row["items"] or [])}
    new_items, log = [], []
    for raw in req.body.get("items") or []:
        food_id = raw.get("food_id")
        if food_id not in nutrition.FOODS and not (raw.get("id") in old and food_id == "unknown"):
            raise ApiError(422, "unknown_food", "Pick a food from the catalog list.")
        try:
            grams = float(raw.get("portion_g")) if raw.get("portion_g") is not None else None
        except (TypeError, ValueError):
            raise ApiError(422, "invalid_portion", "Portion must be a number of grams.")
        if grams is not None and not 1 <= grams <= 3000:
            raise ApiError(422, "invalid_portion", "Portion must be between 1 g and 3000 g.")
        prev = old.get(raw.get("id"))
        if prev:
            merged = dict(prev)
            if food_id != prev["food_id"]:
                log.append(("food", prev["label"], nutrition.FOODS[food_id]["name"]))
                merged.update(food_id=food_id, label=nutrition.FOODS[food_id]["name"], origin="corrected")
                if grams is None:
                    grams = nutrition.FOODS[food_id]["serving"]["grams"]
            if grams is not None and grams != prev["portion_g"]:
                log.append(("portion_g", str(prev["portion_g"]), str(grams)))
                merged.update(portion_g=grams, portion_method="user_confirmed", portion_confidence=1.0, portion_note="")
            new_items.append(nutrition.build_item(merged))
        else:
            food = nutrition.FOODS[food_id]
            log.append(("add", None, food["name"]))
            new_items.append(nutrition.build_item({
                "food_id": food_id, "label": food["name"], "confidence": None, "bbox": None,
                "portion_g": grams or food["serving"]["grams"], "portion_confidence": 1.0,
                "portion_method": "user_confirmed", "origin": "user"}))
    kept = {i["id"] for i in new_items}
    log += [("remove", old[i]["label"], None) for i in old if i not in kept]
    for field, before, after in log:
        db.run("INSERT INTO corrections (analysis_id, field, old_value, new_value, created_at) VALUES (?,?,?,?,?)",
               (row["id"], field, before, after, db.now_iso()))
    reasons = [r for r in nutrition.review_reasons(new_items) if "isn't in the nutrition catalog" in r]
    if not new_items:
        reasons = ["Add at least one food to calculate nutrition."]
    status = "NEEDS_CONFIRMATION" if not new_items else "CALCULATED"
    db.run("UPDATE analyses SET items=?, review_reasons=?, status=?, failure_reason=NULL WHERE id=?",
           (new_items, reasons, status, row["id"]))
    return analysis_public(get_analysis(req, row["id"]))


@route("GET", "/api/v1/analyses/{id}/image")
def analysis_image(req):
    row = get_analysis(req, req.params["id"])
    path = config.UPLOAD_DIR / (row["image_path"] or "")
    if not row["image_path"] or not path.exists():
        raise ApiError(404, "not_found", "Image not found.")
    return ("image/jpeg", path.read_bytes())


# ================================================================== meals
@route("POST", "/api/v1/meals")
def save_meal(req):
    row = get_analysis(req, req.body.get("analysis_id") or "")
    existing = db.one("SELECT * FROM meals WHERE analysis_id = ?", (row["id"],))
    if existing:                                    # idempotent save
        return {"meal": meal_public(existing)}
    items = row["items"] or []
    if not any(i.get("nutrition") for i in items):
        raise ApiError(422, "nothing_to_save", "Add at least one catalog food before saving this meal.")
    meal_type = req.body.get("meal_type") or guess_meal_type(int(req.body.get("tz", 0)))
    if meal_type not in MEAL_TYPES:
        raise ApiError(422, "invalid_meal_type", "Meal type must be breakfast, lunch, dinner or snack.")
    name = (req.body.get("name") or "").strip()[:80] or " + ".join(i["label"] for i in items[:3])
    meal_id = str(uuid.uuid4())
    db.run("""INSERT INTO meals (id, user_id, analysis_id, name, meal_type, captured_at, items, totals, image_path,
              model_version, nutrition_source, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
           (meal_id, req.user["id"], row["id"], name, meal_type, row["created_at"], items, nutrition.totals(items),
            row["image_path"], f"{row['model_name']}:{row['model_version']}", nutrition.source_meta(), db.now_iso()))
    db.run("UPDATE analyses SET status='SAVED' WHERE id=?", (row["id"],))
    return {"meal": meal_public(db.one("SELECT * FROM meals WHERE id = ?", (meal_id,)))}


@route("GET", "/api/v1/meals")
def list_meals(req):
    sql, args = "SELECT * FROM meals WHERE user_id = ?", [req.user["id"]]
    if req.q("meal_type") in MEAL_TYPES:
        sql += " AND meal_type = ?"
        args.append(req.q("meal_type"))
    meals = [meal_public(m) for m in db.query(sql + " ORDER BY captured_at DESC LIMIT ?", args + [int(req.q("limit", 200))])]
    q = (req.q("q") or "").strip().lower()
    if q:
        meals = [m for m in meals if q in m["name"].lower() or any(q in i["label"].lower() for i in m["items"])]
    return {"meals": meals}


@route("GET", "/api/v1/meals/{id}")
def get_meal(req):
    m = db.one("SELECT * FROM meals WHERE id = ? AND user_id = ?", (req.params["id"], req.user["id"]))
    if not m:
        raise ApiError(404, "not_found", "Meal not found.")
    return {"meal": meal_public(m)}


@route("DELETE", "/api/v1/meals/{id}")
def delete_meal(req):
    m = db.one("SELECT * FROM meals WHERE id = ? AND user_id = ?", (req.params["id"], req.user["id"]))
    if not m:
        raise ApiError(404, "not_found", "Meal not found.")
    db.run("DELETE FROM meals WHERE id = ?", (m["id"],))
    if m["analysis_id"]:
        db.run("DELETE FROM corrections WHERE analysis_id = ?", (m["analysis_id"],))
        db.run("DELETE FROM analyses WHERE id = ?", (m["analysis_id"],))
    if m["image_path"]:
        Path(config.UPLOAD_DIR / m["image_path"]).unlink(missing_ok=True)
    return {"deleted": True}


# ================================================================ summary
@route("GET", "/api/v1/summary")
def summary(req):
    days = max(1, min(int(req.q("days", 7)), 90))
    tz = int(req.q("tz", 0))
    local_now = datetime.now(timezone.utc) + timedelta(minutes=tz)
    day_keys = [(local_now - timedelta(days=d)).date().isoformat() for d in range(days - 1, -1, -1)]
    by_day = {k: {"date": k, "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0, "fiber_g": 0, "meals": 0} for k in day_keys}
    foods, types = {}, {t: 0 for t in MEAL_TYPES}
    start_utc = (datetime.fromisoformat(day_keys[0]) - timedelta(minutes=tz)).replace(tzinfo=timezone.utc)
    for m in db.query("SELECT * FROM meals WHERE user_id = ? AND captured_at >= ?", (req.user["id"], start_utc.isoformat())):
        key = (datetime.fromisoformat(m["captured_at"]) + timedelta(minutes=tz)).date().isoformat()
        if key not in by_day:
            continue
        for n in nutrition.NUTRIENTS:
            by_day[key][n] = round(by_day[key][n] + m["totals"][n], 1)
        by_day[key]["meals"] += 1
        types[m["meal_type"]] = types.get(m["meal_type"], 0) + 1
        for i in m["items"]:
            f = foods.setdefault(i["label"], {"label": i["label"], "category": i["category"], "count": 0, "calories": 0})
            f["count"] += 1
            f["calories"] += (i.get("nutrition") or {}).get("calories", 0)
    series = list(by_day.values())
    logged = [d for d in series if d["meals"]]
    avg = {n: round(sum(d[n] for d in logged) / len(logged), 1) if logged else 0 for n in nutrition.NUTRIENTS}
    energy = avg["protein_g"] * 4 + avg["carbs_g"] * 4 + avg["fat_g"] * 9
    split = {k: round(avg[g] * m / energy * 100) if energy else 0 for k, g, m in
             (("carbs", "carbs_g", 4), ("protein", "protein_g", 4), ("fat", "fat_g", 9))}
    streak = 0
    for d in reversed(series):
        if d["meals"]:
            streak += 1
        elif d["date"] != day_keys[-1]:
            break
    return {"days": days, "series": series, "average": avg, "energy_split": split, "days_logged": len(logged),
            "total_meals": sum(d["meals"] for d in series), "meal_types": types, "streak": streak,
            "today": series[-1], "goals": auth.public_user(req.user)["preferences"],
            "top_foods": sorted(foods.values(), key=lambda f: -f["count"])[:6]}


# ================================================================== demo
@route("POST", "/api/v1/demo/seed")
def seed(req):
    """Add a realistic week of meals (no photos) so the dashboard has something to show."""
    plans = [
        ("breakfast", 8, [("poha", 150), ("tea", 150)]), ("breakfast", 8, [("oats_porridge", 240), ("banana", 118)]),
        ("breakfast", 9, [("idli", 120), ("sambar", 150)]), ("breakfast", 8, [("omelette", 110), ("bread_brown", 56)]),
        ("lunch", 13, [("roti", 80), ("dal", 150), ("rice_white", 158), ("green_salad", 80)]),
        ("lunch", 13, [("rajma", 150), ("rice_white", 180), ("curd", 100)]),
        ("lunch", 13, [("biryani_chicken", 280), ("raita", 100)]),
        ("lunch", 14, [("paneer_wrap", 200)]), ("snack", 17, [("fruit_bowl", 250)]), ("snack", 17, [("samosa", 70), ("tea", 150)]),
        ("dinner", 20, [("roti", 120), ("palak_paneer", 150), ("green_salad", 100)]),
        ("dinner", 21, [("chicken_curry", 200), ("rice_white", 158)]), ("dinner", 20, [("khichdi", 250), ("curd", 100)]),
    ]
    rng = random.Random()
    tz = int(req.body.get("tz", 0))
    today = (datetime.now(timezone.utc) + timedelta(minutes=tz)).date()
    created = 0
    for back in range(6, -1, -1):
        day = today - timedelta(days=back)
        for mt in MEAL_TYPES:
            if mt == "snack" and rng.random() < 0.5:
                continue
            if back == 0 and mt in ("dinner", "snack"):
                continue
            meal_type, hour, foods = rng.choice([p for p in plans if p[0] == mt])
            items = [nutrition.build_item({"food_id": f, "portion_g": g * rng.uniform(0.85, 1.2), "confidence": round(rng.uniform(0.78, 0.96), 2),
                                           "portion_confidence": 0.8, "origin": "demo"}) for f, g in foods]
            local = datetime(day.year, day.month, day.day, hour, rng.randint(0, 50), tzinfo=timezone.utc) - timedelta(minutes=tz)
            db.run("""INSERT INTO meals (id, user_id, analysis_id, name, meal_type, captured_at, items, totals, image_path,
                      model_version, nutrition_source, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
                   (str(uuid.uuid4()), req.user["id"], None, " + ".join(i["label"] for i in items), meal_type,
                    local.isoformat(timespec="seconds"), items, nutrition.totals(items), None, "sample-data",
                    nutrition.source_meta(), db.now_iso()))
            created += 1
    return {"created": created}


# ================================================================= server
class Handler(BaseHTTPRequestHandler):
    server_version = "NutriScan/1.0"

    def log_message(self, fmt, *args):
        sys.stderr.write(f"[{self.log_date_time_string()}] {self.command} {self.path.split('?')[0]} -> {args[1] if len(args) > 1 else ''}\n")

    def do_GET(self):
        self.dispatch("GET")

    def do_POST(self):
        self.dispatch("POST")

    def do_PUT(self):
        self.dispatch("PUT")

    def do_DELETE(self):
        self.dispatch("DELETE")

    def send_body(self, status, content_type, data):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def send_json(self, status, obj):
        self.send_body(status, "application/json; charset=utf-8", json.dumps(obj).encode())

    def dispatch(self, method):
        url = urlparse(self.path)
        if not url.path.startswith("/api/"):
            return self.serve_static(url.path)
        request_id = uuid.uuid4().hex[:8]
        try:
            for m, regex, fn, public in ROUTES:
                match = regex.match(url.path)
                if m == method and match:
                    break
            else:
                raise ApiError(404, "not_found", f"No endpoint {method} {url.path}.")
            query = parse_qs(url.query)
            token = (self.headers.get("Authorization") or "").removeprefix("Bearer ").strip() or query.get("token", [None])[0]
            user = auth.user_for_token(token)
            if not public and not user:
                raise ApiError(401, "unauthorized", "Your session has expired. Log in again.")
            body = {}
            length = int(self.headers.get("Content-Length") or 0)
            if length > config.MAX_UPLOAD_BYTES * 1.5:
                raise ApiError(413, "too_large", "This image is over the 5 MB limit.")
            if length:
                try:
                    body = json.loads(self.rfile.read(length).decode() or "{}")
                except (json.JSONDecodeError, UnicodeDecodeError):
                    raise ApiError(400, "bad_json", "The request body must be JSON.")
            result = fn(Request(self, match.groupdict(), query, body, user, token))
            if isinstance(result, tuple):
                return self.send_body(200, result[0], result[1])
            self.send_json(200, result)
        except (ApiError, auth.AuthError) as e:
            self.send_json(e.status, {"error": {"code": e.code, "message": e.message, "request_id": request_id,
                                                **getattr(e, "extra", {})}})
        except Exception:
            traceback.print_exc()
            self.send_json(500, {"error": {"code": "server_error", "request_id": request_id,
                                           "message": f"Something failed on the server (ref {request_id}). Check the terminal log."}})

    def serve_static(self, path):
        target = (config.FRONTEND_DIR / path.lstrip("/")).resolve()
        if path in ("", "/") or not target.is_file() or config.FRONTEND_DIR.resolve() not in target.parents:
            target = config.FRONTEND_DIR / "index.html"
        ctype = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        if ctype.startswith("text/") or ctype.endswith("javascript"):
            ctype += "; charset=utf-8"
        self.send_body(200, ctype, target.read_bytes())


def main():
    db.init()
    httpd = ThreadingHTTPServer((config.HOST, config.PORT), Handler)
    engine = detector.engine_info()
    print(f"\n  NutriScan AI running at  http://{config.HOST}:{config.PORT}")
    print(f"  Detection engine: {engine['mode']} ({engine['model']})")
    if engine["mode"] == "demo":
        print("  Tip: add your Anthropic API key on the Profile page (or in .env) to enable real image recognition.")
    print("  Press Ctrl+C to stop.\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
