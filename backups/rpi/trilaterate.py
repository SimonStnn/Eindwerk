import math
import numpy as np
from easy_trilateration.model import Circle
from easy_trilateration.least_squares import easy_least_squares, rssi_to_distance


def calculate_ple(rssi, distance):
    #  It can range from 2.7 to 4.3
    log_distance = np.log10(distance)
    log_rssi = np.log10(
        np.power(10, (27.55 - (20 * np.log10(2.4)) - rssi) / 20))
    ple = -np.polyfit(log_distance, log_rssi, 1)[0]
    return ple


def estimate_distance(rssi, frequency, ple):
    return 10**((27.55 - (20 * math.log10(frequency)) + math.fabs(rssi)) / (20 * ple))


def calculate_distance(rssi, frequency=2400000000, path_loss_exponent=2.0):
    """
    Calculates the estimated distance from the device using the RSSI value and the Free Space Path Loss model.
    :param rssi: Received Signal Strength Indicator (RSSI) value (in dBm).
    :param frequency: Frequency of the signal (in MHz). Default is 2400 MHz (Bluetooth 2.4GHz).
    :return: Estimated distance (in meters).
    """
    # Path Loss model equation
    fspl = 20 * math.log10(frequency) + 20 * \
        math.log10(math.sqrt((4 * math.pi) / 3)) - 147.55
    # Estimated distance
    distance = 10 ** ((27.55 - fspl + math.fabs(rssi)) /
                      (10 * path_loss_exponent))
    return distance


def trilaterate(coordinates: list, distances: list):
    arr = []
    for i in range(len(coordinates)):
        # dist = rssi_to_distance(rssi[i], 15, 30)
        arr.append(Circle(coordinates[i][0], coordinates[i][1], distances[i]))

    result, meta = easy_least_squares(arr)
    result, meta = easy_least_squares(arr, result)
    return meta.x[0], meta.x[1], abs(meta.x[2])
