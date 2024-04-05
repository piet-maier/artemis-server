from app.database import query_db
from app.socket import navigation, create_grid


def test_navigation(app):
    with app.app_context():
        dictionary = navigation()

        assert len(dictionary) == 3

        assert dictionary["Type 1"] == [0]

        assert dictionary["Type 2"] == [31536000, 63072000]

        assert dictionary["Type 3"] == [94694400, 126230400]


def test_grid_create(app):
    with app.app_context():
        create_grid("Type 4")

        create_grid("Type 4")

        result = query_db("SELECT fk_game_type, creation_timestamp FROM game")

        assert len(result) == 7

        assert result[5]["fk_game_type"] == 4 and result[6]["fk_game_type"] == 4
