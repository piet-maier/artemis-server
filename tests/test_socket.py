import pytest

from app.socket import (
    navigation,
    create_grid,
    handle_request_last_game_of_type,
    handle_submit,
)
from app.socket import plot
from python_scripts.database_read import get_all_player_names


def test_navigation(app):
    with app.app_context():
        dictionary = navigation()

        assert len(dictionary) == 3

        assert dictionary["Type 1"] == [0]

        assert dictionary["Type 2"] == [63072000, 31536000]

        assert dictionary["Type 3"] == [126230400, 94694400]


def test_create_grid(app):
    with app.app_context():
        create_grid("Type 4")

        create_grid("Type 4")

        dictionary = navigation()

        assert len(dictionary) == 4

        assert len(dictionary["Type 4"]) == 2


def test_handle_request_last_game_of_type(app):
    with app.app_context():
        payload = handle_request_last_game_of_type("Type 1", 0)

        assert "head" in payload

        assert payload["head"] == ["User 1", "User 2", "User 3", "User 4", "User 5"]

        assert "body" in payload

        assert len(payload["body"]) == 3

        assert payload["body"][1] == {"User 1": 1}

        assert payload["body"][2]["User 2"] == 2

        assert "User 3" not in payload["body"][2]

        assert "foot" in payload

        assert payload["foot"]["User 1"] == -4

        assert payload["foot"]["User 3"] is None


test_cases_handle_submit = [
    ("Type 1", 0, "User 1", 1, "2", 2),
    ("Type 1", 0, "User 1", 2, "3", 3),
    ("Type 1", 0, "User 1", 3, "4", 4),
]


@pytest.mark.parametrize(
    "game_type_name, game_timestamp, user_name, round_number, score, expected_result",
    test_cases_handle_submit,
)
def test_handle_submit(
    app, game_type_name, game_timestamp, user_name, round_number, score, expected_result
):
    with app.app_context():
        handle_submit(
            game_type_name,
            game_timestamp,
            {"name": user_name, "number": round_number, "cell": score},
        )

        dictionary = handle_request_last_game_of_type(game_type_name, game_timestamp)

        assert dictionary["body"][round_number][user_name] == expected_result


def test_handle_submit_empty(app):
    with app.app_context():
        handle_submit("Type 1", 0, {"name": "User 1", "number": 1, "cell": ""})

        body = handle_request_last_game_of_type("Type 1", 0)["body"]

        assert len(body) == 3

        assert "User 1" not in body[1]


def test_plot(app):
    with app.app_context():
        dictionary = plot()

        assert len(dictionary) == 5

        for player in get_all_player_names():
            assert player in dictionary

        # TODO
