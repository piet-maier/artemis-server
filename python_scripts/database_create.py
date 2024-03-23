"""Util functions to create tables and fields in a connected sqlite database"""
from python_scripts.database_read import get_table_information
from python_scripts.database_utils import database_query_commit


def create_table(table_name: str) -> None:
    """create table in database"""
    sql = f"""
    CREATE TABLE IF NOT EXISTS {table_name}(id INTEGER PRIMARY KEY)
    """
    payload = (table_name,)
    database_query_commit(sql, payload)


def add_field(
    table_name: str,
    column_name: str,
    data_type: str,
    is_primary_key: bool = False,
    foreign_key_reference: str | None = None,
) -> None:
    """create field in table in database"""
    columns = get_table_information(table_name)

    column_exists = any(column[1] == column_name for column in columns)

    if not column_exists:
        sql = f"""
        ALTER TABLE {table_name}
        ADD COLUMN {column_name} {data_type}
        """

        if is_primary_key:
            sql += " PRIMARY KEY"

        if foreign_key_reference:
            sql += f" REFERENCES {foreign_key_reference}"

        sql += ";"

        database_query_commit(sql)


def create_tables() -> None:
    """create tables in database"""
    create_game_type_table()
    create_game_table()
    create_user_table()
    create_round_table()
    create_score_table()


def create_game_type_table() -> None:
    """create game type table in database"""
    create_table("game_type")
    add_field("game_type", "name", "TEXT")


def create_game_table() -> None:
    """create game table in database"""
    create_table("game")
    add_field("game", "fk_game_type", "TEXT", foreign_key_reference="game_type")
    add_field("game", "creation_timestamp", "INTEGER")


def create_user_table() -> None:
    """create user table in database"""
    create_table("user")
    add_field("user", "name", "TEXT")


def create_round_table() -> None:
    """create round table in database"""
    create_table("round")
    add_field("round", "fk_game", "INTEGER", foreign_key_reference="game")
    add_field("round", "number", "INTEGER")
    add_field("round", "fk_first_user", "TEXT", foreign_key_reference="user")


def create_score_table() -> None:
    """create score table in database"""
    create_table("score")
    add_field("score", "fk_game", "INTEGER", foreign_key_reference="game")
    add_field("score", "fk_round", "INTEGER", foreign_key_reference="round")
    add_field("score", "score", "INTEGER")
    add_field("score", "fk_user", "TEXT", foreign_key_reference="user")
