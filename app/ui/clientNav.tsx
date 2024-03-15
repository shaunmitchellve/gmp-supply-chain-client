'use client';

import { useEffect, useState } from 'react';
import { ArrowRightOnRectangleIcon, MagnifyingGlassIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Button from "@/app/ui/button";
import { ClientNavProps  } from "@/app/lib/definitions";
import clsx from 'clsx';
import { signOutClient, authClient } from "@/app/lib/actions";
import Link from 'next/link';

export default function ClientNav({ children, className, setDestination }: ClientNavProps) {
    const [isAdmin, setIsAdmin ] = useState(false);

    useEffect(() => {
        authClient().then(session => {
            if (session?.isAdmin) {
                setIsAdmin(true);
            }
        });
    });

    return (
        <div className={clsx("flex flex-col gap-y-2", className)}>
            <div className="has-tooltip w-40">
                <span className="absolute left-12 top-2 text-xs tooltip rounded shadow-lg p-1 bg-gray-800 text-white">Sign Out</span>
                <Button type="button" onClick={
                    async () => {
                        await signOutClient(); 
                    }}><ArrowRightOnRectangleIcon className="flex w-4"/></Button>
            </div>
            {setDestination &&
                <div className="has-tooltip w-40">
                    <span className="absolute left-12 top-14 text-xs tooltip rounded shadow-lg p-1 bg-gray-800 text-white">New Destination</span>
                    <Button onClick={() => { setDestination(""); }}><MagnifyingGlassIcon className="flex w-4"/></Button>
                </div>
            }
            {isAdmin &&
            <div className="has-tooltip w-40">
                <span className="absolute left-12 top-14 text-xs tooltip rounded shadow-lg p-1 bg-gray-800 text-white">Admin</span>
                <Link href="/admin"><Button><Cog6ToothIcon className="flex w-4"/></Button></Link>
            </div>
            }
       </div>
    )
}