from python_scripts.database_delete import delete_score


def test_delete_score(app):
    with app.app_context():
        delete_score(0, "User 1", 1)
        assert False
