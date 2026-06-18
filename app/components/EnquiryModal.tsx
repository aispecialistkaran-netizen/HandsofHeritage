'use client';

import Image from 'next/image';
import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import type { ShowcaseItem } from '../site-content';

type EnquiryModalProps = {
  item: ShowcaseItem | null;
  onClose: () => void;
};

export function EnquiryModal({ item, onClose }: EnquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState('');
  const [occasion, setOccasion] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!item) {
    return null;
  }

  const closeModal = () => {
    onClose();
    // Reset submission state after panel slides down
    setTimeout(() => {
      setIsSubmitted(false);
    }, 400);
  };

  const submitEnquiry = async () => {
    if (!name || !email) {
      window.alert('Please fill in both your name and email address.');
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'quotes'), {
        type: 'single',
        name,
        email,
        phone,
        quantity: quantity ? parseInt(quantity, 10) : 0,
        occasion,
        city,
        createdAt: new Date().toISOString(),
        status: 'New',
        items: [
          {
            name: item.name,
            material: item.material,
            category: item.category,
            image: item.image,
          },
        ],
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit enquiry to Firebase:', error);
      window.alert('Failed to submit enquiry. Please check your network connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="drawer-overlay enquiry-overlay" onClick={closeModal}>
      <div className="drawer-panel enquiry-panel" onClick={(event) => event.stopPropagation()}>
        <button className="drawer-close" onClick={closeModal} aria-label="Close enquiry form">
          x
        </button>
        {isSubmitted ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '30px 10px 10px',
              gap: '20px',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#fdfbf9',
                border: '1.5px dashed #b5632a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
              }}
            >
              ✨
            </div>

            <div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#251b14', margin: '0 0 8px 0' }}>
                Enquiry Received
              </h2>
              <p style={{ color: '#7c6950', fontSize: '1rem', lineHeight: 1.5, margin: 0, maxWidth: '450px' }}>
                Thank you, <strong>{name}</strong>! Your interest in the <strong>{item.name}</strong> has been shared with our team.
              </p>
            </div>

            <div
              style={{
                width: '100%',
                maxWidth: '400px',
                background: '#fffdfa',
                border: '1px solid rgba(181, 99, 42, 0.12)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#eadfce', flexShrink: 0 }}>
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#251b14', fontWeight: 600 }}>{item.name}</h4>
                  <small style={{ color: '#8f7a5f', fontSize: '0.8rem' }}>{item.material} / {item.category}</small>
                </div>
              </div>
              <div style={{ borderTop: '1px solid rgba(34, 24, 14, 0.06)', paddingTop: '10px', fontSize: '0.85rem', color: '#5f4f3b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {quantity && <div><strong>Approx Quantity:</strong> {quantity} units</div>}
                {occasion && <div><strong>Occasion:</strong> {occasion}</div>}
                {city && <div><strong>Delivery City:</strong> {city}</div>}
                <div><strong>Contact Email:</strong> {email}</div>
                {phone && <div><strong>Contact Phone:</strong> {phone}</div>}
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#8c7a65', margin: 0, maxWidth: '380px', lineHeight: 1.5 }}>
              We will contact you via email or phone within 24 hours to discuss pricing details, bespoke branding, and delivery timelines.
            </p>

            <button
              type="button"
              className="drawer-submit"
              onClick={() => {
                setName('');
                setEmail('');
                setPhone('');
                setQuantity('');
                setOccasion('');
                setCity('');
                setIsSubmitted(false);
                onClose();
              }}
              style={{ maxWidth: '200px', marginTop: '6px' }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
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
              <input 
                type="text" 
                placeholder="Your name" 
                aria-label="Your name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
              <input 
                type="email" 
                placeholder="Email address" 
                aria-label="Email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <input 
                type="tel" 
                placeholder="Phone number" 
                aria-label="Phone number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
              />
              <input 
                type="number" 
                placeholder="Approx. quantity" 
                aria-label="Approximate quantity" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)}
                disabled={isSubmitting}
              />
              <input 
                type="text" 
                placeholder="Occasion or company" 
                aria-label="Occasion or company" 
                value={occasion} 
                onChange={(e) => setOccasion(e.target.value)}
                disabled={isSubmitting}
              />
              <input 
                type="text" 
                placeholder="Delivery city" 
                aria-label="Delivery city" 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                disabled={isSubmitting}
              />
              <button 
                className="drawer-submit" 
                onClick={submitEnquiry}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send enquiry'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
