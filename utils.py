def convert_to_csv(array):
    res = ''

    for i in range(len(array)):
        if i == len(array) - 1:
            res += str(array[i])
            return res

        res += (str(array[i]) + ", ")

    return res


def convert_to_array(string):
    array = string.split(", ")

    return array

def all_false(iterable):

    for i in iterable[1:]:
        if i is not None and i != '{}':
            return True

    return False

