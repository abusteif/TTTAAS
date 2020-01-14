import json
import time
from PIL import Image
import base64
from io import BytesIO
import numpy
from video_capture import *
from test_cases_execution import *

stream_url = "http://localhost:8000/live/teststream.flv"
ttv_url = "http://192.168.0.187:8060"
with open("backend_db_apps.json", "r") as be:
    data = json.load(be)

video = VideoProcessing(stream_url)
test_case = data["testCases"][0]
test_case_execution = TestCaseExecution(video, ttv_url)

test_case_execution.run_step("home")
for step in test_case["steps"]:
    test_case_execution.run_step(step["action"])
    time.sleep(step["delay"])
    if step["expectedBehaviour"]["image"]:
        captured_image = test_case_execution.capture_screenshot(step["order"])
        test_case_image = Image.open(BytesIO(base64.b64decode(step["expectedBehaviour"]["image"].split(",")[1])))
        test_case_image_converted = cv2.cvtColor(numpy.array(test_case_image), cv2.COLOR_RGB2BGR)
        images = [test_case_image_converted, captured_image]

        step_result = test_case_execution.compare_images(images, step["expectedBehaviour"]["selection"])[0][0]
        print(step_result)
        if step_result < 0.999:
            print("Step " + str(step["order"]) + " failed")


