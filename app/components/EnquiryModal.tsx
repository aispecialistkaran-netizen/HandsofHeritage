'use client';

import Image from 'next/image';
import type { ShowcaseItem } from '../site-content';

type EnquiryModalProps = {
  item: ShowcaseItem | null;
  onClose: () => void;
};

export function EnquiryModal({ item, onClose }: EnquiryModalProps) {
  if (!item) {
    return null;
  }

  const submitEnquiry = () => {
    window.alert(`Thank you. Your enquiry for ${item.name} has been received.`);
    onClose();
  };

  return (
    <div className="drawer-overlay enquiry-overlay" onClick={onClose}>
      <div className="drawer-panel enquiry-panel" onClick={(event) => event.stopPropagation()}>
        <button className="drawer-close" onClick={onClose} aria-label="Close enquiry form">
          x
        </button>
        <div className="enquiry-product">
          <div className="enquiry-thumb">
            <Image src={item.image} alt={item.name} fill sizes="96px" />
          </div>
          <div>
            <p className="eyebrow">Product enquiry</p>
            <h2>{item.name}</h2>
            <small>
              {item.material} / {item.category}
            </small>
          </div>
        </div>
        <p>Share your quantity and occasion details. Our team will follow up with pricing, packaging and timelines.</p>
        <div className="drawer-form">
          <input type="text" placeholder="Your name" aria-label="Your name" />
          <input type="email" placeholder="Email address" aria-label="Email address" />
          <input type="tel" placeholder="Phone number" aria-label="Phone number" />
          <input type="number" placeholder="Approx. quantity" aria-label="Approximate quantity" />
          <input type="text" placeholder="Occasion or company" aria-label="Occasion or company" />
          <input type="text" placeholder="Delivery city" aria-label="Delivery city" />
          <button className="drawer-submit" onClick={submitEnquiry}>
            Send enquiry
          </button>
        </div>
      </div>
    </div>
  );
}
