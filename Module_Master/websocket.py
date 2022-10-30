import json
import time
import websockets
import asyncio

from scan import scan
from funcs import read_yaml

CONFIG_WEBSOCKET = "WEBSOCKET"
CONFIG_BLUETOOTH = "BLUETOOTH"


async def register(websocket):
    CONNECTIONS.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        CONNECTIONS.remove(websocket)


async def broadcastFoundDevices():
    i = 1
    while True:
        # start timer
        start_time = time.time()

        nearbyDevices = scan(SCAN_DURATION)

        serialize = []
        for d in nearbyDevices:
            serialize.append(d.serialize())

        print(str(i) + ": sending " + str(len(serialize)) + " items")
        i += 1
        websockets.broadcast(CONNECTIONS, json.dumps(serialize))

        interval = SCAN_DURATION - (time.time() - start_time)
        if interval <= 0:
            interval = 0.1
        await asyncio.sleep(interval)


async def websocketServer(url, port):
    async with websockets.serve(register, url, port):
        await broadcastFoundDevices()  # run forever

if __name__ == "websocket":
    CONNECTIONS = set()

    config = read_yaml("./config.yaml")
    SCAN_DURATION = int(config[CONFIG_BLUETOOTH]["scan_duration"])
    URL = str(config[CONFIG_WEBSOCKET]["url"])
    PORT = str(config[CONFIG_WEBSOCKET]["port"])
