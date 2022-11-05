import time
import select
import bluetooth

from doubles.device import Device



class MyDiscoverer(bluetooth.DeviceDiscoverer):

    def pre_inquiry(self):
        self.done = False
        self.devices = []

    def device_discovered(self, address, device_class, rssi, name):
        
        device = Device()
        device.name = name.decode("utf-8")
        device.addr = address

        major_classes = ("Miscellaneous",
                         "Computer",
                         "Phone",
                         "LAN/Network Access point",
                         "Audio/Video",
                         "Peripheral",
                         "Imaging")
        major_class = (device_class >> 8) & 0xf

        if major_class < 7:
            device.majorClass = major_classes[major_class]
        else:
            device.majorClass = "Uncategorized"

        service_classes = ((16, "positioning"),
                           (17, "networking"),
                           (18, "rendering"),
                           (19, "capturing"),
                           (20, "object transfer"),
                           (21, "audio"),
                           (22, "telephony"),
                           (23, "information"))
        for bitpos, classname in service_classes:
            if device_class & (1 << (bitpos-1)):
                device.classes.append(classname)
        device.rssi = rssi

        discoverer.devices.append(device)

    def inquiry_complete(self):
        self.done = True


async def scan(duration):
    start_time = time.time()
    discoverer.find_devices(duration=duration)

    readfiles = [discoverer, ]

    while True:
        rfds = select.select(readfiles, [], [])[0]
        if discoverer in rfds:
            discoverer.process_event()
        if discoverer.done:
            break

    interval = duration - (time.time() - start_time)
    if interval <= 0:
        interval = 0.1
    time.sleep(interval)

    print(f"--- Found {len(discoverer.devices)} devices")

    return discoverer.devices

discoverer = MyDiscoverer()
