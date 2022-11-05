#!/usr/bin/python3
import asyncio
from websocket import websocketServer

from doubles.funcs import read_yaml

# DC:A6:32:E7:BC:F0
# 'F0:65:AE:2F:C5:D5', "Simon's A53", 5898764

CONFIG_WEBSOCKET = "WEBSOCKET"
CONFIG_BLUETOOTH = "BLUETOOTH"

print("something")

if __name__ == "__main__":
    print("Startup\n-----")
    # Read config file and make global constants
    config = read_yaml("./config.yaml")
    SCAN_DURATION = int(config[CONFIG_BLUETOOTH]["scan_duration"])
    URL = str(config[CONFIG_WEBSOCKET]["url"])
    PORT = str(config[CONFIG_WEBSOCKET]["port"])

    print("Server listening on ws://"+ str(URL)+ ":" + str(PORT))
    asyncio.run(websocketServer(URL, PORT))
