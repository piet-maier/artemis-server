"""Util functions to read from a connected sqlite database"""

from app.database import query_db
from python_scripts.data_structure_utils import convert_list_to_dict, flatten_tuples

SCORE_SUM_ROW_KEY = "SUM(score)"
COUNT_ROWS_KEY = "SUM(*)"


def get_all_game_types() -> list[str]:
    """retrieve a list of all game types from database"""
    sql = """
    SELECT name
    FROM game_type
    """
    game_types = query_db(sql)
    return flatten_tuples(game_types)


def get_all_games() -> dict[str, list[int]]:
    """retrieve a list of all games from database"""
    sql = """
    SELECT game_type.name, creation_timestamp
    FROM game
        JOIN game_type ON game_type.id = game.fk_game_type
    ORDER BY creation_timestamp DESC
    """
    games = query_db(sql)
    return convert_list_to_dict(games)


def get_all_rounds_of_game(game_identifier: int) -> list[str]:
    """retrieve a list of all rounds of game from database"""
    sql = """
    SELECT number
    FROM round
        JOIN game ON game.id = round.fk_game
    WHERE game.creation_timestamp = ?
    """
    payload = (game_identifier,)
    games = query_db(sql, payload)
    return flatten_tuples(games)


def get_all_player_names_of_game(game_identifier: int) -> list[str]:
    """retrieve a list of all player names participating in a game from database"""
    sql = """
    SELECT DISTINCT user.name
    FROM score
        JOIN user ON user.id = score.fk_user 
        JOIN game ON game.id = score.fk_game
    WHERE game.creation_timestamp = ?
    """
    payload = (game_identifier,)
    player_names = query_db(sql, payload)
    return flatten_tuples(player_names)


def get_all_player_names() -> list[str]:
    """retrieve a list of all player names from database"""
    sql = """
    SELECT name
    FROM user
    """
    game_types = query_db(sql)
    return flatten_tuples(game_types)


def get_all_scores_of_game(game_name: int) -> list[tuple[int, int, int]]:
    """retrieve a list of all scores of a game from database"""
    # For some ungodly reason, `score.fk_user` is of type TEXT in the current database.
    sql = """
    SELECT score.fk_round, CAST(score.fk_user AS INTEGER), score
    FROM score
        JOIN game ON game.id = score.fk_game
    WHERE game.creation_timestamp = ?
    """
    payload = (game_name,)
    return query_db(sql, payload)


def score_exists(game_identifier: int, player_name: str, round_number: int) -> bool:
    """return true if score exists in database"""
    sql = """
    SELECT EXISTS (
        SELECT 1
        FROM score
            JOIN user ON user.id = score.fk_user
            JOIN game ON game.id = score.fk_game
        WHERE game.creation_timestamp = ?
            AND score.fk_round = ?
            AND user.name = ?
    )
    """
    payload = (game_identifier, round_number, player_name)
    return query_db(sql, payload, True)[0]


def get_score_sum(game_identifier: int, user: int) -> int:
    """retrieve sum of all scores in given game by given player from database"""
    sql = """
    SELECT SUM(score)
    FROM score
        JOIN game ON game.id = score.fk_game
    WHERE game.creation_timestamp = ? 
        AND score.fk_user = ?
    """
    payload = (game_identifier, user)
    return query_db(sql, payload, True)[SCORE_SUM_ROW_KEY]


def get_table_information(table_name: str) -> list[str]:
    """retrieve database table information"""
    sql = f"""
    PRAGMA table_info({table_name})
    """
    return query_db(sql)


def get_highest_score(game_type: str) -> list[str | int]:
    """retrieve the highest score archived in a given game type from database"""
    sql = """
    SELECT user.name, score
    FROM score
        JOIN user ON user.id = score.fk_user
        JOIN game ON game.id = score.fk_game
        JOIN game_type ON game_type.id = game.fk_game_type
    WHERE game_type.name = ?
    ORDER BY score DESC
    LIMIT 1
    """
    payload = (game_type,)
    return query_db(sql, payload, True)


def get_lowest_score(game_type: str) -> list[str | int]:
    """retrieve the lowest score archived in a given game type from database"""
    sql = """
    SELECT user.name, score
    FROM score
        JOIN user ON user.id = score.fk_user
        JOIN game ON game.id = score.fk_game
        JOIN game_type ON game_type.id = game.fk_game_type
    WHERE game_type.name = ?
    ORDER BY score
    LIMIT 1
    """
    payload = (game_type,)
    return query_db(sql, payload, True)


def get_total_score(game_type: str) -> int:
    """retrieve the sum of all scores in a game type from database"""
    sql = """
    SELECT SUM(score)
    FROM score
        JOIN game ON game.id = score.fk_game
        JOIN game_type ON game_type.id = game.fk_game_type
    WHERE game_type.name = ?
    """
    payload = (game_type,)
    return query_db(sql, payload, True)[SCORE_SUM_ROW_KEY]


def get_total_rounds(game_type: str) -> int:
    """retrieve the total amount of rounds played in a game type from database"""
    sql = """
    SELECT COUNT(*)
    FROM round
        JOIN game ON game.id = round.fk_game
        JOIN game_type ON game_type.id = game.fk_game_type
    WHERE game_type.name = ?
    """
    payload = (game_type,)
    return query_db(sql, payload, True)[COUNT_ROWS_KEY]


def get_total_score_per_game_and_user(game_type: str, user_name: str) -> int:
    """retrieve the sum of all scores in a game type by a given user from database"""
    sql = """
    SELECT SUM(score)
    FROM score
        JOIN user ON user.id = score.fk_user
        JOIN game ON game.id = score.fk_game
        JOIN game_type ON game_type.id = game.fk_game_type
    WHERE game_type.name = ?
        AND user.name = ?
    """
    payload = (game_type, user_name)
    return query_db(sql, payload, True)[SCORE_SUM_ROW_KEY]


def get_total_rounds_per_game_and_user(game_type: str, user_name: str) -> int:
    """retrieve the total amount of rounds played in a game type by a given user from database"""
    sql = """
    SELECT COUNT(*)
    FROM score
        JOIN user ON user.id = score.fk_user
        JOIN game ON game.id = score.fk_game
        JOIN game_type ON game_type.id = game.fk_game_type
    WHERE game_type.name = ?
        AND user.name = ?
    """
    payload = (game_type, user_name)
    return query_db(sql, payload, True)[COUNT_ROWS_KEY]
