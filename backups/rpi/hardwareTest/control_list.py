import time
from datetime import datetime
# LCD Display library
import Adafruit_CharLCD as LCD
# Rotary encoder library
from RPi import GPIO
# Digit display library
import tm1637

# * LCD pin configuration:
lcd_rs = 25
lcd_en = 24
lcd_d4 = 23
lcd_d5 = 17
lcd_d6 = 18
lcd_d7 = 22
lcd_backlight = 1
# Define LCD column and row size for 16x2 LCD.
lcd_columns = 16
lcd_rows = 2

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

# Set digit display brightness
tm.brightness(1)

# todo List
lijst = [
    {
        "name": "Jules",
        "addr": "51:51:51:52:94"
    },
    {
        "name": "Jaaque",
        "addr": "31:68:35:81:52"
    },
    {
        "name": "Anouck",
        "addr": "6f:68:68:18:88"
    },
    {
        "name": "Rehehehehehehehehehe",
        "addr": "39:88:51:18:88"
    },
]

activeIndex = 0
prevIndex = activeIndex+1
activeItem = lijst[activeIndex]
boolean = True

clkLastState = GPIO.input(rot_clk)

start_time = datetime.now()

try:
    while True:
        current_time = datetime.now()
        elapsed_time = (current_time - start_time).total_seconds()

        clkState = GPIO.input(rot_clk)
        dtState = GPIO.input(rot_dt)
        swState = GPIO.input(rot_sw)
        if clkState != clkLastState:
            if dtState != clkState:
                activeIndex += 1
                if activeIndex > len(lijst)-1:
                    activeIndex = 0
            else:
                activeIndex -= 1
                if activeIndex < 0:
                    activeIndex = len(lijst)-1
            print(activeIndex, lijst[activeIndex]["name"])

        clkLastState = clkState

        if swState == 0:
            boolean = not boolean
            print("Bool:", boolean)
            time.sleep(.5)

        time.sleep(.01)

        # Only update displays every .6 seconds
        if elapsed_time >= .6:
            if prevIndex != activeIndex:
                # Update displays
                start_time = current_time
                prevIndex = activeIndex
                # num = str(len(lijst))
                num = str(activeIndex).rjust(2, " ") + \
                    "" + str(len(lijst)).rjust(2, " ")
                # padded_length = num.rjust(4, ' ')
                tm.show(num, colon=True)

                activeItem = lijst[activeIndex]
                msg = activeItem["name"] + "\n" + activeItem["addr"]
                lcd.clear()
                # time.sleep(.02)
                lcd.message(msg)
                print("--- --- updated")
except KeyboardInterrupt:
    pass

finally:
    # GPIO.cleanup()
    print()
