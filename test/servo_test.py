from gpiozero import AngularServo
from time import sleep

servo = AngularServo(25, min_angle=0, max_angle=180)

while True:
    servo.angle = 0
    sleep(2)
    servo.angle = 10
    sleep(2)
    servo.angle = 20
    sleep(2)
    servo.angle = 30
    sleep(2)
    servo.angle = 40
    sleep(2)
    servo.angle = 50
    sleep(2)
    servo.angle = 60
    sleep(2)
    servo.angle = 70
    sleep(2)
    servo.angle = 80
    sleep(2)
    servo.angle = 90
    sleep(2)