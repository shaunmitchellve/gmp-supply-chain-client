import FilterBar from '@/app/ui/admin/filterBar';
import AdminMap from '@/app/ui/admin/map';

export default async function AdminPage({ searchParams } : {
  searchParams?:{
    driver?: string;
    date?: string;
  };
}) {

  const currentDate = new Date();
  const currentMonth = `${currentDate.getMonth() + 1}`.padStart(2, '0');
  const currentDay = `${currentDate.getDate()}`.padStart(2, '0');

  const driver = searchParams?.driver || '';
  const date = searchParams?.date || `${currentDate.getFullYear()}-${currentMonth}-${currentDay}`;

  return (
    <div className="h-full overflow-hidden flex flex-col">
    <FilterBar />
    <AdminMap driver={driver} date={date} />
    </div>
  )
}