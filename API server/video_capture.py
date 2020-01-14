import cv2


class VideoProcessing:

    def __init__(self, stream_url):
        self.stream_url = stream_url

    def capture_frame(self, name):
        vid = cv2.VideoCapture(self.stream_url)
        ret, frame = vid.read()
        if ret:
            cv2.imwrite(str(name)+".png", frame)
            vid.release()
            return frame


