import datetime
import sqlite3

from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit

from python_scripts.database_read import get_all_game_types, get_all_player_names, get_all_player_names_of_game, \
    get_all_games

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

CORS(app, resources={r"/*": {"origins": "*"}})

round_data = []


def build_payload(game_type, game_number):
    connection = sqlite3.connect('round_history.db')

    cursor = connection.cursor()

    payload = {
        "head": [],
        "body": [],
        "foot": {},
    }

    for user_name in get_all_player_names_of_game():
        payload["head"].append(user_name)

        cursor.execute(
            "SELECT fk_round_number, score "
            "FROM score "
            "WHERE fk_game_type = ?"
            "AND fk_game_identifier = ? "
            "AND fk_user_name = ?",
            (game_type, game_number, user_name)
        )

        scores = cursor.fetchall()

        for score in scores:
            while len(payload["body"]) <= score[0]:
                payload["body"].append({})

            payload["body"][score[0]][user_name] = score[1]

    cursor.close()

    connection.close()

    return payload


@app.route('/')
def index():
    return app.send_static_file('templates/index.html')


@app.route('/<path:file>')
def assets(file):
    return app.send_static_file(file)


@socketio.on('navigation')
def handle_get_all_game_types():
    return get_all_games()


@socketio.on('grid')
def handle_request_last_game_of_type(game_type, game_identifier):
    payload = build_payload(game_type, game_identifier)
    return payload


@socketio.on('request_all_user_names')
def handle_request_all_users():
    emit('provide_all_user_names', get_all_player_names(), broadcast=True)


@socketio.on('change')
def handle_submit(grid, change):
    game_number = get_or_create_game(grid)[0]

    connection = sqlite3.connect('round_history.db')

    cursor = connection.cursor()

    cursor.execute(
        "INSERT OR REPLACE INTO score "
        "(fk_game_number, fk_round_number, fk_user_name, fk_game_types, score) "
        "VALUES (?, ?, ?, ?, ?)",
        (game_number, change["number"], change["name"], grid, float(change["cell"])))

    connection.commit()

    cursor.close()

    connection.close()

    emit('change', (grid, change), broadcast=True)


@socketio.on('disconnect')
def handle_disconnect():
    pass


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=10000, allow_unsafe_werkzeug=True)
