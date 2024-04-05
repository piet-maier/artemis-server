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

        dictionary = navigation()

        assert len(dictionary) == 4

        assert len(dictionary["Type 4"]) == 2
