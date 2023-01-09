#include <WiFi.h>

void setup() {
  // Get the current operating mode of the device
  WiFiMode_t mode = WiFi.getMode();

  // Determine the frequency, transmit power, and gain settings based on the operating mode
  float frequency;
  int transmit_power;
  float transmit_gain;
  float receive_gain;
  switch (mode) {
    case WIFI_MODE_NULL:
      frequency = 0;
      transmit_power = 0;
      transmit_gain = 0;
      receive_gain = 0;
      break;
    case WIFI_MODE_STA:
      frequency = 2.4e9;
      transmit_power = 20;   // 20 dBm
      transmit_gain = 2.15;  // 2.15 dBi
      receive_gain = 2.15;   // 2.15 dBi
      break;
    case WIFI_MODE_AP:
      frequency = 2.4e9;
      transmit_power = 20;   // 20 dBm
      transmit_gain = 2.15;  // 2.15 dBi
      receive_gain = 2.15;   // 2.15 dBi
      break;
    case WIFI_MODE_APSTA:
      frequency = 2.4e9;
      transmit_power = 20;   // 20 dBm
      transmit_gain = 2.15;  // 2.15 dBi
      receive_gain = 2.15;   // 2.15 dBi
      break;
    default:
      frequency = 0;
      transmit_power = 0;
      transmit_gain = 0;
      receive_gain = 0;
      break;
  }

  // Print the frequency, transmit power, and gain settings
  Serial.print("Frequency: ");
  Serial.println(frequency);
  Serial.print("Transmit power: ");
  Serial.println(transmit_power);
  Serial.print("Transmit gain: ");
  Serial.println(transmit_gain);
  Serial.print("Receive gain: ");
  Serial.println(receive_gain);
}

void loop() {
  // put your main code here, to run repeatedly:
}
