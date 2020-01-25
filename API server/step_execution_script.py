import time
from PIL import Image
import base64
from io import BytesIO
import numpy
from video_capture import *
from step_execution_class import *
from configs import stream_url, image_comparison_threshold


class StepExecutionScript:

    def __init__(self, step, ttv_url):
        self.step = step
        video = VideoProcessing(stream_url)
        self.step_execution = StepExecutionClass(video, ttv_url)

    def execute_step(self):

        self.step_execution.run_step(self.step["endpoint"])
        if self. step["expectedBehaviour"]["image"]:
            time.sleep(self.step["delay"])
            captured_image = self.step_execution.capture_screenshot()
            test_case_image = Image.open(BytesIO(base64.b64decode(self.step["expectedBehaviour"]["image"].split(",")[1])))
            test_case_image_converted = cv2.cvtColor(numpy.array(test_case_image), cv2.COLOR_RGB2BGR)
            images = [test_case_image_converted, captured_image]

            step_result = self.step_execution.compare_images(images, self.step["expectedBehaviour"]["selection"])[0][0]
            print(step_result)

            if image_comparison_threshold - 0.001 <= step_result < image_comparison_threshold:
                time.sleep(1)
                captured_image = self.step_execution.capture_screenshot()
                images = [test_case_image_converted, captured_image]
                step_result = self.step_execution.compare_images(images, self.step["expectedBehaviour"]["selection"])[0][0]

            print(step_result)
        return step_result
