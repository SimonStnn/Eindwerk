import platform
import socket
import netifaces
import subprocess
import re
import psutil


def arp(mac_address):
    output: str = subprocess.check_output(["arp", "-a"]).decode("utf-8")
    for line in output.split("\n"):
        if mac_address in line:
            ip_address = line.split()[0]
            return ip_address
    return None


def get_ip_address(exclude: list[str]):
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


def convert_bytes_to_gb(bytes_value):
    gb_value = bytes_value / (1024**3)
    return round(gb_value, 2)


def get_storage_usage():
    disk_usage = psutil.disk_usage('/')
    return {
        'total': convert_bytes_to_gb(disk_usage.total),
        'used': convert_bytes_to_gb(disk_usage.used),
        'available': convert_bytes_to_gb(disk_usage.free)
    }


def get_cpu_temperature():
    with open('/sys/class/thermal/thermal_zone0/temp', 'r') as f:
        temp = f.read()
        return float(temp) / 1000


def get_memory_usage():
    memory = psutil.virtual_memory()
    return {
        'total': convert_bytes_to_gb(memory.total),
        'used': convert_bytes_to_gb(memory.used),
        'available': convert_bytes_to_gb(memory.available)
    }

def get_operating_system():
    system = platform.system()
    release = platform.release()
    return f"{system} {release}"

def get_system_uptime():
    try:
        uptime = subprocess.check_output(['uptime', '-p']).decode('utf-8').strip()
        return uptime
    except:
        return ""

OS_NAME = get_operating_system()
# OS_NAME = os.uname().sysname
OS_STORAGE_USAGE = get_storage_usage()

PI_MODEL = platform.uname()[1]

HOST_IP = get_ip_address(exclude=["127.0.0.1", "127.0.1.1"])
HOST_NAME = socket.gethostname()
WEBSOCKET_PORT = 7890
WEBSERVER_PORT = 7891
CONNECTIONS = set()

ESP32_FREQ = 2.4e9
ESP32_TRANSMIT_POWER = 20
ESP32_TRANSMIT_GAIN = 2.15
ESP32_RECEIVE_GAIN = 2.15
