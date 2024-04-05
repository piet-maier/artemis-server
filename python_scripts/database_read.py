"""Util functions to read from a connected sqlite database"""
from python_scripts.data_structure_utils import flatten_tuples, convert_list_to_dict
from python_scripts.database_utils import database_query_retrieve_one, database_query_retrieve_many

SCORE_SUM_ROW_KEY = "SUM(score)"
COUNT_ROWS_KEY = "SUM(*)"


def get_all_game_types() -> list[str]:
    """retrieve a list of all game types from database"""
    sql = """
    SELECT name
    FROM game_type
    """
    game_types = database_query_retrieve_many(sql)
    return flatten_tuples(game_types)


def get_all_games() -> dict[str, list[int]]:
    """retrieve a list of all games from database"""
    sql = """
    SELECT game_type.name, creation_timestamp
    FROM game
        JOIN game_type ON game_type.id = game.fk_game_type
    """
    games = database_query_retrieve_many(sql)
    return convert_list_to_dict(games)


def get_all_rounds_of_game(game_identifier: int) -> list[tuple[int, str]]:
    """retrieve a list of all rounds of game from database"""
    sql = """
    SELECT number, user.name
    FROM round
        JOIN user ON user.id = round.fk_first_user
        JOIN game ON game.id = round.fk_game
    WHERE game.creation_timestamp = ?
    """
    payload = (game_identifier,)
    games = database_query_retrieve_many(sql, payload)
    return games


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
    player_names = database_query_retrieve_many(sql, payload)
    return flatten_tuples(player_names)


def get_all_player_names() -> list[str]:
    """retrieve a list of all player names from database"""
    sql = """
    SELECT name
    FROM user
    """
    game_types = database_query_retrieve_many(sql)
    return flatten_tuples(game_types)


def get_all_scores_of_game(game_name: int) -> list[tuple[int, str, int]]:
    """retrieve a list of all scores of a game from database"""
    sql = """
    SELECT score.fk_round, user.name, score
    FROM score
        JOIN user ON user.id = score.fk_user
        JOIN game ON game.id = score.fk_game
    WHERE game.creation_timestamp = ?
    """
    payload = (game_name,)
    return database_query_retrieve_many(sql, payload)


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
    return database_query_retrieve_one(sql, payload)[0]


def get_score_sum(game_identifier: int, user_name: str) -> int:
    """retrieve sum of all scores in given game by given player from database"""
    sql = """
    SELECT SUM(score)
    FROM score
        JOIN user ON user.id = score.fk_user
        JOIN game ON game.id = score.fk_game
    WHERE game.creation_timestamp = ? 
        AND user.name = ?
    """
    payload = (game_identifier, user_name)
    return database_query_retrieve_one(sql, payload)[SCORE_SUM_ROW_KEY]


def get_table_information(table_name: str) -> list[str]:
    """retrieve database table information"""
    sql = f"""
    PRAGMA table_info({table_name})
    """
    return database_query_retrieve_many(sql)


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
    return database_query_retrieve_one(sql, payload)


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
    return database_query_retrieve_one(sql, payload)


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
    return database_query_retrieve_one(sql, payload)[SCORE_SUM_ROW_KEY]


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
    return database_query_retrieve_one(sql, payload)[COUNT_ROWS_KEY]


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
    return database_query_retrieve_one(sql, payload)[SCORE_SUM_ROW_KEY]


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
    return database_query_retrieve_one(sql, payload)[COUNT_ROWS_KEY]
