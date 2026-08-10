'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { products, type Product } from './site-content';
import { useQuote } from './context/QuoteContext';
import { ProductCard } from './components/ProductCard';

const homeNavLinks = [
  { label: 'Wedding favours', href: '/wedding-favours' },
  { label: 'Corporate gifts', href: '/corporate-gifts' },
  { label: 'Packaging', href: '/packaging' },
  { label: 'Gallery', href: '/gallery' },
];

const heroItems: { name: string; image?: string; video?: string; className: string }[] = [
  {
    name: 'The Art of Gifting',
    video: '/download.mp4',
    className: 'tall',
  },
  {
    name: 'Pure copper water tumbler',
    image: '/Pure Copper Water Tumbler.png',
    className: '',
  },
  {
    name: 'Hammered Moscow mule mug',
    image: '/Hammered Copper Moscow Mule Mug.png',
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

  // Curate 8 top featured products for the homepage
  const featuredProducts: Product[] = products.slice(0, 8);

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
              {homeNavLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
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
              <p className="eyebrow">Handcrafted gifting from India</p>
              <h1>
                Gifts that carry <em>memory</em> forward
              </h1>
              <p className="hero-text">
                A curated collection of artisan-made wedding favours and corporate gifts. Each keepsake is crafted with mindful workmanship, luxe materials and elegant personalization.
              </p>
              <div className="hero-actions">
                <Link className="button-primary" href="/wedding-favours">
                  Wedding favours
                </Link>
                <Link className="button-secondary" href="/corporate-gifts">
                  Corporate gifts
                </Link>
              </div>
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

          {/* Streamlined Featured Catalogue Section (6-8 items) */}
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
              <p className="eyebrow">Signature Collection</p>
              <h2>Featured Handcrafted Keepsakes</h2>
            </div>

            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link className="button-secondary" href="/gallery" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', fontSize: '0.95rem' }}>
                Browse Full Catalogue (29+ Items & Filters) →
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

          {/* One Genuine Case Study / Testimonial */}
          <motion.section
            className="long-panel"
            variants={sectionReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          >
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
              <p className="eyebrow">Client Case Study</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#251b14', marginBottom: '20px' }}>
                &quot;The marble coasters in our welcome hampers were the highlight of our destination wedding in Udaipur. Flawless craftsmanship and individual personalization.&quot;
              </h2>
              <p className="eyebrow" style={{ color: '#b5632a', fontWeight: 600 }}>
                — Priya & Rohan (500 Guest Wedding, Udaipur)
              </p>
            </div>
          </motion.section>

          {/* Strong Final Quote Call-To-Action Banner */}
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
                Every favour, <em>personally</em> crafted for your event
              </h2>
            </div>
            <button type="button" className="button-primary" onClick={openDrawer}>
              Request a personalised quote
            </button>
          </motion.section>
        </main>

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
              <span>Privacy</span>
              <span>Terms</span>
              <span>Instagram</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
