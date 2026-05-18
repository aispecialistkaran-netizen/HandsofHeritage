import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { MobileBottomBar } from './components/MobileBottomBar';

export const metadata: Metadata = {
  title: 'Hands of Heritage',
  description: 'Premium handcrafted gifting for weddings and corporate events.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <MobileBottomBar />
      </body>
    </html>
  );
}
