from time import sleep
from RPi import GPIO

# Hoe aan te sluiten:
# CLK   - GPIO17 (pin11)
# DT    - GPIO18 (pin12)
# SW    - GPIO27 (pin13)
# +     - 3v3 (pin1)
# GND   - GND (pin6)

clk = 17
dt = 18
sw = 27

GPIO.setmode(GPIO.BCM)
GPIO.setup(clk, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(dt, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.setup(sw, GPIO.IN, pull_up_down=GPIO.PUD_UP)

counter = 0
clkLastState = GPIO.input(clk)

try:
    while True:
        clkState = GPIO.input(clk)
        dtState = GPIO.input(dt)
        swState = GPIO.input(sw)
        if clkState != clkLastState:
            if dtState != clkState:
                counter += 1
            else:
                counter -= 1
            print(counter)
        clkLastState = clkState
        if swState == 0:
            print("pressed")
            print(swState)
            sleep(.3)
        sleep(0.01)
finally:
    GPIO.cleanup()
