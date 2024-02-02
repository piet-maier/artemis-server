import os

from flask import Flask, Response

from . import database, socket


def create_app() -> Flask:
    """
    Create and configure an instance of the Flask application.
    """
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        DATABASE=os.path.join(app.instance_path, "round_history.db")
    )

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

    # socket.py
    socket.socketio.init_app(app)

    return app
