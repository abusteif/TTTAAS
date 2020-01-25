from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
import json
from ttv import *
from configs import *
from step_execution_script import *
import time
import copy

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['PROPAGATE_EXCEPTIONS'] = True # To allow flask propagating exception even if debug is set to false on app
api = Api(app)

items = []

# @app.before_request
# def do_something_whenever_a_request_comes_in():
#     print("***********************")

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
        with open(database_file, "r") as f:
            json_data = json.load(f)

        return {'testCases': list(filter(lambda x: x['parentId'] == guid, json_data["testCases"]))}


class TestCase(Resource):

    def put(self, guid):
        with open(database_file, "r") as f:
            json_data = json.load(f)

        data = request.get_json()
        print(type(data))
        item = next(filter(lambda x: x['id'] == guid, json_data["testCases"]), None)
        if item is None:
            json_data["testCases"].append(data["testCase"])
            with open(database_file, "w") as db_f:
                json.dump(json_data, db_f)
        else:
            print(json_data["testCases"][2])
            for i in range(json_data["testCases"].__len__()):
                if json_data["testCases"][i]['id'] == guid:
                    json_data["testCases"][i] = {**json_data["testCases"][i], **data["testCase"]}
                    # json_data["testCases"][i] = data["testCase"]
                    with open(database_file, "w") as db_f:
                        json.dump(json_data, db_f)

            return data, 200

    def get(self, guid):
        with open(database_file, "r") as f:
            json_data = json.load(f)

        return {'testCase': next(filter(lambda x: x['id'] == guid, json_data["testCases"]), None)}


    def delete(self, guid):
        with open(database_file, "r") as f:
            json_data = json.load(f)

        new_test_cases = {"testCases":list(filter(lambda x: x['id'] != guid, json_data["testCases"]))}
        new_json_data = {**json_data, **new_test_cases}

        with open(database_file, "w") as db_f:
            json.dump(new_json_data, db_f)
        return {}, 204

class TestSuites(Resource):


    def get(self, guid):
        with open(database_file, "r") as f:
            json_data = json.load(f)

        return {'testSuites': list(filter(lambda x: x['parentId'] == guid, json_data["testSuites"]))}

class TestSuite(Resource):

    def put(self, guid):

        with open(database_file, "r") as f:
            json_data = json.load(f)

        data = request.get_json()

        item = next(filter(lambda x: x['id'] == guid, json_data["testSuites"]), None)
        if item is None:
            json_data["testSuites"].append(data["testSuite"])
            with open(database_file, "w") as db_f:
                json.dump(json_data, db_f)
        else:
            for i in range(json_data["testSuites"].__len__()):
                if json_data["testSuites"][i]['id'] == guid:
                    json_data["testSuites"][i] = {**json_data["testSuites"][i], **data["testSuite"]}
                    with open(database_file, "w") as db_f:
                        json.dump(json_data, db_f)

            return data, 200

    def delete(self, guid):
        with open(database_file, "r") as f:
            json_data = json.load(f)

        new_test_suites = {"testSuites": list(filter(lambda x: x['id'] != guid, json_data["testSuites"]))}
        new_json_data = {**json_data, **new_test_suites}

        with open(database_file, "w") as db_f:
            json.dump(new_json_data, db_f)
        return {}, 204

class Apps(Resource):
    def get(self):
        with open(database_file, "r") as f:
            json_data = json.load(f)

        return {'apps': json_data["apps"]}

class TTV_command(Resource):

    def post(self):

        data = request.get_json()
        ttv_instance = TTV(ttv_url)
        return data, ttv_instance.run_command(data["endpoint"])

class TTV_execute(Resource):

    def post(self):

        data = request.get_json()
        # print(data)
        test_step = data["testStep"]
        if test_step["expectedBehaviour"]["image"]:
            execute_step = StepExecutionScript(test_step, ttv_url)
            result = execute_step.execute_step()
            return float(result) > image_comparison_threshold


        else:
            ttv_instance = TTV(ttv_url)
            result =  ttv_instance.run_command(test_step["endpoint"]) == 200
            time.sleep(test_step["delay"])
            return result




# api.add_resource(ItemList, '/items')
# api.add_resource(Item, '/item/<string:name>')

api.add_resource(TestCases, '/test-cases/<string:guid>')
api.add_resource(TestCase, '/test-case/<string:guid>')

api.add_resource(TestSuites, '/test-suites/<string:guid>')
api.add_resource(TestSuite, '/test-suite/<string:guid>')

api.add_resource(Apps, '/apps')

api.add_resource(TTV_command, '/TTV-command/')
api.add_resource(TTV_execute, '/TTV-execute/')



# api.add_resource(TestSuite, '/testSuite/<string:id>')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')  # important to mention debug=True