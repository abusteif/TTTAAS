from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
import json

app = Flask(__name__)
cors = CORS(app, resources={r"/test-case/*": {"origins": "*"}})
app.config['PROPAGATE_EXCEPTIONS'] = True # To allow flask propagating exception even if debug is set to false on app
api = Api(app)


items = []
with open("backend_db_apps.json") as f:
    json_data = json.load(f)

class Item(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('price',
        type=float,
        required=True,
        help="This field cannot be left blank!"
    )

    def get(self, name):
        return {'item': next(filter(lambda x: x['name'] == name, items), None)}

    def post(self, name):
        if next(filter(lambda x: x['name'] == name, items), None) is not None:
            return {'message': "An item with name '{}' already exists.".format(name)}

        data = Item.parser.parse_args()

        item = {'name': name, 'price': data['price']}
        items.append(item)
        return item

    def delete(self, name):
        global items
        items = list(filter(lambda x: x['name'] != name, items))
        return {'message': 'Item deleted'}

    def put(self, name):
        data = Item.parser.parse_args()
        # Once again, print something not in the args to verify everything works
        item = next(filter(lambda x: x['name'] == name, items), None)
        if item is None:
            item = {'name': name, 'price': data['price']}
            items.append(item)
        else:
            item.update(data)
        return item

class ItemList(Resource):
    def get(self):
        return {'items': items}


# class TestCases(Resource):
#     def get(self):
#         return

class TestCase(Resource):
    def get(self, guid):
        return {'testCases': next(filter(lambda x: x['id'] == guid, json_data["testCases"]), None)}

# class TestSuites(Resource):
#     def get(self):
#         return
#
# class TestSuite(Resource):
#     def get(self):
#         return

api.add_resource(ItemList, '/items')
api.add_resource(Item, '/item/<string:name>')

# api.add_resource(TestCases, '/testCases')
api.add_resource(TestCase, '/test-case/<string:guid>')

# api.add_resource(TestSuites, '/testSuites')
# api.add_resource(TestSuite, '/testSuite/<string:id>')


if __name__ == '__main__':
    app.run(debug=True)  # important to mention debug=True