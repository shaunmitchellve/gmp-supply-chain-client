'use client';

import React from 'react';
import {useMapsLibrary} from '@vis.gl/react-google-maps';
import Button from '@/app/ui/button';
import clsx from 'clsx';
import {DestinationProps} from '../../lib/definitions';

export default function DestinationCard({
  className,
  setDestination,
}: DestinationProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const autoComplete = React.useRef<google.maps.places.Autocomplete | null>(
    null
  );
  const routesLibrary = useMapsLibrary('places');
  let address = '';

  React.useEffect(() => {
    if (routesLibrary && !autoComplete.current) {
      if (inputRef.current) {
        autoComplete.current = new routesLibrary.Autocomplete(
          inputRef.current
        );

        autoComplete.current.addListener('place_changed', () => {
          if (autoComplete.current !== null) {
            const place = autoComplete.current.getPlace();

            if (!place.geometry || !place.geometry?.location) {
              console.log('No places available for: ', place.name);
              return;
            }

            if (place.address_components) {
              const newAddress = fullAddress(place.address_components);

              const buttonRef = document.getElementById('go-button');

              buttonRef?.addEventListener(
                'click',
                () => {
                  setDestination(newAddress);
                },
                {once: true}
              );
            }
          }
        });
      }
    }
  }, [routesLibrary, address, setDestination]);

  if (className !== undefined) {
    className += ' ';
  }

  return (
    <div
      className={clsx(
        'relative p-4 border bg-white border-gray-200 sm:p-6 md:p-8 shadow-inner',
        className
      )}
    >
      <div className="relative w-full flex justify-center">
        <div className="relative w-full md:w-1/4">
          <input
            type="text"
            name="destination"
            id="destination"
            ref={inputRef}
            placeholder=" "
            autoFocus
            className="block m-0 px-2.5 pb-2.5 pt-4 w-full text-md text-gray-700 bg-slate-100 rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer"
          />
          <label
            htmlFor="destination"
            className="absolute text-md text-gray-600 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] start-1 bg-slate-100 px-2 peer-focus:px-2 peer-focus:text-red-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Where to?
          </label>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <Button type="button" className="mt-4 w-1/2 md:w-1/3" id="go-button">
          Go
        </Button>
      </div>
    </div>
  );
}

function fullAddress(
  addressComponents: google.maps.GeocoderAddressComponent[]
) {
  let address = '';

  if (addressComponents) {
    address = [
      (addressComponents[0] && addressComponents[0].short_name) || '',
      (addressComponents[1] && addressComponents[1].short_name) || '',
      (addressComponents[2] && addressComponents[2].short_name) || '',
    ].join(' ');
  }

  return address;
}
