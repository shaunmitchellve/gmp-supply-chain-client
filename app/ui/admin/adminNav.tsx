'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import clsx from 'clsx';
import ShopsLogo from '@/app/ui/image/shops-logo';
import {MapIcon, ArrowRightOnRectangleIcon} from '@heroicons/react/24/outline';
import {signOutClient} from '@/app/lib/actions';

const links = [{name: 'Dashboard', href: '/admin', icon: MapIcon}];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed flex-col w-60 h-full bg-red-900 -translate-x-48 z-20">
      <Link
        className="flex bg-white rounded-full p-2 w-10 h-10 float-right mr-1 mt-2"
        href="/"
      >
        <ShopsLogo />
      </Link>
      <div className="flex flex-col w-full mt-24 space-y-2">
        {links.map(link => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'hover:ml-5 hover:text-red-300 w-full h-[50px] bg-red-900 rounded-full transform ease-in-out duration-300 flex justify-end pr-4',
                {
                  'text-red-300': pathname === link.href,
                  'text-white': pathname !== link.href,
                }
              )}
              title={link.name}
              aria-label={link.name}
            >
              <LinkIcon className="w-6 h-6 mt-3" />
            </Link>
          );
        })}
      </div>
      <a
        onClick={async () => {
          await signOutClient();
        }}
        title="Log Out"
        aria-label="Log Out"
        className="hover:ml-5 hover:text-red-300 text-white w-full h-[50px] bg-red-900 rounded-full transform ease-in-out duration-300 flex justify-end pr-4 cursor-pointer"
      >
        <ArrowRightOnRectangleIcon className="w-6 h-6 mt-3" />
      </a>
    </aside>
  );
}
