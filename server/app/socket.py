from collections import defaultdict
from datetime import datetime
from typing import Literal, TypedDict

from flask_socketio import SocketIO, emit
from python_scripts.database_delete import delete_score
from python_scripts.database_read import (
    get_all_game_types,
    get_all_games,
    get_score_sum,
)
from python_scripts.database_utils import database_query_commit
from python_scripts.database_write import add_new_game, add_new_game_type, add_new_score
from python_scripts.grid_utils import Grid, build_grid_payload

from app.database import get_database, query_db

# FIXME: Remove CORS In Production
socketio = SocketIO(cors_allowed_origins="*")


class Change(TypedDict):
    name: str
    number: int
    cell: str


class Player(TypedDict):
    id: int
    name: str


@socketio.on("navigation")
def navigation() -> dict[str, list[int]]:
    return get_all_games()


@socketio.on("grid:create")
def create_grid(grid_type: str) -> int:
    current_timestamp = int(datetime.now().timestamp() * 1000)

    if grid_type not in get_all_game_types():
        add_new_game_type(grid_type)

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

    return {
        k: v
        for k, v in sorted(result.items(), key=lambda item: (-item[1], item[0]))[:10]
    }


@socketio.on("player:read")
def player_list():
    result = query_db("SELECT id, name FROM user")

    return [{"id": item["id"], "name": item["name"]} for item in result]


@socketio.on("player:create")
def player_create(name: str):
    connection = get_database()

    cursor = connection.cursor()

    cursor.execute("INSERT INTO user (name) VALUES (?)", (name,))

    connection.commit()

    emit("player:create", {"id": cursor.lastrowid, "name": name}, broadcast=True)


@socketio.on("player:update")
def player_update(player: Player):
    database_query_commit(
        "UPDATE user SET name = ? WHERE id = ?", (player["name"], player["id"])
    )

    emit("player:update", player, broadcast=True)


@socketio.on("player:delete")
def player_delete(id: int):
    pass
