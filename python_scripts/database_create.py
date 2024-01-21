from app.database import get_database
from python_scripts.database_connect import get_database_cursor
from python_scripts.database_read import get_table_information


def execute_sql(sql_statement):
    connection = get_database()
    cursor = get_database_cursor(connection)
    cursor.execute(sql_statement)
    connection.commit()


def create_table(table_name):
    execute_sql(f"""
    CREATE TABLE IF NOT EXISTS {table_name}(
    id INTEGER PRIMARY KEY);
    """)


def add_field(table_name, column_name, data_type, is_primary_key=False, foreign_key_reference=None):
    columns = get_table_information(table_name)

    column_exists = any(column[1] == column_name for column in columns)

    if not column_exists:
        sql_statement = f"""
        ALTER TABLE {table_name}
        ADD COLUMN {column_name} {data_type}
        """

        if is_primary_key:
            sql_statement += ' PRIMARY KEY'

        if foreign_key_reference:
            sql_statement += f' REFERENCES {foreign_key_reference}'

        sql_statement += ';'

        execute_sql(sql_statement)


def create_tables():
    create_game_type_table()
    create_game_table()
    create_user_table()
    create_round_table()
    create_score_table()


def create_game_type_table():
    create_table("game_type")
    add_field("game_type", "name", "TEXT")


def create_game_table():
    create_table("game")
    add_field("game", "fk_game_type", "TEXT", foreign_key_reference="game_type")
    add_field("game", "creation_timestamp", "INTEGER")


def create_user_table():
    create_table("user")
    add_field("user", "name", "TEXT")


def create_round_table():
    create_table("round")
    add_field("round", "fk_game_type", "TEXT", foreign_key_reference="game_type")
    add_field("round", "fk_game", "INTEGER", foreign_key_reference="game")
    add_field("round", "number", "INTEGER")
    add_field("round", "fk_first_user", "TEXT", foreign_key_reference="user")


def create_score_table():
    create_table("score")
    add_field("score", "fk_game", "INTEGER", foreign_key_reference="game")
    add_field("score", "fk_round", "INTEGER", foreign_key_reference="round")
    add_field("score", "score", "INTEGER")
    add_field("score", "fk_user", "TEXT", foreign_key_reference="user")
