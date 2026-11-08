from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash

from app.database import get_database

bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.post("/sign-up")
def sign_up():
    name = request.form.get("name", "")
    password = request.form.get("password", "")

    if not name:
        return jsonify("The name is required."), 400
    elif not password:
        return jsonify("The password is required."), 400

    if not _validate_name(name) or name.strip() != name:
        return jsonify("The name is invalid."), 400

    if not _validate_password(password):
        return jsonify("The password is invalid."), 400

    db = get_database()

    try:
        # TODO: Unicode Normalization
        db.execute(
            "INSERT INTO user (name, hash) VALUES (?, ?)",
            (name, generate_password_hash(password)),
        )

        db.commit()
    except db.IntegrityError:
        return jsonify("The user already exists."), 400

    return "", 201


def _validate_name(name: str):
    return len(name) > 3 and len(name) < 32


def _validate_password(password: str):
    return len(password) > 7 and len(password) < 256
