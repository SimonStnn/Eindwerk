import netifaces
import subprocess
import re


def arp(mac_address):
    output: str = subprocess.check_output(["arp", "-a"]).decode("utf-8")
    for line in output.split("\n"):
        if mac_address in line:
            ip_address = line.split()[0]
            return ip_address
    return None


def get_ip_address(exclude: list):
    # Get all the network interfaces on the computer
    interfaces = netifaces.interfaces()
    # Iterate over the interfaces and get the IP addresses
    local_ips = []
    for iface in interfaces:
        addresses = netifaces.ifaddresses(iface)
        for addr_family, addr_info in addresses.items():
            if addr_family == netifaces.AF_INET:  # IPv4 addresses
                for addr in addr_info:
                    local_ips.append(addr['addr'])
    for ip in local_ips:
        if ip not in exclude:
            return ip


def is_mac_address(string: str) -> bool:
    # Regular expression pattern for a MAC address
    mac_address_pattern = re.compile(
        "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$")
    # Return True if the string matches the pattern, False otherwise
    return mac_address_pattern.match(string) is not None


HOST_IP = get_ip_address(exclude=["127.0.0.1", ""])
WEBSOCKET_PORT = 7890
WEBSERVER_PORT = 7891
CONNECTIONS = set()

ESP32_FREQ = 2.4e9
ESP32_TRANSMIT_POWER = 20
ESP32_TRANSMIT_GAIN = 2.15
ESP32_RECEIVE_GAIN = 2.15