from python_scripts.database_connect import get_database_cursor, close_database_connection, get_database_connection
from python_scripts.data_structure_utils import flatten_tuples


def get_all_game_types() -> [str]:
    sql = '''
    SELECT name
    FROM game_types
    '''
    game_types = database_query(sql)
    return flatten_tuples(game_types)


def get_all_games_of_type(game_type: str) -> [str]:
    sql = '''
    SELECT start_time
    FROM game
    WHERE fk_game_types = ?
    '''
    payload = (game_type,)
    games_of_type = database_query(sql, payload)
    return flatten_tuples(games_of_type)


def get_all_rounds_of_game(game_type: str) -> [(int, str, int)]:
    pass


def get_all_players_of_game(game_name: str) -> [str]:
    pass


def get_all_players() -> [str]:
    pass


def database_query(sql: str, payload: (any,) = ()) -> list:
    database_connection = get_database_connection()
    cursor = get_database_cursor(database_connection)
    cursor.execute(sql, payload)
    query_result = cursor.fetchall()
    close_database_connection(database_connection)
    return query_result
