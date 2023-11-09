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


# def estimate_distance(rssi, frequency, ple):
#     return 10**((27.55 - (20 * math.log10(frequency)) + math.fabs(rssi)) / (20 * ple))

# def calculate_distance(rssi, C: int = 17, R: int = 38) -> float:
#     return float(rssi_to_distance(rssi, C, R))


def calculate_distance(rssi, measured_power=-40, path_loss_exponent=2.0):
    """
    Calculates the estimated distance from the device using the RSSI value and the Free Space Path Loss model.
    :param rssi: Received Signal Strength Indicator (RSSI) value (in dBm).
    :param frequency: Frequency of the signal (in MHz). Default is 2400 MHz (Bluetooth 2.4GHz).
    :return: Estimated distance (in meters).
    """
    # Speed of light
    c = 299_792_458
    # # Path Loss model equation
    # fspl = 20 * math.log10((4 * math.pi * frequency) / c)
    # Estimated distance
    # distance = 10 ** ((27.55 - fspl + math.fabs(rssi)) /
    #                   (10 * path_loss_exponent))
    # distance = 10 ** ((-40 - rssi) / (10 * path_loss_exponent))

    # distance = round(10 ** ((-40 - (int(rssi)))/(10 * path_loss_exponent)), 2)
    
    
    
    distance = 10 ** ((measured_power - (int(rssi)))/(10 * path_loss_exponent))
    return round(distance, 2)


def trilaterate(coordinates: list, distances: list):
    arr = []
    for i in range(len(coordinates)):
        # dist = rssi_to_distance(rssi[i], 15, 30)
        arr.append(Circle(coordinates[i][0], coordinates[i][1], distances[i]))

    result, meta = easy_least_squares(arr)
    result, meta = easy_least_squares(arr, result)
    return meta.x[0], meta.x[1], abs(meta.x[2])
