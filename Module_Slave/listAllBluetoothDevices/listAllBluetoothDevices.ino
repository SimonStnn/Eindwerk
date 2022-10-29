#include <SoftwareSerial.h>

#define HC05_PIN_RX 2
#define HC05_PIN_TX 3

SoftwareSerial BTserial(HC05_PIN_RX, HC05_PIN_TX);

char c;

void delayAndRead()
{
  delay(50);
  while(BTserial.available())
  {
    c = BTserial.read();
    Serial.print(c);
  }
  delay(100);
}

void setup() {
  Serial.begin(38400);
  BTserial.begin(38400);
  Serial.println("READY\n-----");
  BTserial.println("AT"); 
  delayAndRead();
  BTserial.println("AT");
  BTserial.println("AT+CMODE=1");// Enable connect to any device
  delayAndRead();
  BTserial.println("AT+ROLE=1");// Set to master in order to enable scanning
  delayAndRead();
  BTserial.println("AT+INQM=1,254,24");//RSSI, Max 254 devices, ~30s
  delayAndRead();
  BTserial.println("AT+CLASS=0");// Disable COD filter
  delayAndRead();
  BTserial.println("AT+INIT");// Init.
  delayAndRead();
  BTserial.println("AT+INQ");// Query Nearby Discoverable Devices
}

void loop() {
  if (BTserial.available())
  {
    c = BTserial.read();
    Serial.print(c);
  }
  if (Serial.available())
  {
    c = Serial.read();
    Serial.print(c);
    BTserial.write(c);
  }
}
