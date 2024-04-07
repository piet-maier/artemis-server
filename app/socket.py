from datetime import datetime
from typing import TypedDict

from flask_socketio import SocketIO

from app.database import query_db
from python_scripts.database_delete import delete_score
from python_scripts.database_read import (
    get_all_games,
    get_score_sum,
    get_all_player_names,
    get_all_game_types,
)
from python_scripts.database_write import add_new_score, add_new_game
from python_scripts.grid_utils import build_grid_payload, Grid

# FIXME: Remove CORS In Production
socketio = SocketIO(cors_allowed_origins="*")


class Change(TypedDict):
    name: str
    number: int
    cell: str


@socketio.on("navigation")
def navigation() -> dict[str, list[int]]:
    return get_all_games()


@socketio.on("grid:create")
def create_grid(grid_type: str) -> int:
    current_timestamp = int(datetime.now().timestamp() * 1000)

    add_new_game(grid_type, current_timestamp)

    return current_timestamp


# noinspection PyUnusedLocal
@socketio.on("grid:read")
def handle_request_last_game_of_type(game_type: str, game_name: int) -> Grid:
    payload = build_grid_payload(game_name)
    return payload


@socketio.on("grid:update")
def handle_submit(game_type: str, game_timestamp: int, change: Change) -> None:
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
        result[name] = 0

    # TODO: MIN/MAX Depending On Game Type
    query = (
        "SELECT user.name, COUNT(*) AS count "
        "FROM score "
        "JOIN user ON score.fk_user = user.id "
        "JOIN game ON score.fk_game = game.id "
        "JOIN game_type ON game.fk_game_type = game_type.id "
        "JOIN (SELECT fk_game, fk_round, MIN(score) AS min FROM score GROUP BY fk_game, fk_round) AS min "
        "ON score.fk_game = min.fk_game AND score.fk_round = min.fk_round AND score.score = min.min "
        "WHERE game_type.name = ? "
        "GROUP BY user.id "
        "ORDER BY count DESC"
    )

    for game_type in get_all_game_types():
        for name, number in query_db(query, (game_type,)):
            result[name] += number

    return result
