import logging
import threading
import asyncio
import websockets
from websockets.server import WebSocketServer, WebSocketServerProtocol

from const import HOST_IP, WEBSOCKET_PORT, CONNECTIONS
from collection import Collection
import decoder


_LOGGING = logging.getLogger(__name__)


async def run_websocket_server(collection: Collection, stop_event: threading.Event):
    """Start the websocket server."""
    async def register(websocket: WebSocketServerProtocol):
        # Client joins
        CONNECTIONS.add(websocket)
        try:
            async for msg in websocket:
                # Client message
                msg = str(msg)
                if msg == "REQ=collection":
                    await websocket.send(f"COLLECTION={collection.serialize()}")
                elif msg.startswith("UPDATE_POS="):
                    decoded = decoder.position_command(msg)
                    collection.update_satellite_position(
                        decoded["addr"], decoded["room"], decoded["x"], decoded["y"]
                    )
                elif msg.startswith("CHANGE_ROOM="):
                    decoded = decoder.change_room_command(msg)
                    collection.change_satellite_room(
                        decoded["addr"], decoded["room"])
                elif msg.startswith("CALLIBRATE="):
                    decoded = decoder.callibrate_command(msg)
                    # callibrate(
                    #     collection, decoded["sat"], decoded["dev"], decoded["distances"], decoded["rssis"], decoded["def"])
                elif msg.startswith("RENAME="):
                    [addr, new_name] = decoder.rename_command(msg)
                    collection.rename_satellite(addr, new_name)
                    _LOGGING.info(f"Renamed {addr} to {new_name}.")
                elif msg.startswith("DEBUG="):
                    [name, newstate] = decoder.debug_command(msg)
                    log_level = logging.DEBUG if newstate else logging.INFO
                    logging.getLogger(name).setLevel(log_level)

                    _LOGGING.info(
                        f"{'Enabled' if newstate else 'Disabled'} debugging for {name}.")

                # heyy simon hoe geet het met je
        except (websockets.exceptions.ConnectionClosed, asyncio.CancelledError) as e:
            _LOGGING.error(f"Connection closed. {e}")
        finally:
            try:
                # Client leaves
                CONNECTIONS.remove(websocket)
            except (websockets.exceptions.ConnectionClosed, asyncio.CancelledError):
                pass

    websocket_server: WebSocketServer = await websockets.serve(
        register, HOST_IP, WEBSOCKET_PORT)
    _LOGGING.info(
        f"Websocket serving on: ws://{HOST_IP}:{WEBSOCKET_PORT}/")

    await websocket_server.start_serving()
    # return websocket_server

    while not stop_event.is_set():
        await asyncio.sleep(1)
    websocket_server.close()
    await websocket_server.wait_closed()
