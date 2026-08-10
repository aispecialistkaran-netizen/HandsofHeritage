'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { pickItems } from '../site-content';
import { useQuote } from '../context/QuoteContext';
import { ProductCard } from '../components/ProductCard';

const corporatePicks = pickItems([
  'Pure copper water tumbler',
  'Hammered copper Moscow mule mug',
  'Copper teaspoon gift set',
  'Copper napkin ring',
  'Brass bookmark',
  'Copper keychain',
  'Marble Taj Mahal paperweight',
  'Brass spice spoon',
]);

export default function CorporateGiftsPage() {
  const { openDrawer } = useQuote();

  return (
    <div className="page-shell">
      <SiteHeader activeHref="/corporate-gifts" />
      <main className="subpage-main">
        {/* Hero */}
        <section className="subpage-hero">
          <div className="subpage-copy">
            <p className="eyebrow">Corporate gifts</p>
            <h1>Refined gifting for clients, teams and milestone events</h1>
            <p>
              Choose premium handcrafted pieces for leadership offsites, festive dispatches, onboarding kits and conference gifting.
            </p>
            <div className="hero-actions">
              <button type="button" className="button-primary" onClick={openDrawer}>
                Build a gift set
              </button>
              <Link className="button-secondary" href="/gallery">
                Browse gallery
              </Link>
            </div>
          </div>
          <div className="subpage-hero-media">
            {corporatePicks.slice(0, 3).map((item, index) => (
              <div className={`hero-photo hero-photo-${index + 1}`} key={item.name}>
                <Image src={item.image} alt={item.name} fill sizes="(max-width: 1040px) 100vw, 44vw" priority={index === 0} />
              </div>
            ))}
          </div>
        </section>

        {/* Streamlined Feature Panels */}
        <section className="detail-grid">
          {[
            ['Client gifting', 'Statement drinkware, desk pieces and keepsakes for premium relationship building.'],
            ['Team rewards', 'Useful handcrafted gifts that suit celebrations, joining kits and annual events.'],
            ['Event dispatches', 'Quantity planning, packaging and delivery coordination for distributed teams.'],
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
            <p className="eyebrow">Corporate Edit</p>
            <h2>Gifts Built for Repeated Use</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {corporatePicks.map((product) => (
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
            <p className="eyebrow">Buying flow</p>
            <h2>From shortlist to dispatch plan</h2>
          </div>
          {[
            ['01', 'Shortlist', 'Choose product combinations matching your event tone and operational needs.'],
            ['02', 'Packaging', 'Box, sleeve, insert and brand treatment are aligned with the selected products.'],
            ['03', 'Dispatch', 'Production, packing and delivery are managed smoothly around your schedule.'],
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
            <p className="eyebrow">Bulk gifting</p>
            <h2>
              Make every dispatch feel <em>considered</em>
            </h2>
          </div>
          <button type="button" className="button-primary" onClick={openDrawer}>
            Request corporate options
          </button>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
