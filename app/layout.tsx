import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { QuoteProvider } from './context/QuoteContext';
import { QuoteDrawer } from './components/QuoteDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Toast } from './components/Toast';
import { MobileBottomBar } from './components/MobileBottomBar';

export const metadata: Metadata = {
  title: 'Hands of Heritage | Handcrafted Wedding Favours & Heirloom Keepsakes',
  description: 'Bespoke artisan wedding favours, ceremony keepsakes, and celebration gifts in pure copper, brass and marble. Also offering curated corporate gifting.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QuoteProvider>
          {children}
          <QuoteDrawer />
          <ProductDetailModal />
          <Toast />
          <MobileBottomBar />
        </QuoteProvider>
      </body>
    </html>
  );
}
