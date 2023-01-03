#!/usr/bin/python3

import time
import json
import asyncio
import threading
import websockets
# import iprocessing
import http.server
from multiprocessing import Manager, Lock


# hostname=socket.gethostname()
# IPAddr=socket.gethostbyname(hostname)
# print("Your Computer Name is:"+hostname)
# print("Your Computer IP Address is:"+IPAddr)

HOST_IP = "10.250.3.99"
WEBSOCKET_PORT = 7890
WEBSERVER_PORT = 7891

# Declare the shared variable as a multiprocessing.Value object
collection = Manager().dict()
# Create a lock object
lock = Lock()

CONNECTIONS = set()


def get_content_for_web_page(collection) -> str:
    json_collection = json.dumps(dict(collection), indent=3)

    keys_collection = collection.keys()

    devs_found = []
    for v in collection.values():
        for dev in v['devs']:
            devs_found.append(dev['addr'])
    devs_unique = set()
    for v in collection.values():
        for dev in v['devs']:
            devs_unique.add(dev['addr'])

    s = [
        f"Webserver: http://{HOST_IP}:{str(WEBSERVER_PORT)}/",
        f"Websocket: ws://{HOST_IP}:{str(WEBSOCKET_PORT)}/",
        f"",
        f"Connected satelites:\t{len(keys_collection)}",
        f"{keys_collection}",
        f"Found devices:\t\t{len(devs_found)}",
        f"{devs_found}",
        f"Found unique devices:\t{len(devs_unique)}",
        f"{list(devs_unique)}",
        f"",
        f"Collection:",
        f"{json_collection}",
        f"",
        f"Websocket connections:\t{len(CONNECTIONS)}",
        f"{list(CONNECTIONS)}",
        f"",
    ]
    return "\n".join(s)


def decode_incoming_data(data: str) -> dict:
    """Decode the incoming data from a satellite, and return an object structured like: 
    {
        satelite: { name, addr, ip }
        devices: [ { name, address, classes, rssi }, ... ]
    }"""
    [section1, *section2] = data.split("|")

    section1 = section1.split("&")
    sat = {
        "name": section1[0],
        "addr": section1[1]
        # ,"ip": section1[2]
    }

    devs = []
    for section in section2:
        dev = section.split("&")
        devs.append({
            "name": dev[0],
            "addr": dev[1],
            "clas": dev[2],
            "rssi": dev[3]
        })

    return {
        "sat": sat,
        "devs": devs
    }


def structure_data_for_collection(collection, data_addr: str, data: dict) -> dict:
    data["timestamp"] = time.time()
    # prevent new data from overwriting old location data
    if data_addr in collection:
        if all(key in collection[data_addr]["sat"]for key in ["room", "x", "y"]):
            with lock:
                data["sat"]["room"] = collection[data_addr]["sat"]["room"]
                data["sat"]["x"] = collection[data_addr]["sat"]["x"]
                data["sat"]["y"] = collection[data_addr]["sat"]["y"]
    return data


def serialize_collection(collection) -> str:
    return json.dumps(dict(collection))


def broadcast_to_all_clients(collection) -> None:
    websockets.broadcast(CONNECTIONS, serialize_collection(collection))
    pass


def decode_position_command(cmd: str) -> dict:
    cmd = cmd.replace("UPDATE_POS=", "")
    [addr, room, x, y] = cmd.split("&")
    return {
        "addr": str(addr),
        "room": str(room),
        "x": int(x),
        "y": int(y),
    }


def update_satellite_position(collection, addr: str, room: str, x: int, y: int):
    a = collection[addr]
    a["sat"]["room"] = room
    a["sat"]["x"] = x
    a["sat"]["y"] = y

    with lock:  # Use lock to syncronize shared_dict
        collection[addr] = a

    print(" --- After:", collection[addr]["sat"])


def run_websocket_server(collection):
    async def register(websocket: websockets):
        # if websocket not in CONNECTIONS:
        CONNECTIONS.add(websocket)
        try:
            async for msg in websocket:
                msg = str(msg)
                print("<<< " + msg)
                if msg == "REQ=collection":
                    await websocket.send(serialize_collection(collection))
                elif msg.startswith("UPDATE_POS="):
                    d = decode_position_command(msg)
                    update_satellite_position(
                        collection, d["addr"], d["room"], d["x"], d["y"])
                    await websocket.send("Received")
                else:
                    await websocket.send("Received")
        finally:
            CONNECTIONS.remove(websocket)

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    start_server = websockets.serve(register, HOST_IP, WEBSOCKET_PORT)
    print(f"Websocket serving on: ws://{HOST_IP}:{WEBSOCKET_PORT}/")
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()


def run_web_server(collection):
    class RequestHandler(http.server.BaseHTTPRequestHandler):
        def handle_one_request(self):
            self.raw_requestline = self.rfile.readline()
            if not self.raw_requestline:
                self.close_connection = 1
                return
            if not self.parse_request():  # An error code has been sent, just exit
                return
            mname = 'do_' + self.command
            if not hasattr(self, mname):
                self.send_error(501, "Unsupported method (%r)" % self.command)
                return
            method = getattr(self, mname)
            method(collection)  # Pass collection to the do_GET method
            self.wfile.flush()  # actually send the response if not already

        def do_GET(self, collection):
            # access collection here
            # implement your Web server logic here
            self.send_response(200)
            self.end_headers()
            self.wfile.write(
                (get_content_for_web_page(collection)).encode("utf-8"))
            pass

        def do_POST(self, collection):
            self.send_response(200)
            self.end_headers()
            content_length = int(self.headers["Content-Length"])

            # Read the data from the request body
            data = self.rfile.read(content_length).decode()
            data = decode_incoming_data(data)

            data_addr = data["sat"]["addr"]
            collection[data_addr] = structure_data_for_collection(
                collection, data_addr, data)

            broadcast_to_all_clients(dict(collection))

            pass

    httpd = http.server.HTTPServer((HOST_IP, WEBSERVER_PORT), RequestHandler)
    print(f"Webserver serving on: http://{HOST_IP}:{WEBSOCKET_PORT}/")
    httpd.serve_forever()


# create and start the WebSocket server thread
websocket_thread = threading.Thread(
    target=run_websocket_server, args=(collection,))
websocket_thread.start()

# create and start the Web server thread
webserver_thread = threading.Thread(target=run_web_server, args=(collection,))
webserver_thread.start()
