import os
from flask import Flask
from dotenv import load_dotenv
import json
from peewee import *
import datetime
from playhouse.shortcuts import model_to_dict
import utm

load_dotenv()
app = Flask(__name__)

if os.getenv("TESTING") == "true":
    print("Running in test mode")
    mydb = SqliteDatabase('file:memory?mode=memory&cache=shared', uri=True)
else:
    mydb = PostgresqlDatabase(
        'envilabs', 
        user='postgres', 
        password='postgres',
        host='localhost', 
        port=15432)

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
        'Queue At LU': "Queuing (LU)",
        'Spot at LU': "Spotting",
        'Truck Loading': "Loading",
        'Hauling': "Hauling",
        'NON_PRODUCTIVE': "Non-Productive",
        'Queuing at Dump': "Queuing (Dump)",
        'Dumping': "Dumping"
    }

    row_count = sum([q.status_count for q in query if q.status != 'Wenco General Production'])

    data = []
    for q in query:
        if q.status != 'Wenco General Production':
            data.append({"status": STATUS_TRANSLATE[q.status], "value": q.status_count / row_count * 100})

    return {"data": data}

    
@app.route('/api/truck_ids', methods=['GET'])
def get_truck_ids():
    return [0, 1, 2, 3]
    
@app.route('/api')
def api_home():
    return "Hello, world!"

if __name__ == "__main__":
    app.run(port=5000)
