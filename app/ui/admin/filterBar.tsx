// import {Client} from 'undici';
import {DriverFilter, DateFilter} from '@/app/ui/admin/filters';
import {FormInputsSkeleton, TripsSkeleton} from '@/app/ui/admin/skeletons';
import {Suspense} from 'react';
import {fetchDrivers, fetchTrips} from '@/app/lib/data/data';
import {ReturnTrips} from '@/app/lib/definitions';
import {getSecret} from '@/app/lib/secrets-manager';
import ViewMap from '@/app/ui/admin/viewMap';
import clsx from 'clsx';

export default async function FilterBar({
  driver,
  date,
  tripId,
}: {
  driver: string;
  date: string;
  tripId: string | null;
}) {
  const drivers = await fetchDrivers();
  let trips: ReturnTrips[] = [];

  if (driver || date) {
    trips = JSON.parse(await fetchTrips(driver, date));
  }

  return (
    <section className="flex flex-col w-content h-full w-[460px] ml-[48px] pt-5 bg-gray-100 shadow-[rgba(0,0,15,0.5)_2px_0px_10px_0px] z-10 overflow-scroll overflow-x-hidden">
      <div className="flex place-content-center mb-5 bg-white w-full">
        <h1 className="text-2xl font-bold align-middle">Filters</h1>
      </div>
      <div className="flex flex-col pl-2 pr-2">
        <div className="flex flex-col mb-5">
          <Suspense fallback={<FormInputsSkeleton />}>
            <DateFilter />
          </Suspense>
        </div>
        <div className="flex flex-col mb-5">
          <Suspense fallback={<FormInputsSkeleton />}>
            <DriverFilter drivers={drivers} />
          </Suspense>
        </div>
        <hr className="w-48 h-1 mx-auto bg-gray-500 border-0 rounded my-4" />
        <div className="flex flex-col">
          <Suspense fallback={<TripsSkeleton key={JSON.stringify(trips)} />}>
            <ShowTrips trips={trips} tripId={tripId} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

async function ShowTrips({
  trips,
  tripId,
}: {
  trips: ReturnTrips[];
  tripId: string | null;
}) {
  if (Object.keys(trips).length === 0) {
    return <p className="text-center">No trips found</p>;
  }

  const apiKey = await getSecret('MAPS_API_KEY');
  const len = trips.length;
  const tripsList = [];

  for (let i = 0; i < len; i++) {
    const startLocation = await getAddress(
      trips[i].startLocation.lat,
      trips[i].startLocation.lng,
      apiKey
    );
    const endLocation = await getAddress(
      trips[i].destination.lat,
      trips[i].destination.lng,
      apiKey
    );

    tripsList.push(
      <div
        className={clsx({
          'bg-white': tripId !== trips[i].id,
          'bg-gray-300': tripId === trips[i].id,
          'max-w-md mx-auto text-xs rounded-xl shadow-md overflow-hidden m-1':
            true,
        })}
      >
        <div className="p-4">
          <div className="uppercase tracking-wide text-indigo-500 font-semibold">
            {trips[i].email}
          </div>
          <div className="mt-2 text-gray-500">
            <p className="font-semibold">Starting Location:</p>
            {startLocation}
          </div>
          <div className="mt-2 text-gray-500">
            <p className="font-semibold">Destination:</p>
            {endLocation}
          </div>
          <ViewMap id={trips[i].id} />
        </div>
      </div>
    );
  }

  return tripsList;
}

async function getAddress(lat: number, lng: number, apiKey: string) {
  return lat.toString() + ', ' + lng.toString();

  // This works but slows down the return if there are a large amount of trips
  // @todo - Need to determine away to speed this up

  // const client = new Client('https://maps.googleapis.com');

  // try {
  //   const {statusCode, body} = await client.request({
  //     method: 'GET',
  //     path: `/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&result_type=street_address`,
  //   });

  //   if (statusCode !== 200) {
  //     return lat.toString() + ', ' + lng.toString();
  //   }

  //   const response = (await body.json()) as GeoCodingResponse;
  //   client.close();
  //   return response.results[0].formatted_address;
  // } catch (err) {
  //   console.log('Reverese Geocoding Error: ', err);
  //   client.close();
  //   return lat.toString() + ', ' + lng.toString();
  // }
}
