from multiprocessing import Manager, Lock
import csv
import numpy as np
import logging
import time
import json
import math
import websockets
from trilaterate import trilaterate
import log
from const import CONNECTIONS

_LOGGING = logging.getLogger(__name__)


class Collection:
    def __init__(self, dic: dict = {}) -> None:
        # self.dic = Manager().dict()
        self.dic = dic
        self.satellites = {}
        self.devices = {}
        self.ple = {}
        self.loggers = {}
        self.lock = Lock()

    def decode_incoming_satellite_data(self, data: str) -> dict:
        """Decode the incoming data from a satellite, and return an object structured like:
        {
            satellite: { name, addr }
            devices: [ { name, address, classes, rssi }, ... ]
        }"""
        [section1, *section2] = data.split("|")

        section1 = section1.split("&")
        sat = {
            "name": section1[0],
            "addr": section1[1]
        }

        devs = []
        for section in section2:
            dev = section.split("&")
            devs.append({"name": dev[0], "addr": dev[1],
                        "clas": int(dev[2]),
                         "rssi": int(dev[3])})

        return {"sat": sat, "devs": devs}

    def add_satellite_to_collection(self, satellite_addr: str, data: dict) -> None:
        """ Add the received data from ESP32 to collection."""
        data["timestamp"] = time.time()
        sats = self.dic["sats"]

        # prevent new data from overwriting old location data
        if satellite_addr in sats:
            if all(key in sats[satellite_addr]["sat"] for key in ["room", "x", "y"]):
                with self.lock:
                    data["sat"]["room"] = sats[satellite_addr]["sat"]["room"]
                    data["sat"]["x"] = sats[satellite_addr]["sat"]["x"]
                    data["sat"]["y"] = sats[satellite_addr]["sat"]["y"]

        # Handle queue
        # Add the empty queue object to the incoming data if its not there
        if "queue" not in data:
            data["queue"] = {}

        if data["sat"]["addr"] in sats:
            if "queue" in sats[data["sat"]["addr"]]:
                for dev in data["devs"]:
                    prevQueue: list = sats[data["sat"]["addr"]]["queue"]
                    if dev["addr"] not in prevQueue:
                        prevQueue[dev["addr"]] = []

                    # Remove first element from the queue and add the new rssi value to the queue
                    if len(prevQueue[dev["addr"]]) >= 5:
                        prevQueue[dev["addr"]] = prevQueue[dev["addr"]][1:]
                    prevQueue[dev["addr"]].append({
                        "rssi": dev["rssi"],
                        "timestamp": data["timestamp"],
                    })

                    data["queue"] = prevQueue

                    # change the rssi of the device to the avg from the queue
                    vals = [val["rssi"] for val in prevQueue[dev["addr"]]]

                    def map_func(x):
                        if x["addr"] == dev["addr"]:
                            x["rssi"] = round(sum(vals) / len(vals), 2)
                        return x
                    data["devs"] = list(map(map_func, data["devs"]))

        # _LOGGING.debug(json.dumps(data, indent=3))

        # if data["sat"]["addr"] == "58:BF:25:93:7C:88":  # ESP32-Simon-01
        #     data["sat"]["room"] = "Living"
        #     data["sat"]["x"] = 746
        #     data["sat"]["y"] = 21
        # elif data["sat"]["addr"] == "58:BF:25:93:7E:78":  # ESP32-Simon-02
        #     data["sat"]["room"] = "Living"
        #     # data["sat"]["x"] = 40
        #     data["sat"]["x"] = 487
        #     data["sat"]["y"] = 13
        # elif data["sat"]["addr"] == "0C:B8:15:F3:68:DC":  # ESP32-Maxim
        #     data["sat"]["room"] = "Living"
        #     data["sat"]["x"] = 768
        #     data["sat"]["y"] = 366
        # elif data["sat"]["addr"] == "58:BF:25:93:7E:84":  # ESP32-Zetel
        #     data["sat"]["room"] = "Living"
        #     data["sat"]["x"] = 760
        #     data["sat"]["y"] = 370

        sats[satellite_addr] = data

        # write_to_csv_file("./logs/afvlakking.csv", satellite_addr, data["devs"])

        with self.lock:  # Use lock to syncronize shared_dict
            self.dic["sats"] = sats

    def add_device_to_collection(self, data: dict) -> None:
        """Add the device to the collection"""

        with self.lock:  # Use lock to syncronize shared_dict
            self.dic["devs"] = data if data else {}

    def serialize(self) -> str:
        """Convert the shared_dict to a normal dict and convert to json."""
        self.dic["loggers"] = log.getloggers()
        return json.dumps(dict(self.dic))

    def broadcast_to_all_clients(self) -> None:
        """Broadcast the whole collection to all Websocket connections."""
        websockets.broadcast(
            CONNECTIONS, self.serialize())

    def decode_position_command(self, cmd: str) -> dict:
        """Convert incoming position command string to dict."""
        cmd = cmd.replace("UPDATE_POS=", "")
        [addr, room, x_coord, y_coord] = cmd.split("&")
        return {
            "addr": str(addr),
            "room": str(room),
            "x": int(x_coord),
            "y": int(y_coord),
        }

    def decode_change_room_command(self, cmd: str) -> dict:
        """Convert incoming position command string to dict."""
        cmd = cmd.replace("CHANGE_ROOM=", "")
        [addr, room] = cmd.split("&")
        return {
            "addr": str(addr),
            "room": str(room),
        }

    def decode_callibrate_command(self, cmd: str) -> dict:
        """Convert the incoming callibrate command string to dict."""
        cmd = cmd.replace("CALLIBRATE=", "")
        [devices, values] = cmd.split("|", 1)
        [satellite, device, setDefault] = devices.split("&")
        rssis = []
        distances = []
        for value in values:
            [dist, rssi] = value.split("&")
            distances.append(float(dist))
            rssis.append(float(rssi))

        setDefault = setDefault == "Y" if True else False

        return {
            "sat": str(satellite),
            "dev": str(device),
            "def": bool(setDefault),
            "rssis": list(rssis),
            "distances": list(distances),
        }

    def decode_debug_command(self, cmd: str) -> list[str, bool]:
        cmd = cmd.replace("DEBUG=", "")
        [name, state] = cmd.split("&")
        return [name, state == "1"]

    def update_satellite_position(self, addr: str, room: str, x_coord: int, y_coord: int):
        """Update a satellites position in the collection."""
        sats = self.dic["sats"]

        sat = sats[addr]
        sat["sat"]["room"] = room
        sat["sat"]["x"] = x_coord
        sat["sat"]["y"] = y_coord

        sats[addr] = sat
        with self.lock:  # Use lock to syncronize shared_dict
            self.dic["sats"] = sats

        self.broadcast_to_all_clients()

    def change_satellite_room(self, addr: str, room: str):
        """Change the room where the device is located."""
        sats = self.dic["sats"]

        sat = sats[addr]
        sat["sat"]["room"] = room
        sat["sat"]["x"] = None
        sat["sat"]["y"] = None

        sats[addr] = sat
        with self.lock:  # Use lock to syncronize shared_dict
            self.dic["sats"] = sats

        self.broadcast_to_all_clients()

    def callibrate(self, sat_addr: str, dev_addr: str, distances: list, signal_strengths: list, default: bool = False):
        """Calculate the path loss exponent and save it to the collection."""
        ple = self.calculate_ple(signal_strengths, distances)
        _LOGGING.info("Callibrated PLE:", ple, "\n", "Calculated using satellite:",
                      sat_addr, "and device:", dev_addr)

        if math.isnan(ple):
            return

        col_ple = self.dic["ple"]
        col_ple[sat_addr] = ple
        if default:
            col_ple["default"] = ple
        # Update the collection
        with self.lock:  # Use lock to syncronize shared_dict
            self.dic["ple"] = col_ple

    def make_device_pairs(self) -> list:
        """Make pairs of multple diveces that are the same."""
        sats: object = self.dic["sats"]

        # Create a dictionary to store the child devices with the same address
        common_devs_by_addr = {}

        # Iterate over the satellite devices
        for sat in sats.values():
            # Iterate over the child devices of this satellite
            for dev in sat['devs']:
                # If the address of this device is already in the dictionary, append it to the corresponding list
                if dev['addr'] in common_devs_by_addr:
                    common_devs_by_addr[dev['addr']]['sats'].append(sat["sat"])
                    common_devs_by_addr[dev['addr']]['devs'].append(dev)
                # If the address of this device is not in the dictionary, add it as a new entry
                else:
                    common_devs_by_addr[dev['addr']] = {
                        'sats': [sat["sat"]],
                        'devs': [dev]
                    }

        # Convert the dictionary to a list of dictionaries and return it
        return list(common_devs_by_addr.values())

    def filter_pairs(self, pairs: list) -> list:
        """Remove the devices that were not discovered by 3 or more satellites and if any of the satellites don't have coords."""
        return [entry for entry in pairs if len(entry['sats']) >= 3 and all('x' in sat and 'y' in sat and 'room' in sat for sat in entry['sats']) and len(set(sat['room'] for sat in entry['sats'])) == 1]

    def extract_coords_and_distances(self, paired_sats_devs: list):
        """Extract coords from filtered paired sats and devs to get `[[x1, y2], [x2, y2], ...], [d1, d2, ...]`."""
        for pair in paired_sats_devs:
            coords = []
            distances = []
            # sats = pair['sats']

            for i in range(len(pair["sats"])):
                sat = pair["sats"][i]
                dev = pair["devs"][i]

                coords.append(np.array([int(sat['x']), int(sat['y'])]))

                distance = self.calculate_distance(
                    int(dev["rssi"]), path_loss_exponent=9)
                _LOGGING.info(sat["name"], "with rssi:\t", dev["rssi"],
                              "calculated distance:\t", distance)
                distances.append(distance*100)

            # for sat in sats:
            #     coords.append(np.array([int(sat['x']), int(sat['y'])]))

            # devs = pair['devs']
            # for dev in devs:
            #     distance = calculate_distance(int(dev['rssi']), path_loss_exponent=9)
            #     distances.append(distance*100)

            yield pair, coords, distances

    def calculate_devices_positions(self) -> dict:
        """Calculate the position of all devices."""
        pairs = self.filter_pairs(self.make_device_pairs())
        if len(pairs) == 0:
            return

        devs = {}
        for pair, coords, distances in self.extract_coords_and_distances(pairs):
            name = ""
            for i in range(len(pair["devs"])):
                name = pair["devs"][i]["name"]
                if name != "":
                    break
            addr = pair["devs"][0]["addr"]
            clas = pair["devs"][0]["clas"]
            room = pair["sats"][0]["room"]
            # found_by = pair["sats"]
            found_by = [sat['addr']
                        for entry in pairs for sat in entry['sats']]

            x, y, error = trilaterate(coords, distances)

            devs[addr] = {
                "name": name,
                "addr": addr,
                "clas": clas,
                "room": room,
                "x": x,
                "y": y,
                "radius": error,
                "found_by": found_by
            }
        return devs

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
