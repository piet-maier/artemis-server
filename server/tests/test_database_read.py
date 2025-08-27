from python_scripts.database_read import *


def test_get_all_game_types(app):
    with app.app_context():
        game_types = get_all_game_types()
        assert game_types == ["Type 1", "Type 2", "Type 3", "Type 4"]


def test_get_all_games(app):
    with app.app_context():
        games = get_all_games()
        assert games == {
            "Type 1": [0],
            "Type 2": [63072000, 31536000],
            "Type 3": [126230400, 94694400],
        }


def test_get_all_rounds_of_game(app):
    with app.app_context():
        rounds = get_all_rounds_of_game(0)
        assert rounds == [0, 1, 2]


def test_get_all_player_names_of_game(app):
    with app.app_context():
        player_names = get_all_player_names_of_game(0)
        assert player_names == ["User 1", "User 2"]


def test_get_all_player_names(app):
    with app.app_context():
        player_names = get_all_player_names()
        assert player_names == ["User 1", "User 2", "User 3", "User 4", "User 5"]


def test_get_all_scores_of_game(app):
    with app.app_context():
        scores = get_all_scores_of_game(0)

        assert len(scores) == 3

        assert scores[0][0] == 1 and scores[0][1] == "User 1" and scores[0][2] == 1

        assert scores[1][0] == 2 and scores[1][1] == "User 2" and scores[1][2] == 2


def test_score_exists(app):
    with app.app_context():
        score_present = score_exists(0, "User 1", 1)
        assert score_present
