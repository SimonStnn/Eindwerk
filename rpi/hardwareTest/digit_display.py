import sys
import time
import datetime
import RPi.GPIO as GPIO
import tm1637

#CLK -> GPIO23 (Pin 16)
#Di0 -> GPIO24 (Pin 18)

clk = 5
dio = 6
tm = tm1637.TM1637(clk,dio)

# all LEDS off
tm.write([0, 0, 0, 0])

num1 = 2
num2 = 5

tm.show()

# while True:
# #     tm.numbers(12, 59)
#     # time.sleep(1)
# #     tm.show("1259")
# #     time.sleep(1)

#     tm.show("e   ")
#     time.sleep(.3)
#     tm.show(" e  ")
#     time.sleep(.3)
#     tm.show("  e ")
#     time.sleep(.3)
#     tm.show("   e")
#     time.sleep(.3)
#     tm.show("  e ")
#     time.sleep(.3)
#     tm.show(" e  ")
#     time.sleep(.3)
