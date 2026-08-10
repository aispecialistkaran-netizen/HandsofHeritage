'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuote } from '../context/QuoteContext';

export function ProductDetailModal() {
  const { activeDetailProduct, closeProductDetail, addToQuote, openDrawer } = useQuote();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!activeDetailProduct) return null;

  const images = activeDetailProduct.additionalImages && activeDetailProduct.additionalImages.length > 0
    ? activeDetailProduct.additionalImages
    : [activeDetailProduct.image];

  const handleAdd = () => {
    addToQuote(activeDetailProduct, quantity);
    closeProductDetail();
  };

  const handleAddAndOpen = () => {
    addToQuote(activeDetailProduct, quantity);
    closeProductDetail();
    openDrawer();
  };

  return (
    <AnimatePresence>
      <div className="drawer-overlay" onClick={closeProductDetail} style={{ zIndex: 9990 }}>
        <motion.div
          className="drawer-panel product-detail-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '680px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            margin: 'auto',
            borderRadius: '20px',
            position: 'relative',
          }}
        >
          <button
            type="button"
            className="drawer-close"
            onClick={closeProductDetail}
            aria-label="Close detail view"
            style={{ top: '16px', right: '16px' }}
          >
            ✕
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {/* Gallery View */}
            <div>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  backgroundColor: '#f3eae0',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
                }}
              >
                {images[selectedImageIndex]?.endsWith('.mp4') ? (
                  <video
                    src={images[selectedImageIndex]}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Image
                    src={images[selectedImageIndex] || activeDetailProduct.image}
                    alt={activeDetailProduct.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                )}
              </div>

              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {images.map((img, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      style={{
                        position: 'relative',
                        width: '56px',
                        height: '56px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: selectedImageIndex === index ? '2px solid #b5632a' : '1px solid rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        padding: 0,
                        backgroundColor: '#f3eae0',
                        flexShrink: 0,
                      }}
                    >
                      {img.endsWith('.mp4') ? (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333', color: '#fff', fontSize: '10px' }}>
                          VIDEO
                        </div>
                      ) : (
                        <Image src={img} alt={`Thumb ${index}`} fill style={{ objectFit: 'cover' }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span className="eyebrow" style={{ display: 'inline-block', marginBottom: '4px' }}>
                  {activeDetailProduct.material} • {activeDetailProduct.category}
                </span>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.0rem', color: '#251b14', margin: '0 0 8px 0', lineHeight: 1.2 }}>
                  {activeDetailProduct.name}
                </h2>
                <p style={{ fontSize: '0.92rem', color: '#5f4f3b', margin: 0, lineHeight: 1.5 }}>
                  {activeDetailProduct.description}
                </p>
              </div>

              {/* Specifications Box */}
              <div
                style={{
                  backgroundColor: '#fdfbf9',
                  border: '1px solid rgba(181, 99, 42, 0.15)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '0.86rem',
                }}
              >
                <div style={{ fontWeight: 600, color: '#b5632a', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.75rem' }}>
                  Product Specifications
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                  <div>
                    <strong style={{ color: '#251b14' }}>Dimensions:</strong>
                    <div style={{ color: '#6e5d48' }}>{activeDetailProduct.dimensions}</div>
                  </div>
                  <div>
                    <strong style={{ color: '#251b14' }}>Weight / Capacity:</strong>
                    <div style={{ color: '#6e5d48' }}>{activeDetailProduct.weightCapacity}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong style={{ color: '#251b14' }}>Exact Material:</strong>
                    <div style={{ color: '#6e5d48' }}>{activeDetailProduct.exactMaterial}</div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ backgroundColor: 'rgba(181, 99, 42, 0.1)', color: '#b5632a', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '20px' }}>
                  {activeDetailProduct.min}
                </span>
                {activeDetailProduct.personalisation && (
                  <span style={{ backgroundColor: '#eef5ec', color: '#2d6a37', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '20px' }}>
                    Personalisation Available
                  </span>
                )}
                {activeDetailProduct.isTravelFriendly && (
                  <span style={{ backgroundColor: '#eef2f7', color: '#2b547e', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: '20px' }}>
                    ✈️ Travel / Destination Ready
                  </span>
                )}
              </div>

              {/* Quantity Selector & Add Button */}
              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <label htmlFor="modal-qty" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#251b14' }}>
                    Est. Quantity:
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(34,24,14,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      style={{ padding: '6px 12px', background: '#f5efe8', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                    >
                      -
                    </button>
                    <input
                      id="modal-qty"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      style={{ width: '60px', textAlign: 'center', border: 'none', padding: '6px', fontSize: '0.9rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      style={{ padding: '6px 12px', background: '#f5efe8', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={handleAdd}
                    style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}
                  >
                    Add to Shortlist
                  </button>
                  <button
                    type="button"
                    className="button-primary"
                    onClick={handleAddAndOpen}
                    style={{ flex: 1.2, padding: '12px', fontSize: '0.9rem' }}
                  >
                    Add & Request Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
