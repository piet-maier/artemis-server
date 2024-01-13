import sqlite3


DATABASE_PATH = 'round_history.db'


def get_database_connection():
    database_connection = sqlite3.connect(DATABASE_PATH)
    return database_connection


def get_database_cursor(database_connection):
    return database_connection.cursor()


def close_database_connection(database_connection):
    database_connection.close()
