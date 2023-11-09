import functools
from multiprocessing import Manager, Lock
import threading
from typing import Union, Callable
import csv
import numpy as np
import logging
import time
import json
import math
import websockets
import log
from const import CONNECTIONS, is_mac_address
from channels import Channel, Satellite, Device, Encoder
import trilaterate

_LOGGING = logging.getLogger(__name__)

lock = threading.Lock()


class Collection:
    def __init__(self) -> None:
        # Only allow one Collection to exist
        global collection
        if collection is not None:
            raise Exception("Collection already exists")
        collection = self

        # Define variables for the collection
        self.satellites: dict[str, Satellite] = {}
        self.devices: dict[str, Device] = {}
        self.ple: dict[str, float] = {}
        self.loggers: dict[str, bool] = {}

    def lock_wrapper(func):
        """Lock the collection when accessing the collection"""

        def wrapper(self: "Collection", *args, **kwargs):
            return func(self, *args, **kwargs)
            global lock
            with lock:
                return func(self, *args, **kwargs)
        return wrapper

    def change_wrapper(func):
        """When a Channel gets updated, send the update to all clients."""

        def wrapper(self: "Collection", *args, **kwargs):
            func(self, *args, **kwargs)
            # Find the mac address of the Channel that changes in the args
            for arg in args:
                if isinstance(arg, Channel):
                    addr = arg.addr
                    break
                elif isinstance(arg, str) and is_mac_address(arg):
                    addr = arg
                    break
                else:
                    continue

            if not (channel := self.get_satellite(addr)):
                channel = self.get_device(addr)

            if channel:
                change = json.dumps(channel.__dict__, cls=Encoder).replace(
                    '"_x"', '"x"').replace('"_y"', '"y"')
                self.broadcast_to_all_clients(
                    f"CHANGE={'s' if type(channel) == Satellite else 'd'}&{addr}&{change}")
            else:
                _LOGGING.warning(f"Channel {addr} not found")
                _LOGGING.warning(f"Args: {args}")
        return wrapper

    @lock_wrapper
    @change_wrapper
    def add_satellite(self, satellite: Satellite) -> None:
        """ Add the received data from ESP32 to collection."""
        if satellite.addr in self.satellites:
            raise Exception(f"Satellite {satellite.addr} already exists")

        self.satellites[satellite.addr] = satellite

    @lock_wrapper
    @change_wrapper
    def update_satellite(self, satellite: Satellite) -> None:
        """Update the satellite in the collection."""
        if not (sat := self.get_satellite(satellite.addr)):
            raise Exception(f"Satellite {satellite.addr} not found")

        sat.update(satellite)

    @lock_wrapper
    def get_satellite(self, addr: str):
        """Get a satellite by mac address from the collection"""
        return self.satellites[addr] if addr in self.satellites else None

    @lock_wrapper
    def get_satellites(self):
        """Get all satellites from the collection"""
        return self.satellites

    @lock_wrapper
    @change_wrapper
    def add_device(self, device: Device) -> None:
        """Add the device to the collection"""
        if device.addr in self.devices:
            raise Exception(f"Device {device.addr} already exists")

        self.devices[device.addr] = device

    @lock_wrapper
    @change_wrapper
    def update_device(self, device: Device) -> None:
        """Update the device in the collection"""
        if not (dev := self.get_device(device.addr)):
            raise Exception(f"Device {device.addr} not found")

        dev.update(device)

    @lock_wrapper
    def get_device(self, addr: str) -> Union[Device, None]:
        """Get the device from the collection"""
        return self.devices[addr] if addr in self.devices else None

    @lock_wrapper
    def get_devices(self):
        """Get all devices from the collection"""
        return self.devices

    @lock_wrapper
    def serialize(self) -> str:
        """Convert the shared_dict to a normal dict and convert to json."""
        self.loggers = log.getloggers()
        return json.dumps({
            "sats": self.satellites,
            "devs": self.devices,
            "ple": self.ple,
            "loggers": self.loggers,
        }, cls=Encoder).replace('"_x"', '"x"').replace('"_y"', '"y"')

    def broadcast_to_all_clients(self, content: str) -> None:
        """Broadcast the whole collection to all Websocket connections."""
        websockets.broadcast(
            CONNECTIONS, content)

    @lock_wrapper
    @change_wrapper
    def rename_satellite(self, addr: str, new_name: str):
        self.satellites[addr].rename(new_name)

    @lock_wrapper
    @change_wrapper
    def update_satellite_position(self, addr: str, room: str, x_coord: int, y_coord: int):
        """Update a satellites position in the collection."""
        sat = self.satellites[addr]
        sat.room = room
        sat.set_coords(x_coord, y_coord)

    @lock_wrapper
    @change_wrapper
    def change_satellite_room(self, addr: str, room: str):
        """Change the room where the device is located."""
        sat = self.satellites[addr]
        sat.room = room
        sat.set_coords(None, None)

    @lock_wrapper
    def callibrate(self, sat_addr: str, dev_addr: str, distances: list, signal_strengths: list, default: bool = False):
        """Calculate the path loss exponent and save it to the collection."""
        ple = trilaterate.calculate_ple(signal_strengths, distances)

        _LOGGING.info("Callibrated PLE:", ple, "\n", "Calculated using satellite:",
                      sat_addr, "and device:", dev_addr)

        if math.isnan(ple):
            return

        self.ple[sat_addr] = ple
        if default:
            self.ple["default"] = ple

    @lock_wrapper
    def make_device_pairs(self) -> list[dict[str, list[Channel]]]:
        """Make pairs of multple diveces that are the same."""
        # Create a dictionary to store the child devices with the same address
        common_devs_by_addr: dict[str, dict[str, list[Channel]]] = {}

        # Iterate over all connected satellites
        for satellite in self.satellites.values():
            # Iterate over the child devices
            for device in satellite.found_devices.values():
                # If the address of this device is already in the dictionary, append it to the corresponding list
                if device.addr in common_devs_by_addr:
                    common_devs_by_addr[device.addr]['sats'].append(satellite)
                    common_devs_by_addr[device.addr]['devs'].append(device)
                # If the address of this device is not in the dictionary, add it as a new entry
                else:
                    common_devs_by_addr[device.addr] = {
                        'sats': [satellite],
                        'devs': [device]
                    }

        # Convert the dictionary to a list of dictionaries and return it
        return list(common_devs_by_addr.values())

    def filter_pairs(self, pairs: list[dict[str, list[Channel]]]) -> list[dict[str, list[Channel]]]:
        """Remove the devices that were not discovered by 3 or more satellites and if any of the satellites don't have coords."""
        return [
            entry for entry in pairs
            if len(entry['sats']) >= 3 and
            all(
                sat.x is not None and
                sat.y is not None and
                sat.room is not None for sat in entry['sats']
            ) and
            len(set(sat.room for sat in entry['sats'])) == 1
        ]

    def extract_coords_and_distances(self, paired_sats_devs: list[dict[str, list[Channel]]]):
        """Extract coords from filtered paired sats and devs to get `[[x1, y2], [x2, y2], ...], [d1, d2, ...]`."""
        for pair in paired_sats_devs:
            coords: list[float] = []
            distances: list[float] = []
            # sats = pair['sats']

            for i in range(len(pair["sats"])):
                satellite: Satellite = pair["sats"][i]
                device: Device = pair["devs"][i]

                coords.append(np.array([int(satellite.x), int(satellite.y)]))

                # distance = trilaterate.calculate_distance(
                #     int(device.rssi))
                distance = trilaterate.calculate_distance(
                    device._rssi, measured_power=-42, path_loss_exponent=5)
                # distances.append(distance)
                distances.append(distance*100)

                # if satellite.addr == '58:BF:25:93:7D:20':
                if device.name == 'SHIELD':
                    _LOGGING.debug(
                        f"{satellite.name:>8} calculated {distance:^6} for {device.name:10} with {device._rssi:6}dBm")

            yield pair, coords, distances

    @lock_wrapper
    def update_devices_positions(self):
        """Calculate the position of all devices."""
        # don't re-enable the lock
        pairs = self.filter_pairs(self.make_device_pairs())
        if len(pairs) == 0:
            return

        for pair, coords, distances in self.extract_coords_and_distances(pairs):
            # Locate the device
            x, y, error = trilaterate.trilaterate(coords, distances)
            # Find the name of the located device
            name = ""
            for i in range(len(pair["devs"])):
                device: Device = pair["devs"][i]
                if device.name != "":
                    break
            else:
                device: Device = pair["devs"][0]

            found_by = set()
            for entry in pairs:
                for sat in entry['sats']:
                    found_by.add(sat.addr)

            device.set_coords(x, y)
            device.found_by = list(found_by)

            device.room = pair["sats"][0].room
            device.radius = error if error < 100 else 100

            if device.addr in self.devices:
                self.update_device(device)
            else:
                self.add_device(device)

    def write_to_csv_file(path, addr, devs):
        """Write incoming satellite data to csv file."""
        timestr = time.time()

        rows = []
        for dev in devs:
            rows.append([timestr, addr, dev["name"], dev["addr"], dev["rssi"]])
        with open(path, 'a', newline='') as csv_file:
            # Create a writer object
            writer = csv.writer(csv_file)
            writer.writerows(rows)

            # for sat in col["sats"]:
            #     for dev in col["sats"][sat]["devs"]:
            #         writer.writerow(
            #             [sat, dev["name"], dev["addr"], dev["rssi"]])


collection: Collection = None


def get_collection():
    """Get the collection."""
    global collection
    while collection == None:
        pass
    return collection
