import os
from flask import Flask, render_template, request, Response
from dotenv import load_dotenv
import json
from peewee import *
import datetime
from playhouse.shortcuts import model_to_dict

load_dotenv()
app = Flask(__name__)

if os.getenv("TESTING") == "true":
    print("Running in test mode")
    mydb = SqliteDatabase('file:memory?mode=memory&cache=shared', uri=True)
else:
    mydb = PostgresqlDatabase(
        'my_app', 
        user='postgres', 
        password='secret',
        host='10.1.0.9', 
        port=5432)

class Master(Model):
    timestamp = DateTimeField()
    gpsnorthing = DoubleField()
    gpseasting = DoubleField()
    gpselevation = DoubleField()
    fuel_rate = DoubleField()
    status = CharField()
    payload = DoubleField()
    truck_id = IntegerField()
    truck_type_id = IntegerField()
    shovel_id = IntegerField()
    dump_id = IntegerField()
    rnd = IntegerField()

    class Meta:
        database = mydb

mydb.connect()
mydb.create_tables([Master])



@app.route('/api/truck_status_count/<int:truck_id>', methods=['GET'])
def get_truck_status_count():
    status_count = [
        {
            "empty": 2 
        },
        {
            "hauling": 5 
        },
        {
            "waiting":6
        }
    ]

    return status_count

    

@app.route('/api/truck_ids', methods=['GET'])
def get_truck_ids():

    return [0, 1, 2, 3]
    
@app.route('/api')
def api_home():
    return "Hello, world!"

if __name__ == "__main__":
    app.run(port=5000)
