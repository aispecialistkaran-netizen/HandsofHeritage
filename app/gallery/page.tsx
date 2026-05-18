import type { Metadata } from 'next';
import Link from 'next/link';
import { GalleryGrid } from '../components/GalleryGrid';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { showcaseItems } from '../site-content';

export const metadata: Metadata = {
  title: 'Gallery | Hands of Heritage',
  description: 'Browse the Hands of Heritage handcrafted gifting gallery.',
};

export default function GalleryPage() {
  return (
    <div className="page-shell">
      <SiteHeader activeHref="/gallery" />
      <main className="subpage-main">
        <section className="gallery-hero">
          <div>
            <p className="eyebrow">Gallery</p>
            <h1>Browse the full handcrafted collection</h1>
            <p>
              Explore copper, brass and marble pieces across drinkware, decor, accessories and serveware. Every
              item can be folded into wedding favours, corporate sets or custom hampers.
            </p>
          </div>
          <Link className="button-primary" href="/#products">
            Request a quote
          </Link>
        </section>

        <section className="long-panel gallery-intro-panel">
          <div>
            <p className="eyebrow">Materials</p>
            <h2>Three craft families, one gifting catalogue</h2>
          </div>
          <div className="matrix-grid">
            {[
              ['Copper', 'Warm, useful drinkware and accessories for wellness-led or daily-use gifting.'],
              ['Brass', 'Ceremonial decor, desk objects and festive pieces with a traditional Indian feel.'],
              ['Marble', 'Polished table, desk and decor pieces with a clean premium finish.'],
            ].map(([title, text]) => (
              <article className="matrix-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <GalleryGrid items={showcaseItems} />

        <section className="process-section">
          <div className="section-intro">
            <p className="eyebrow">How to use the gallery</p>
            <h2>Turn favourites into a quote shortlist</h2>
          </div>
          {[
            ['01', 'Browse', 'Click any product image to open the enquiry form with that product selected.'],
            ['02', 'Compare', 'Look across materials and categories before deciding on a single item or mixed set.'],
            ['03', 'Share details', 'Send quantity, event type, city and any packaging notes.'],
            ['04', 'Curate', 'We recommend final combinations based on your use case and budget.'],
            ['05', 'Confirm', 'Products and packaging are finalized together before production.'],
          ].map(([number, title, text]) => (
            <article className="process-row" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
