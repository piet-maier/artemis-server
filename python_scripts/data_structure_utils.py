def flatten_tuples(input_list: [(any,)]) -> [any]:
    return [item[0] for item in input_list]


def convert_list_to_dict(input_list):
    result_dict = {}

    for key, value in input_list:
        if key not in result_dict:
            result_dict[key] = [value]
        else:
            result_dict[key].append(value)

    return result_dict
