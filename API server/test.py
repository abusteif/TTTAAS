from configs import *
import json
import copy
import time

items = []
with open(database_file, "r") as f:
    json_data = json.load(f)

guid ="f7b97c47-a400-4402-b5b0-4ca15d0fb12b"
new_json_data = {"testCases":list(filter(lambda x: x['id'] != guid, json_data["testCases"]))}
print({**new_json_data, **new_json_data})


