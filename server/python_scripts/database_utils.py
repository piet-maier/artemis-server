"""Util functions for interacting with a sqlite database"""

import sqlite3
from typing import Any

from app.database import get_database


def get_database_cursor(database_connection: sqlite3.Connection) -> sqlite3.Cursor:
    """returns a cursor for the given database connection"""
    return database_connection.cursor()


def database_query_commit(sql: str, payload: tuple[Any, ...] = ()):
    """execute sql without return value"""
    database_connection = get_database()
    cursor = get_database_cursor(database_connection)
    cursor.execute(sql, payload)
    database_connection.commit()

    return cursor.lastrowid
