'use client';

import Image from 'next/image';
import { useState } from 'react';
import { EnquiryModal } from './EnquiryModal';
import type { ShowcaseItem } from '../site-content';

type GalleryGridProps = {
  items: ShowcaseItem[];
};

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);

  return (
    <>
      <section className="gallery-grid" aria-label="Product gallery">
        {items.map((item, index) => (
          <figure className={`gallery-tile ${index % 9 === 0 ? 'wide' : ''}`} key={item.name}>
            <div role="button" tabIndex={0} className="gallery-tile-button" onClick={() => setSelectedItem(item)}>
              <div className="gallery-image">
                <Image src={item.image} alt={item.name} fill sizes="(max-width: 560px) 100vw, (max-width: 1040px) 50vw, 25vw" priority={index < 2} />
              </div>
              <figcaption>
                <span>{item.material}</span>
                {item.name}
              </figcaption>
            </div>
          </figure>
        ))}
      </section>
      <EnquiryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
