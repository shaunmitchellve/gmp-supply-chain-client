'use client'

import { useEffect, useState} from 'react';
import { APIProvider, Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { fetcher } from '@/app/lib/utils';
import useSWR from 'swr';
import { fetchTrips } from '@/app/lib/data/data';
import { ReturnTrips } from '@/app/lib/definitions';


export default function AdminMap({driver, date}: {driver: string, date: string}) {
    const mapProps = {
        location:{
            lat: 40.7785,
            lng: -101.6367
        },
        zoom: 5,
    }; 
    
    const { data: apiKey, isLoading: apiKeyLoading } = useSWR('/api?key=MAPS_API_KEY', fetcher, { keepPreviousData: true});
    const { data: mapId, isLoading: mapIdLoading } = useSWR('/api?key=MAPS_MAP_ID', fetcher, { keepPreviousData: true });

    if (apiKeyLoading || mapIdLoading) {
    return <></>;
    }

    return(
    <div className="flex w-full h-full z-0">
        {/* @ts-ignore */}
        <APIProvider apiKey={apiKey.key} v="beta" loading="async">
        <Map center={mapProps.location}
            zoom={mapProps.zoom}
            disableDefaultUI={true}
            mapId={mapId.key}
            keyboardShortcuts={false}>

            <DrawTrips driver={driver} date={date} />
        </Map>
        </APIProvider>
    </div>
    )
}

function DrawTrips({driver, date}: {driver: string, date: string}) {
    const map = useMap();
    const marker = useMapsLibrary('marker');
    const polyLineOptions =  {
        clickable: false,
        strokeOpacity: 1.0,
        strokeWeight: 4,
        zIndex: 2,
    };
    const polyLineColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];
    const [trips, setTrips] = useState<ReturnTrips[]>([]);
    let routes: google.maps.Polyline[] = [];
    let avm: google.maps.marker.AdvancedMarkerElement[] = [];
    let zoomL: google.maps.MapsEventListener[] = [];

    if (map === null) {
        return <></>
    }
    

    useEffect(() => {
        if (driver !== "" || date !== "") {
            fetchTrips(driver, date).then((data) => {
                setTrips(JSON.parse(data));
            })
        }
    }, [driver, date]);

    useEffect(() => {
        if (trips.length > 0 && marker !== null) {
            for (let trip of trips) {
                let path: google.maps.LatLngLiteral[] = [];
                let bounds = new google.maps.LatLngBounds();

                if (trip.route?.length > 0) {
                    console.log("TRIPS :", trip.route.length)
                    bounds.extend(new google.maps.LatLng(trip.startLocation.lat, trip.startLocation.lng));
                    bounds.extend(new google.maps.LatLng(trip.destination.lat, trip.destination.lng));
                    map.fitBounds(bounds);

                    let rlen = routes.push(new google.maps.Polyline(polyLineOptions)) - 1; // Subtract 1 becasue arrays are 0 indexed
                    routes[rlen].setOptions({ strokeColor: polyLineColors[rlen - 1]});
                    routes[rlen].setMap(map);

                    for (let leg of trip.route) {
                        path.push( { lat: leg.lat, lng: leg.lng } );
                        
                        let am = new marker.AdvancedMarkerElement({
                            content: buildAVPoint(leg.lat, leg.lng, trip.email),
                            position: { lat: leg.lat, lng: leg.lng },
                            zIndex: 100,
                            gmpClickable: true,
                        });

                        avm.push(am);

                    }
                    routes[rlen].setPath(path);
                }
            }
        }

        if (avm.length > 0) {
            zoomL.push(map.addListener('zoom_changed', () => {
                const zoom = map.getZoom();

                if (zoom) {
                    for (let am of avm) {
                        am.map = zoom > 14 ? map : null;
                    }
                }
            }));
        }

        return () => {
            for (let route of routes) {
                route.setMap(null);
            }
            
            for(let am of avm) {
                am.map = null;
            }

            for (let ev of zoomL) {
                ev.remove();
            }

            routes = [];
            avm = [];
            zoomL = [];
        }
    }, [trips.length]);

    return (
        <></>
    );
}

function buildAVPoint(lat: number, lng: number, email: string) {
    const markerElement = document.createElement('div');
    markerElement.className = 'has-tooltip'
    markerElement.innerHTML = `
        <span class="absolute -translate-y-20 text-xs tooltip rounded shadow-lg p-1 bg-gray-800 text-white">
                ${email}<br />
                ${lat}, ${lng}
         </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="red" class="w-5 h-5">
            <path fill-rule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clip-rule="evenodd" />
            </svg>`;

    return markerElement;
}