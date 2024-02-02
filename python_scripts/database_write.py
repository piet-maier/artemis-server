from app.database import get_database
from python_scripts.database_connect import get_database_cursor
from python_scripts.database_read import score_exists


def add_new_game_type(game_type: str):
    pass


def add_new_game(grid_type: str, grid_name: int) -> None:
    sql = "INSERT INTO game (fk_game_type, creation_timestamp) VALUES (?, ?)"

    database_query(sql, (grid_type, grid_name))


def add_player(player_name: str):
    pass


def add_new_round(game_type: str, game_name: str):
    pass


def add_new_score(game_name: str, player_name: str, round_number: int, score: int):
    if score_exists(game_name, player_name, round_number):
        sql = """
            UPDATE score
            SET score = ?
            WHERE fk_game = ? AND fk_round = ? AND fk_user = ?;
            """
        payload = (score, game_name, round_number, player_name)
    else:
        sql = """
            INSERT INTO score (fk_game, fk_round, score, fk_user)
            VALUES (?, ?, ?, ?)
            """
        payload = (game_name, round_number, score, player_name)
    database_query(sql, payload)


def database_query(sql: str, payload: (any,) = ()):
    database_connection = get_database()
    cursor = get_database_cursor(database_connection)
    cursor.execute(sql, payload)
    database_connection.commit()
