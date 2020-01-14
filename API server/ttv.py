import requests

class TTV:
    def __init__(self, base_url ):
        self.base_url = base_url

    def run_command(self, end_point):
        return requests.post(self.base_url + end_point).status_code
