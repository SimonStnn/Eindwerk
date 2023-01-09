from easy_trilateration.model import Circle
from easy_trilateration.least_squares import easy_least_squares, rssi_to_distance


def trilaterate(coordinates: list, rssi: list):
    arr = []
    for i in range(len(coordinates)):
        dist = rssi_to_distance(rssi[i], 15, 30)
        # print('--- dist:', dist)
        arr.append(Circle(coordinates[i][0], coordinates[i][1], dist))

    result, meta = easy_least_squares(arr)
    result, meta = easy_least_squares(arr, result)
    return meta.x[0], meta.x[1], abs(meta.x[2])
