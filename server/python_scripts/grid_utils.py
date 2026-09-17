"""Util functions for grid data structure"""

from typing import TypedDict

from app.database import query_db
from python_scripts.data_structure_utils import flatten_tuples
from python_scripts.database_read import (
    get_all_scores_of_game,
    get_score_sum,
)


class Grid(TypedDict):
    head: list[int]
    body: list[dict[int, int]]
    foot: dict[int, int]


def build_grid_payload(game_identifier: int) -> Grid:
    """build grid payload for given game"""
    scores = get_all_scores_of_game(game_identifier)
    users = flatten_tuples(query_db("SELECT id FROM player"))

    payload: Grid = {
        "head": users,
        "body": [],
        "foot": {},
    }

    for round_number, user, score in scores:
        if user not in users:
            continue
        while len(payload["body"]) <= round_number:
            payload["body"].append({})

        payload["body"][round_number][user] = score

    for user in users:
        payload["foot"][user] = get_score_sum(game_identifier, user)

    return payload
