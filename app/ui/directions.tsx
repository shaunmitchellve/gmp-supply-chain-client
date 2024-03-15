'use client'

import React from 'react';
import {
  useMapsLibrary,
  useMap,
} from '@vis.gl/react-google-maps';
import clsx from 'clsx';
import { DirectionsProps } from '@/app/lib/definitions';
import Button from '@/app/ui/button';
import Link from 'next/link';
import { getArrivalTime } from '@/app/lib/utils';

export default function Directions({
        currentLocation,
        dest,
        className,
        setDestination,
    }: DirectionsProps ) {

    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = React.useState<google.maps.DirectionsService>();
    const [routes, setRoutes] = React.useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, setRouteIndex] = React.useState(0);
    const [polyLines] = React.useState<google.maps.Polyline[]>([]);
    const depatureTime = new Date();
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    // Once routesLibrary useEffect fires, a re-render triggers and routesLibrary will be set
    React.useEffect(() => {
        if(!routesLibrary || !map ) return;
        
        setDirectionsService(new routesLibrary.DirectionsService());
    }, [routesLibrary, map]);

    // Once the above useEffect fires then directionsService will be set
    // Get the routes for the destination and the users current location
    React.useEffect(() => {
        if (!directionsService || !routesLibrary || !map) return;
        let clickIds:google.maps.MapsEventListener[] = [];

        directionsService.route({
            origin: currentLocation,
            destination: dest,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: false,
            drivingOptions: {
                departureTime: depatureTime,
                trafficModel: google.maps.TrafficModel.BEST_GUESS,
            }
        }).then(response => {
            for(let i = 0; i < response.routes.length; i++) {
                const polyLine = new google.maps.Polyline(polyLineOptions(i, routeIndex));
                polyLine.setMap(map);
                polyLine.setPath(response.routes[i].overview_path);

                clickIds.push(google.maps.event.addListener(polyLine, 'click', (e:google.maps.MapMouseEvent) =>{
                    setRouteIndex(i);
                }));

                polyLines.push(polyLine);
            };

            setRoutes(response.routes);
            map.fitBounds(response.routes[0].bounds);
        });

        // Clean up the polylines and remote the onclick listeners
        return () => {
            clickIds.forEach((click) => {
                google.maps.event.removeListener(click);
            });

            polyLines.forEach((polyLine) => {
                polyLine.setMap(null);
            });
        }
    }, [directionsService]); // eslint-disable-line react-hooks/exhaustive-deps

    if (polyLines.length > 0) {
        for(let i = 0; i < polyLines.length; i++) {
            polyLines[i].setOptions(polyLineOptions(i, routeIndex));
        }
    }

    if (!leg) return;

   const arrivalTime = getArrivalTime(depatureTime, leg.duration_in_traffic?.value);

    return (
        <>
            <div className={clsx(
                "relative p-2 bg-white border border-gray-200 sm:p-6 md:p-8 flex flex-row",
                className
            )}>
                <div><Link href={"/driving?" + createQueryString([
                    {
                        "name": "d",
                        "value": dest,
                    },
                    {
                        "name": "sl",
                        "value": leg.start_location.lat().toString() + "," + leg.start_location.lng().toString(),
                    },
                    {
                        "name": "r",
                        "value": routes[routeIndex].overview_polyline,
                    },])}><Button type="button" className="w-25">Start</Button></Link></div>
                <div className="grow">
                    <h1 className="text-xl text-center">{arrivalTime}</h1>
                    <h1 className="text-base text-center">{leg.duration_in_traffic?.text} | {leg.distance?.text}</h1>
                </div>
            </div>
        </>
    );
}

// Setup the polyline options, depending of what the active route is the display will change
function polyLineOptions(index:number, routeIndex:number) {
    return {
        strokeColor: (index === routeIndex)? "red" : "gray",
        clickable: true,
        strokeOpacity: (index === routeIndex)? 1.0 : 0.7,
        strokeWeight: 4,
        zIndex: (index === routeIndex)? 2 : 1,
    };
}

interface queryString {
    name: string;
    value: string;
};

function createQueryString(qs: queryString[]){
    const params = new URLSearchParams();

    qs.forEach(kvp => {
        if (kvp.name !== "" && kvp.value != "") {
            params.set(kvp.name, kvp.value);
        }
    });

    return params.toString();
}