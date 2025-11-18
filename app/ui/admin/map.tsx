'use client';

import {useEffect, useState, useRef} from 'react';
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from '@vis.gl/react-google-maps';
import {fetcher} from '@/app/lib/utils';
import useSWR from 'swr';
import {fetchTrip} from '@/app/lib/data/data';
import {Legs} from '@/app/lib/definitions';

export default function AdminMap({tripId}: {tripId: string}) {
  const mapProps = {
    location: {
      lat: 40.7785,
      lng: -101.6367,
    },
    zoom: 5,
  };

  const {data: apiKey, isLoading: apiKeyLoading} = useSWR(
    '/api?key=MAPS_API_KEY',
    fetcher,
    {
      keepPreviousData: true,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    }
  );
  const {data: mapId, isLoading: mapIdLoading} = useSWR(
    '/api?key=MAPS_MAP_ID',
    fetcher,
    {
      keepPreviousData: true,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
    }
  );

  if (apiKeyLoading || mapIdLoading) {
    return <></>;
  }

  return (
    <div className="flex w-full h-full z-0">
      <APIProvider apiKey={apiKey.key} version="beta">
        <Map
          center={mapProps.location}
          zoom={mapProps.zoom}
          disableDefaultUI={true}
          mapId={mapId.key}
          keyboardShortcuts={false}
        >
          <DrawTrips routeId={tripId} />
        </Map>
      </APIProvider>
    </div>
  );
}

function DrawTrips({routeId}: {routeId: string}) {
  const map = useMap();
  const marker = useMapsLibrary('marker');
  const [legs, setLegs] = useState<Legs[]>([]);
  const avm = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const zoomL = useRef<google.maps.MapsEventListener | null>(null);

  useEffect(() => {
    if (routeId) {
      fetchTrip(routeId).then(data => setLegs(JSON.parse(data)));
    }
  }, [routeId]);

  useEffect(() => {
    if (!map || !marker || legs.length === 0) return;

    const polyLineOptions = {
      clickable: false,
      strokeOpacity: 1.0,
      strokeWeight: 4,
      strokeColor: 'red',
      zIndex: 2,
    };

    const path: google.maps.LatLngLiteral[] = [];
    const bounds = new google.maps.LatLngBounds();

    if (legs.length > 0) {
      for (const leg of legs) {
        bounds.extend(new google.maps.LatLng(leg.lat, leg.lng));
        bounds.extend(new google.maps.LatLng(leg.lat, leg.lng));

        path.push({lat: leg.lat, lng: leg.lng});

        const am = new marker.AdvancedMarkerElement({
          content: buildAVPoint(leg.lat, leg.lng),
          position: {lat: leg.lat, lng: leg.lng},
          zIndex: 100,
          gmpClickable: true,
        });

        avm.current.push(am);
      }
    }

    const route = new google.maps.Polyline(polyLineOptions);
    route.setPath(path);
    route.setMap(map);

    if (avm.current.length > 0) {
      zoomL.current = map.addListener('zoom_changed', () => {
        const zoom = map.getZoom();

        if (zoom) {
          for (const am of avm.current) {
            am.map = zoom > 14 ? map : null;
          }
        }
      });
    }

    map.fitBounds(bounds);

    return () => {
      for (const am of avm.current) {
        am.map = null;
      }

      if (zoomL.current) {
        zoomL.current.remove();
      }

      avm.current = [];
    };
  }, [legs, map, marker]);

  return <></>;
}

function buildAVPoint(lat: number, lng: number) {
  const markerElement = document.createElement('div');
  markerElement.className = 'has-tooltip';
  markerElement.innerHTML = `
        <span class="absolute -translate-y-20 text-xs tooltip rounded shadow-lg p-1 bg-gray-800 text-white">
                ${lat}, ${lng}
         </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="red" class="w-5 h-5">
            <path fill-rule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clip-rule="evenodd" />
            </svg>`;

  return markerElement;
}
