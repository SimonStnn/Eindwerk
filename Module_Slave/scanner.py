import websockets
import asyncio
import json

from scan import scan
from doubles.funcs import getMac, read_yaml

PORT = 7890
SCAN_DURATION = 3
MAC= getMac()

testDevices = [
    {
        "name": "Test naam",
        "addr": "adress test",
        "majorClass": "Computer",
        "classes": ["Iets doen", "een tweede dinge doen", "audio"],
        "rssi": -69
    },
    {
        "name": "Test naam2",
        "addr": "adress test",
        "majorClass": "Audio/Video",
        "classes": ["Iets doen", "een tweede dinge doen", "audio"],
        "rssi": -35
    },
]

async def listen():
    url = "ws://10.250.3.99:" + str(PORT) + "/"

    async with websockets.connect(url,ping_interval=None) as ws:

        await ws.send("ROLE=satelite")
        
        while True:
            nearbyDevices = await scan(SCAN_DURATION)
            await ws.send("DEVICES=" + json.dumps(
            {
                "satelite_addr": MAC,
                "devices":[*testDevices, *nearbyDevices],
            }
            ))
            print(f">>> *Found devices")
            greeting = await ws.recv()
            print(f"<<< {greeting}")

# asyncio.new_event_loop().run_until_complete(listen())

if __name__ == "__main__":
    asyncio.run(listen())