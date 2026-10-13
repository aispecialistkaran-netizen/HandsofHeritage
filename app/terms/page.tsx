import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

export const metadata: Metadata = {
  title: 'Terms of Service | Hands of Heritage',
  description: 'Terms of Service and ordering guidelines for Hands of Heritage handcrafted keepsakes.',
};

export default function TermsOfServicePage() {
  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="subpage-main" style={{ maxWidth: '820px', margin: '40px auto', padding: '0 20px' }}>
        <p className="eyebrow">Client Guidelines</p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.4rem', color: '#251b14', marginBottom: '24px' }}>
          Terms of Service
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: 1.7, color: '#4a3b2c', fontSize: '0.95rem' }}>
          <p>
            Welcome to <strong>Hands of Heritage</strong>. By browsing our handcrafted collections and submitting quotation requests, you agree to the following operational terms:
          </p>

          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#251b14', margin: '16px 0 8px' }}>
            1. Quotation & Order Process
          </h2>
          <p>
            Submitting a quote request via our website does not constitute a financial charge or binding sales contract. It represents an expression of interest. Following your submission, our gifting team provides a formal written quotation with confirmed unit pricing, personalization mockups, shipping costs, and production milestones.
          </p>

          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#251b14', margin: '16px 0 8px' }}>
            2. Minimum Order Quantities (MOQs)
          </h2>
          <p>
            Because each product is individually hand-shaped, hammered, cast, or carved by traditional Indian artisans, minimum order quantities (typically 40, 50, 75 or 100 units depending on the piece) apply to all production runs.
          </p>

          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#251b14', margin: '16px 0 8px' }}>
            3. Artisan Handcraft Variations
          </h2>
          <p>
            Each piece is made by human hands using authentic materials including pure hammered copper, sand-cast brass, and natural Makrana/Rajasthan marble. Slight variations in hammer marks, natural stone veining, and hand-finished luster are hallmarks of authentic artisan craftsmanship, not defects.
          </p>

          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: '#251b14', margin: '16px 0 8px' }}>
            4. Timelines & Worldwide Delivery
          </h2>
          <p>
            We manage global logistics for destination weddings and corporate dispatches across the UK, Europe, North America, Middle East, and India. Recommended planning lead times are 3 to 6 weeks for custom engravings and velvet packaging.
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
