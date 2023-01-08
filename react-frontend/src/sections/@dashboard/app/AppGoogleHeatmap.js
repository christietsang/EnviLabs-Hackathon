import React from "react";
import GoogleMapReact from 'google-map-react';
import axios from 'axios'


const AnyReactComponent = ({ text }) => <div>{text}</div>;

const baseURL = "http://127.0.0.1:5000/api/location_coordinates"


export default function AppGoogleHeatmap() {
    const { coordinates, setCoordinates } = React.useState([])
    const defaultProps = {
        center: {
            lat: 10.99835602,
            lng: 77.01502627
        },
        zoom: 11
    };

    const handleApiLoaded = (map, maps) => {
        // use map and maps objects
    };

    const handleClick = () => {
        axios.get(baseURL.concat("/shovel")).then((response => {
            console.log(response.data)
            // setCoordinates(response.data)
        }))
    }

    // React.useEffect(() => {
    //     axios.get(baseURL).then((response => {
    //       console.log(response.data)
    //     //   setPost(response.data);
    //     }))
    //   }, []);


    const heatMapData = {
        positions: coordinates,
        options: {
            radius: 20,
            opacity: 0.6,
        }
    }

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            <button onClick={handleClick}>Help</button>
            {/* <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyASJBZug5wjbg1zVC1Tmwl8_EhQfT-3HlA" }}
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
            </GoogleMapReact> */}
        </div>
    );
}