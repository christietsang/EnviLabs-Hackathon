import React from "react";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function AppGoogleHeatmap() {
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


    const heatMapData = {
        positions: [
            { lat: 55.5, lng: 34.56 },
            { lat: 34.7, lng: 28.4 },
        ],
        options: {
            radius: 20,
            opacity: 0.6,
        }
    }

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyASHOoCtcStfe12aW1DfibR4jr-cH6ZeMQ" }}
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