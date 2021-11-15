#!/usr/bin/python
import time
import py_qmc5883l
sensor = py_qmc5883l.QMC5883L()
while True:
    print sensor.get_magnet()
    time.sleep(0.2)
