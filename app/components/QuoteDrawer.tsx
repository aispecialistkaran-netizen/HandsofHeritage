'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuote, type QuoteFormData } from '../context/QuoteContext';

export function QuoteDrawer() {
  const {
    quoteItems,
    drawerOpen,
    closeDrawer,
    removeFromQuote,
    updateQuantity,
    submitQuote,
    isSubmitting,
    isSubmitted,
    lastSubmissionData,
    resetSubmission,
  } = useQuote();

  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    deliveryLocation: '',
    packaging: 'Velvet gift box',
    personalisation: '',
    budget: '',
    notes: '',
  });

  if (!drawerOpen) return null;

  const handleInputChange = (field: keyof QuoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitQuote(formData);
  };

  const handleClose = () => {
    closeDrawer();
    setTimeout(() => {
      resetSubmission();
    }, 400);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="drawer-overlay"
        className="drawer-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        style={{ zIndex: 9995 }}
      >
        <motion.div
          className="drawer-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          onClick={(event) => event.stopPropagation()}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#fbf8f5',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '28px 24px',
            zIndex: 9996,
          }}
        >
          <button type="button" className="drawer-close" onClick={handleClose} aria-label="Close quote drawer">
            ✕
          </button>

          {isSubmitted && lastSubmissionData ? (
            <motion.div
              key="success-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '20px 0',
                gap: '16px',
                margin: 'auto 0',
              }}
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: '#fdfbf9',
                  border: '1.5px dashed #b5632a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.0rem',
                }}
              >
                ✨
              </div>

              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.0rem', color: '#251b14', margin: '0 0 6px 0' }}>
                  Quote Request Received
                </h2>
                <p style={{ color: '#7c6950', fontSize: '0.92rem', lineHeight: 1.5, margin: 0, maxWidth: '440px' }}>
                  Thank you, <strong>{lastSubmissionData.name}</strong>! Your quote enquiry for <strong>{quoteItems.length} selected product lines</strong> has been logged. An automated summary email has been generated to <strong>{lastSubmissionData.email}</strong>.
                </p>
              </div>

              {/* Notice Banner */}
              <div
                style={{
                  backgroundColor: '#eef5ec',
                  color: '#2d6a37',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  width: '100%',
                }}
              >
                ✉️ We normally respond with full pricing within one working day.
              </div>

              {/* Summary Card */}
              <div
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid rgba(181, 99, 42, 0.15)',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  textAlign: 'left',
                  fontSize: '0.86rem',
                }}
              >
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#b5632a', fontWeight: 700 }}>
                  Selected Items Summary
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '140px', overflowY: 'auto' }}>
                  {quoteItems.map((item) => (
                    <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                          <Image src={item.product.image} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <span style={{ color: '#251b14', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.product.name}
                        </span>
                      </div>
                      <span style={{ fontWeight: 600, color: '#b5632a', flexShrink: 0 }}>
                        {item.quantity} units
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px', color: '#5f4f3b', fontSize: '0.82rem' }}>
                  {lastSubmissionData.eventDate && <div><strong>Delivery/Event Date:</strong> {lastSubmissionData.eventDate}</div>}
                  {lastSubmissionData.deliveryLocation && <div><strong>Delivery Postcode/Country:</strong> {lastSubmissionData.deliveryLocation}</div>}
                  {lastSubmissionData.packaging && <div><strong>Packaging:</strong> {lastSubmissionData.packaging}</div>}
                  {lastSubmissionData.personalisation && <div><strong>Personalisation:</strong> {lastSubmissionData.personalisation}</div>}
                  {lastSubmissionData.budget && <div><strong>Budget:</strong> {lastSubmissionData.budget}</div>}
                </div>
              </div>

              <button
                type="button"
                className="button-primary"
                onClick={handleClose}
                style={{ width: '100%', padding: '12px', marginTop: '8px' }}
              >
                Continue shopping
              </button>
            </motion.div>
          ) : (
            <>
              <div style={{ marginBottom: '20px' }}>
                <span className="eyebrow" style={{ display: 'block', marginBottom: '4px' }}>
                  Quote Basket
                </span>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#251b14', margin: 0 }}>
                  Your Selected Keepsakes ({quoteItems.reduce((acc, i) => acc + i.quantity, 0)})
                </h2>
              </div>

              {/* Response Promise Banner */}
              <div
                style={{
                  backgroundColor: '#f3eae0',
                  borderLeft: '4px solid #b5632a',
                  padding: '10px 14px',
                  borderRadius: '0 8px 8px 0',
                  fontSize: '0.84rem',
                  color: '#4a3b2c',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>🕒</span>
                <span><strong>Response Promise:</strong> We normally respond with detailed pricing within one working day.</span>
              </div>

              {/* Product Shortlist Items */}
              <div className="drawer-items" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {quoteItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: '#8f7a5f', background: '#ffffff', borderRadius: '12px', border: '1px dashed rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 500 }}>Your quote basket is empty.</p>
                    <small>Explore our copper, brass and marble products and click <strong>Add to quote</strong>.</small>
                  </div>
                ) : (
                  quoteItems.map((item) => (
                    <div
                      key={item.product.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: '#ffffff',
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: '1px solid rgba(37, 27, 18, 0.08)',
                      }}
                    >
                      <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f5efe8' }}>
                        <Image src={item.product.image} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#251b14', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.product.name}
                        </h4>
                        <small style={{ color: '#8f7a5f', fontSize: '0.78rem' }}>
                          {item.product.material} • {item.product.min}
                        </small>
                      </div>

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '6px', overflow: 'hidden' }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          style={{ border: 'none', padding: '4px 8px', background: '#f5efe8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={1}
                          aria-label={`Quantity for ${item.product.name}`}
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            updateQuantity(item.product.id, isNaN(val) ? 1 : Math.max(1, val));
                          }}
                          style={{
                            width: '48px',
                            textAlign: 'center',
                            border: 'none',
                            padding: '2px 4px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: '#251b14',
                            backgroundColor: '#fff',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          style={{ border: 'none', padding: '4px 8px', background: '#f5efe8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromQuote(item.product.id)}
                        style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '1rem', padding: '4px' }}
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Quote Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                <h3 style={{ fontSize: '1.05rem', fontFamily: 'Cormorant Garamond, serif', color: '#251b14', margin: '8px 0 0 0' }}>
                  Event & Contact Details
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '2px' }}>
                      Required Delivery Date *
                    </label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => handleInputChange('eventDate', e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.86rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '2px' }}>
                      Postcode / Country *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SW1A 1AA, UK"
                      value={formData.deliveryLocation}
                      onChange={(e) => handleInputChange('deliveryLocation', e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.86rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '2px' }}>
                      Packaging Finish
                    </label>
                    <select
                      value={formData.packaging}
                      onChange={(e) => handleInputChange('packaging', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.86rem', backgroundColor: '#fff' }}
                    >
                      <option value="Velvet gift box">Velvet Gift Box with Wax Seal</option>
                      <option value="Cotton pouch">Organic Cotton Craft Pouch</option>
                      <option value="Rigid hamper box">Custom Rigid Hamper Box</option>
                      <option value="Standard bulk">Standard Bulk Protective Packaging</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '2px' }}>
                      Approx. Budget
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. £15-£25 / item"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.86rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '2px' }}>
                    Personalisation Requirements
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Initials engraved, custom tag printing"
                    value={formData.personalisation}
                    onChange={(e) => handleInputChange('personalisation', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.86rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '2px' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.86rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '2px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.86rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '2px' }}>
                    Telephone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+44 7123 456789"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '2px' }}>
                    Free-text Notes / Special Instructions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell us more about your event theme or custom request..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.86rem', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || quoteItems.length === 0}
                  className="button-primary"
                  style={{ width: '100%', padding: '14px', marginTop: '6px', fontSize: '0.95rem' }}
                >
                  {isSubmitting ? 'Sending Quote Request...' : 'Send Quote Request'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
