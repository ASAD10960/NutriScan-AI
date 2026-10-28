
"""Deterministic nutrition service: food ID + grams + versioned catalog -> nutrients.

Nothing here guesses. Unknown foods keep their label but get no nutrition, and are
left out of totals, so the UI can say exactly what is missing.
"""
import json
import re
import uuid

import config

_catalog = json.loads(config.CATALOG_PATH.read_text(encoding="utf-8"))
SOURCE = _catalog["source"]
FOODS = {f["id"]: f for f in _catalog["foods"]}
NUTRIENTS = ("calories", "protein_g", "carbs_g", "fat_g", "fiber_g")

LOW_CONFIDENCE = 0.6
LOW_PORTION_CONFIDENCE = 0.5


def source_meta():
    return {"name": SOURCE["name"], "version": SOURCE["version"], "basis": SOURCE["basis"], "note": SOURCE["note"]}


def catalog_prompt_lines():
    return "\n".join(
        f"{f['id']} | {f['name']} | typical serving: 1 {f['serving']['unit']} = {f['serving']['grams']:g} g"
        for f in FOODS.values())


def search(q="", limit=12):
    q = (q or "").strip().lower()
    foods = list(FOODS.values())
    if q:
        def score(f):
            names = [f["name"].lower(), f["id"].replace("_", " ")] + [a.lower() for a in f["aliases"]]
            if any(n == q for n in names):
                return 0
            if any(n.startswith(q) for n in names):
                return 1
            if any(q in n for n in names):
                return 2
            return None
        scored = [(score(f), f) for f in foods]
        foods = [f for s, f in sorted((x for x in scored if x[0] is not None), key=lambda x: x[0])]
    return [food_public(f) for f in foods[:limit]]


def food_public(f):
    return {"id": f["id"], "name": f["name"], "category": f["category"],
            "serving": f["serving"], "per_100g": f["per_100g"]}


def match_text(text):
    """Find catalog foods mentioned in free text (used by demo mode for filenames)."""
    norm = " " + re.sub(r"[^a-z]+", " ", (text or "").lower()) + " "
    found = []
    for f in FOODS.values():
        names = sorted({f["id"].replace("_", " "), f["name"].lower()} | {a.lower() for a in f["aliases"]}, key=len, reverse=True)
        for n in names:
            n = re.sub(r"[^a-z]+", " ", n).strip()
            if n and f" {n} " in norm:
                found.append((len(n), f))
                norm = norm.replace(f" {n} ", " ")
                break
    return [f for _, f in sorted(found, key=lambda x: -x[0])]


def serving_text(food, grams):
    unit, per = food["serving"]["unit"], food["serving"]["grams"]
    count = round((grams / per) * 2) / 2
    if count <= 0:
        return f"{grams:g} g"
    plurals = {"glass": "glasses", "tbsp": "tbsp", "tsp": "tsp", "handful": "handfuls"}
    label = unit if count <= 1 else plurals.get(unit, unit + "s")
    return f"{count:g} {label}"


def nutrients_for(food, grams):
    factor = grams / 100.0
    return {k: round(food["per_100g"][k] * factor, 1) for k in NUTRIENTS}


def build_item(raw):
    """Normalise one detected/corrected item and attach deterministic nutrition."""
    food = FOODS.get(raw.get("food_id"))
    grams = raw.get("portion_g")
    try:
        grams = float(grams) if grams is not None else None
    except (TypeError, ValueError):
        grams = None
    if food and (grams is None or grams <= 0):
        grams = food["serving"]["grams"]
    grams = round(min(max(grams or 0, 1), 3000)) if grams else None

    confidence = raw.get("confidence")
    portion_conf = raw.get("portion_confidence")
    item = {
        "id": raw.get("id") or uuid.uuid4().hex[:10],
        "food_id": food["id"] if food else "unknown",
        "label": raw.get("label") or (food["name"] if food else "Unknown food"),
        "category": food["category"] if food else "unknown",
        "confidence": round(float(confidence), 2) if confidence is not None else None,
        "bbox": raw.get("bbox"),
        "portion_g": grams,
        "portion_confidence": round(float(portion_conf), 2) if portion_conf is not None else None,
        "portion_method": raw.get("portion_method") or "model_estimate",
        "portion_note": raw.get("portion_note") or "",
        "origin": raw.get("origin") or "model",
        "supported": bool(food),
        "serving_text": serving_text(food, grams) if food and grams else None,
        "nutrition": nutrients_for(food, grams) if food and grams else None,
        "calorie_range": None,
    }
    if item["nutrition"] and item["portion_confidence"] is not None and item["portion_confidence"] < LOW_PORTION_CONFIDENCE:
        kcal = item["nutrition"]["calories"]
        item["calorie_range"] = [round(kcal * 0.75), round(kcal * 1.25)]
    return item


def totals(items):
    out = {k: 0.0 for k in NUTRIENTS}
    missing = []
    for it in items:
        if it.get("nutrition"):
            for k in NUTRIENTS:
                out[k] += it["nutrition"][k]
        else:
            missing.append(it["label"])
    out = {k: round(v, 1) for k, v in out.items()}
    energy = out["protein_g"] * 4 + out["carbs_g"] * 4 + out["fat_g"] * 9
    out["energy_split"] = {
        "protein": round(out["protein_g"] * 4 / energy * 100) if energy else 0,
        "carbs": round(out["carbs_g"] * 4 / energy * 100) if energy else 0,
        "fat": round(out["fat_g"] * 9 / energy * 100) if energy else 0,
    }
    out["incomplete"] = bool(missing)
    out["missing_items"] = missing
    return out


def review_reasons(items, demo_mode=False):
    reasons = []
    if not items:
        reasons.append("No food was recognised. Add the items on your plate manually.")
    if demo_mode and items:
        reasons.append("Demo mode guessed these foods from the file name. Check them before saving.")
    for it in items:
        if not it["supported"]:
            reasons.append(f"“{it['label']}” isn't in the nutrition catalog. Pick the closest food or remove it.")
        elif it["confidence"] is not None and it["confidence"] < LOW_CONFIDENCE:
            reasons.append(f"Low confidence for {it['label']} ({round(it['confidence'] * 100)}%). Confirm it's right.")
        elif it["portion_confidence"] is not None and it["portion_confidence"] < LOW_PORTION_CONFIDENCE:
            reasons.append(f"Portion of {it['label']} is uncertain. Adjust the grams if needed.")
    return reasons
