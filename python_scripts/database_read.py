from python_scripts.database_connect import get_database_cursor, close_database_connection, get_database_connection
from python_scripts.data_structure_utils import flatten_tuples, convert_list_to_dict


def get_all_game_types() -> [str]:
    sql = '''
    SELECT name
    FROM game_types
    '''
    game_types = database_query(sql)
    return flatten_tuples(game_types)


def get_all_games() -> [str]:
    sql = '''
    SELECT fk_game_type, start_time
    FROM game
    '''
    games = database_query(sql)
    return convert_list_to_dict(games)


def get_all_rounds_of_game(game_type: str) -> [(int, str, int)]:
    pass


def get_all_player_names_of_game(game_type: str, game_identifier: str) -> [str]:
    sql = '''
    SELECT DISTINCT fk_user_name
    FROM score
    WHERE fk_game_type = ? AND fk_game_identifier = ?
    '''
    payload = (game_type, game_identifier)
    game_types = database_query(sql, payload)
    return flatten_tuples(game_types)


def get_all_player_names() -> [str]:
    pass


def database_query(sql: str, payload: (any,) = ()) -> list:
    database_connection = get_database_connection()
    cursor = get_database_cursor(database_connection)
    cursor.execute(sql, payload)
    query_result = cursor.fetchall()
    close_database_connection(database_connection)
    return query_result
