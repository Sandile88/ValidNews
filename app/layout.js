import './globals.css';
import { Inter } from 'next/font/google';
import { MiniKitContextProvider } from '../providers/MiniKitProvider';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ValidNews - Decentralized Fact Checker',
  description: 'Verify truth together with decentralized fact-checking',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MiniKitContextProvider>
          <Navbar/>
          {children}
        </MiniKitContextProvider>
      </body>
    </html>
  );
}
