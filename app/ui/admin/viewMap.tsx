'use client';
import {useSearchParams, usePathname, useRouter} from 'next/navigation';
import Button from '@/app/ui/button';

export default function ViewMap({id}: {id: string}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {replace} = useRouter();

  const handleShowMap = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('trip_id', id);

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full flex justify-end">
      <Button className="mt-3" onClick={() => handleShowMap(id)}>
        View
      </Button>
    </div>
  );
}
