'use client';

import Link from 'next/link';
import { useQuote } from '../context/QuoteContext';

export function SiteFooter() {
  const { openDrawer } = useQuote();

  return (
    <footer className="site-footer" style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(34,24,14,0.08)' }}>
      {/* Navigation Links */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', fontSize: '0.9rem' }}>
        <Link href="/wedding-favours" style={{ color: '#251b14', fontWeight: 600, textDecoration: 'none' }}>Wedding Favours</Link>
        <Link href="/packaging" style={{ color: '#5f4f3b', textDecoration: 'none' }}>Bespoke Packaging</Link>
        <Link href="/gallery" style={{ color: '#5f4f3b', textDecoration: 'none' }}>Full Catalogue</Link>
        <Link href="/corporate-gifts" style={{ color: '#8c765c', textDecoration: 'none', borderLeft: '1px solid rgba(34,24,14,0.12)', paddingLeft: '12px' }}>Corporate Gifts</Link>
        <button
          type="button"
          onClick={openDrawer}
          style={{ background: 'none', border: 'none', color: '#b5632a', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
        >
          Request a Quote
        </button>
      </div>

      {/* Direct Company Contact Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          padding: '12px 24px',
          borderRadius: '30px',
          border: '1px solid rgba(37,27,18,0.08)',
          fontSize: '0.84rem',
          color: '#5f4f3b',
        }}
      >
        <span>
          ✉️ <a href="mailto:enquiries@handsofheritage.com" style={{ color: '#b5632a', fontWeight: 600, textDecoration: 'none' }}>enquiries@handsofheritage.com</a>
        </span>
        <span style={{ color: 'rgba(37,27,18,0.2)' }}>•</span>
        <span>
          📞 <a href="tel:+447911123456" style={{ color: '#251b14', fontWeight: 500, textDecoration: 'none' }}>+44 7911 123456</a>
        </span>
        <span style={{ color: 'rgba(37,27,18,0.2)' }}>•</span>
        <span>
          💬 <a href="https://wa.me/447911123456?text=Hi%20Hands%20of%20Heritage%2C%20I%20have%20an%20enquiry" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 700, textDecoration: 'none' }}>WhatsApp Us</a>
        </span>
      </div>

      {/* Legal & Social Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', borderTop: '1px solid rgba(34,24,14,0.06)', paddingTop: '16px', flexWrap: 'wrap', gap: '12px', fontSize: '0.84rem', color: '#7c6950' }}>
        <p style={{ margin: 0 }}>© 2026 Hands of Heritage. Handcrafted in India. Worldwide Delivery.</p>
        <div className="footer-links" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/privacy" style={{ color: '#5f4f3b', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: '#5f4f3b', textDecoration: 'none' }}>Terms of Service</Link>
          <a href="https://instagram.com/handsofheritage" target="_blank" rel="noopener noreferrer" style={{ color: '#b5632a', textDecoration: 'none', fontWeight: 600 }}>Instagram ↗</a>
        </div>
      </div>
    </footer>
  );
}
