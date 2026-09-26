"""Util functions for converting data structures"""

from typing import Any, TypedDict


class NavigationItem(TypedDict):
    id: int
    unixTime: int


def flatten_tuples(input_list: list[tuple[Any, ...]]) -> list[Any]:
    """convert list containing tuples of values into a list containing these values"""
    return [item[0] for item in input_list]


def convert_list_to_dict(input_list: list[tuple[str, int, int]]):
    """convert list containing tuples of values into a list containing these values"""
    result_dict: dict[str, list[NavigationItem]] = {}

    for type, id, date in input_list:
        item: NavigationItem = {"id": id, "unixTime": date}

        if type not in result_dict:
            result_dict[type] = [item]
        else:
            result_dict[type].append(item)

    return result_dict
