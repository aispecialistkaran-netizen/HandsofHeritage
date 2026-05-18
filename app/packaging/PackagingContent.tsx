'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductShelf } from '../components/ProductShelf';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { pickItems } from '../site-content';

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
              <Link className="button-primary" href="/#products">
                Choose products
              </Link>
              <Link className="button-secondary" href="/corporate-gifts">
                Corporate sets
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
          viewport={{ once: true, amount: 0.2 }}
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
          viewport={{ once: true, amount: 0.2 }}
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

        <motion.div
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <ProductShelf eyebrow="Packaged products" title="Pieces commonly built into gift-ready sets" items={packagingSamples} />
        </motion.div>

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
          className="editorial-band"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          style={{ gridTemplateColumns: '1fr', textAlign: 'center', maxWidth: '800px', margin: '80px auto 0' }}
        >
          <div>
            <p className="eyebrow">Finish details</p>
            <h2 style={{ marginBottom: '24px' }}>Packaging is quoted with the product set</h2>
            <p style={{ margin: '0 auto' }}>
              Share quantity, occasion, city, timelines and any colour or branding direction. We will recommend a
              practical packaging route before production starts.
            </p>
          </div>
        </motion.section>
      </main>
      <SiteFooter />
    </div>
  );
}
