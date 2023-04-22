import threading
import time
from datetime import datetime
import json
from enum import Enum
import re
import socket
import subprocess
import logging
# LCD Display library
import Adafruit_CharLCD as LCD
# Rotary encoder library
from RPi import GPIO
# Digit display library
import tm1637
from collection import Collection

_LOGGING = logging.getLogger(__name__)

# * LCD pin configuration:
lcd_rs = 25
lcd_en = 24
lcd_d4 = 23
lcd_d5 = 17
lcd_d6 = 18
lcd_d7 = 22
lcd_backlight = 1
# Define LCD column and row size for 16x2 LCD.
lcd_columns = 20
lcd_rows = 4

# * Rotary encoder configuration
rot_clk = 16
rot_dt = 12
rot_sw = 27

# * Digit display configuration
dig_clk = 5
dig_dio = 6

# * Initialize LCD and Digit display
# setup pins for rotary encoder
GPIO.setmode(GPIO.BCM)
GPIO.setup(rot_clk, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(rot_dt, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(rot_sw, GPIO.IN, pull_up_down=GPIO.PUD_UP)
# LCD
lcd = LCD.Adafruit_CharLCD(lcd_rs, lcd_en, lcd_d4, lcd_d5, lcd_d6, lcd_d7,
                           lcd_columns, lcd_rows, lcd_backlight)
# Digit display
tm = tm1637.TM1637(dig_clk, dig_dio)

# Clear all displays
tm.write([0, 0, 0, 0])
lcd.clear()

lcd.message(
    "$     Welcome!     $\n$   Raspberrypi    $\n$   is starting!   $\n$__________________$")

# Set digit display brightness
tm.brightness(1)


def handle_displays(collection: Collection, stop_event: threading.Event):
    global lcd
    global tm

    clkLastState = GPIO.input(rot_clk)
    clicked = False
    activeIndex = 0
    prevIndex = activeIndex-1
    start_time = datetime.now()
    menu_stack = []

    HOST_NAME = socket.gethostname()
    HOST_IP = socket.gethostbyname(HOST_NAME)
    SSID = subprocess.check_output(
        ["iwgetid"]).decode().strip().split(" ")[1][1:-1]

    custom_chars = {
        "bin_back": [
            0b00000,
            0b00001,
            0b00101,
            0b01001,
            0b11111,
            0b01000,
            0b00100,
            0b00000
        ],
        "bin_menu": [
            0b00000,
            0b10000,
            0b10100,
            0b10010,
            0b11111,
            0b00010,
            0b00100,
            0b00000
        ],
        "bin_info": [
            0b00000,
            0b00000,
            0b00100,
            0b00010,
            0b11111,
            0b00010,
            0b00100,
            0b00000
        ],
        "bin_colen": [
            0b00000,
            0b01000,
            0b01000,
            0b00000,
            0b00000,
            0b01000,
            0b01000,
            0b00000
        ],
        "bin_arrow_down": [
            0b00000,
            0b00000,
            0b00000,
            0b00000,
            0b00000,
            0b10001,
            0b01010,
            0b00100
        ],
    }
    lcd.create_char(0, custom_chars["bin_back"])
    lcd.create_char(1, custom_chars["bin_menu"])
    lcd.create_char(2, custom_chars["bin_info"])
    lcd.create_char(3, custom_chars["bin_colen"])
    lcd.create_char(4, custom_chars["bin_arrow_down"])

    class CustomChars(Enum):
        BACK = "\x00"
        MENU = "\x01"
        INFO = "\x02"
        COLEN = "\x03"
        ARROW_UP = "^"
        ARROW_DOWN = "\x04"

    class Indicator(Enum):
        BACK = CustomChars.BACK.value
        MENU = CustomChars.MENU.value
        INFO = CustomChars.INFO.value
        NONE = " "

    class Action(Enum):
        UP = "up"
        DOWN = "down"
        ENTER = "enter"
        BACK = "back"

    # Replace the short names to their full name
    def name_register(key: str):
        name = key

        def is_mac_address(string):
            # Regular expression pattern for a MAC address
            mac_address_pattern = re.compile(
                "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$")
            # Return True if the string matches the pattern, False otherwise
            return mac_address_pattern.match(string) is not None

        if is_mac_address(key):
            if key in collection.dic["sats"]:
                name = collection.dic["sats"][key]["sat"]["name"]
            elif key in collection.dic["devs"]:
                dev = collection.dic["devs"][key]
                if "name" in dev:
                    name = dev["name"]

        register = {
            "sats": "satellites",
            "sat": "satellite",
            "devs": "devices",
            "ple": "path loss exponents",
            "addr": "address",
            "clas": "class",
        }
        if key in register:
            name = register[key]

        return name[0].capitalize() + name[1:]

    class MenuItem:
        def __init__(self, title, item_type, sub_items=[]):
            self.title = name_register(str(title))
            self.item_type = item_type
            self.sub_items = sub_items or []

    class Menu(MenuItem):
        def __init__(self, title: str, path: list[str] = [], sub_items: list = []):
            super().__init__(title, "menu", sub_items)
            self.index = 0
            self.visible_top = 0
            self.prev_index = self.index - 1
            self.prev_displayed = []
            self.visible_height = 4
            self.options = self.set_options(sub_items)

            self.path = path
            self.key = path[-1] if path else None

        def __str__(self):
            try:
                return json.dumps({
                    "title": self.title,
                    "index": self.index,
                    "options": self.options,
                    "sub_items": self.sub_items,
                    "path": self.path,
                    "key": self.key,
                }, indent=3)
            except Exception:
                return self.title

        def set_options(self, options):
            # Add the back option at the top
            options = ["Back", *options]
            opts = []
            # Add the readable text from the sub items to be displayed
            for item in options:
                if isinstance(item, Menu):
                    opts.append(item.title)
                elif isinstance(item, InformationScreen):
                    name = str(item.content)
                    if len(str(item.title)) + len(str(item.content)) + 1 < lcd_columns:
                        name = str(item.title) + CustomChars.COLEN.value + name
                        if item.content == "":
                            name = str(item.title)
                    opts.append(name)
                else:
                    opts.append(str(item))
            return opts

        def update_menu(self, obj):
            # Follow the path to where the user is in the menu
            items: dict = obj
            for path in self.path:
                items: dict = items[path]

            def make_menu_items(obj: dict):
                # Create empty list for the menu items it needs to display
                menuitems = []
                for key, data in obj.items():
                    # Create a new path
                    new_path = [*self.path, key]
                    # Add a sub menu that the user can go into (only if it's not empty)
                    if isinstance(data, dict):
                        if data != {}:
                            menuitems.append(Menu(
                                key,
                                new_path,
                            ))
                        else:
                            # menuitems.append(InformationScreen(key))
                            menuitems.append(Menu(key, new_path))
                    elif isinstance(data, list):
                        menuitems.append(InformationScreen(f"List {key}"))

                    elif callable(data):
                        menuitems.append(InformationScreen(key, str(data())))
                    # Add just an information line to the menu items
                    else:
                        # Only display both the key and its
                        # value if it fits on the screen
                        menuitems.append(InformationScreen(key, data))
                return menuitems

            # Save the items
            self.sub_items = make_menu_items(items)
            self.options = self.set_options(self.sub_items)
            return

        def display(self, stack_length):
            # Hide the Back button in the main screen
            if stack_length == 0 and self.index == 0:
                self.handle_input(Action.DOWN, stack_length)

            def getIndicator(i):
                indicator = Indicator.NONE.value
                # Get the indicator for the current selected index
                if self.index == i + self.visible_top:
                    if self.index == 0:
                        indicator = Indicator.BACK.value
                    elif isinstance(self.sub_items[self.index-1], Menu):
                        indicator = Indicator.MENU.value
                    else:
                        indicator = Indicator.INFO.value
                return indicator[0]

            displayed_items = self.options[self.visible_top: self.visible_top + 4]
            if self.prev_displayed == displayed_items and self.prev_index == self.index:
                return
            # Only re-render the indicator
            elif self.prev_displayed == displayed_items:
                for i, option in enumerate(displayed_items):
                    lcd.set_cursor(0, i)
                    indicator = getIndicator(i)
                    lcd.message(indicator)
            else:
                # Re-render the whole screen
                self.prev_displayed = displayed_items
                lines = []
                for i, option in enumerate(displayed_items):
                    indicator = getIndicator(i)
                    line = f"{indicator}{option}"  # .ljust(lcd_columns, " ")

                    # # Add the up and down arrow at the right of the screen
                    # if i == 0 and (
                    #     (self.visible_top != 0 and stack_length != 0) or
                    #     (self.visible_top != 1 and stack_length == 0)):
                    #     line = line[:-1] + CustomChars.ARROW_UP.value
                    # if i == 3 and self.visible_top + self.visible_height != len(self.options):
                    #     line = line[:-1] + CustomChars.ARROW_DOWN.value

                    lines.append(line[:lcd_columns])

                # Clear the display and write the new message
                lcd.clear()
                lcd.message("\n".join(lines))
            self.prev_index = self.index
            time.sleep(.01)

        def handle_input(self, input: Action, stack_length):
            # Hide the back option in the main menu
            if stack_length == 0 and self.visible_top == 0:
                self.visible_top = 1

            if input == Action.UP:
                # self.index = (self.index - 1) % (len(self.options) + 1)
                # Go one up in the list
                self.index -= 1
                if self.index < 0:
                    self.index = 0
                # Make sure it can't go to the back button in the main menu
                if stack_length == 0 and self.index == 0:
                    self.index = 1
                # Move the visible top with the index if it goes above it
                if self.index < self.visible_top:
                    self.visible_top = self.index

            elif input == Action.DOWN:
                # Go one down in the list
                self.index += 1
                if self.index > len(self.options) - 1:
                    self.index = len(self.options) - 1
                # Move the visible top with the index if it goes below it
                if self.index >= self.visible_top + 4:
                    self.visible_top = (self.visible_top +
                                        1) % (len(self.options) + 1)
            elif input == Action.ENTER:
                if self.index == 0:
                    # Handle the back button
                    return Action.BACK, False
                else:
                    # Go enter a sub menu
                    # but only do this if its a Menu
                    self.prev_index = -1
                    self.prev_displayed = []

                    selected_menu: MenuItem = self.sub_items[self.index - 1]
                    if isinstance(selected_menu, Menu):
                        return selected_menu, True
            return self, False

    class InformationScreen(MenuItem):
        def __init__(self, title, content=""):
            super().__init__(title, "information")
            self.content = content

    def handle_rotary_encoder(current_item: Menu):
        nonlocal clkLastState
        nonlocal clicked
        nonlocal activeIndex
        nonlocal menu_stack
        result, add_to_stack = None, None

        # Read GPIO pins
        clkState = GPIO.input(rot_clk)
        dtState = GPIO.input(rot_dt)
        swState = GPIO.input(rot_sw)
                
        # Check states
        if clkState != clkLastState:
            if dtState != clkState:
                # Rotary encoder moved down
                result, add_to_stack = current_item.handle_input(
                    Action.DOWN, len(menu_stack))
            else:
                # Rotary encoder moved up
                result, add_to_stack = current_item.handle_input(
                    Action.UP, len(menu_stack))

        clkLastState = clkState

        # Check if Rotary encoder is pressed
        if swState == 0 and not clicked:
            result, add_to_stack = current_item.handle_input(
                Action.ENTER, len(menu_stack))
            clicked = True

        # Handle back button
        if result == Action.BACK:
            if len(menu_stack) > 0:
                current_item = menu_stack.pop()
        # Go menu deeper
        elif isinstance(result, Menu) and add_to_stack:
            menu_stack.append(current_item)
            current_item = result
        return current_item

    def get_unique_devs():
        col_sats: dict = collection.dic["sats"]
        sats_devs_unique = set()
        for val in col_sats.values():
            for dev in val["devs"]:
                sats_devs_unique.add(dev["addr"])
        return sats_devs_unique

    try:
        # Make the main menu
        current_menu: Menu = Menu("Main menu", [])
        # Make the menu object to display
        menu = {
            "raspberry info": {
                "host name": HOST_NAME,
                "SSID": SSID,
                "host IP": HOST_IP,
            },
            "sats": lambda: len(collection.dic["sats"]),
            "devs": lambda: len(collection.dic["devs"]),
            "collection": collection.dic,
            "unique devices": lambda: len(get_unique_devs()),
        }

        while not stop_event.is_set():
            # Check if rotary encoder has been turned
            # and handle its up and down events
            current_menu = handle_rotary_encoder(current_menu)

            # Keep track of the passed time
            current_time = datetime.now()
            elapsed_time = (current_time - start_time).total_seconds()
            # Check if the display should be updated
            # print("ll")
            if prevIndex != current_menu.index or clicked or elapsed_time >= 3:  # Update displays
                # Reset some variables
                start_time = current_time
                prevIndex = current_menu.index
                # Re-build the menu
                current_menu.update_menu(menu)
                # Update digit display
                num = str(current_menu.index).rjust(2, " ") + \
                    "" + str(len(menu_stack)).rjust(2, " ")
                tm.show(num, colon=True)

                # Update LCD
                current_menu.display(len(menu_stack))

                # Reset clicked state
                if clicked:
                    time.sleep(.5)
                    clicked = False
    except KeyboardInterrupt:
        pass
    finally:
        # Clear all displays
        tm.write([0, 0, 0, 0])
        lcd.clear()
