def flatten_tuples(input_list: [(any,)]) -> [any]:
    return [item[0] for item in input_list]
