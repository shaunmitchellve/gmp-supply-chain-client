'use client'

import React from 'react';
import { APIProvider, Map} from '@vis.gl/react-google-maps';
import Spinner from '@/app/ui/spinner';

export default function CoreMap() {
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
    if(apiKey === undefined) {
        return <></>;
    }

    const [zoom, setZoom] = React.useState(5);
    const [location, setlocation] = React.useState({
        lat: 40.7785,
        lng: -101.6367
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            setlocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });

            setZoom(17);
            setLoading(false);
            console.log(location);
          }, (error) => {
            console.log("Error getting users position")
          }, {
            timeout: 5000,
            enableHighAccuracy: true,
          });
        }
      }, [zoom]);

    return(
        <APIProvider apiKey={apiKey}>
            <Map center={location} zoom={zoom} disableDefaultUI={true}>
                {loading &&
                    <Spinner size="10" fullScreen={true}>
                        <span className="inline-flex">Getting your percise location</span>
                    </Spinner>
                }
            </Map>
        </APIProvider>
    )
}