'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { pickItems } from '../site-content';
import { useQuote } from '../context/QuoteContext';
import { ProductCard } from '../components/ProductCard';

const packagingSamples = pickItems([
  'Copper tea light holder',
  'Brass trinket box',
  'Marble jewellery dish',
  'Copper teaspoon gift set',
  'Pure copper water tumbler',
  'Lotus brass tealight holder',
  'Marble spice bowl',
  'Copper napkin ring',
]);

const heroSamples = pickItems([
  'Copper tea light holder',
  'Brass trinket box',
  'Marble jewellery dish',
  'Copper teaspoon gift set',
]);

const sectionReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function PackagingContent() {
  const { openDrawer } = useQuote();

  return (
    <div className="page-shell">
      <SiteHeader activeHref="/packaging" />
      <main className="subpage-main">
        <motion.section 
          className="subpage-hero packaging-hero"
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <div className="subpage-copy">
            <p className="eyebrow">The Finishing Touch</p>
            <h1>Gift-ready presentation for intimate events and bulk dispatches</h1>
            <p style={{ marginTop: '20px' }}>
              Packaging is planned around product shape, event tone and delivery route. Choose refined velvet boxes,
              custom silk ribbons, wax seals, and personalized inserts that make each handcrafted item feel extraordinarily complete on arrival.
            </p>
            <div className="hero-actions" style={{ marginTop: '32px' }}>
              <button type="button" className="button-primary" onClick={openDrawer}>
                Request packaging quote
              </button>
              <Link className="button-secondary" href="/gallery">
                Browse catalogue
              </Link>
            </div>
          </div>
          <div className="package-stack">
            <div className="package-sample" style={{ overflow: 'hidden', borderRadius: '24px' }}>
              <Image src="/packaging_showcase.png" alt="Bespoke Packaging" fill sizes="(max-width: 1040px) 50vw, 22vw" style={{ objectFit: 'cover' }} />
            </div>
            <div className="package-sample" style={{ overflow: 'hidden', borderRadius: '24px' }}>
              <Image src="/gift_ribbon.png" alt="Silk Ribbon" fill sizes="(max-width: 1040px) 50vw, 22vw" style={{ objectFit: 'cover' }} />
            </div>
            <div className="package-sample" style={{ overflow: 'hidden', borderRadius: '24px' }}>
              <Image src="/wax_seal.png" alt="Custom Wax Seal" fill sizes="(max-width: 1040px) 50vw, 22vw" style={{ objectFit: 'cover' }} />
            </div>
            <div className="package-sample" style={{ overflow: 'hidden', borderRadius: '24px' }}>
              <Image src={heroSamples[3].image} alt={heroSamples[3].name} fill sizes="(max-width: 1040px) 50vw, 22vw" style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </motion.section>

        <motion.section 
          className="package-option-grid"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          {[
            ['Single-piece boxes', 'Rigid or foldable boxes sized for individual favours, with room for notes and inserts.'],
            ['Hamper-ready sets', 'Coordinated sets for welcome rooms, festive gifting and premium corporate dispatches.'],
            ['Event tags and sleeves', 'Names, dates, table numbers, brand marks and short messages matched to the occasion.'],
            ['Bulk-safe cartons', 'Outer cartons and product protection planned for local or multi-city delivery.'],
          ].map(([title, text]) => (
            <motion.article 
              className="feature-panel" 
              key={title}
              whileHover={{ y: -6, borderColor: 'rgba(181, 99, 42, 0.2)' }}
              transition={{ duration: 0.2 }}
              style={{ cursor: 'pointer', transition: 'border-color 0.2s ease' }}
            >
              <h2>{title}</h2>
              <p>{text}</p>
            </motion.article>
          ))}
        </motion.section>

        <motion.section 
          className="long-panel"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <p className="eyebrow">Packaging routes</p>
            <h2>Presentation choices by product type</h2>
          </div>
          <div className="matrix-grid">
            {[
              ['Drinkware', 'Tall boxes, protective inserts and sleeves that keep copper tumblers presentation-ready.'],
              ['Diyas and tealights', 'Compact boxes with separators so polished metal finishes stay clean.'],
              ['Desk accessories', 'Flat sleeves, cards and branded inserts for bookmarks, paperweights and keychains.'],
              ['Serveware sets', 'Nested packing for spoon sets, spice bowls, coasters and napkin rings.'],
              ['Marble pieces', 'Foam-backed compartments and careful outer cartons for weight and edge protection.'],
              ['Mixed hampers', 'Tray-led layouts that balance height, colour, material and unboxing order.'],
            ].map(([title, text]) => (
              <motion.article 
                className="matrix-card" 
                key={title}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                style={{ cursor: 'pointer' }}
              >
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Products commonly built into gift-ready sets */}
        <section className="catalogue-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <div className="section-intro">
            <p className="eyebrow">Packaged Products</p>
            <h2>Pieces Commonly Built into Gift-Ready Sets</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {packagingSamples.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <motion.section 
          className="process-section"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div className="section-intro">
            <p className="eyebrow">Packaging process</p>
            <h2>How we move from product to finished gift</h2>
          </div>
          <div style={{ marginTop: '40px' }}>
            {[
              ['01', 'Measure', 'Each product is mapped by dimensions, finish, fragility and final presentation angle.'],
              ['02', 'Match', 'Box style, filler, insert and sleeve are selected according to quantity and route.'],
              ['03', 'Personalize', 'Names, dates, brand marks and short messages are added to tags or inserts.'],
              ['04', 'Pack', 'Products are packed by event, recipient group, office location or dispatch batch.'],
              ['05', 'Handover', 'Outer cartons and labels are organized so delivery teams can move quickly.'],
            ].map(([number, title, text]) => (
              <motion.article 
                className="process-row" 
                key={number}
                whileHover={{ x: 8 }}
                transition={{ duration: 0.2 }}
              >
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section 
          className="quote-banner"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div>
            <p className="eyebrow">Finish details</p>
            <h2>Packaging is quoted with your product set</h2>
          </div>
          <button type="button" className="button-primary" onClick={openDrawer}>
            Request packaging & product quote
          </button>
        </motion.section>
      </main>
      <SiteFooter />
    </div>
  );
}
