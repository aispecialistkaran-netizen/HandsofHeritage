'use client';

import Link from 'next/link';
import { useQuote } from '../context/QuoteContext';

export function SiteFooter() {
  const { openDrawer } = useQuote();

  return (
    <footer className="site-footer" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', fontSize: '0.9rem' }}>
        <Link href="/wedding-favours" style={{ color: '#5f4f3b', textDecoration: 'none' }}>Wedding Favours</Link>
        <Link href="/corporate-gifts" style={{ color: '#5f4f3b', textDecoration: 'none' }}>Corporate Gifts</Link>
        <Link href="/packaging" style={{ color: '#5f4f3b', textDecoration: 'none' }}>Bespoke Packaging</Link>
        <Link href="/gallery" style={{ color: '#5f4f3b', textDecoration: 'none' }}>Full Catalogue</Link>
        <button
          type="button"
          onClick={openDrawer}
          style={{ background: 'none', border: 'none', color: '#b5632a', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
        >
          Request a Quote
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderTop: '1px solid rgba(34,24,14,0.06)', paddingTop: '16px' }}>
        <p style={{ margin: 0 }}>© 2026 Hands of Heritage. All rights reserved.</p>
        <div className="footer-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Instagram</span>
        </div>
      </div>
    </footer>
  );
}
