"""Util functions for converting data structures"""


def flatten_tuples(input_list: [(any,)]) -> [any]:
    """convert list containing tuples of values into a list containing these values"""
    return [item[0] for item in input_list]


def convert_list_to_dict(input_list: list[(str, any)]) -> dict[str, any]:
    """convert list containing tuples of values into a list containing these values"""
    result_dict = {}

    for key, value in input_list:
        if key not in result_dict:
            result_dict[key] = [value]
        else:
            result_dict[key].append(value)

    return result_dict
