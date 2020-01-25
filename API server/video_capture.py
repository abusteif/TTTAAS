import cv2
import datetime

class VideoProcessing:

    def __init__(self, stream_url):
        self.stream_url = stream_url

    def capture_frame(self):
        vid = cv2.VideoCapture(self.stream_url)
        ret, frame = vid.read()
        if ret:
            step_name = datetime.datetime.now().strftime("%Y-%m-%d-%H:%M:%S")
            print(step_name, type(step_name))
            name = step_name + ".png"
            cv2.imwrite(name, frame)
            vid.release()
            return frame


