from app.database import get_database
from python_scripts.database_connect import get_database_cursor


def delete_score(game_name: int, player_name: str, round_number: int):
    sql = """
    DELETE FROM score
    WHERE fk_game = ? AND fk_round = ? AND fk_user = ?
    """
    payload = (game_name, round_number, player_name)
    database_query(sql, payload)


def database_query(sql: str, payload: (any,) = ()):
    database_connection = get_database()
    cursor = get_database_cursor(database_connection)
    cursor.execute(sql, payload)
    database_connection.commit()
