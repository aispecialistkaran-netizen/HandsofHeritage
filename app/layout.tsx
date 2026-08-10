import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { QuoteProvider } from './context/QuoteContext';
import { QuoteDrawer } from './components/QuoteDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { Toast } from './components/Toast';
import { MobileBottomBar } from './components/MobileBottomBar';

export const metadata: Metadata = {
  title: 'Hands of Heritage | Artisan Wedding & Corporate Gifting',
  description: 'Premium handcrafted gifting for weddings, celebrations and corporate events. Artisan-made copper, brass and marble keepsakes.',
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
