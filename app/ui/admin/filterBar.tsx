'use server';

import { DriverFilter, DateFilter } from '@/app/ui/admin/filters';
import { FormInputsSkeleton } from '@/app/ui/admin/skeletons';
import { Suspense } from 'react';
import { fetchDrivers } from '@/app/lib/data/data';

export default async function FilterBar() { 
    const drivers = await fetchDrivers();

    return (
        <div className="flex w-full h-28 flex-row px-3 py-4 border-b-2 border-gray-200 shadow-md z-10">
            <div className="flex items-center">
                <Suspense fallback={<FormInputsSkeleton />}>
                    <DriverFilter drivers={drivers}/>
                </Suspense>
            </div>
            <div className="flex items-center ml-10">
                    <Suspense fallback={<FormInputsSkeleton />}>
                    <DateFilter />
                </Suspense>
            </div>
        </div>
    )
}