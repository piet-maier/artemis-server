import sqlite3
from typing import cast

import click
from flask import current_app, g, Flask


def get_db() -> sqlite3.Connection:
    """
    This function returns a database connection.
    The connection is stored and reused if the function is called several times in the same request.
    """
    if "db" not in g:
        g.db = sqlite3.connect(
            current_app.config["DATABASE"], detect_types=sqlite3.PARSE_DECLTYPES
        )

        g.db.row_factory = sqlite3.Row

    return cast(sqlite3.Connection, g.db)


def init_db() -> None:
    # noinspection PyUnusedLocal
    db = get_db()

    # TODO: https://flask.palletsprojects.com/en/3.0.x/tutorial/database/


@click.command("init-db")
def init_db_command() -> None:
    init_db()

    click.echo("The database has been initialized.")


# noinspection PyUnusedLocal
def close_db(e: Exception | None = None) -> None:
    """
    This function closes the database connection, if one exists.
    It should be called when cleaning up after each request.
    """
    db: sqlite3.Connection | None = g.pop("db", None)

    if db is not None:
        db.close()


def init_app(app: Flask) -> None:
    app.teardown_appcontext(close_db)  # type: ignore

    app.cli.add_command(init_db_command)
