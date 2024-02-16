import '@/app/ui/globals.css';
import { Metadata } from 'next';
import AdminNav from '@/app/ui/admin/adminNav';

export const metadata: Metadata = {
    title: "Admin"
  }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <AdminNav />
            </div>
            <div className="flex-grow md:overflow-y-auto">
              {children}
            </div>
        </div>
  );
}
