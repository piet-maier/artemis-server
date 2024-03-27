"""Util functions to delete in a connected sqlite database"""

from python_scripts.database_utils import database_query_commit


def delete_score(game_identifier: int, player_name: str, round_number: int):
    """delete score from database"""
    sql = """
    DELETE FROM score
    WHERE EXISTS (
        SELECT 1
        FROM score
            JOIN game ON game.id = score.fk_game
            JOIN round ON round.id = score.fk_round
            JOIN user ON user.id = score.fk_user
        WHERE game.id = ?
            AND round.id = ?
            AND user.id = ?
    )
    """
    payload = (game_identifier, round_number, player_name)
    database_query_commit(sql, payload)
