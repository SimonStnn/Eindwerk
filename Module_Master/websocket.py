import json
import time
# import ssl to encrypt
import websockets
import asyncio

from doubles.device import Device
from doubles.funcs import read_yaml

CONFIG_WEBSOCKET = "WEBSOCKET"
CONFIG_BLUETOOTH = "BLUETOOTH"

collection = []

async def register(websocket: websockets):
    CONNECTIONS.add(websocket)
    try:
        async for msg in websocket:
            msg = str(msg)
            # print("<<< " + msg)
            if msg.startswith("ROLE="):
                msg = msg.replace("ROLE=", "").lower()
                if msg == "satelite":
                    SATELITES.add(websocket)
                    print("A satelite just joined.")
                elif msg == "client":
                    CLIENTS.add(websocket)
                    print("A client just joined.")
            elif msg.startswith("DEVICES="):
                msg = msg.replace("DEVICES=", "")
                data = json.loads(msg)
                satelite_addr = data["satelite_addr"]
                devices = data["devices"]
                if len(collection) == 0:
                    collection.append(data)
                else:
                    for col in collection:
                        col_addr = col["satelite_addr"]
                        col_devices = col["devices"]
                        if satelite_addr == col_addr:
                            collection.remove(col)
                        
                        collection.append(data)
                        print(collection)

            await websocket.send("Received")
    finally:
        CONNECTIONS.remove(websocket)
        if websocket in SATELITES:
            SATELITES.remove(websocket)
            print("A satelite just left.")
        if websocket in CLIENTS:
            CLIENTS.remove(websocket)
            print("A client just left.")


async def broadcastFoundDevices():
    i = 1
    while True:
        # start timer
        start_time = time.time()

        serialize = []
        for sat in collection:
            for dev in sat["devices"]:
                dev = Device(dev["name"], dev["addr"], dev["majorClass"], dev["classes"], dev["rssi"])
                serialize.append(dev.serialize())

        websockets.broadcast(CLIENTS, str(serialize))
        print("--- Broadcasted ---")
        interval = SCAN_DURATION - (time.time() - start_time)
        if interval <= 0:
            interval = 0.1
        await asyncio.sleep(interval)


async def websocketServer(url, port):
    async with websockets.serve(register, url, port):
        await broadcastFoundDevices()  # run forever

if __name__ == "websocket":
    CONNECTIONS = set()
    CLIENTS = set()
    SATELITES = set()

    config = read_yaml("./config.yaml")
    SCAN_DURATION = int(config[CONFIG_BLUETOOTH]["scan_duration"])
    URL = str(config[CONFIG_WEBSOCKET]["url"])
    PORT = str(config[CONFIG_WEBSOCKET]["port"])
