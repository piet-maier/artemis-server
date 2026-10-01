"""Util functions to delete in a connected sqlite database"""

from app.database import query_db
from python_scripts.database_utils import database_query_commit


def delete_score(game_identifier: int, player: int, round_number: int) -> None:
    """delete score from database"""
    game = query_db(
        "SELECT id FROM game WHERE creation_timestamp = ?", (game_identifier,), True
    )

    if game is None:
        raise ValueError(f'The game "{game_identifier}" does not exist.')

    database_query_commit(
        "DELETE FROM score WHERE fk_user = ? AND fk_game = ? AND fk_round = ?",
        (player, game["id"], round_number),
    )
