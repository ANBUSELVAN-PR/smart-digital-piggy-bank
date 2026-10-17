"""Reference MicroPython application. Hardware/library calls are isolated for mockable logic."""
import time
try:
    import machine, ubinascii
except ImportError:
    class _Machine:
        @staticmethod
        def unique_id(): return b"simulation"
    machine = _Machine()
    import binascii as ubinascii
try:
    import urequests as requests
    import config
except ImportError:
    requests = None

FIRMWARE_VERSION = "1.0.0"
def event_id():
    return ubinascii.hexlify(machine.unique_id()).decode() + "-" + str(time.ticks_ms())
def map_pulses(pulses, mapping):
    return next((value for value, count in mapping.items() if count == pulses), None)
def weight_within_tolerance(delta, expected, tolerance):
    return expected is not None and abs(delta - expected) <= tolerance
def deposit_record(coin, before, after, verified, reason=None):
    return {'eventId': event_id(), 'coinDenomination': coin, 'identifiedCoinValue': coin,
            'measuredWeightChangeGrams': after-before, 'verificationStatus': 'verified' if verified else 'unverified',
            'timestamp': time.time(), 'rejectionReason': reason}
def main():
    # Integrate an HX711 driver and pulse ISR for the selected board. Do not treat this
    # reference as hardware-tested; invalid readings must remain unverified.
    print('Smart Piggy firmware', FIRMWARE_VERSION)
if __name__ == '__main__': main()
