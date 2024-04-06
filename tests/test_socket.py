from app.socket import navigation, create_grid, handle_request_last_game_of_type


def test_navigation(app):
    with app.app_context():
        dictionary = navigation()

        assert len(dictionary) == 3

        assert dictionary["Type 1"] == [0]

        assert dictionary["Type 2"] == [63072000, 31536000]

        assert dictionary["Type 3"] == [126230400, 94694400]


def test_grid_create(app):
    with app.app_context():
        create_grid("Type 4")

        create_grid("Type 4")

        dictionary = navigation()

        assert len(dictionary) == 4

        assert len(dictionary["Type 4"]) == 2


def test_grid_read(app):
    with app.app_context():
        dictionary = handle_request_last_game_of_type("Type 1", 0)

        assert len(dictionary) == 2

        assert dictionary[0]["User 1"] == 1

        assert dictionary[1]["User 2"] == 2
