from pytest import raises

from app.database import query_db
from python_scripts.database_delete import delete_score


def test_delete_score(app):
    with app.app_context():
        with raises(ValueError):
            delete_score(0, "", 1)

        with raises(ValueError):
            delete_score(-86400, "User 1", 1)

        delete_score(0, "User 1", 1)

        result = query_db(
            "SELECT * FROM score WHERE fk_user = 1 AND fk_game = 1 AND fk_round = 1"
        )

        assert len(result) == 0
