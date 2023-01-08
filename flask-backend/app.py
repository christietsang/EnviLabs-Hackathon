import os
from flask import Flask, request
from dotenv import load_dotenv
import json
from peewee import *
import datetime
from playhouse.shortcuts import model_to_dict
import utm
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app)

if os.getenv("TESTING") == "true":
    print("Running in test mode")
    mydb = SqliteDatabase('file:memory?mode=memory&cache=shared', uri=True)
else:
    mydb = PostgresqlDatabase(
        'envilabs',
        user="postgres", 
        password=os.getenv("PASSWORD"),
        host=os.getenv("HOSTLINK"), 
        port=os.getenv("PORT"))

class Operations(Model):
    id = IntegerField()
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

class Trips(Model):
    trip_id = IntegerField()
    shovel_id = IntegerField()
    dump_id = IntegerField()
    truck_id = IntegerField()
    truck_type_id = IntegerField()
    avg_fuel = DoubleField()
    payload = DoubleField()
    start_time = DateTimeField()
    end_time = DateTimeField()
    start_gpsnorthing = DoubleField()
    end_gpsnorthing = DoubleField()
    start_gpseasting = DoubleField()
    end_gpseasting = DoubleField()
    start_gpselevation = DoubleField()
    end_gpselevation = DoubleField()

    class Meta:
        database = mydb


mydb.connect()

@app.route('/api/all_start_coordinates', methods=['GET'])
def get_all_start_coordinates():
    start_coordinates = []
    for trip in Trips:
        coordinates = utm.to_latlon(trip["easting"], trip["northing"], 1, "s")
        start_coordinates.append({"lat": coordinates[0], "lon": coordinates[1]})
    return start_coordinates

@app.route('/api/truck_status_count/<int:truck_id>', methods=['GET'])
def get_truck_status_count(truck_id):
    query = Operations\
            .select(Operations.status, fn.COUNT(Operations.status).alias('status_count'))\
            .where(Operations.truck_id == truck_id)\
            .group_by(Operations.status) 

    STATUS_TRANSLATE = {
        'Empty': "Empty",
        'Queue At LU': "Queuing(LU)",
        'Spot at LU': "Spotting",
        'Truck Loading': "Loading",
        'Hauling': "Hauling",
        'NON_PRODUCTIVE': "Non-Prod",
        'Queuing at Dump': "Queuing(Dump)",
        'Dumping': "Dumping"
    }

    row_count = sum([q.status_count for q in query if q.status != 'Wenco General Production'])

    data = []
    for q in query:
        if q.status != 'Wenco General Production':
            data.append({"status": STATUS_TRANSLATE[q.status], "value": q.status_count / row_count * 100})

    return {"data": data}


@app.route('/api/fuel_rate_by_truck_type', methods=['GET'])
def get_fuel_rate_by_truck_type():

    hauling_query = Operations\
        .select(Operations.truck_type_id, fn.AVG(Operations.fuel_rate).alias('avg_fuel_rate'))\
        .where(Operations.status == "Hauling", Operations.truck_type_id != 2, Operations.truck_type_id != 4)\
        .group_by(Operations.truck_type_id)
    
    non_hauling_query = Operations\
        .select(Operations.truck_type_id, fn.AVG(Operations.fuel_rate).alias('avg_fuel_rate'))\
        .where(Operations.status == "Hauling", Operations.truck_type_id != 2, Operations.truck_type_id != 4)\
        .group_by(Operations.truck_type_id)
 
    return {"data": {
            "hauling": [ {"truck_type": q.truck_type_id, "fuel_rate": q.avg_fuel_rate } for q in hauling_query],
            "non_hauling": [{"truck_type": q.truck_type_id, "fuel_rate": q.avg_fuel_rate } for q in non_hauling_query],
            }}
           

    
@app.route('/api/truck_ids', methods=['GET'])
def get_truck_ids():
    return [0, 1, 2, 3]


def make_prediction(PAYLOAD, TRUCK_ID, TRUCK_TYPE_ID, STATUS):
    status = {"STATUS_Dumping": 197.2934, "STATUS_Empty": 197.1431, "STATUS_Hauling": 200.2302,
              "STATUS_NON_PRODUCTIVE": 195.6164, "STATUS_Queue At LU": 195.9913, "STATUS_Queuing at Dump": 197.7622,
              "STATUS_Spot at LU": 196.4896, "STATUS_Truck Loading": 195.6117}
    print(PAYLOAD, TRUCK_ID, TRUCK_TYPE_ID, STATUS)
    result = (PAYLOAD * 0.0108) + (TRUCK_ID * 0.0177) + (TRUCK_TYPE_ID * 0.2083) + status.get("STATUS_"+STATUS)
    return result

@app.route('/api/predict_fuel_rate', methods=['POST'])
def predict_fuel_rate():
    data = request.get_json()
    PAYLOAD = float(data["payload"])
    TRUCK_ID = float(data["truck_id"])
    TRUCK_TYPE_ID = float(data["truck_type_id"])
    STATUS = data["status"]
    return { "predicted_fuel_rate": make_prediction(PAYLOAD, TRUCK_ID, TRUCK_TYPE_ID, STATUS) }

    
@app.route('/api')
def api_home():
    return "Hello, world!"

if __name__ == "__main__":
    app.run(port=5000)
