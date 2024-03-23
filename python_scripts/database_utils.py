"""Util functions for interacting with a sqlite database"""
import sqlite3
from typing import Any

from app.database import get_database


def get_database_cursor(database_connection: sqlite3.Connection) -> sqlite3.Cursor:
    """returns a cursor for the given database connection"""
    return database_connection.cursor()


def database_query_commit(sql: str, payload: tuple[Any, ...] = ()) -> None:
    """execute sql without return value"""
    database_connection = get_database()
    cursor = get_database_cursor(database_connection)
    cursor.execute(sql, payload)
    database_connection.commit()


def database_query_retrieve_one(sql: str, payload: tuple[Any, ...] = ()) -> Any:
    """execute sql with return value"""
    database_connection = get_database()
    cursor = get_database_cursor(database_connection)
    cursor.execute(sql, payload)
    query_result = cursor.fetchone()
    return query_result


def database_query_retrieve_many(sql: str, payload: tuple[Any, ...] = ()) -> list:
    """execute sql with return value"""
    database_connection = get_database()
    cursor = get_database_cursor(database_connection)
    cursor.execute(sql, payload)
    query_result = cursor.fetchall()
    return query_result
