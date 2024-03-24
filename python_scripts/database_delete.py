"""Util functions to delete in a connected sqlite database"""

from app.database import query_db


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
    query_db(sql, payload)
