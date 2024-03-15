'use client'

import { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import {
  TruckIcon,
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Button from '@/app/ui/button';
import { StartDrivingProps } from '@/app/lib/definitions';
import { getArrivalTime, fetcher } from '@/app/lib/utils';import useSWR from 'swr';
import { getMockData } from '@/app/lib/actions';
import { saveLocation } from '@/app/lib/utils';
import { v4 as uuidv4 } from 'uuid';

export default function DrivingPage() {
  const { data: apiKey, isLoading: apiKeyLoading } = useSWR('/api?key=MAPS_API_KEY', fetcher, { keepPreviousData: true});
  const { data: mapId, isLoading: mapIdLoading } = useSWR('/api?key=MAPS_MAP_ID', fetcher, { keepPreviousData: true });

  const searchParams = useSearchParams();
  const destination = searchParams.get("d");
  const rt = searchParams.get("r");
  const startingLocation = searchParams.get("sl");
  let sl = [];
  const [ destinationProps, setDestinationProps ] = useState({
    arrivalTime: "",
    time: "",
    distance: "",
  });

  if (startingLocation) {
    sl = startingLocation.split(",");
  } else return <></>;

  if (!rt || ! destination) {
    return <></>;
  }

  if (apiKeyLoading || mapIdLoading) {
    return <></>;
  }

  const location = {
    lat: parseFloat(sl[0]),
    lng: parseFloat(sl[1]),
  };
  
  return(
        <div className="h-full">
        <APIProvider apiKey={apiKey.key}>
          <Map center={location}
            zoom={18}
            disableDefaultUI={true}
            mapId={mapId.key}
            tilt={45}
            keyboardShortcuts={false}
            className={clsx({"h-[calc(100vh-65px)] md:h-[calc(100vh-100px)] shadow-lg z-10 shadow-gray-400/50": true})}>
              
               <StartDriving rtString={rt} stLocation={location} destination={destination} updateDestinationProps={setDestinationProps} />
          </Map>
        </APIProvider>
        <Destination arrivalTime={destinationProps.arrivalTime} time={destinationProps.time} distance={destinationProps.distance} />
        </div>
  )
}

function StartDriving({rtString, stLocation, destination, updateDestinationProps}: StartDrivingProps) {
  const map = useMap();
  const geometryLibrary = useMapsLibrary("geometry");
  const routesLibrary = useMapsLibrary("routes");
  const geocodingLibrary = useMapsLibrary("geocoding");
  const overLayLibrary = useMapsLibrary("maps");
  const [location, setLocation] = useState({
    "current": stLocation,
    "last": stLocation,
  });
  const [index, setIndex] = useState(0);
  const useMock = (process.env.NEXT_PUBLIC_USE_MOCK === "true");
  let geoLocationID:number | undefined = undefined;
  const tripId = useRef<string | null>(null);
  const destinationCoords = useRef<google.maps.LatLngLiteral | null>(null);
  const placeId = useRef<string | null>(null);

  if (tripId.current === null) {
    tripId.current = uuidv4();
  }

  useEffect(() => {
    if (!geocodingLibrary) return;

    const geocoder = new geocodingLibrary.Geocoder();
    geocoder.geocode({address: destination}).then((res) => {
      if (res.results.length <= 0) return;

      const results = res.results[0];

      destinationCoords.current = {
        lat: results.geometry.location.lat(),
        lng: results.geometry.location.lng(),
      };

      if (results.place_id !== "" && results.place_id !== null) {
        placeId.current = results.place_id;
      }
    });
  }, [geocodingLibrary, destination])

  useEffect(() => {
    if (!routesLibrary) return;

    const distanceMatrixService = new routesLibrary.DistanceMatrixService();
    distanceMatrixService.getDistanceMatrix({
      origins: [location.current],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        trafficModel: google.maps.TrafficModel.BEST_GUESS,
        departureTime: new Date(),
      }
    }).then((resp) => {
      const row = resp.rows[0].elements[0];
      if(row.status === "OK") {
        updateDestinationProps(
          {
            arrivalTime: getArrivalTime(new Date(), row.duration_in_traffic.value),
            time: row.duration_in_traffic.text,
            distance: row.distance.text,
          }
        );
      }
    });
  }, [routesLibrary, location.current.lat]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (useMock) {
      getMockData().then(coords=> {
        // @ts-ignore
        geoLocationID = setInterval(() => { // eslint-disable-line react-hooks/exhaustive-deps
          if (index > (coords.length-1)) {
            clearInterval(geoLocationID);
            
            return <></>;
          }
      
          const l = {
            lat: coords[index].lat,
            lng: coords[index].lng,
          };

          if (tripId.current !== null && destinationCoords.current !== null && placeId.current !== null) {
            saveLocation(l, destinationCoords.current, stLocation, tripId.current, placeId.current);
          }

          setLocation({"last": location.current, "current": l});
      
          setIndex(index + 1);
        }, 5000);
      });
    } else {
      if (navigator.geolocation) {
        geoLocationID = navigator.geolocation.watchPosition((position) => {
          setLocation({"last": location.current, "current": {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }});

          setIndex(index + 1);
        }, (error) => {
          console.log("Unable to watch position");
          if (!useMock && typeof geoLocationID !== "undefined") {
            navigator.geolocation.clearWatch(geoLocationID);
          }
        },{
          timeout: 5000,
          enableHighAccuracy: true,
          maximumAge: 3 * 60 * 1000,
        })
      }
    }

    return () => {
      if (!useMock && typeof geoLocationID !== "undefined") {
        navigator.geolocation.clearWatch(geoLocationID);
      } else {
        clearInterval(geoLocationID);
      }
    }
  }, [index]);

  let polyLine:google.maps.LatLng[];
  const polyLineOptions =  {
    strokeColor: "red",
    clickable: false,
    strokeOpacity: 1.0,
    strokeWeight: 4,
    zIndex: 2,
  };

  if (geometryLibrary) {
    polyLine = geometryLibrary.encoding.decodePath(rtString);
  } else {
    return <></>;
  }

  if (!map) return <></>

  const route = new google.maps.Polyline(polyLineOptions);
  route.setMap(map);
  route.setPath(polyLine);

  if (index >= 1) {
    /**
     * Attempting to use a "shadow" or "fake" location to pan the map to in order to keep the advance marker icon
     * at the bottom of the visible map bounds. This isnt working at the moment.
     */
    // const southWest = new google.maps.LatLng(map.getBounds()?.getSouthWest().lat()!, location.current.lng);
    // const distance = geometryLibrary.spherical.computeDistanceBetween(location.current, southWest);
    const heading = geometryLibrary.spherical.computeHeading(location.last, location.current);
    // const shadow = geometryLibrary.spherical.computeOffset(location.current, distance, heading);
    map.setHeading(heading);
    map.panTo(location.current);
  } else {
    map.setHeading(geometryLibrary.spherical.computeHeading(polyLine[0], polyLine[1]));
    map.setCenter(polyLine[0]);
  }

  return (
    <AdvancedMarker position={location.current}>
      <TruckIcon className="flex h-8 text-red-600"/>
   </AdvancedMarker>
   )
}

function Destination({className, arrivalTime, time, distance}: {className?: string; arrivalTime: string; time: string; distance: string;}) {
  return (
    <div className={clsx(
      "relative p-2 bg-white border border-gray-200 sm:p-6 md:p-8 flex flex-row",
      className
  )}>
      <div><Link href={"/"}><Button type="button" className="w-25">Stop</Button></Link></div>
      <div className="grow">
          <h1 className="text-xl text-center">{arrivalTime}</h1>
          <h1 className="text-base text-center">{time} | {distance}</h1>
      </div>
  </div>
  )
}