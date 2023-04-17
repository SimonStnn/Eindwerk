#!/usr/bin/python3
# pylint: disable=invalid-name, trailing-whitespace, line-too-long, multiple-statements

"""
Main file for eindproef from Simon Stijnen.
"""
import os
import csv
import sys
import time
import json
import math
from aiohttp import web
import signal
import asyncio
import threading
from multiprocessing import Manager, Lock
import numpy as np
import websockets
from trilaterate import trilaterate, calculate_ple, calculate_distance
from discover import discover
from displays import handle_displays
import log
import logging

_LOGGING = logging.getLogger(__name__)


def decode_incoming_satellite_data(data: str) -> dict:
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


def add_satellite_to_collection(collection, satellite_addr: str, data: dict) -> None:
    """ Add the received data from ESP32 to collection."""
    data["timestamp"] = time.time()
    sats = collection["sats"]

    # prevent new data from overwriting old location data
    if satellite_addr in sats:
        if all(key in sats[satellite_addr]["sat"] for key in ["room", "x", "y"]):
            with lock:
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

    with lock:  # Use lock to syncronize shared_dict
        collection["sats"] = sats


def add_device_to_collection(collection, data: dict) -> None:
    """Add the device to the collection"""
    # devs = collection["devs"]

    # devs[device_addr] = data

    with lock:  # Use lock to syncronize shared_dict
        collection["devs"] = data if data else {}


def serialize_collection(col) -> str:
    """Convert the shared_dict to a normal dict and convert to json."""
    return json.dumps(dict(col))


def broadcast_to_all_clients(dictionary) -> None:
    """Broadcast the whole collection to all Websocket connections."""
    websockets.broadcast(CONNECTIONS, serialize_collection(dictionary))


def decode_position_command(cmd: str) -> dict:
    """Convert incoming position command string to dict."""
    cmd = cmd.replace("UPDATE_POS=", "")
    [addr, room, x_coord, y_coord] = cmd.split("&")
    return {
        "addr": str(addr),
        "room": str(room),
        "x": int(x_coord),
        "y": int(y_coord),
    }


def decode_change_room_command(cmd: str) -> dict:
    """Convert incoming position command string to dict."""
    cmd = cmd.replace("CHANGE_ROOM=", "")
    [addr, room] = cmd.split("&")
    return {
        "addr": str(addr),
        "room": str(room),
    }


def decode_callibrate_command(cmd: str) -> dict:
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


def update_satellite_position(collection, addr: str, room: str, x_coord: int, y_coord: int):
    """Update a satellites position in the collection."""
    sats = collection["sats"]

    sat = sats[addr]
    sat["sat"]["room"] = room
    sat["sat"]["x"] = x_coord
    sat["sat"]["y"] = y_coord

    sats[addr] = sat
    with lock:  # Use lock to syncronize shared_dict
        collection["sats"] = sats

    broadcast_to_all_clients(collection)


def change_satellite_room(collection, addr: str, room: str):
    """Change the room where the device is located."""
    sats = collection["sats"]

    sat = sats[addr]
    sat["sat"]["room"] = room
    sat["sat"]["x"] = None
    sat["sat"]["y"] = None

    sats[addr] = sat
    with lock:  # Use lock to syncronize shared_dict
        collection["sats"] = sats

    broadcast_to_all_clients(collection)


def callibrate(collection, sat_addr: str, dev_addr: str, distances: list, signal_strengths: list, default: bool = False):
    """Calculate the path loss exponent and save it to the collection."""
    ple = calculate_ple(signal_strengths, distances)
    _LOGGING.info("Callibrated PLE:", ple, "\n", "Calculated using satellite:",
                  sat_addr, "and device:", dev_addr)

    if math.isnan(ple):
        return

    col_ple = collection["ple"]
    col_ple[sat_addr] = ple
    if default:
        col_ple["default"] = ple
    # Update the collection
    with lock:  # Use lock to syncronize shared_dict
        collection["ple"] = col_ple


def make_device_pairs(collection) -> list:
    """Make pairs of multple diveces that are the same."""
    sats: object = collection["sats"]

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


def filter_pairs(pairs: list) -> list:
    """Remove the devices that were not discovered by 3 or more satellites and if any of the satellites don't have coords."""
    return [entry for entry in pairs if len(entry['sats']) >= 3 and all('x' in sat and 'y' in sat and 'room' in sat for sat in entry['sats']) and len(set(sat['room'] for sat in entry['sats'])) == 1]


def extract_coords_and_distances(paired_sats_devs: list):
    """Extract coords from filtered paired sats and devs to get `[[x1, y2], [x2, y2], ...], [d1, d2, ...]`."""
    for pair in paired_sats_devs:
        coords = []
        distances = []
        # sats = pair['sats']

        for i in range(len(pair["sats"])):
            sat = pair["sats"][i]
            dev = pair["devs"][i]

            coords.append(np.array([int(sat['x']), int(sat['y'])]))

            distance = calculate_distance(
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


def calculate_devices_positions(collection) -> dict:
    """Calculate the position of all devices."""
    pairs = filter_pairs(make_device_pairs(collection))
    if len(pairs) == 0:
        return

    devs = {}
    for pair, coords, distances in extract_coords_and_distances(pairs):
        name = ""
        for i in range(len(pair["devs"])):
            name = pair["devs"][i]["name"]
            if name != "":
                break
        addr = pair["devs"][0]["addr"]
        clas = pair["devs"][0]["clas"]
        room = pair["sats"][0]["room"]
        # found_by = pair["sats"]
        found_by = [sat['addr'] for entry in pairs for sat in entry['sats']]

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


async def run_websocket_server(collection, stop_event: threading.Event) -> asyncio.AbstractEventLoop:
    """Start the websocket server."""
    async def register(websocket: websockets):
        # Client joins
        CONNECTIONS.add(websocket)
        try:
            async for msg in websocket:
                # Client message
                msg = str(msg)
                if msg == "REQ=collection":
                    await websocket.send(serialize_collection(collection))
                elif msg.startswith("UPDATE_POS="):
                    decoded = decode_position_command(msg)
                    update_satellite_position(
                        collection, decoded["addr"], decoded["room"], decoded["x"], decoded["y"]
                    )
                elif msg.startswith("CHANGE_ROOM="):
                    decoded = decode_change_room_command(msg)
                    change_satellite_room(
                        collection, decoded["addr"], decoded["room"])
                elif msg.startswith("CALLIBRATE="):
                    decoded = decode_callibrate_command(msg)
                    # callibrate(
                    #     collection, decoded["sat"], decoded["dev"], decoded["distances"], decoded["rssis"], decoded["def"])
# heyy simon hoe geet het met je
                await websocket.send("Received")
        finally:
            try:
                # Client leaves
                CONNECTIONS.remove(websocket)
            except (websockets.exceptions.ConnectionClosed, asyncio.CancelledError):
                pass
            
            

    try:
        websocket_server = await websockets.serve(
            register, HOST_IP, WEBSOCKET_PORT)
        _LOGGING.info(f"Websocket serving on: ws://{HOST_IP}:{WEBSOCKET_PORT}/")

        await websocket_server.start_serving()
        
        while not stop_event.is_set():
            await asyncio.sleep(1)
        
        await websocket_server.close()
    except Exception as e:
        pass



def run_web_server(collection):
    """Start the web server"""

    def get_raw_content_for_web_page(collection: dict) -> web.Response:
        """Make the content from collection to send to the webpage."""
        def format_dict(dictionary) -> str:
            """Format a dictionary to be send to webserver."""
            return json.dumps(dictionary, indent=".  ")

        col_sats = collection["sats"]
        # Format collection and serialise
        json_collection = format_dict(dict(collection))
        # Get amount of connected satellites
        connected_sats = list(col_sats.keys())
        # Check how many devices all sats combined found
        sats_devs_found = []
        for val in col_sats.values():
            for dev in val["devs"]:
                sats_devs_found.append(dev["addr"])
        # Check how many different devices were found
        sats_devs_unique = set()
        for val in col_sats.values():
            for dev in val["devs"]:
                sats_devs_unique.add(dev["addr"])

        pairs = filter_pairs(make_device_pairs(collection))

        string = [
            f"Webserver: http://{HOST_IP}:{str(WEBSERVER_PORT)}/",
            f"Websocket: ws://{HOST_IP}:{str(WEBSOCKET_PORT)}/",
            "",
            f"Connected satellites:\t{len(connected_sats)}",
            f"{connected_sats}",
            f"Found devices:\t\t{len(sats_devs_found)}",
            f"{sats_devs_found}",
            f"Found unique devices:\t{len(sats_devs_unique)}",
            f"{list(sats_devs_unique)}",
            "",
            "Collection:",
            f"{json_collection}",
            "",
            f"Websocket connections:\t{len(CONNECTIONS)}",
            f"{list(CONNECTIONS)}",
            "",
            "Common_devs:",
            str(format_dict(pairs)),
        ]

        return "\n".join(string)

    async def handle_post(request: web.Request, collection: dict):
        """Handle POST requests. (ESP32)"""
        # Read the data from the request body
        data = await request.text()

        data = decode_incoming_satellite_data(data)

        data_addr = data["sat"]["addr"]
        add_satellite_to_collection(
            collection, data_addr, data
        )

        devices = calculate_devices_positions(collection)
        add_device_to_collection(collection, devices)

        # sat = collection["sats"][data_addr]
        # for dev in sat["devs"]:
        #     _LOGGING.debug(sat["sat"]["name"], "estimated", dev["name"], dev["rssi"],
        #           " distance for:", calculate_distance(dev["rssi"], path_loss_exponent=6.0))

        broadcast_to_all_clients(dict(collection))
        return web.Response()

    async def serve_static(request: web.Request):
        path = request.match_info.get('path', '')
        if not path:
            path = 'index.html'  # Set default path to index.html for '/'
        file_path = os.path.join('build', path)
        if os.path.exists(file_path):
            return web.FileResponse(file_path)
        else:
            return web.HTTPNotFound()

    app = web.Application()
    app.router.add_get('/', serve_static)
    app.router.add_get('/rooms', serve_static)
    app.router.add_get('/discover', serve_static)
    app.router.add_get('/components', serve_static)
    app.router.add_get('/settings', serve_static)
    app.router.add_get(
        '/raw', lambda request: web.Response(text=get_raw_content_for_web_page(collection)))
    app.router.add_get('/{path:.*}', serve_static)  # Serve other static files

    # Handle post requests
    app.router.add_post(
        '/', lambda request: handle_post(request, collection), )

    # Add catch-all route for 404 errors
    app.router.add_route('*', '/{path:.*}', lambda req: _LOGGING.warning(req))

    web.run_app(
        app,
        host=HOST_IP,
        port=WEBSERVER_PORT,
        print=_LOGGING.info,
        access_log_format='%a "%r" %s %b "%{Referer}i" "%{User-Agent}i"'
    )


if __name__ == "__main__":
    HOST_IP = "10.250.3.99"
    WEBSOCKET_PORT = 7890
    WEBSERVER_PORT = 7891
    CONNECTIONS = set()

    ESP32_FREQ = 2.4e9
    ESP32_TRANSMIT_POWER = 20
    ESP32_TRANSMIT_GAIN = 2.15
    ESP32_RECEIVE_GAIN = 2.15

    # Settup the logger
    log.setup(sys)

    # Declare the shared variable as a multiprocessing.Value object
    shared_collection = Manager().dict()
    # Create a lock object
    lock = Lock()
    # Update the shared_collection
    with lock:
        shared_collection = {
            "sats": {},
            "devs": {},
            "ple": {
                "default": 8.0
            },
        }

    # Define stop event var
    stop_event = threading.Event()

    # Define stop signal
    sig = signal.SIGUSR1
    sig2 = signal.SIGUSR2

    # Define a signal handler function
    def signal_handler(signum, frame):
        global stop_event
        print()
        _LOGGING.info('Shutting down...')
        stop_event.set()

    # Register signal handler for SIGINT signal (Ctrl+C)
    signal.signal(sig, signal_handler)
  
    # Websocket thread
    websocket_thread = threading.Thread(
        target=asyncio.run, args=[run_websocket_server(shared_collection, stop_event)],
        name="WebsocketThread"
    )

    # create and start thread that handles the display
    display_thread = threading.Thread(
        target=handle_displays, args=(shared_collection, stop_event),
        name="DisplayThread"
    )
    # create and start discover thread
    discover_thread = threading.Thread(
        target=discover, args=(shared_collection, stop_event),
        name="DiscoverThread"
    )

    # Start threads
    display_thread.start()
    discover_thread.start()
    websocket_thread.start()

    # Keep webserver in the main thread and wait for it to close
    run_web_server(shared_collection)
    
    # code for closing the app
    # Send stop signal
    os.kill(os.getpid(), sig)
    
    # Wait for threads to finish
    display_thread.join()
    _LOGGING.debug("Display thread terminated")
    discover_thread.join()
    _LOGGING.debug("Discover thread terminated")
    websocket_thread.join()
    _LOGGING.debug("Websocket thread terminated")
