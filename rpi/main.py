#!/usr/bin/python3
# pylint: disable=invalid-name, trailing-whitespace, line-too-long, multiple-statements

"""
Main file for eindproef from Simon Stijnen.
"""
import sys
import asyncio
import threading
from collection import Collection
from discover import discover
from displays import handle_displays
from websocket import run_websocket_server
from webserver import run_webserver
import log
import logging

_LOGGING = logging.getLogger(__name__)


if __name__ == "__main__":

    # Settup the logger
    log.setup(sys)
    _LOGGING.debug("Starting...")

    # * Create a shared collection
    shared_collection = Collection()

    # Define stop event variable
    stop_event = threading.Event()

    # * Make threads
    # Websocket thread
    websocket_thread = threading.Thread(
        target=asyncio.run, args=[run_websocket_server(shared_collection, stop_event)],
        name="WebsocketThread",
    )
    # create and start thread that handles the display
    display_thread = threading.Thread(
        target=handle_displays, args=(shared_collection, stop_event),
        name="DisplayThread",
    )
    # create and start discover thread
    discover_thread = threading.Thread(
        target=discover, args=(shared_collection, stop_event),
        name="DiscoverThread",
    )

    # * Start threads
    display_thread.start()
    discover_thread.start()
    websocket_thread.start()

    # Keep webserver in the main thread and wait for it to close
    run_webserver(shared_collection)

    # * Close the app
    # Set the stop event variable
    stop_event.set()
    _LOGGING.debug("Stop signal send")

    # Wait for threads to finish
    display_thread.join()
    _LOGGING.debug("Display thread closed")
    discover_thread.join()
    _LOGGING.debug("Discover thread closed")
    websocket_thread.join()
    _LOGGING.debug("Websocket thread closed")
