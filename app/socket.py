from collections import defaultdict
from datetime import datetime
from typing import Literal, TypedDict

from flask_socketio import SocketIO

from app.database import query_db
from python_scripts.database_delete import delete_score
from python_scripts.database_read import (
    get_all_games,
    get_score_sum,
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

    socketio.emit("grid:create", (grid_type, current_timestamp), include_self=False)

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
    result = defaultdict(int)

    def query(func: Literal["MIN", "MAX"]) -> str:
        return (
            "SELECT user.name, COUNT(*) AS count "
            "FROM score "
            "JOIN user ON score.fk_user = user.id "
            "JOIN game ON score.fk_game = game.id "
            "JOIN game_type ON game.fk_game_type = game_type.id "
            f"JOIN (SELECT fk_game, fk_round, {func} (score) AS val FROM score GROUP BY fk_game, fk_round) AS val "
            "ON score.fk_game = val.fk_game AND score.fk_round = val.fk_round AND score.score = val.val "
            "WHERE game_type.name = ? "
            "GROUP BY user.id "
            "ORDER BY count DESC"
        )

    for game_type, function in query_db("SELECT name, function FROM game_type"):
        if function:
            for name, number in query_db(query(function), (game_type,)):
                result[name] += number

    return {k: v for k, v in sorted(result.items(), key=lambda item: item[1], reverse=True)}
