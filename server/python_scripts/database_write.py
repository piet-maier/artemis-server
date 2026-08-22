"""Util functions to write to a connected sqlite database"""

from python_scripts.database_utils import database_query_commit


def add_new_game_type(game_type: str):
    """add new game type to database"""
    sql = """
    INSERT INTO game_type (name)
    VALUES (?)
    """
    payload = (game_type,)
    database_query_commit(sql, payload)


def add_new_game(game_type: str, game_identifier: int):
    """add new game to database"""
    sql = """
    INSERT INTO game (fk_game_type, creation_timestamp)
    SELECT id, ?
    FROM game_type
    WHERE name = ?
    """
    payload = (game_identifier, game_type)
    database_query_commit(sql, payload)


def add_player(player_name: str):
    """add new player to database"""
    sql = """
    INSERT INTO user (name) 
    VALUES (?)
    """
    payload = (player_name,)
    database_query_commit(sql, payload)


def add_new_round(game_identifier: int, first_user_name: str):
    """add new round to database"""
    sql = """
    INSERT INTO round (fk_game, number, fk_first_user)
    SELECT COALESCE(MAX(round.number), 0) + 1, game.id, ?
    FROM round
        JOIN game ON game.id = round.fk_game
    WHERE game.creation_timestamp = ?
    """
    payload = (game_identifier, first_user_name)
    database_query_commit(sql, payload)


def add_new_score(game_identifier: int, player: int, round_number: int, score: int):
    """add new score to database"""
    sql = "INSERT INTO score (fk_game, fk_round, score, fk_user) VALUES ((SELECT id FROM game WHERE game.creation_timestamp = ?), ?, ?, ?) ON CONFLICT (fk_game, fk_round, fk_user) DO UPDATE SET score = ?"
    payload = (game_identifier, round_number, score, player, score)
    database_query_commit(sql, payload)
