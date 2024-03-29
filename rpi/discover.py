"""Automatically discover satellites."""
import socket
import asyncio
import threading
import netifaces
from datetime import datetime, timedelta
import time
import const
import logging


def get_broadcast_address() -> str:
    # return "255.255.255.255"
    interfaces = netifaces.interfaces()
    for interface in interfaces:
        if interface == 'lo':
            continue
        iface_details = netifaces.ifaddresses(interface)
        if netifaces.AF_INET in iface_details:
            address_info = iface_details[netifaces.AF_INET][0]
            if 'broadcast' in address_info:
                return address_info['broadcast']


def get_server_address() -> str:
    # get a list of network interfaces
    interfaces = netifaces.interfaces()
    # find the IP address of the first interface that is not the loopback interface
    for iface in interfaces:
        addrs = netifaces.ifaddresses(iface)
        if netifaces.AF_INET in addrs and iface != 'lo':
            return addrs[netifaces.AF_INET][0]['addr']


# get the IP address of the Raspberry Pi
SERVER_IP = get_server_address()
BROADCAST_ADDRESS = get_broadcast_address()
BROADCAST_PORT: int = 12346
BROADCAST_INTERVAL = 60 * 3
CHECK_PACKET_INTERVAL = 1
_LOGGING = logging.getLogger(__name__)


def sendConfigInfo(addr: str):
    conf = [SERVER_IP, str(const.WEBSERVER_PORT), str(3)]
    msg = "C=" + ("&".join(conf))

    client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    client_socket.sendto(msg.encode(),
                         (str(addr), int(BROADCAST_PORT)))
    client_socket.close()

    _LOGGING.info(f"Send config to: {addr}")


def onPacket(sock: socket.socket, addr: str, packet: str):
    if packet.startswith("RC="):
        sendConfigInfo(addr)
    elif packet.startswith("P="):
        _LOGGING.info(f"Received discovery response from {addr}")
        pass


def discover(collection, stop_event: threading.Event):
    time.sleep(2)

    # start timer at broadcast interval seconds

    def check_data() -> list[str, str]:
        try:
            data, addr = sock.recvfrom(1024)
            if addr[0] == SERVER_IP:  # ignore own messages
                return None, None
            _LOGGING.info(f'Received packet from {addr}: {data.decode()}')
            return data.decode(), addr[0]
        except socket.error:
            return None, None

    # Create a UDP socket and bind it to the broadcast address and port
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    sock.setblocking(True)
    sock.settimeout(2)
    sock.bind((BROADCAST_ADDRESS, BROADCAST_PORT))

    _LOGGING.info(
        f"Receiving UDP packages on {BROADCAST_ADDRESS}:{BROADCAST_PORT}")
    
    async def loop():
        broadcast_start_time = datetime.now() - timedelta(seconds=BROADCAST_INTERVAL)
        check_start_time = datetime.now() - timedelta(seconds=CHECK_PACKET_INTERVAL)
        
        while not stop_event.is_set():
            # * Send UDP package
            # make a timer
            current_time = datetime.now()
            broadcast_elapsed_time = (current_time - broadcast_start_time).total_seconds()
            check_elapsed_time = (current_time - check_start_time).total_seconds()
            # Run every x seconds
            if broadcast_elapsed_time >= BROADCAST_INTERVAL:
                broadcast_start_time = current_time  # reset timer

                # send package
                message = "D="
                sock.sendto(message.encode(), (str(BROADCAST_ADDRESS), int(BROADCAST_PORT)))
                _LOGGING.debug(f"Send discovery message: {message}")

            if check_elapsed_time>= CHECK_PACKET_INTERVAL:
                check_start_time = current_time  # reset timer
                # * Check for new packets
                # * Receive UDP packages
                packet, addr = check_data()
                if not packet:  # If no packet was received
                    continue

                # once a packet is received. trigger onPacket event
                onPacket(sock, addr, packet)

        message = "R="
        sock.sendto(message.encode(), (str(BROADCAST_ADDRESS), int(BROADCAST_PORT)))
        _LOGGING.debug(f"Send closing message: {message}")
        
    asyncio.new_event_loop().run_until_complete(loop())

