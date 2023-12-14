'use client'

import { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import {
  TruckIcon,
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Button from '@/app/ui/button';
import { StartDrivingProps } from '@/app/lib/definitions';
import { getArrivalTime } from '@/app/lib/utils';

export default function DrivingPage() {
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
  const mapId = process.env.NEXT_PUBLIC_MAP_ID;
  
  if(apiKey === undefined) {
      return <></>;
  }

  const searchParams = useSearchParams();
  const destination = searchParams.get("d");
  const rt = searchParams.get("r");
  const startingLocation = searchParams.get("sl");
  let sl = [];
  if (startingLocation) {
    sl = startingLocation.split(",");
  } else return <></>;

  if (!rt || ! destination) return <></>;

  const [ mapProps ] = useState({
      location:{
        lat: parseFloat(sl[0]),
        lng: parseFloat(sl[1]),
      },
      zoom: 18,
      tilt: 45,
  });
  const [ destinationProps, setDestinationProps ] = useState({
    arrivalTime: "",
    time: "",
    distance: "",
  });

  return(
        <div className="h-full">
        <APIProvider apiKey={apiKey}>
          <Map center={mapProps.location}
            zoom={mapProps.zoom}
            disableDefaultUI={true}
            mapId={mapId}
            tilt={mapProps.tilt}
            keyboardShortcuts={false}
            className={clsx({"h-[calc(100vh-65px)] md:h-[calc(100vh-100px)] shadow-lg z-10 shadow-gray-400/50": true})}>
              
               <StartDriving rtString={rt} stLocation={mapProps.location} destination={destination} updateDestinationProps={setDestinationProps} />
          </Map>
        </APIProvider>
        <Destination arrivalTime={destinationProps.arrivalTime} time={destinationProps.time} distance={destinationProps.distance} />
        </div>
  )
}

function CalcDrivingLeft(currentLocation:google.maps.LatLngLiteral, destination:string) {
  const routesLibrary = useMapsLibrary("routes");
  if (!routesLibrary) return null;

  const distanceMatrixService = new routesLibrary.DistanceMatrixService();
  return distanceMatrixService.getDistanceMatrix({
    origins: [currentLocation],
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
    drivingOptions: {
      trafficModel: google.maps.TrafficModel.BEST_GUESS,
      departureTime: new Date(),
    }
  });
}

function StartDriving({rtString, stLocation, destination, updateDestinationProps}: StartDrivingProps) {
  const map = useMap();
  const geometryLibrary = useMapsLibrary("geometry");
  const [location, setLocation] = useState(stLocation);
  const [index, setIndex] = useState(0);
  const useMock = (process.env.NEXT_PUBLIC_USE_MOCK === "true");
  let geoLocationID:number | undefined = undefined;
  const coords = [
    {lat:50.56510138416556, lng:-113.86084005021054},
    {lat:50.56516145545394, lng:-113.85919925074137},
    {lat:50.5650938752459, lng:-113.85760573657902},
    {lat:50.56510138416091, lng:-113.8561564425273},
    {lat:50.56586878912717, lng:-113.85614934974402},
  ];

  if (!map) {
    return <></>;
  }

  CalcDrivingLeft(location, destination)?.then((resp) => {
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
  })

  useEffect(() => {
    if (useMock) {
      // @ts-ignore
      geoLocationID = setInterval(() => {
        if (index > (coords.length-1)) {
          clearInterval(geoLocationID);
          
          return <></>;
        }
    
        const l = {
          lat: coords[index].lat,
          lng: coords[index].lng,
        };
    
        setLocation(l);
    
        setIndex(index + 1);
      }, 5000);
    } else {
      if (navigator.geolocation) {
        geoLocationID = navigator.geolocation.watchPosition((position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
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
  }, [location.lat]);

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

  const route = new google.maps.Polyline(polyLineOptions);
  route.setMap(map);
  route.setPath(polyLine);

  if (index >= 1) {
    map.setHeading(geometryLibrary.spherical.computeHeading(polyLine[(index-1)], polyLine[index]));
    map.panTo(location);
  } else {
    map.setHeading(geometryLibrary.spherical.computeHeading(polyLine[0], polyLine[1]));
    map.setCenter(polyLine[0]);
  }

  return (
    <AdvancedMarker position={location}>
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