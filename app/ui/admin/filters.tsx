'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { currentDate } from '@/app/lib/utils';

export function DriverFilter({drivers}: {drivers: string[]}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleDriverChange(driver: string) {
        const params = new URLSearchParams(searchParams);
        
        if (driver) {
            params.set('driver', driver);
        } else {
            params.delete('driver');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    // @ts-ignore
    const selectedDriver: string = (searchParams.get('driver') === null) ? "" : searchParams.get('driver');

    return (
        <>
            <label htmlFor="drivers" className="text-sm font-medium text-gray-700 tracking-wide mr-4">Driver</label>
            <select id="drivers" name="drivers"
                onChange={(e) => handleDriverChange(e.target.value)}
                className="border-2 p-1 rounded-md border-slate-200"
                defaultValue={selectedDriver}
            >
                <option value="">Select a driver</option>
                {drivers.map((driver:string) => {
                    return (<option id={driver} key={driver} value={driver}>{driver}</option>)
                })}
            </select>
        </>
    )
}

export function DateFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleDateChange(date: string){
        const params = new URLSearchParams(searchParams);

        if (date) {
            params.set('date', date);
        } else {
            params.delete('date');
        }
        replace(`${pathname}?${params.toString()}`);
    }

     // @ts-ignore
    const selectedDate: string = (searchParams.get('date') === null) ?
       currentDate() : 
        searchParams.get('date');

    return (
        <>
            <label htmlFor="date" className="text-sm font-medium text-gray-700 tracking-wide mr-4">Date</label>
            <input name="date" id="date" type="date"
                className="border-2 p-1 rounded-md border-slate-200"
                onChange={(e) => handleDateChange(e.target.value)}
                value={selectedDate}
            ></input>
        </>
    )
}