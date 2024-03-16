"""Util functions for grid data structure"""
from python_scripts.database_read import get_all_scores_of_game, get_score_sum, \
    get_all_player_names


def build_grid_payload(game_identifier: int):
    """build grid payload for given game"""
    scores = get_all_scores_of_game(game_identifier)
    users = get_all_player_names()

    payload = {
        "head": users,
        "body": [],
        "foot": {},
    }

    for round_number, user_name, score in scores:
        if user_name not in users:
            continue
        while len(payload["body"]) <= round_number:
            payload["body"].append({})

        payload["body"][round_number][user_name] = score

    for user_name in users:
        payload["foot"][user_name] = get_score_sum(game_identifier, user_name)

    return payload
