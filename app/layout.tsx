import '@/app/ui/globals.css';
import {inter} from '@/app/ui/fonts';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Cymbol Track-It',
    default: 'Cymbol Track-It',
  },
  description:
    'Cymbol Shops Track-It App provides Cymbol with real time visibilty into its Supply Chain',
  metadataBase: new URL('https://localhosthost:3000'),
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
