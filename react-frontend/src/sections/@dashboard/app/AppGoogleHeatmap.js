import React, { useState } from "react";
import GoogleMapReact from 'google-map-react';
import axios from 'axios'
import { Box, Button, Card, CardHeader, FormControl, Select, InputLabel, MenuItem, Stack} from '@mui/material';


const AnyReactComponent = ({ text }) => <div>{text}</div>;

const locationCoordinatesURL = "http://127.0.0.1:5000/api/location_coordinates"
const truckPathCoordinatesURL = "http://127.0.0.1:5000/api/truck_path_coordinates"
const tripCoordinatesURL = "http://127.0.0.1:5000/api/trip_coordinates"


export default function AppGoogleHeatmap() {
    const [heatMapData, setHeatMapData] = React.useState()
    const [coordinates, setCoordinates] = useState([])
    const [, forceUpdate] = React.useState()
    const [truckID, setTruckID] = useState(0)
    const [tripID, setTripId] = useState(0)
    const [tripsCount, setTripsCount] = useState(0)

    const TOTAL_TRUCKS = 69

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
        }}  
    };

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
        axios.get(`${truckPathCoordinatesURL}/${truckId}/${tripID}`).then((response => {
            setTripsCount(response.data.trips)
            setCoordinates([...response.data.coordinates])
        }))
    })

    const getTripCoordinates = React.useCallback((truckId, tripId) => {
        axios.get(`${truckPathCoordinatesURL}/${truckId}/${tripId}`).then((response => {
            setCoordinates([...response.data.coordinates])
        }))
    })



    const createDropDown = (itemsCount, firstElem) => {
        const numsList = [...Array(itemsCount).keys()]
        return numsList.map((item) => {
            if (item === 0) return <MenuItem value={item}>{firstElem}</MenuItem>
            return <MenuItem value={item}>{item}</MenuItem>
        })
    }


    const handleNewTruckSelected = (event) => {
        const newTruckId = event.target.value
        setTruckID(newTruckId)
        setTripId(0)
        if (newTruckId) getTruckPathCoordinates(newTruckId)
    }

    const handleNewTripSelected = (event) => {
        const newTripId = event.target.value
        setTripId(newTripId)
        if (truckID) getTripCoordinates(truckID, newTripId)
    }


    return (
        // Important! Always set the container height explicitly
        <Card>
            <CardHeader title={"Activity Heat Map"} />
            <div style={{ height: '100vh', width: '100%', }}>
                <div style={{ display: "flex", justifyContent: "left", alignItems: "left" }}>
                    <Stack sx={{p: 1}}spacing={1} direction="row">
                        <Button variant="outlined" onClick={() => getLocationCoordinates("shovel")}>Loading Locations</Button>
                        <Button variant="outlined" onClick={() => getLocationCoordinates("dump")}>Dumping Locations</Button>
                    </Stack>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-label">Truck ID</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            label="Truck ID"
                            id="demo-simple-select"
                            value={truckID}
                            defaultValue={0}
                            onChange={handleNewTruckSelected}
                            MenuProps={MenuProps}
                        >
                            {createDropDown(TOTAL_TRUCKS, "None")}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-label-2">Trip ID</InputLabel>
                        <Select
                            labelId="demo-simple-select-label-2"
                            label="Trip ID"
                            id="demo-simple-select"
                            value={tripID}
                            defaultValue={0}
                            onChange={handleNewTripSelected}
                            MenuProps={MenuProps}
                        >
                            {createDropDown(tripsCount, "All")}
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