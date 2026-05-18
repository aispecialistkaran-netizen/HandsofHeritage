import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ProductShelf } from '../components/ProductShelf';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { pickItems } from '../site-content';

export const metadata: Metadata = {
  title: 'Corporate Gifts | Hands of Heritage',
  description: 'Premium handcrafted corporate gifting for clients, teams and event delegates.',
};

const corporatePicks = pickItems([
  'Pure copper water tumbler',
  'Hammered copper Moscow mule mug',
  'Copper teaspoon gift set',
  'Copper napkin ring',
  'Brass bookmark',
  'Copper keychain',
  'Marble Taj Mahal paperweight',
  'Brass spice spoon',
  'Brass trinket box',
  'Brass temple bell',
  'Marble spice bowl',
  'Marble candle holder',
  'Copper incense holder',
  'Brass elephant figurine',
  'Marble ring holder',
  'Mini copper lota pot',
]);

export default function CorporateGiftsPage() {
  return (
    <div className="page-shell">
      <SiteHeader activeHref="/corporate-gifts" />
      <main className="subpage-main">
        <section className="subpage-hero">
          <div className="subpage-copy">
            <p className="eyebrow">Corporate gifts</p>
            <h1>Refined gifting for clients, teams and milestone events</h1>
            <p>
              Choose premium handcrafted pieces for leadership offsites, festive dispatches, onboarding kits and
              conference gifting. We help balance utility, cultural character and polished presentation.
            </p>
            <div className="hero-actions">
              <Link className="button-primary" href="/#products">
                Build a gift set
              </Link>
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

        <section className="story-section">
          <div className="story-copy">
            <p className="eyebrow">Program design</p>
            <h2>Corporate gifting that works across many occasions</h2>
            <p>
              A strong corporate gift needs to feel useful, culturally grounded and easy to dispatch at scale. We
              shortlist products by role, quantity, event timing and presentation format so the final set feels
              premium without becoming complicated to manage.
            </p>
            <div className="story-points">
              <span>Leadership gifts</span>
              <span>Festive dispatches</span>
              <span>Delegate kits</span>
              <span>Employee milestones</span>
            </div>
          </div>
          <div className="story-image-grid">
            {corporatePicks.slice(3, 7).map((item) => (
              <div className="story-image" key={item.name}>
                <Image src={item.image} alt={item.name} fill sizes="(max-width: 1040px) 50vw, 22vw" />
              </div>
            ))}
          </div>
        </section>

        <section className="long-panel">
          <div>
            <p className="eyebrow">Use cases</p>
            <h2>Built for repeat gifting calendars</h2>
          </div>
          <div className="matrix-grid">
            {[
              ['Festive gifting', 'Copper drinkware, brass decor and marble desk pieces packed as premium seasonal sets.'],
              ['Leadership offsites', 'Compact keepsakes for retreats, board meetings and annual planning sessions.'],
              ['Client onboarding', 'Refined gift boxes that introduce a relationship without feeling generic.'],
              ['Conference counters', 'Fast-moving favour formats for delegates, speakers and VIP guests.'],
              ['Employee recognition', 'Practical pieces that suit anniversaries, achievements and team celebrations.'],
              ['International guests', 'Culturally rooted objects that travel well and communicate Indian craft clearly.'],
            ].map(([title, text]) => (
              <article className="matrix-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <ProductShelf eyebrow="Corporate edit" title="Gifts built for repeated use" items={corporatePicks} />

        <section className="process-section">
          <div className="section-intro">
            <p className="eyebrow">Buying flow</p>
            <h2>From shortlist to dispatch plan</h2>
          </div>
          {[
            ['01', 'Brief', 'Share occasion, audience, city, approximate quantity and budget range.'],
            ['02', 'Shortlist', 'We recommend product combinations that match your event tone and operational needs.'],
            ['03', 'Packaging', 'Box, sleeve, insert and brand treatment are aligned with the selected products.'],
            ['04', 'Sampling', 'For larger orders, approve a sample or reference set before production.'],
            ['05', 'Dispatch', 'Production, packing and delivery are planned around your event or campaign calendar.'],
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
            <p className="eyebrow">Bulk gifting</p>
            <h2>
              Make every dispatch feel <em>considered</em>
            </h2>
          </div>
          <Link className="button-primary" href="/#products">
            Request options
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
