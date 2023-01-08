import os
from flask import Flask
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
        user=os.getenv("USERNAME"), 
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
    shovel_id = IntegerField()
    dump_id = IntegerField()
    truck_id = IntegerField()
    truck_type_id = IntegerField()
    avg_fuel = FloatField()
    payload = FloatField()
    start_time = DateTimeField()
    end_time = DateTimeField()
    start_gpsnorthing = FloatField()
    end_gpsnorthing = FloatField()
    start_gpseasting = FloatField()
    end_gpseasting = FloatField()
    start_gpselevation = FloatField()
    end_gpselevation = FloatField()
    trip_id = IntegerField(primary_key=True)
    

    class Meta:
        database = mydb


mydb.connect()

@app.route('/api/location_coordinates/<string:location>', methods=['GET'])
def get_location_coordinates(location):
    
    if location == "shovel":
        query = mydb.execute_sql('select start_gpseasting, start_gpsnorthing from trips;')
                
    else:
        query = mydb.execute_sql('select end_gpseasting, end_gpsnorthing from trips;')
    
    coordinates = []
    for q in query:
        easting = q[0]
        northing = q[1]
        if 100_000 < easting < 999_999 and 0 < northing < 10_000_000:
            this_coordinates = utm.to_latlon(q[0], q[1], 1, "s")
            coordinates.append({"lat": this_coordinates[0], "lng": this_coordinates[1]})
    return { "coordinates": coordinates }

@app.route('/api/truck_path_coordinates/<int:truck_id>', methods=['GET'])
def get_truck_path_coordinates(truck_id):
    
    if truck_id == "0":
        query = mydb.execute_sql('select gpseasting, gpsnorthing from trip_path_locations;')
                
    else:
        query = mydb.execute_sql(f'SELECT gpseasting, gpsnorthing FROM trip_path_locations WHERE truck_id={truck_id};')
    
    coordinates = []
    for q in query:
        easting = q[0]
        northing = q[1]
        if 100_000 < easting < 999_999 and 0 < northing < 10_000_000:
            this_coordinates = utm.to_latlon(q[0], q[1], 1, "s")
            coordinates.append({"lat": this_coordinates[0], "lng": this_coordinates[1]})
    return { "coordinates": coordinates }

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
