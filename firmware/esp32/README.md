# ESP32 firmware

Copy `config.example.py` to a private `config.py`, configure the GPIOs and pulse mapping for the selected programmable acceptor, and install an ESP32-compatible MicroPython HX711 driver. The example mapping is not a denomination claim: calibrate the acceptor and set its actual pulse counts.

The device must authenticate with a restricted per-device/user token; never place Firebase administrator credentials on the board. `main.py` contains the idempotent event shape and verification helpers; production wiring should add a durable pending-event queue and a Firebase REST/client implementation appropriate to the chosen authentication method.

Wiring: load cell → HX711 (DT/DOUT and SCK), HX711 → ESP32 3.3V/GND, acceptor pulse output → configured input GPIO with appropriate level shifting/common ground. Verify electrical levels before connecting.
