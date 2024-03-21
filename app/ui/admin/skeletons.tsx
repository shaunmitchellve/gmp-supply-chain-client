export function FormInputsSkeleton() {
  return (
    <div className="animate-pulse relative overflow-hidden rounded-xl bg-gray-500 p-2 shadow-sm">
      <div className="flex p-1">
        <div className="h-3 w-10 rounded-md bg-gray-200 mr-4 text-sm font-medium" />
        <div className="h-3 w-64 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function TripsSkeleton() {
  return (
    <div className="animate-pulse relative overflow-hidden rounded-xl bg-gray-500 p2 shadow-sm max-w-md h-[200px] ml-9 mr-9" />
  );
}
