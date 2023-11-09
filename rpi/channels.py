import time
import json
from typing import Callable, Union
from const import arp


class Channel:
    def __init__(self, mac_addr: str, name="New Channel", ip: str = None, room: str = None, x: int = None, y: int = None, radius: int = None) -> None:
        self.name: str = name
        self.addr: str = mac_addr
        self.ip: str = ip if ip else (a if (a := arp(mac_addr)) else None)
        self.room: str = room
        self._x = x
        self._y = y
        self.radius: int = radius

    @property
    def x(self) -> int:
        return self._x

    @property
    def y(self) -> int:
        return self._y

    def __str__(self):
        return json.dumps(self.__dict__, cls=Encoder)

    def set_coords(self, x: Union[int, None], y: Union[int, None]) -> None:
        #  Check if coordinates are negative
        self._x = x
        self._y = y

    def has_coords(self) -> bool:
        return self._x is not None and self._y is not None


class Device(Channel):
    def __init__(self, mac_addr: str, clas: int, rssi: float, *, name="New Device", ip=None, found_by: list[str] = [], room: str = None, x: int = None, y: int = None, radius=None) -> None:
        super().__init__(mac_addr, name, ip, room, x, y, radius)
        self.clas: int = clas
        self._rssi = rssi
        # self.rssi: int = property(lambda: self._rssi)
        self.rssi_queue: list[int] = []
        self.found_by = found_by

        self.update_rssi(rssi)

    @property
    def rssi(self):
        return self._rssi

    def update(self, new_device: "Device") -> None:
        self.update_rssi(new_device.rssi)
        self.set_coords(new_device.x, new_device.y)
        self.room = new_device.room
        self.radius = new_device.radius
        self.found_by = new_device.found_by

    def update_rssi(self, rssi: int) -> None:
        # Add rssi to queue and remove oldest rssi if queue is full
        self.rssi_queue.append(rssi)
        # Prevent queue from growing too large
        if len(self.rssi_queue) > 5:
            self.rssi_queue.pop(0)
        # Calculate average
        self._rssi = float(round(sum(self.rssi_queue) / len(self.rssi_queue), 2))


class Satellite(Channel):
    def __init__(self, mac_addr: str, *, name="New Satellite", ip="") -> None:
        super().__init__(mac_addr,  name, ip, radius=8)
        self.found_devices: dict[str, Device] = {}
        self.timestamp = time.time()

    def update(self, new_satellite: "Satellite") -> None:
        # for device in new_satellite.found_devices.values():
        self.set_found_devices(list(new_satellite.found_devices.values()))

        self.timestamp = new_satellite.timestamp

    def set_found_devices(self, devices: list[Device]) -> None:
        self.found_devices = {}

        # sort devices
        devices.sort(key=lambda device: device.addr)

        for device in devices:
            self.found_devices[device.addr] = device

    def add_found_devices(self, device: Device) -> None:
        if device.addr in self.found_devices:
            self.found_devices[device.addr].update(device)
        else:
            self.found_devices[device.addr] = device

    def get_device(self, mac_addr: str) -> Union[Device, None]:
        return self.found_devices[mac_addr] if mac_addr in self.found_devices else None

    def rename(self, new_name: str) -> None:
        self.name = new_name


class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Channel):
            return obj.__dict__
        elif isinstance(obj, property):
            return obj.fget()
        elif isinstance(obj, Callable):
            return obj.__name__
        return super().default(obj)
