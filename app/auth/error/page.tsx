import {Metadata} from 'next';
import Link from 'next/link';
import DeniedImage from '@/app/ui/denied-image';

export const metadata: Metadata = {
  title: 'Access Denied',
};

export default function ErrorPage({
  searchParams,
}: {
  searchParams: {[key: string]: string | string[] | undefined};
}) {
  let errorMessage = 'An error has occured with your access.';

  if (searchParams.error) {
    switch (searchParams.error) {
      case 'accessdenied':
        errorMessage =
          'Access Deined: You have stumbled into a restricted area.';
    }
  }
  return (
    <div className="relative">
      <DeniedImage />
      <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
        <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
          <h1 className="text-7xl font-bold text-red-600 p-4">Sorry</h1>
          <h2 className="text-gray-50 font-bold text-2xl">{errorMessage}</h2>
          <Link href="/">
            <button
              type="button"
              className="mt-8 flex justify-center bg-red-600 hover:bg-red-800 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition eas-in durraction-500"
            >
              Head Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
