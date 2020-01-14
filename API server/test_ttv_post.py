import requests
import json

# url="http://192.168.0.85/keydown/up"
# print(requests.post(url))


data={
"testCase":
{
    "name": "test_case26",
    "id": "418292f9-4617-4635-a674-94fecb517d11",
    "parentId": "179f"}

}
data1=json.dumps(data)
print(data1)
a = requests.put("http://127.0.0.1:5000/test-case/418292f9-4617-4635-a674-94fecb517d11",data= data1, headers={"Content-Type": "application/json"})
print(a.content)
#
# print(requests.get("http://127.0.0.1:5000/test-case/418292f9-4617-4635-a674-94fecb517d11").content)