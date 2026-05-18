'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';

type Product = {
  id: number;
  name: string;
  material: string;
  materialKey: string;
  category: string;
  image: string;
  min: string;
};

const products: Product[] = [
  {
    id: 1,
    name: 'Pure copper water tumbler',
    material: 'Copper',
    materialKey: 'copper',
    category: 'drinkware',
    image: '/Pure Copper Water Tumbler.png',
    min: 'Min. 50 units',
  },
  {
    id: 2,
    name: 'Hammered copper Moscow mule mug',
    material: 'Copper',
    materialKey: 'copper',
    category: 'drinkware',
    image: '/Hammered Copper Moscow Mule Mug.png',
    min: 'Min. 50 units',
  },
  {
    id: 3,
    name: 'Mini copper lota pot',
    material: 'Copper',
    materialKey: 'copper',
    category: 'decor',
    image: '/Mini_Copper_Lota_Pot.png',
    min: 'Min. 50 units',
  },
  {
    id: 4,
    name: 'Copper teaspoon gift set',
    material: 'Copper',
    materialKey: 'copper',
    category: 'serveware',
    image: '/Copper_Teaspoon_Gift_Set.png',
    min: 'Min. 40 sets',
  },
  {
    id: 5,
    name: 'Copper napkin ring',
    material: 'Copper',
    materialKey: 'copper',
    category: 'serveware',
    image: '/Copper_Napkin_Ring.png',
    min: 'Min. 100 units',
  },
  {
    id: 6,
    name: 'Copper keychain',
    material: 'Copper',
    materialKey: 'copper',
    category: 'accessories',
    image: '/Copper_Keychain.png',
    min: 'Min. 100 units',
  },
  {
    id: 7,
    name: 'Copper incense holder',
    material: 'Copper',
    materialKey: 'copper',
    category: 'decor',
    image: '/Copper_Incense_Holder.png',
    min: 'Min. 50 units',
  },
  {
    id: 8,
    name: 'Copper bookmark',
    material: 'Copper',
    materialKey: 'copper',
    category: 'accessories',
    image: '/Copper_Bookmark.png',
    min: 'Min. 100 units',
  },
  {
    id: 9,
    name: 'Copper tea light holder',
    material: 'Copper',
    materialKey: 'copper',
    category: 'decor',
    image: '/Copper Tea Light Holder.png',
    min: 'Min. 50 units',
  },
  {
    id: 10,
    name: 'Mini brass diya oil lamp',
    material: 'Brass',
    materialKey: 'brass',
    category: 'decor',
    image: '/Mini_Brass_Diya_Oil_Lamp.png',
    min: 'Min. 100 units',
  },
  {
    id: 11,
    name: 'Lotus brass tealight holder',
    material: 'Brass',
    materialKey: 'brass',
    category: 'decor',
    image: '/Lotus_Brass_Tealight_Holder.png',
    min: 'Min. 75 units',
  },
  {
    id: 12,
    name: 'Peacock brass diya lamp',
    material: 'Brass',
    materialKey: 'brass',
    category: 'decor',
    image: '/Peacock_Brass_Diya_Lamp.png',
    min: 'Min. 50 units',
  },
  {
    id: 13,
    name: 'Brass temple bell',
    material: 'Brass',
    materialKey: 'brass',
    category: 'decor',
    image: '/Brass_Temple_Bell.png',
    min: 'Min. 50 units',
  },
  {
    id: 14,
    name: 'Brass Ganesha mini statue',
    material: 'Brass',
    materialKey: 'brass',
    category: 'decor',
    image: '/Brass_Ganesha_Mini_Statue.png',
    min: 'Min. 50 units',
  },
  {
    id: 15,
    name: 'Brass elephant figurine',
    material: 'Brass',
    materialKey: 'brass',
    category: 'decor',
    image: '/Brass_Elephant_Figurine.png',
    min: 'Min. 50 units',
  },
  {
    id: 16,
    name: 'Brass incense holder',
    material: 'Brass',
    materialKey: 'brass',
    category: 'decor',
    image: '/Brass_Incense_Holder.png',
    min: 'Min. 75 units',
  },
  {
    id: 17,
    name: 'Brass spice spoon',
    material: 'Brass',
    materialKey: 'brass',
    category: 'serveware',
    image: '/Brass_Spice_Spoon.png',
    min: 'Min. 100 units',
  },
  {
    id: 18,
    name: 'Brass bookmark',
    material: 'Brass',
    materialKey: 'brass',
    category: 'accessories',
    image: '/Brass_Bookmark.png',
    min: 'Min. 100 units',
  },
  {
    id: 19,
    name: 'Brass trinket box',
    material: 'Brass',
    materialKey: 'brass',
    category: 'accessories',
    image: '/Brass_Trinket_Box.png',
    min: 'Min. 50 units',
  },
  {
    id: 20,
    name: 'Taj marble coaster set',
    material: 'Marble',
    materialKey: 'marble',
    category: 'serveware',
    image: '/Taj_Marble_Coaster_Set.png',
    min: 'Min. 50 sets',
  },
  {
    id: 21,
    name: 'Marble candle holder',
    material: 'Marble',
    materialKey: 'marble',
    category: 'decor',
    image: '/Marble_Candle_Holder.png',
    min: 'Min. 50 units',
  },
  {
    id: 22,
    name: 'Marble elephant figurine',
    material: 'Marble',
    materialKey: 'marble',
    category: 'decor',
    image: '/Marble_Elephant_Figurine.png',
    min: 'Min. 50 units',
  },
  {
    id: 23,
    name: 'Marble jewellery dish',
    material: 'Marble',
    materialKey: 'marble',
    category: 'accessories',
    image: '/Marble_Jewellery_Dish.png',
    min: 'Min. 50 units',
  },
  {
    id: 24,
    name: 'Marble incense holder',
    material: 'Marble',
    materialKey: 'marble',
    category: 'decor',
    image: '/Marble_Incense_Holder.png',
    min: 'Min. 50 units',
  },
  {
    id: 25,
    name: 'Marble Taj Mahal paperweight',
    material: 'Marble',
    materialKey: 'marble',
    category: 'accessories',
    image: '/Marble_Taj_Mahal_Paperweight.png',
    min: 'Min. 50 units',
  },
  {
    id: 26,
    name: 'Marble tealight holder',
    material: 'Marble',
    materialKey: 'marble',
    category: 'decor',
    image: '/Marble_Tealight_Holder.png',
    min: 'Min. 50 units',
  },
  {
    id: 27,
    name: 'Marble soap dish',
    material: 'Marble',
    materialKey: 'marble',
    category: 'decor',
    image: '/Marble_Soap_Dish.png',
    min: 'Min. 50 units',
  },
  {
    id: 28,
    name: 'Marble ring holder',
    material: 'Marble',
    materialKey: 'marble',
    category: 'accessories',
    image: '/Marble_Ring_Holder.png',
    min: 'Min. 50 units',
  },
  {
    id: 29,
    name: 'Marble spice bowl',
    material: 'Marble',
    materialKey: 'marble',
    category: 'serveware',
    image: '/Marble_Spice_Bowl.png',
    min: 'Min. 50 units',
  },
];

const filters = [
  { key: 'all', label: 'All' },
  { key: 'copper', label: 'Copper' },
  { key: 'brass', label: 'Brass' },
  { key: 'marble', label: 'Marble' },
  { key: 'drinkware', label: 'Drinkware' },
  { key: 'serveware', label: 'Serveware' },
  { key: 'decor', label: 'Decor' },
  { key: 'accessories', label: 'Accessories' },
];

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

const faqs = [
  { q: 'What is the minimum order quantity (MOQ)?', a: 'Our standard MOQ starts at 50 units for most handcrafted pieces, though some premium marble or large brass items can be ordered in smaller batches of 25.' },
  { q: 'How long does a custom order take?', a: 'We recommend placing your order 6-8 weeks before your event. This allows our artisans ample time to craft, engrave, and perfectly package your favours.' },
  { q: 'Do you ship internationally for destination weddings?', a: 'Yes, we have extensive experience safely shipping our handcrafted gifts worldwide, ensuring they arrive securely and on time for your destination celebration.' },
];

function FaqItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(34, 24, 14, 0.1)', padding: '24px 0' }}>
      <div 
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)} 
        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h3 style={{ margin: 0, fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#251b14' }}>{q}</h3>
        <span style={{ fontSize: '1.8rem', color: '#b5632a', fontWeight: 300 }}>{isOpen ? '−' : '+'}</span>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ marginTop: '16px', marginBottom: 0, color: '#5f4f3b', lineHeight: 1.8, fontSize: '1rem' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [quoteItems, setQuoteItems] = useState<Product[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loader after a smooth 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleOpenDrawer = () => setDrawerOpen(true);
    window.addEventListener('open-quote-drawer', handleOpenDrawer);
    return () => window.removeEventListener('open-quote-drawer', handleOpenDrawer);
  }, []);

  const filteredProducts = useMemo(
    () =>
      activeFilter === 'all'
        ? products
        : products.filter((item) => item.category === activeFilter || item.materialKey === activeFilter),
    [activeFilter]
  );

  const addToQuote = (id: number) => {
    const product = products.find((item) => item.id === id);
    if (!product || quoteItems.some((item) => item.id === id)) {
      setDrawerOpen(true);
      return;
    }
    setQuoteItems((current) => [...current, product]);
    setDrawerOpen(true);
  };

  const removeFromQuote = (id: number) => {
    setQuoteItems((current) => current.filter((item) => item.id !== id));
  };

  const submitQuote = () => {
    window.alert('Thank you! Your enquiry has been received. We will be in touch within 24 hours.');
    setQuoteItems([]);
    setDrawerOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="page-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
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
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <Image src="/logohoh.png" alt="Hands of Heritage logo" width={140} height={126} priority />
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
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <div className="brand-mark">
          <Image src="/logohoh.png" alt="Hands of Heritage logo" width={58} height={52} priority className="brand-logo" />
          <div>
            <span>Hands of</span>
            <strong>Heritage</strong>
          </div>
        </div>
        <nav className="header-nav">
          <ul>
            {homeNavLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <button type="button" className="nav-cta" onClick={() => setDrawerOpen(true)}>
            Request a quote
            <span className={`quote-count ${quoteItems.length ? 'visible' : ''}`}>{quoteItems.length}</span>
          </button>
        </nav>
      </motion.header>

      <main>
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
              A premium collection of artisan-made wedding favours and corporate gifts. Each keepsake is curated with mindful craftsmanship, luxe materials and elegant personalization.
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

        <motion.section
          className="info-section"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div className="section-intro">
            <p className="eyebrow">How it works</p>
            <h2>Effortless curation with bespoke support</h2>
          </div>
          <div className="steps-grid">
            {[
              { title: 'Browse', text: 'Explore our curated catalogue of handmade Indian copper, brass and marble gifts for homes, events and business gifting.' },
              { title: 'Select', text: 'Add items to your quote basket. We build a tailored package around your quantity and brief.' },
              { title: 'Consult', text: 'We connect to discuss personalization, packaging, delivery dates and gifting presentation.' },
              { title: 'Receive', text: 'Your curated favour set arrives gift-ready with refined presentation and careful packing.' },
            ].map((step, index) => (
              <motion.div key={step.title} className="step-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <span className="step-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="catalogue-section"
          id="products"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div className="section-intro">
            <p className="eyebrow">Popular favourites</p>
            <h2>Explore the copper, brass and marble collection</h2>
          </div>
          <div className="filter-toolbar">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter.key}
                className={`filter-chip ${activeFilter === filter.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                role="button"
                tabIndex={0}
                className="product-card"
                onClick={() => addToQuote(product.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="product-image">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 560px) 100vw, (max-width: 780px) 50vw, (max-width: 1040px) 100vw, 25vw"
                  />
                </div>
                <div className="product-material">{product.material}</div>
                <h3>{product.name}</h3>
                <p>{product.min}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="story-section"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div className="story-copy">
            <p className="eyebrow">The Artisan Story</p>
            <h2>Rooted in Indian Heritage</h2>
            <p>
              Our collections are born from the hands of generational artisans. 
              By choosing Hands of Heritage, you preserve the ancient arts of brass, copper, 
              and marble crafting, ensuring that true craftsmanship continues to thrive.
            </p>
          </div>
          <div className="story-image-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="story-image" style={{ aspectRatio: '16/9' }}>
              <video 
                src="/download.mp4" 
                autoPlay 
                muted 
                loop 
                playsInline 
                style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 }} 
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="editorial-band"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div className="story-image" style={{ aspectRatio: '4/3' }}>
            <Image src="/packaging_showcase.png" alt="Bespoke Packaging" fill sizes="(max-width: 1040px) 100vw, 50vw" />
          </div>
          <div className="story-copy">
            <p className="eyebrow">Unboxing the Experience</p>
            <h2>Bespoke Packaging</h2>
            <p>
              Presentation is just as important as the gift itself. Our favours arrive 
              event-ready in custom velvet boxes, finished with elegant ribbons, personalized 
              engraved tags, and custom wax seals, leaving a lasting impression on your guests.
            </p>
          </div>
        </motion.section>

        <motion.section
          className="catalogue-section"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div className="section-intro">
            <p className="eyebrow">Curated Collections</p>
            <h2>Curated for your occasion</h2>
          </div>
          <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {[
              { title: 'The Mehendi Edit', desc: 'Bright, vibrant, fun pieces', img: '/mehendi_edit.png' },
              { title: 'The Welcome Hamper', desc: 'Practical items for hotel rooms', img: '/welcome_hamper.png' },
              { title: 'The Boardroom Collection', desc: 'Sleek corporate gifts', img: '/boardroom_collection.png' },
            ].map((edit) => (
              <div key={edit.title} className="product-card" style={{ cursor: 'default', transform: 'none', boxShadow: 'none', borderColor: 'rgba(37, 27, 18, 0.08)' }}>
                <div className="product-image" style={{ aspectRatio: '4/3' }}>
                  <Image src={edit.img} alt={edit.title} fill sizes="(max-width: 1040px) 100vw, 33vw" />
                </div>
                <h3>{edit.title}</h3>
                <p style={{ marginTop: '6px' }}>{edit.desc}</p>
              </div>
            ))}
          </div>
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
            <p className="eyebrow">Social Proof</p>
            <h2>Memories we&apos;ve helped create</h2>
          </div>
          <div className="matrix-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {[
              { quote: "The marble coasters in our welcome hampers were the talk of the wedding. Absolutely flawless presentation.", author: "Priya & Rohan" },
              { quote: "Hands of Heritage delivered 500 bespoke brass paperweights for our annual gala. The craftsmanship is unmatched.", author: "Director, Global Tech" },
              { quote: "From the first consultation to the final delivery, the team made gifting completely stress-free.", author: "Neha, Event Planner" },
            ].map((t, i) => (
              <div key={i} className="matrix-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ fontStyle: 'italic', fontSize: '1.1rem', color: '#251b14', marginBottom: '24px' }}>&quot;{t.quote}&quot;</p>
                <p className="eyebrow" style={{ margin: 0 }}>— {t.author}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="info-section"
          style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '80px' }}
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div className="section-intro" style={{ textAlign: 'center' }}>
            <p className="eyebrow">The Finer Details</p>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div style={{ marginTop: '40px' }}>
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </motion.section>

        <motion.section
          className="quote-banner"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div>
            <p className="eyebrow">Bespoke gifting</p>
            <h2>
              Every favour, <em>personally</em> crafted for you
            </h2>
          </div>
          <button type="button" className="button-primary" onClick={() => setDrawerOpen(true)}>
            Request a personalised quote
          </button>
        </motion.section>
      </main>

      <motion.footer
        className="site-footer"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: 'easeOut' }}
      >
        <p>(c) 2026 Hands of Heritage. All rights reserved.</p>
        <div className="footer-links">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Instagram</span>
        </div>
      </motion.footer>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div key="drawer-overlay" className="drawer-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)}>
            <motion.div className="drawer-panel" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 220, damping: 22 }} onClick={(event) => event.stopPropagation()}>
              <button type="button" className="drawer-close" onClick={() => setDrawerOpen(false)}>
                x
              </button>
              <h2>Your quote basket</h2>
              <p>Items you have selected, plus our team will follow up with tailored pricing and packaging options.</p>
              <div className="drawer-items">
                {quoteItems.length === 0 ? (
                  <p className="drawer-empty">No items added yet. Select a product to start your quote.</p>
                ) : (
                  quoteItems.map((item) => (
                    <div className="drawer-item" key={item.id}>
                      <div className="drawer-thumb">
                        <Image src={item.image} alt={item.name} fill sizes="56px" />
                      </div>
                      <div>
                        <p>{item.name}</p>
                        <small>{item.material}</small>
                      </div>
                      <button type="button" className="drawer-remove" onClick={() => removeFromQuote(item.id)}>
                        x
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="drawer-form">
                <input type="text" placeholder="Your name" aria-label="Your name" />
                <input type="email" placeholder="Email address" aria-label="Email address" />
                <input type="text" placeholder="Event type (e.g. Wedding, Diwali)" aria-label="Event type" />
                <input type="number" placeholder="Approx. guest count" aria-label="Guest count" />
                <button type="button" className="drawer-submit" onClick={submitQuote}>
                  Send enquiry
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
