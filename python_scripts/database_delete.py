"""Util functions to delete in a connected sqlite database"""

from app.database import query_db
from python_scripts.database_utils import database_query_commit


def delete_score(game_identifier: int, player_name: str, round_number: int) -> None:
    """delete score from database"""
    player = query_db("SELECT id FROM user WHERE name = ?", (player_name,), True)

    if player is None:
        raise ValueError(f'The player "{player_name}" does not exist.')

    game = query_db(
        "SELECT id FROM game WHERE creation_timestamp = ?", (game_identifier,), True
    )

    if game is None:
        raise ValueError(f'The game "{game_identifier}" does not exist.')

    database_query_commit(
        "DELETE FROM score WHERE fk_user = ? AND fk_game = ? AND fk_round = ?",
        (player["id"], game["id"], round_number),
    )
