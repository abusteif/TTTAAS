from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
import json
from ttv import *
import time

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['PROPAGATE_EXCEPTIONS'] = True # To allow flask propagating exception even if debug is set to false on app
api = Api(app)
database_file = "backend_db_apps.json"

items = []
with open(database_file, "r") as f:
    json_data = json.load(f)
    print("aaaaa", json_data)

# class Item(Resource):
#     parser = reqparse.RequestParser()
#     parser.add_argument('price',
#         type=float,
#         required=True,
#         help="This field cannot be left blank!"
#     )
#
#     def get(self, name):
#         return {'item': next(filter(lambda x: x['name'] == name, items), None)}
#
#     def post(self, name):
#         if next(filter(lambda x: x['name'] == name, items), None) is not None:
#             return {'message': "An item with name '{}' already exists.".format(name)}
#
#         data = Item.parser.parse_args()
#
#         item = {'name': name, 'price': data['price']}
#         items.append(item)
#         return item
#
#     def delete(self, name):
#         global items
#         items = list(filter(lambda x: x['name'] != name, items))
#         return {'message': 'Item deleted'}
#
#     def put(self, name):
#         data = Item.parser.parse_args()
#         # Once again, print something not in the args to verify everything works
#         item = next(filter(lambda x: x['name'] == name, items), None)
#         if item is None:
#             item = {'name': name, 'price': data['price']}
#             items.append(item)
#         else:
#             item.update(data)
#         return item
#
# class ItemList(Resource):
#     def get(self):
#         return {'items': items}


class TestCases(Resource):

    # parser = reqparse.RequestParser()
    # parser.add_argument('test-cases',
    #     type=list,
    #     required=True,
    #     help="This field cannot be left blank!"
    # )
    #
    # def put(self, name):
    #     data = TestCases.parser.parse_args()
    #     item = next(filter(lambda x: x['name'] == name, items), None)
    #     if item is None:
    #         item = {'name': name, 'price': data['price']}
    #         items.append(item)
    #     else:
    #         item.update(data)
    #     return item

    def get(self, guid):
        return {'testCases': list(filter(lambda x: x['parentId'] == guid, json_data["testCases"]))}


class TestCase(Resource):

    def put(self, guid):
        data = request.get_json()
        # print(data)
        item = next(filter(lambda x: x['id'] == guid, json_data["testCases"]), None)
        if item is None:
            json_data["testCases"].append(data["testCase"])
            with open(database_file, "w") as db_f:
                json.dump(json_data, db_f)
        else:
            for i in range(json_data["testCases"].__len__()):
                if json_data["testCases"][i]['id'] == guid:
                    json_data["testCases"][i] = data["testCase"]
                    with open(database_file, "w") as db_f:
                        json.dump(json_data, db_f)

            return data, 201

    def get(self, guid):
        print(json_data["testCases"])
        return {'testCase': next(filter(lambda x: x['id'] == guid, json_data["testCases"]), None)}

class TestSuites(Resource):
    def get(self, guid):
        return {'testSuites': list(filter(lambda x: x['parentId'] == guid, json_data["testSuites"]))}

class Apps(Resource):
    def get(self):
        return {'apps': json_data["apps"]}


class TTV_commands(Resource):

    def post(self):
        data = request.get_json()
        ttv_instance = TTV(data["baseURL"])
        print(data)
        for ep in data["endpoints"]:
            print(ttv_instance.run_command(ep["endpoint"]))
            time.sleep(ep["delay"])
        return data, 200


# class TestSuite(Resource):
#     def get(self):
#         return

# api.add_resource(ItemList, '/items')
# api.add_resource(Item, '/item/<string:name>')

api.add_resource(TestCases, '/test-cases/<string:guid>')
api.add_resource(TestCase, '/test-case/<string:guid>')

api.add_resource(TestSuites, '/test-suites/<string:guid>')
api.add_resource(Apps, '/apps')

api.add_resource(TTV_commands, '/TTV-commands')


# api.add_resource(TestSuite, '/testSuite/<string:id>')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')  # important to mention debug=True