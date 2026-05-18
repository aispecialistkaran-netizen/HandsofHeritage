'use client';

import Image from 'next/image';
import { useState } from 'react';
import { EnquiryModal } from './EnquiryModal';
import type { ShowcaseItem } from '../site-content';

type ProductShelfProps = {
  eyebrow: string;
  title: string;
  items: ShowcaseItem[];
};

export function ProductShelf({ eyebrow, title, items }: ProductShelfProps) {
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);

  return (
    <section className="catalogue-section compact-section">
      <div className="section-intro">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div className="product-grid showcase-grid">
        {items.map((item) => (
          <div role="button" tabIndex={0} className="product-card product-link-card" onClick={() => setSelectedItem(item)} key={item.name}>
            <div className="product-image">
              <Image src={item.image} alt={item.name} fill sizes="(max-width: 560px) 100vw, (max-width: 1040px) 50vw, 25vw" />
            </div>
            <div className="product-material">{item.material}</div>
            <h3>{item.name}</h3>
            <p>{item.category}</p>
          </div>
        ))}
      </div>
      <EnquiryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </section>
  );
}
