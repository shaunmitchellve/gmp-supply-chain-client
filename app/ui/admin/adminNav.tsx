'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import ShopsLogo from '@/app/ui/shops-logo';
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { signOut } from '@/auth';

const links = [
    { name: "Dashboard", href:"/admin", icon: Cog6ToothIcon}
];

export default function AdminNav() {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col px-3 py-4 border-r-2 border-gray-200 shadow-md">
            <Link 
                className="flex"
                href="/">
                    <ShopsLogo />
             </Link>
             <div className="flex grow flex-row justify-between space-x-2 mt-10 h-10">
             {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link key={link.name} href={link.href}
                        className={clsx(
                            "flex h-[48px] grow items-center justify-left gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-red-300 hover:text-red-600",
                            {
                                "bg-red-300 text-red-600": pathname === link.href,
                            },
                        )}
                    >
                            <LinkIcon className="flex w-8" />
                            <p className="hidden md:block">{link.name}</p>
                    </Link>
                )})
            }
             </div>
             <div className="border-t-2 border-gray-200 text-center hover:bg-red-300 hover:cursor-pointer hover:text-red-600">
                <a onClick={async () => { await signOut(); }}>Sign Out</a>
             </div>
        </div>
    )
}