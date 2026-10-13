import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy | Hands of Heritage',
  description: 'Privacy Policy and data protection standards for Hands of Heritage clients.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="subpage-main" style={{ maxWidth: '820px', margin: '40px auto', padding: '0 20px' }}>
        <p className="eyebrow">Data Governance</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.4rem', color: '#251b14', marginBottom: '24px' }}>
          Privacy Policy
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: 1.7, color: '#4a3b2c', fontSize: '0.95rem' }}>
          <p>
            Last updated: October 2026. At <strong>Hands of Heritage</strong>, we value your privacy and are committed to protecting the personal information you share with us when exploring handcrafted keepsakes and requesting quotations.
          </p>

          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#251b14', margin: '16px 0 8px' }}>
            1. Information We Collect
          </h2>
          <p>
            When you submit a quote request or contact us, we collect details necessary to prepare bespoke production estimates and arrange deliveries:
          </p>
          <ul>
            <li>Contact details: Name, email address, telephone number.</li>
            <li>Event specifications: Required delivery date, destination postcode/country, occasion type, target budget.</li>
            <li>Customisation preferences: Selected keepsakes, requested physical quantities, engraving initials, and packaging finishes.</li>
          </ul>

          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#251b14', margin: '16px 0 8px' }}>
            2. How We Use Your Information
          </h2>
          <p>
            We use your data solely to:
          </p>
          <ul>
            <li>Prepare itemized quotations, production timelines, and bespoke mockup proofs.</li>
            <li>Communicate with you regarding your enquiry via email or WhatsApp.</li>
            <li>Coordinate artisan dispatch, quality packaging, and secure delivery logistics.</li>
          </ul>

          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#251b14', margin: '16px 0 8px' }}>
            3. Data Security & Storage
          </h2>
          <p>
            Your information is stored securely in encrypted cloud databases (Google Cloud / Firebase Firestore) with AES-256 encryption at rest and TLS 1.3 encryption in transit. Access is strictly limited to authorized coordinators (Latika and Karan). We never sell, rent, or trade your personal information with third parties.
          </p>

          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#251b14', margin: '16px 0 8px' }}>
            4. Your Rights (Right to Erasure / GDPR)
          </h2>
          <p>
            You have the right to request a copy of the information we hold about you or to ask us to permanently delete your enquiry records at any time. To request deletion, email us at <a href="mailto:enquiries@handsofheritage.com" style={{ color: '#b5632a', fontWeight: 600 }}>enquiries@handsofheritage.com</a>.
          </p>
        </div>

        <div style={{ marginTop: '36px', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '20px' }}>
          <Link href="/" className="button-secondary">
            ← Return to Homepage
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
