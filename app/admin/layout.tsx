import '@/app/ui/globals.css';
import {Metadata} from 'next';
import AdminNav from '@/app/ui/admin/adminNav';

export const metadata: Metadata = {
  title: 'Admin',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-row h-screen">
      <AdminNav />
      <div className="flex w-full">{children}</div>
    </div>
  );
}
