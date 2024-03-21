'use client';
import {useSearchParams, usePathname, useRouter} from 'next/navigation';
import {currentDate} from '@/app/lib/utils';

const inputCss = `block border-0 rounded-md py-1.5 pl-2 text-gray-700 ring-1 ring-inset
ring-gray-300 focus:ring-2 focus:ring-red-600 focus:ring-inset focus:outline-none w-fit`;

export function DriverFilter({drivers}: {drivers: string[]}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {replace} = useRouter();

  function handleDriverChange(driver: string) {
    const params = removeTripId(new URLSearchParams(searchParams));

    if (driver) {
      params.set('driver', driver);
    } else {
      params.delete('driver');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  let selectedDriver = searchParams.get('driver');

  if (!selectedDriver) {
    selectedDriver = '';
  }

  return (
    <>
      <label
        htmlFor="drivers"
        className="text-sm font-bold text-gray-700 tracking-wide mr-4"
      >
        Driver
      </label>
      <select
        id="drivers"
        name="drivers"
        onChange={e => handleDriverChange(e.target.value)}
        className={inputCss}
        defaultValue={selectedDriver}
      >
        <option value="">Select a driver</option>
        {drivers.map((driver: string) => {
          return (
            <option id={driver} key={driver} value={driver}>
              {driver}
            </option>
          );
        })}
      </select>
    </>
  );
}

export function DateFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {replace} = useRouter();

  function handleDateChange(date: string) {
    const params = removeTripId(new URLSearchParams(searchParams));

    if (date) {
      params.set('date', date);
    } else {
      params.delete('date');
    }

    replace(`${pathname}?${params.toString()}`);
  }

  let selectedDate = searchParams.get('date');

  if (!selectedDate) {
    selectedDate = currentDate();
  }

  return (
    <>
      <label
        htmlFor="date"
        className="text-sm font-bold text-gray-700 tracking-wide block leading-6"
      >
        Date
      </label>
      <input
        name="date"
        id="date"
        type="date"
        className={inputCss}
        onChange={e => handleDateChange(e.target.value)}
        value={selectedDate}
      ></input>
    </>
  );
}

function removeTripId(params: URLSearchParams): URLSearchParams {
  params.has('trip_id') && params.delete('trip_id');

  return params;
}
