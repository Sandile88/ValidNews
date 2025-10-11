import './globals.css';
import { Inter } from 'next/font/google';
import { MiniKitContextProvider } from '../provider/MinikitProvider';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'ValidNews - Decentralized Fact Checker',
  description: 'Verify truth together with decentralized fact-checking',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MiniKitContextProvider>
          <Navbar/>
          {children}
        </MiniKitContextProvider>
      </body>
    </html>
  );
}
