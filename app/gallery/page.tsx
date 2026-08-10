import type { Metadata } from 'next';
import { GalleryGrid } from '../components/GalleryGrid';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { products } from '../site-content';

export const metadata: Metadata = {
  title: 'Catalogue Gallery | Hands of Heritage',
  description: 'Browse the full Hands of Heritage handcrafted gifting catalogue with search and filters.',
};

export default function GalleryPage() {
  return (
    <div className="page-shell">
      <SiteHeader activeHref="/gallery" />
      <main className="subpage-main">
        <section className="gallery-hero" style={{ paddingBottom: '32px' }}>
          <div>
            <p className="eyebrow">Catalogue Gallery</p>
            <h1>Browse the full handcrafted collection</h1>
            <p>
              Explore copper, brass and marble keepsakes across drinkware, decor, accessories and serveware. Use the search bar and filter criteria below to curate your shortlist.
            </p>
          </div>
        </section>

        <GalleryGrid items={products} />
      </main>
      <SiteFooter />
    </div>
  );
}
