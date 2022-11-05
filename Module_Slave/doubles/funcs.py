import yaml
import uuid

def getMac():
    return ':'.join([
        '{:02x}'.format((uuid.getnode() >> elements) & 0xff)
        for elements in range(0, 2 * 6, 2)
    ][::-1])

def read_yaml(file_path):
    """Read yaml file and return yaml dict"""
    with open(str(file_path), "r") as f:
        return yaml.safe_load(f)
