"""Util functions to delete in a connected sqlite database"""

from python_scripts.database_utils import database_query_commit


def delete_score(game_identifier: int, player: int, round_number: int) -> None:
    """delete score from database"""
    database_query_commit(
        "DELETE FROM score WHERE fk_user = ? AND fk_game = ? AND fk_round = ?",
        (player, game_identifier, round_number),
    )
