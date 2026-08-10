'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { pickItems } from '../site-content';
import { useQuote } from '../context/QuoteContext';
import { ProductCard } from '../components/ProductCard';

const weddingPicks = pickItems([
  'Lotus brass tealight holder',
  'Mini brass diya oil lamp',
  'Copper tea light holder',
  'Peacock brass diya lamp',
  'Taj marble coaster set',
  'Marble ring holder',
  'Copper bookmark',
  'Brass trinket box',
]);

export default function WeddingFavoursPage() {
  const { openDrawer } = useQuote();

  return (
    <div className="page-shell">
      <SiteHeader activeHref="/wedding-favours" />
      <main className="subpage-main">
        {/* Hero */}
        <section className="subpage-hero">
          <div className="subpage-copy">
            <p className="eyebrow">Wedding favours</p>
            <h1>Keepsakes for ceremonies, welcome hampers and guest tables</h1>
            <p>
              Build a favour story around artisan-made pieces that guests will treasure. Copper, brass and marble options curated by ritual, guest profile, and presentation style.
            </p>
            <div className="hero-actions">
              <button type="button" className="button-primary" onClick={openDrawer}>
                Select favours & request quote
              </button>
              <Link className="button-secondary" href="/packaging">
                View packaging finishes
              </Link>
            </div>
          </div>
          <div className="subpage-hero-media">
            {weddingPicks.slice(0, 3).map((item, index) => (
              <div className={`hero-photo hero-photo-${index + 1}`} key={item.name}>
                <Image src={item.image} alt={item.name} fill sizes="(max-width: 1040px) 100vw, 44vw" priority={index === 0} />
              </div>
            ))}
          </div>
        </section>

        {/* Streamlined Features Grid */}
        <section className="detail-grid">
          {[
            ['Ceremony keepsakes', 'Diyas, tealight holders and incense burners for pujas, mehendi and evening tables.'],
            ['Guest-room hampers', 'Compact copper and marble items that pair well with sweets, notes and local treats.'],
            ['Bespoke touches', 'Add custom names, dates, velvet boxes, tags and ribbons matching your wedding palette.'],
          ].map(([title, text]) => (
            <article className="feature-panel" key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </section>

        {/* Curated Product Shelf */}
        <section className="catalogue-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <div className="section-intro">
            <p className="eyebrow">Wedding Edit</p>
            <h2>Top Favours for Celebrations</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {weddingPicks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link className="button-secondary" href="/gallery">
              View All 29 Items in Gallery →
            </Link>
          </div>
        </section>

        {/* Streamlined Process Section */}
        <section className="process-section">
          <div className="section-intro">
            <p className="eyebrow">Wedding timeline</p>
            <h2>Plan favours seamlessly</h2>
          </div>
          {[
            ['01', 'Curate', 'Browse pieces by ceremony, material, size and packing style.'],
            ['02', 'Personalize', 'Names, dates, engraved tags, sleeves and box finishes are planned together.'],
            ['03', 'Deliver', 'Favours arrive safely packed and ready for distribution.'],
          ].map(([number, title, text]) => (
            <article className="process-row" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>

        {/* Quote CTA Banner */}
        <section className="quote-banner">
          <div>
            <p className="eyebrow">Plan the set</p>
            <h2>
              Match favours to <em>every</em> wedding event
            </h2>
          </div>
          <button type="button" className="button-primary" onClick={openDrawer}>
            Start a quote
          </button>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
