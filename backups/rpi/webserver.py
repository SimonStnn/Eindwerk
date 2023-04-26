import os
import json
from aiohttp import web
import logging

from const import HOST_IP, WEBSERVER_PORT, WEBSOCKET_PORT, CONNECTIONS
from collection import Collection
from channels import Satellite, Device, Encoder
import decoder

_LOGGING = logging.getLogger(__name__)


def run_webserver(collection: Collection):
    """Start the web server"""

    def get_raw_content_for_web_page(request: web.Request) -> web.Response:
        """Make the content from collection to send to the webpage."""
        def format_dict(dictionary, encoder=None) -> str:
            """Format a dictionary to be send to webserver."""
            return json.dumps(dictionary, indent=".  ", cls=encoder)

        col_sats = collection.satellites
        # Format collection and serialise
        json_collection = format_dict(dict(collection.__dict__), Encoder)
        # Get amount of connected satellites
        connected_sats = list(col_sats.keys())
        # Check how many devices all sats combined found
        sats_devs_found = []
        for satellite in col_sats.values():
            for device in satellite.found_devices.values():
                sats_devs_found.append(device.addr)
        # Check how many different devices were found
        sats_devs_unique = set()
        for satellite in col_sats.values():
            for device in satellite.found_devices.values():
                sats_devs_unique.add(device.addr)

        pairs = collection.filter_pairs(collection.make_device_pairs())

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

    async def handle_post(request: web.Request) -> web.Response:
        """Handle POST requests. (ESP32)"""
        # Read the data from the request body
        data = await request.text()

        sat: Satellite = decoder.incoming_satellite_data(data)

        if sat.addr in collection.satellites:
            collection.update_satellite(sat)
        else:
            collection.add_satellite(sat)

        collection.update_devices_positions()
        
        # sat = collection["sats"][data_addr]
        # for dev in sat["devs"]:
        #     _LOGGING.debug(sat["sat"]["name"], "estimated", dev["name"], dev["rssi"],
        #           " distance for:", calculate_distance(dev["rssi"], path_loss_exponent=6.0))

        # collection.broadcast_to_all_clients(f"COLLECTION={collection.serialize()}")
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
        '/raw', lambda request: web.Response(text=get_raw_content_for_web_page(request)))
    app.router.add_get('/{path:.*}', serve_static)  # Serve other static files

    # Handle post requests
    app.router.add_post('/', handle_post)

    # Add catch-all route for 404 errors
    app.router.add_route('*', '/{path:.*}', lambda req: _LOGGING.warning(req))

    web.run_app(
        app,
        host=HOST_IP,
        port=WEBSERVER_PORT,
        print=_LOGGING.debug,
        access_log_format='%a "%r" %s %b "%{Referer}i" "%{User-Agent}i"',
    )
