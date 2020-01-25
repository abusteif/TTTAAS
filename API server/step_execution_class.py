import requests
import cv2
from ttv import *
import datetime


max_height = 720
max_width = 1280


class StepExecutionClass:

    def __init__(self, video_object, ttv_url):
        self.video_object = video_object
        self. ttv_url = ttv_url

    def run_step(self, endpoint):
        ttv = TTV(self.ttv_url)
        return ttv.run_command(endpoint)

    def capture_screenshot(self):
        return self.video_object.capture_frame()

    def compare_images(self, images, selection):

        width = selection["width"]
        height = selection["height"]
        x1 = selection["left"]
        y1 = selection["top"]
        x2 = width + x1
        y2 = height + y1
        new_images = []
        print(x1, x2, y1, y2)
        for image in images:


            new_images.append(image[y1:y2,x1:x2])

        # cv2.imshow("img", new_images[0])
        # cv2.waitKey()
        # cv2.imshow("img", new_images[1])
        # cv2.waitKey()
        return cv2.matchTemplate(new_images[0], new_images[1], cv2.TM_CCOEFF_NORMED)


