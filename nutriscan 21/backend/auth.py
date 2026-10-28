"""Email/password accounts with PBKDF2 hashing and bearer-token sessions."""
import hashlib #Used for password hashing, such as PBKDF2, so passwords are not stored as plain text.
import hmac   #Provides message authentication and secure comparison functions.
import re    #Can validate email formats or check password requirements.
import secrets  
import uuid   #Generates unique identifiers.
from datetime import datetime, timedelta, timezone  #Can record account creation times, token expiration, and login timestamps.

import config #May contain database settings, security parameters, or application configuration.
import db  #Imports your project's database module.

DEFAULT_PREFERENCES = {
    "calorie_goal": 2000,
    "protein_goal_g": 75,
    "carbs_goal_g": 250,
    "fat_goal_g": 65,
    "fiber_goal_g": 30,
}

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class AuthError(Exception):
    def __init__(self, status, code, message):
        super().__init__(message)
        self.status, self.code, self.message = status, code, message


def hash_password(password, salt=None):
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 200_000).hex()
    return f"{salt}${digest}"


def verify_password(password, stored):
    salt, _ = stored.split("$", 1)
    return hmac.compare_digest(hash_password(password, salt), stored)


def public_user(user):
    prefs = {**DEFAULT_PREFERENCES, **(user.get("preferences") or {})}
    return {"id": user["id"], "name": user["name"], "email": user["email"],
            "preferences": prefs, "created_at": user["created_at"]}


def signup(name, email, password):
    name, email = (name or "").strip(), (email or "").strip().lower()
    if len(name) < 2:
        raise AuthError(422, "invalid_name", "Enter your name (at least 2 characters).")
    if not EMAIL_RE.match(email):
        raise AuthError(422, "invalid_email", "Enter a valid email address.")
    if len(password or "") < 6:
        raise AuthError(422, "weak_password", "Use a password with at least 6 characters.")
    if db.one("SELECT id FROM users WHERE email = ?", (email,)):
        raise AuthError(409, "email_taken", "An account with this email already exists. Log in instead.")
    user_id = str(uuid.uuid4())
    db.run("INSERT INTO users (id, name, email, password_hash, preferences, created_at) VALUES (?,?,?,?,?,?)",
           (user_id, name, email, hash_password(password), DEFAULT_PREFERENCES, db.now_iso()))
    return create_session(user_id)


def login(email, password):
    email = (email or "").strip().lower()
    user = db.one("SELECT * FROM users WHERE email = ?", (email,))
    if not user or not verify_password(password or "", user["password_hash"]):
        raise AuthError(401, "invalid_credentials", "Email or password is incorrect.")
    return create_session(user["id"])


def create_session(user_id):
    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + timedelta(days=config.SESSION_DAYS)
    db.run("INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?,?,?,?)",
           (token, user_id, db.now_iso(), expires.isoformat(timespec="seconds")))
    user = db.one("SELECT * FROM users WHERE id = ?", (user_id,))
    return {"token": token, "user": public_user(user)}


def user_for_token(token):
    if not token:
        return None
    session = db.one("SELECT * FROM sessions WHERE token = ?", (token,))
    if not session or session["expires_at"] < db.now_iso():
        return None
    return db.one("SELECT * FROM users WHERE id = ?", (session["user_id"],))


def logout(token):
    db.run("DELETE FROM sessions WHERE token = ?", (token,))
