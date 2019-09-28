import requests
import json

# url="http://192.168.0.85/keydown/up"
# print(requests.post(url))

with open("backend_db_apps.json") as f:
    b = json.load(f)
    print(b["testCases"][0]["name"])