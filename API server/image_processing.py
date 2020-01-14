from PIL import Image, ImageFile

from io import BytesIO
import json
import base64



import time

with open("backend_db_apps.json", "r") as be:
    data = json.load(be)
#print(data["testCases"][0]["steps"][0]["expectedBehaviour"]["image"])



# data = '''R0lGODlhDwAPAKECAAAAzMzM/////wAAACwAAAAADwAPAAACIISPeQHsrZ5ModrLl
# N48CXF8m2iQ3YmmKqVlRtW4MLwWACH+H09wdGltaXplZCBieSBVbGVhZCBTbWFydFNhdmVyIQAAOw=='''
#
im=Image.open(BytesIO(base64.b64decode(data["testCases"][0]["steps"][0]["expectedBehaviour"]["image"].split(",")[1])))
pix = im.load()
im.save("portal.png")
rescale_factor = 0.67
max_height = 1080
max_width=1920
width = 571 / rescale_factor
height = 452 / rescale_factor
x1 = 65 / rescale_factor
y1 = 105 / rescale_factor
x2 = width + x1
y2 = height + y1
print(x2, y2)

for i in range(0,max_width):
    for j in range(0,max_height):
        if i < x1 or i > x2:
            pix[i, j] = (10, 10, 10, 255)
        else:
            if j < y1 or j > y2:
                pix[i,j] = (10,10,10,255)
im.save("test.png")
