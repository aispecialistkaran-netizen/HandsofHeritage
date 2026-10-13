'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { products, pickItems, type Product } from './site-content';
import { useQuote } from './context/QuoteContext';
import { ProductCard } from './components/ProductCard';
import { SiteFooter } from './components/SiteFooter';

const homeNavLinks = [
  { label: 'Wedding favours', href: '/wedding-favours', isPrimary: true },
  { label: 'Packaging', href: '/packaging' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Corporate gifts', href: '/corporate-gifts', isSecondary: true },
];

const heroItems: { name: string; image?: string; video?: string; className: string }[] = [
  {
    name: 'The Art of Gifting',
    video: '/download.mp4',
    className: 'tall',
  },
  {
    name: 'Lotus brass tealight holder',
    image: '/Lotus_Brass_Tealight_Holder.png',
    className: '',
  },
  {
    name: 'Mini brass diya oil lamp',
    image: '/Mini_Brass_Diya_Oil_Lamp.png',
    className: '',
  },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const { quoteItems, openDrawer } = useQuote();
  const [isLoading, setIsLoading] = useState(true);
  const totalCount = quoteItems.reduce((acc, item) => acc + item.quantity, 0);

  // Curate 8 top wedding favour products for the homepage
  const featuredWeddingFavours: Product[] = pickItems([
    'Lotus brass tealight holder',
    'Mini brass diya oil lamp',
    'Copper tea light holder',
    'Peacock brass diya lamp',
    'Taj marble coaster set',
    'Marble ring holder',
    'Marble jewellery dish',
    'Pure copper water tumbler',
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="page-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: '#f7f0e8',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              <Image src="/logohoh.png" alt="Hands of Heritage logo" width={120} height={108} priority />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page-shell">
        <motion.header
          className="site-header"
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Link className="brand-mark" href="/">
            <Image src="/logohoh.png" alt="Hands of Heritage logo" width={58} height={52} priority className="brand-logo" />
            <div>
              <span>Hands of</span>
              <strong>Heritage</strong>
            </div>
          </Link>
          <nav className="header-nav">
            <ul>
              {homeNavLinks.map((link) => {
                const linkClasses = [
                  link.isPrimary ? 'nav-primary' : '',
                  link.isSecondary ? 'nav-secondary' : '',
                ].filter(Boolean).join(' ');

                return (
                  <li key={link.href}>
                    <Link className={linkClasses || undefined} href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <button type="button" className="nav-cta" onClick={openDrawer}>
              Request a quote
              <span className={`quote-count ${totalCount > 0 ? 'visible' : ''}`}>{totalCount}</span>
            </button>
          </nav>
        </motion.header>

        <main>
          {/* Hero Section */}
          <motion.section
            className="hero-section"
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <div className="hero-copy">
              <p className="eyebrow">Bespoke Wedding Favours & Celebration Keepsakes</p>
              <h1>
                Heirloom favours your guests will <em>cherish forever</em>
              </h1>
              <p className="hero-text">
                Artisan-crafted copper, brass and marble keepsakes designed for sacred ceremonies, welcome room hampers, and memorable celebration tables.
              </p>
              <div className="hero-actions">
                <Link className="button-primary" href="/wedding-favours">
                  Explore Wedding Favours
                </Link>
                <button type="button" className="button-secondary" onClick={openDrawer}>
                  Request a Quote
                </button>
              </div>
              <p style={{ marginTop: '16px', fontSize: '0.84rem', color: '#7d6648' }}>
                Planning executive gifting or team hampers?{' '}
                <Link href="/corporate-gifts" style={{ textDecoration: 'underline', color: '#b5632a', fontWeight: 500 }}>
                  Explore corporate gifting →
                </Link>
              </p>
            </div>

            <motion.div className="hero-visual" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }}>
              <div className="mosaic-grid">
                {heroItems.map((item) => (
                  <div className={`mosaic-card ${item.className}`} key={item.name}>
                    {item.video ? (
                      <video
                        src={item.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 0 }}
                      />
                    ) : (
                      <Image src={item.image!} alt={item.name} fill sizes="(max-width: 1040px) 100vw, 45vw" priority className="mosaic-image" />
                    )}
                    <p style={{ zIndex: 2, position: 'relative' }}>{item.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.section>

          {/* Streamlined Featured Catalogue Section (Wedding Favours Focus) */}
          <motion.section
            className="catalogue-section"
            id="products"
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          >
            <div className="section-intro">
              <p className="eyebrow">Wedding Collection</p>
              <h2>Signature Ceremony Favours & Hampers</h2>
              <p style={{ maxWidth: '620px', margin: '8px auto 0', color: '#675740', fontSize: '0.95rem' }}>
                Curated artisan pieces favored by couples for ceremony rituals, mehendi giveaways, and luxury destination wedding welcome hampers.
              </p>
            </div>

            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {featuredWeddingFavours.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link className="button-primary" href="/wedding-favours" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
                View Wedding Curation Guide →
              </Link>
              <Link className="button-secondary" href="/gallery" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
                Browse Full Catalogue (29 Items) →
              </Link>
            </div>
          </motion.section>

          {/* One Packaging Showcase Section */}
          <motion.section
            className="editorial-band"
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          >
            <div className="story-image" style={{ aspectRatio: '4/3' }}>
              <Image src="/packaging_showcase.png" alt="Bespoke Packaging finishes" fill sizes="(max-width: 1040px) 100vw, 50vw" />
            </div>
            <div className="story-copy">
              <p className="eyebrow">Unboxing Experience</p>
              <h2>Bespoke Packaging Finishes</h2>
              <p>
                Presentation elevates the gift. Every keepsake arrives event-ready in rich velvet boxes, organic cotton pouches, or rigid gift boxes finished with custom wax seals and engraved tags.
              </p>
              <div style={{ marginTop: '16px' }}>
                <Link className="button-secondary" href="/packaging">
                  Explore Packaging Options
                </Link>
              </div>
            </div>
          </motion.section>

          {/* One Genuine Wedding Case Study / Testimonial */}
          <motion.section
            className="long-panel"
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          >
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
              <p className="eyebrow">Wedding Case Study</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#251b14', marginBottom: '20px' }}>
                &quot;The marble coasters and brass diyas in our welcome hampers were the highlight of our destination wedding in Udaipur. Flawless craftsmanship and individual personalization.&quot;
              </h2>
              <p className="eyebrow" style={{ color: '#b5632a', fontWeight: 600 }}>
                — Priya & Rohan (500 Guest Wedding, Udaipur)
              </p>
            </div>
          </motion.section>

          {/* Dedicated Corporate Gifting Secondary Section */}
          <motion.section
            className="corporate-section-home"
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            style={{
              backgroundColor: '#fff',
              border: '1px solid rgba(37, 27, 18, 0.08)',
              borderRadius: '20px',
              padding: '36px 40px',
              margin: '40px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '24px',
              boxShadow: '0 4px 20px rgba(37, 27, 18, 0.03)',
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <p className="eyebrow" style={{ color: '#7d6648', marginBottom: '6px' }}>For Organizations & Brands</p>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.9rem', margin: '0 0 10px', color: '#251b14' }}>
                Looking for Corporate & Executive Gifting?
              </h3>
              <p style={{ margin: 0, color: '#675740', fontSize: '0.92rem', lineHeight: 1.6 }}>
                We also craft statement copper drinkware, marble desk keepsakes, and branded onboarding hampers for corporate milestones, leadership summits, and client appreciation.
              </p>
            </div>
            <Link className="button-secondary" href="/corporate-gifts" style={{ whiteSpace: 'nowrap', padding: '12px 24px' }}>
              Explore Corporate Gifting →
            </Link>
          </motion.section>

          {/* Strong Final Wedding Quote Call-To-Action Banner */}
          <motion.section
            className="quote-banner"
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          >
            <div>
              <p className="eyebrow">Bespoke Curation</p>
              <h2>
                Every favour, <em>personally</em> crafted for your wedding
              </h2>
            </div>
            <button type="button" className="button-primary" onClick={openDrawer}>
              Request a personalised favour quote
            </button>
          </motion.section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
