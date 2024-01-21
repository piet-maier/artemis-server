import os

from flask import Flask
from flask_cors import CORS

from . import database, socket


def create_app() -> Flask:
    """
    Create and configure an instance of the Flask application.
    """
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(DATABASE=os.path.join(app.instance_path, "round_history.db"))

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # database.py

    database.init_app(app)

    # socket.py

    socket.socketio.init_app(app)

    CORS(app, resources={r"/*": {"origins": "*"}})

    return app
