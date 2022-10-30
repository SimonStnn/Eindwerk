import yaml

def read_yaml(file_path):
    """Read yaml file and return yaml dict"""
    with open(str(file_path), "r") as f:
        return yaml.safe_load(f)
