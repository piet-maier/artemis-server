from app.database import get_database
from python_scripts.database_connect import get_database_cursor
from python_scripts.data_structure_utils import flatten_tuples, convert_list_to_dict


def get_all_game_types() -> [str]:
    sql = '''
    SELECT name
    FROM game_type
    '''
    game_types = database_query(sql)
    return flatten_tuples(game_types)


def get_all_games() -> [str]:
    sql = '''
    SELECT fk_game_type, creation_timestamp
    FROM game
    '''
    games = database_query(sql)
    return convert_list_to_dict(games)


def get_all_rounds_of_game(game_type: str) -> [(int, str, int)]:
    pass


def get_all_player_names_of_game(game_identifier: int) -> [str]:
    sql = '''
    SELECT DISTINCT fk_user
    FROM score
    WHERE fk_game = ?
    '''
    payload = (game_identifier,)
    game_types = database_query(sql, payload)
    return flatten_tuples(game_types)


def get_all_player_names() -> [str]:
    sql = '''
    SELECT name
    FROM user
    '''
    game_types = database_query(sql)
    return flatten_tuples(game_types)


def get_all_scores_of_game(game_name):
    sql = """
        SELECT fk_round, fk_user, score 
        FROM score 
        WHERE fk_game = ?
        """
    payload = (game_name,)
    return database_query(sql, payload)


def score_exists(game_name: str, player_name: str, round_number: int):
    sql = """
        SELECT *
        FROM score
        WHERE fk_game = ? AND fk_round = ? AND fk_user = ?
    """
    payload = (game_name, round_number, player_name)
    return len(database_query(sql, payload)) > 0


def get_score_sum(game_name: int, user_name: str):
    sql = """
    SELECT SUM(score)
    FROM score
    WHERE fk_game = ? AND fk_user = ?
    """
    payload = (game_name, user_name)
    return database_query(sql, payload)[0]["SUM(score)"]


def get_table_information(table_name):
    sql = f"PRAGMA table_info({table_name})"
    return database_query(sql)


def database_query(sql: str, payload: (any,) = ()) -> list:
    database_connection = get_database()
    cursor = get_database_cursor(database_connection)
    cursor.execute(sql, payload)
    query_result = cursor.fetchall()
    return query_result
