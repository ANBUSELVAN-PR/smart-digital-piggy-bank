import unittest
from firmware.esp32.main import map_pulses, weight_within_tolerance
class LogicTests(unittest.TestCase):
    def test_mapping_and_unknown(self):
        self.assertEqual(map_pulses(5,{1:1,2:2,5:5,10:10}),5)
        self.assertIsNone(map_pulses(3,{1:1,2:2,5:5,10:10}))
    def test_tolerance(self):
        self.assertTrue(weight_within_tolerance(3.1,3,0.2)); self.assertFalse(weight_within_tolerance(3.5,3,0.2))
if __name__=='__main__': unittest.main()
