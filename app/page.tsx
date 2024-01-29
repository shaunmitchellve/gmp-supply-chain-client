'use client'

import { useEffect, useState} from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import Spinner from '@/app/ui/spinner';
import {
  TruckIcon,
} from '@heroicons/react/24/solid';
import Directions from '@/app/ui/directions';
import Destination from '@/app/ui/destination';
import clsx from 'clsx';
import ClientNav from '@/app/ui/clientNav';
import { fetcher } from '@/app/lib/utils';
import useSWR from 'swr';

export default function Home() {
  const [mapProps, setMapProps] = useState({
    location:{
      lat: 40.7785,
      lng: -101.6367
    },
    zoom: 5,
  });
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState(null);

  const { data: apiKey, isLoading: apiKeyLoading } = useSWR('/api?key=MAPS_API_KEY', fetcher, { keepPreviousData: true});
  const { data: mapId, isLoading: mapIdLoading } = useSWR('/api?key=MAPS_MAP_ID', fetcher, { keepPreviousData: true });

  useEffect(() => {
    if(navigator.geolocation && loading) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMapProps({...mapProps,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          zoom: 17,
        });

        setLoading(false);
      }, (error) => {
        console.log("Error getting users position")
      }, {
        timeout: 5000,
        enableHighAccuracy: true,
      });
    }
  }, [mapProps.location.lat]);

  if (apiKeyLoading || mapIdLoading) {
    return <></>;
  }

  return(
    <div className="h-full">
      <APIProvider apiKey={apiKey.key}>
        <Map center={mapProps.location}
          zoom={mapProps.zoom}
          disableDefaultUI={true}
          mapId={mapId.key}
          keyboardShortcuts={false}
          className={clsx({"h-[calc(70vh)] md:h-[calc(70vh)]":!loading&&!destination,
            "h-full":loading,
            "h-[calc(100vh-65px)] md:h-[calc(100vh-100px)]":!loading&&destination, "shadow-lg z-10 shadow-gray-400/50": true})}>
            {loading &&
                <Spinner size="20" fullScreen={true}>
                    <span className="inline-flex">Getting your percise location</span>
                </Spinner>
            }
            {(!destination && !loading) &&
              <AdvancedMarker position={mapProps.location}>
                <TruckIcon className="flex h-8 text-red-600"/>
              </AdvancedMarker>
            }
        </Map>

        {(!destination && !loading) &&
          <>
            <Destination className="w-full h-full" setDestination={setDestination} /> &&
            <ClientNav className="absolute top-4 left-4 z-10" />
          </>
        }
        {destination && !loading &&
          <>
            <Directions className="w-full h-full" currentLocation={mapProps.location} dest={destination} setDestination={setDestination}/>
            <ClientNav className="absolute top-4 left-4 z-10" setDestination={setDestination} />
          </>
        }
      </APIProvider>
    </div>
  )
}