from channels import Satellite, Device
from collection import Collection, get_collection
from typing import Callable


def decoder_decorator(func: Callable):
    """Decorator for decoding incoming commands."""
    def wrapper(command: str) -> dict:
        collection = get_collection()
        return func(collection, command)
    return wrapper


@decoder_decorator
def incoming_satellite_data(collection: Collection, data: str) -> Satellite:
    """Decode the incoming data from a satellite, and return an object structured like:
    {
        satellite: { name, addr }
        devices: [ { name, address, classes, rssi }, ... ]
    }"""
    # Split command on '|' to get the satellite name, address, and default bool for ple
    [section1, *section2] = data.split("|")
    # First section contains satellite name, address, and default bool for ple
    [sat_name, sat_addr, set_default] = section1.split("&")
    # Convert '1' or '0' to True or False respectively
    set_default = True if set_default == "1" else False

    # # Create a new satellite object if one doesn't exist yet in the collection
    # if satellite := collection.get_satellite(sat_addr):
    #     # Update if a satellite is found
    #     satellite.update(Satellite(sat_addr, name=str(sat_name), ip=satellite.ip))
    # else:
    satellite = Satellite(sat_addr, name=str(sat_name))

    # Second section contains found devices: name, address, class, and rssi (split by '&')
    devices: list[Device] = []
    for section in section2:
        [dev_name, dev_addr, dev_class, dev_rssi] = section.split("&")

        # Create a new device object if one doesn't exist yet in the satellite
        if device := satellite.get_device(dev_addr):
            # Update if a device is found
            device.update(Device(dev_addr, int(dev_class), int(dev_rssi), name=dev_name, ip=device.ip))
        else:
            device = Device(dev_addr, int(dev_class), int(dev_rssi), name=dev_name)
        # Add the device to the satellite
        devices.append(device)

    satellite.set_found_devices(devices)
    return satellite


@decoder_decorator
def position_command(collection: Collection, cmd: str) -> dict:
    """Convert incoming position command string to dict."""
    cmd = cmd.replace("UPDATE_POS=", "")
    [addr, room, x_coord, y_coord] = cmd.split("&")
    return {
        "addr": str(addr),
        "room": str(room),
        "x": int(x_coord),
        "y": int(y_coord),
    }


@decoder_decorator
def change_room_command(collection: Collection, cmd: str) -> dict:
    """Convert incoming position command string to dict."""
    cmd = cmd.replace("CHANGE_ROOM=", "")
    [addr, room] = cmd.split("&")
    return {
        "addr": str(addr),
        "room": str(room),
    }


@decoder_decorator
def callibrate_command(collection: Collection, cmd: str) -> dict:
    """Convert the incoming callibrate command string to dict."""
    cmd = cmd.replace("CALLIBRATE=", "")
    [devices, values] = cmd.split("|", 1)
    [satellite, device, setDefault] = devices.split("&")
    rssis = []
    distances = []
    for value in values:
        [dist, rssi] = value.split("&")
        distances.append(float(dist))
        rssis.append(float(rssi))

    setDefault = setDefault == "Y" if True else False

    return {
        "sat": str(satellite),
        "dev": str(device),
        "def": bool(setDefault),
        "rssis": list(rssis),
        "distances": list(distances),
    }


@decoder_decorator
def debug_command(collection: Collection, cmd: str) -> list[str, bool]:
    cmd = cmd.replace("DEBUG=", "")
    [name, state] = cmd.split("&")
    return [name, state == "1"]


@decoder_decorator
def rename_command(collection: Collection, cmd: str) -> list[str, str]:
    cmd = cmd.replace("RENAME=", "")
    [addr, new_name] = cmd.split("&")
    return [addr, new_name]
