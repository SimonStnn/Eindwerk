from .bcolors import bcolors

class Device():
    def __init__(self, name="", addr="", majorClass="", classes=[], rssi=None):
        self.name: str = name.replace("'", "")
        self.addr: str = addr
        self.majorClass: str = majorClass
        self.classes: list = classes
        self.rssi: int = rssi

    def __str__(self):
        s = f"Name: '{bcolors.GREEN}{self.name}{bcolors.END}'\n"
        s += f"Address: '{bcolors.GREEN}{self.addr}{bcolors.END}'\n"
        s += f"Major class: '{bcolors.GREEN}{self.majorClass}{bcolors.END}'\n"
        s += f"Classes: [\n"
        for c in self.classes:
            s += f"   '{bcolors.GREEN}{c}{bcolors.END}',\n"
        s+= "]\n"
        s += f"RSSI: {bcolors.YELLOW}{self.rssi}{bcolors.END}"

        return s
    
    def serialize(self):
        return {
            "name": self.name,
            "addr": self.addr,
            "majorClass": self.majorClass,
            "classes": self.classes,
            "rssi": self.rssi
        }