import requests
import cv2


max_height = 720
max_width = 1280


class TestCaseExecution:

    def __init__(self, video_object, ttv_url):
        self.video_object = video_object
        self. ttv_url = ttv_url

    def run_step(self, button):
        unchanged_buttons = ["home", "back", "up", "down", "right", "left"]
        if button in unchanged_buttons:
            pass
        elif button == "ok":
            button = "select"
        elif button == "undo":
            button = "InstantReplay"
        elif button == "star":
            button = "info"
        command = self.ttv_url + "/keypress/" + button
        requests.post(command)

    def capture_screenshot(self, step_name):
        return self.video_object.capture_frame(step_name)

    def compare_images(self, images, selection):

        width = selection["width"]
        height = selection["height"]
        x1 = selection["left"]
        y1 = selection["top"]
        x2 = width + x1
        y2 = height + y1
        new_images = []
        for image in images:
            new_images.append(image[x1:x2,y1:y2])
        return cv2.matchTemplate(new_images[0], new_images[1], cv2.TM_CCOEFF_NORMED)


