import os
from collections.abc import Mapping
from typing import Any

from flask import Flask, Response

from . import auth, database, socket


def create_app(test_config: Mapping[str, Any] | None = None) -> Flask:
    """
    Create and configure an instance of the Flask application.
    """
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        DATABASE=os.path.join(app.instance_path, "round_history.db")
    )

    if test_config is None:
        app.config.from_pyfile("config.py", silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # database.py
    database.init_app(app)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def catch_all(path: str) -> Response:
        return app.send_static_file(path if "." in path else "index.html")

    app.register_blueprint(auth.bp)

    # socket.py
    socket.socketio.init_app(app)

    return app
