import os

from flask import Flask


def create_app() -> Flask:
    """
    Create and configure an instance of the Flask application.
    """
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(DATABASE=os.path.join(app.instance_path, "app.sqlite"))

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    from . import db

    db.init_app(app)

    from . import socket

    socket.socketio.init_app(app)

    return app
