import random
from datetime import datetime

from flask_socketio import SocketIO

from python_scripts.database_delete import delete_score
from python_scripts.database_read import (
    get_all_games,
    get_score_sum,
    get_all_player_names,
)
from python_scripts.database_write import add_new_score, add_new_game
from python_scripts.grid_utils import build_grid_payload

# FIXME: Remove CORS In Production
socketio = SocketIO(cors_allowed_origins="*")


@socketio.on("navigation")
def navigation():
    return get_all_games()


@socketio.on("grid:create")
def create_grid(grid_type: str) -> int:
    current_timestamp = int(datetime.now().timestamp() * 1000)

    add_new_game(grid_type, current_timestamp)

    return current_timestamp


# noinspection PyUnusedLocal
@socketio.on("grid:read")
def handle_request_last_game_of_type(game_type, game_name):
    payload = build_grid_payload(game_name)
    return payload


@socketio.on("grid:update")
def handle_submit(game_type, game_timestamp, change):
    if change["cell"]:
        add_new_score(game_timestamp, *change.values())
    else:
        delete_score(game_timestamp, change["name"], change["number"])
    socketio.emit(
        "grid:update",
        (
            game_type,
            game_timestamp,
            change,
            get_score_sum(game_timestamp, change["name"]),
        ),
        include_self=True,
    )


@socketio.on("plot")
def plot() -> dict[str, int]:
    result = {}

    for name in get_all_player_names():
        # TODO
        result[name] = random.randrange(1000, 6000)

    return result
