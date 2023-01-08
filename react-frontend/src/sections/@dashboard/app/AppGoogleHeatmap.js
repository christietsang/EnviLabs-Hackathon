import React from "react";
import GoogleMapReact from 'google-map-react';
import axios from 'axios'


const AnyReactComponent = ({ text }) => <div>{text}</div>;

const baseURL = "http://127.0.0.1:5000/api/location_coordinates"


export default function AppGoogleHeatmap() {
    const [heatMapData, setHeatMapData] = React.useState()
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

    const getLocationCoordinates = (location) => {
        axios.get(`${baseURL}/${location}`).then((response => {
            console.log(response.data)
            setHeatMapData({
                positions: response.data.coordinates,
                options: {
                    radius: 20,
                    opacity: 0.6,
                }
            })

        }))
    }


    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            <button onClick={() => getLocationCoordinates("shovel")}>Loading Locations</button>
            <button onClick={() => getLocationCoordinates("dump")}>Dumping Locations</button>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyDtiniFzSPG3U0MIc0UgeSNgVPIFLa3If4" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                heatmapLibrary
                heatmap={heatMapData}
            // onClick={this.onMapClick.bind(this)}
            >
                <AnyReactComponent
                    lat={59.955413}
                    lng={30.337844}
                    text="My Marker"
                />
            </GoogleMapReact>
        </div>
    );
}