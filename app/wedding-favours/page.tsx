import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ProductShelf } from '../components/ProductShelf';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { pickItems } from '../site-content';

export const metadata: Metadata = {
  title: 'Wedding Favours | Hands of Heritage',
  description: 'Curated handcrafted Indian wedding favours in copper, brass and marble.',
};

const weddingPicks = pickItems([
  'Lotus brass tealight holder',
  'Mini brass diya oil lamp',
  'Copper tea light holder',
  'Peacock brass diya lamp',
  'Taj marble coaster set',
  'Marble ring holder',
  'Copper bookmark',
  'Brass trinket box',
  'Marble Taj Mahal paperweight',
  'Marble jewellery dish',
  'Brass Ganesha mini statue',
  'Copper napkin ring',
  'Marble tealight holder',
  'Mini copper lota pot',
  'Brass incense holder',
  'Marble candle holder',
]);

export default function WeddingFavoursPage() {
  return (
    <div className="page-shell">
      <SiteHeader activeHref="/wedding-favours" />
      <main className="subpage-main">
        <section className="subpage-hero">
          <div className="subpage-copy">
            <p className="eyebrow">Wedding favours</p>
            <h1>Keepsakes for ceremonies, welcome hampers and guest tables</h1>
            <p>
              Build a favour story around artisan-made pieces that guests can take home and keep using. Copper,
              brass and marble options can be curated by ritual, guest profile, budget and presentation style.
            </p>
            <div className="hero-actions">
              <Link className="button-primary" href="/#products">
                Select favours
              </Link>
              <Link className="button-secondary" href="/packaging">
                View packaging
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

        <section className="detail-grid">
          {[
            ['Ceremony keepsakes', 'Diyas, tealight holders and incense pieces for pujas, mehendi corners and reception tables.'],
            ['Guest-room hampers', 'Compact copper and marble items that pair well with sweets, notes and local treats.'],
            ['Personal touches', 'Add names, dates, tags, sleeves and curated packaging around your wedding palette.'],
          ].map(([title, text]) => (
            <article className="feature-panel" key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </section>

        <section className="story-section">
          <div className="story-copy">
            <p className="eyebrow">Celebration planning</p>
            <h2>Favour ideas for every part of the wedding week</h2>
            <p>
              Each event can carry its own gifting language. Brass diyas suit ceremonial evenings, marble pieces
              work beautifully for room hampers, and compact copper accessories are practical for welcome desks,
              mehendi tables and farewell baskets.
            </p>
            <div className="story-points">
              <span>Welcome rooms</span>
              <span>Mehendi tables</span>
              <span>Puja ceremonies</span>
              <span>Reception seating</span>
            </div>
          </div>
          <div className="story-image-grid">
            {weddingPicks.slice(3, 7).map((item) => (
              <div className="story-image" key={item.name}>
                <Image src={item.image} alt={item.name} fill sizes="(max-width: 1040px) 50vw, 22vw" />
              </div>
            ))}
          </div>
        </section>

        <section className="long-panel">
          <div>
            <p className="eyebrow">Event map</p>
            <h2>Build a complete guest journey</h2>
          </div>
          <div className="matrix-grid">
            {[
              ['Save-the-date parcels', 'Small bookmarks, tags or keepsakes paired with the first wedding note.'],
              ['Welcome hampers', 'Marble dishes, tumblers and local treats arranged for guest rooms.'],
              ['Haldi and mehendi', 'Bright, compact favours that are easy to distribute during high-energy events.'],
              ['Puja ceremonies', 'Diyas, incense holders and brass pieces that connect directly to ritual use.'],
              ['Reception tables', 'Place-setting pieces that double as take-home gifts for each guest.'],
              ['Farewell baskets', 'Practical keepsakes packed with thank-you cards for the final send-off.'],
            ].map(([title, text]) => (
              <article className="matrix-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <ProductShelf eyebrow="Wedding edit" title="Favourite pieces for celebrations" items={weddingPicks} />

        <section className="process-section">
          <div className="section-intro">
            <p className="eyebrow">Wedding timeline</p>
            <h2>Plan favours without last-minute decisions</h2>
          </div>
          {[
            ['01', 'Theme', 'Share event functions, colour direction, guest count and the type of memory you want guests to take home.'],
            ['02', 'Curation', 'We suggest pieces by ceremony, material, size and packing style.'],
            ['03', 'Personalization', 'Names, dates, tags, inserts and sleeves are planned around the selected favour.'],
            ['04', 'Approval', 'Confirm final products, quantities and packaging before production begins.'],
            ['05', 'Delivery', 'Favours are packed by set, event or guest group so handover is simple.'],
          ].map(([number, title, text]) => (
            <article className="process-row" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>

        <section className="quote-banner">
          <div>
            <p className="eyebrow">Plan the set</p>
            <h2>
              Match favours to <em>every</em> wedding event
            </h2>
          </div>
          <Link className="button-primary" href="/#products">
            Start a quote
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
