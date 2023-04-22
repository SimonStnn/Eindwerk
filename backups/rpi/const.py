import netifaces


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


HOST_IP = get_ip_address(exclude=["127.0.0.1", ""])
WEBSOCKET_PORT = 7890
WEBSERVER_PORT = 7891
CONNECTIONS = set()

ESP32_FREQ = 2.4e9
ESP32_TRANSMIT_POWER = 20
ESP32_TRANSMIT_GAIN = 2.15
ESP32_RECEIVE_GAIN = 2.15
