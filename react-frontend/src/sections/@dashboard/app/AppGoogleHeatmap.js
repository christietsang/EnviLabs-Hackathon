import React, { useState } from "react";
import GoogleMapReact from 'google-map-react';
import axios from 'axios'
import { Box, Button, Card, CardHeader, FormControl, Select, InputLabel, MenuItem } from '@mui/material';


const AnyReactComponent = ({ text }) => <div>{text}</div>;

const locationCoordinatesURL = "http://127.0.0.1:5000/api/location_coordinates"
const truckPathCoordinatesURL = "http://127.0.0.1:5000/api/truck_path_coordinates"
const tripCoordinatesURL = "http://127.0.0.1:5000/api/trip_coordinates"


export default function AppGoogleHeatmap() {
    const [heatMapData, setHeatMapData] = React.useState()
    const [coordinates, setCoordinates] = useState([])
    const [, forceUpdate] = React.useState()
    const [truckID, setTruckID] = useState(0)

    const defaultProps = {
        center: {
            lat: 0.5158022987615369,
            lng: -179.47394663515502
        },
        zoom: 11
    };

    const handleApiLoaded = (map, maps) => {
        // use map and maps objects
    };

    React.useEffect(() => {
        setHeatMapData({
            positions: coordinates,
            options: {
                radius: 20,
                opacity: 0.6,
            }
        })
    }, [coordinates]);


    const getLocationCoordinates = React.useCallback((location) => {
        axios.get(`${locationCoordinatesURL}/${location}`).then((response => {
            setCoordinates([...response.data.coordinates])
        }))
    })

    const getTruckPathCoordinates = React.useCallback((truckId) => {
        axios.get(`${truckPathCoordinatesURL}/${truckId}`).then((response => {
            setCoordinates([...response.data.coordinates])
        }))
    })

    const getTripCoordinates = React.useCallback((tripId) => {
        axios.get(`${tripCoordinatesURL}/${tripId}`).then((response => {
            setCoordinates([...response.data.coordinates])
        }))
    })



    const createDropDown = () => {
        const numsList = [...Array(69).keys()]
        return numsList.map((item) => {
            if (item === 0) return <MenuItem value={item}>All</MenuItem>
            return <MenuItem value={item}>{item}</MenuItem>
        })
    }

    const handleChange = (event) => {
        const newTruckId = event.target.value
        setTruckID(newTruckId)
        getTruckPathCoordinates(newTruckId)
    }


    return (
        // Important! Always set the container height explicitly
        <Card>
            <CardHeader title={"Activity Heat Map"} />
            <div style={{ height: '100vh', width: '100%', }}>
                <div style={{ display: "flex", justifyContent: "left", alignItems: "left" }}>
                    <Button variant="outlined" onClick={() => getLocationCoordinates("shovel")}>Loading Locations</Button>
                    <Button variant="outlined" onClick={() => getLocationCoordinates("dump")}>Dumping Locations</Button>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-label">Truck Paths</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            label="Truck Activity"
                            id="demo-simple-select"
                            value={truckID}
                            defaultValue={0}
                            onChange={handleChange}
                        >
                            {createDropDown()}
                        </Select>
                    </FormControl>
                </div>

                {/* <button onClick={() => console.log(heatMapData)}>Test</button> */}
                <GoogleMapReact

                    bootstrapURLKeys={{ key: "AIzaSyDtiniFzSPG3U0MIc0UgeSNgVPIFLa3If4" }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                    heatmapLibrary
                    heatmap={heatMapData}
                // onClick={this.onMapClick.bind(this)}
                >
                    {/* <AnyReactComponent
                    lat={59.955413}
                    lng={30.337844}
                    text="My Marker"
                /> */}
                </GoogleMapReact>
            </div>
        </Card>
    );
}