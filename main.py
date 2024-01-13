import datetime
import sqlite3

from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit

from python_scripts.database_read import get_all_game_types

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

CORS(app, resources={r"/*": {"origins": "*"}})

round_data = []

DATABASE = sqlite3.connect('round_history.db')
CURSOR = DATABASE.cursor()


def get_connected_users():
    CURSOR.execute(
        "SELECT name, total_score, total_rounds "
        "FROM user "
        "WHERE connected != ?",
        ("",)
    )
    connected_users = CURSOR.fetchall()
    return connected_users


def end_game(game_number):
    CURSOR.execute(
        "UPDATE game "
        "SET end_time = ? "
        "WHERE number = ? ",
        (datetime.datetime.now(), game_number)
    )
    DATABASE.commit()


def build_payload(game_type, game_number):
    connection = sqlite3.connect('round_history.db')

    cursor = connection.cursor()

    payload = {
        "head": [],
        "body": [],
        "foot": {},
    }

    for user_name in get_all_user_names():
        payload["head"].append(user_name)

        cursor.execute(
            "SELECT fk_round_number, score "
            "FROM score "
            "WHERE fk_game_types = ?"
            "AND fk_game_number = ? "
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


def get_or_create_user(user_name):
    CURSOR.execute("SELECT * FROM user WHERE name = ?", (user_name,))
    result = CURSOR.fetchone()

    if result:
        return result[0]

    new_user_data = (user_name, 0, 0, "True")
    CURSOR.execute(
        "INSERT INTO user (name, total_score, total_rounds, connected)"
        "VALUES (?, ?, ?, ?)",
        new_user_data
    )
    DATABASE.commit()
    return new_user_data


def create_new_user(user_name):
    CURSOR.execute("SELECT * FROM user WHERE name = ?", (user_name,))
    result = CURSOR.fetchone()

    print(result)
    if result:
        return

    new_user_data = "user_name", 0, 0, "True"
    CURSOR.execute(
        """
        INSERT INTO user (name, total_score, total_rounds, connected)
        VALUES (?, ?, ?, ?)""",
        new_user_data
    )
    DATABASE.commit()


def get_last_game(game_type):
    connection = sqlite3.connect('round_history.db')

    cursor = connection.cursor()

    cursor.execute(
        "SELECT number "
        "FROM game "
        "WHERE fk_game_types = ? "
        "ORDER BY number "
        "DESC "
        "LIMIT 1",
        (game_type,))

    result = cursor.fetchone()

    cursor.close()

    connection.close()

    return result


def create_new_game(game_type):
    game_number = 0

    new_game_data = game_number, datetime.datetime.now(), "-", game_type

    connection = sqlite3.connect('round_history.db')

    cursor = connection.cursor()

    cursor.execute(
        "INSERT INTO game (number, start_time, end_time, fk_game_types)"
        "VALUES (?, ?, ?, ?)",
        new_game_data
    )

    cursor.execute(
        "INSERT INTO round (fk_game_number, fk_first_user, number, color, fk_game_types)"
        "VALUES (?, ?, ?, ?, ?)",
        (game_number, "Pert", 0, "light", game_type)
    )

    connection.commit()

    cursor.close()

    connection.close()

    return new_game_data


def get_or_create_game(game_type):
    last_game_data = get_last_game(game_type)
    if last_game_data:
        return last_game_data

    new_game_data = create_new_game(game_type)
    return new_game_data


def insert_or_update_score(game_number, round_number, user_name, new_score):
    CURSOR.execute(
        "SELECT * "
        "FROM score "
        "WHERE fk_game_number = ? "
        "AND fk_round_number = ? "
        "AND fk_user_name = ?",
        (game_number, round_number, user_name)
    )
    existing_row = CURSOR.fetchone()

    if existing_row:
        CURSOR.execute(
            "UPDATE score "
            "SET score = ? "
            "WHERE fk_game_number = ? "
            "AND fk_round_number = ? "
            "AND fk_user_name = ?",
            (new_score, game_number, round_number, user_name)
        )
    else:
        CURSOR.execute("INSERT INTO score (fk_game_number, fk_round_number, fk_user_name, score) "
                       "VALUES (?, ?, ?, ?)",
                       (game_number, round_number, user_name, new_score))


def get_all_user_names():
    connection = sqlite3.connect('round_history.db')

    cursor = connection.cursor()

    cursor.execute(
        "SELECT name "
        "FROM user"
    )

    result = [element for sub_list in cursor.fetchall() for element in sub_list]

    cursor.close()

    connection.close()

    return result


def set_user_to_disconnected(client_sid):
    CURSOR.execute(
        "UPDATE user "
        "SET connected = ? "
        "WHERE connected = ?",
        ("", client_sid)
    )


def set_user_to_connected(client_id, user_name):
    CURSOR.execute(
        "UPDATE user "
        "SET connected = ? "
        "WHERE name = ?",
        (client_id, user_name)
    )


def get_current_game_number():
    CURSOR.execute(
        "SELECT number "
        "FROM game "
        "WHERE end_time = ?",
        ("-",)
    )

    result = CURSOR.fetchone()
    return result


@app.route('/')
def index():
    return app.send_static_file('templates/index.html')


@app.route('/<path:file>')
def assets(file):
    return app.send_static_file(file)


@socketio.on('login')
def handle_login(user_name):
    print(f'{user_name} logged in.')
    user = get_or_create_user(user_name)
    set_user_to_connected(request.sid, user_name)
    game = get_or_create_game()
    payload = build_payload(game[0])
    emit('login', payload, broadcast=True)


@socketio.on('navigation')
def handle_get_all_game_types():
    return get_all_game_types()


@socketio.on('get_last_game')
def handle_request_table_by_game_number(game_type):
    payload = get_or_create_game(game_type)
    emit('provide_last_game', payload)


@socketio.on('add_new_user')
def handle_add_new_user(user_name):
    create_new_user(user_name)
    emit('provide_all_user_names', get_all_user_names(), broadcast=True)


@socketio.on('grid')
def handle_request_last_game_of_type(game_type):
    game_number = get_or_create_game(game_type)[0]
    payload = build_payload(game_type, game_number)
    return payload


@socketio.on('request_table_by_game_number')
def handle_request_table_by_game_number(game_type, game_number):
    payload = build_payload(game_type, game_number)
    emit('provide_table', payload)


@socketio.on('request_current_table')
def handle_request_current_table(game_type):
    game = get_or_create_game(game_type)
    payload = build_payload(game[0])
    emit('provide_table', payload)


@socketio.on('request_all_user_names')
def handle_request_all_users():
    emit('provide_all_user_names', get_all_user_names(), broadcast=True)


@socketio.on('change')
def handle_submit(grid, change):
    # game_number = get_current_game_number()
    # round_number = data["round_number"]
    # user_name = data["user_name"]
    # score = data["score"]
    # insert_or_update_score(game_number, round_number, user_name, score)
    # payload = build_payload(game_number)

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
