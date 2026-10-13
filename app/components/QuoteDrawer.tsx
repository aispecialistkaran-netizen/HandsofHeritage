'use client';

import Image from 'next/image';
import Link from 'next/link';
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
    clearQuote,
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
    eventType: 'Wedding / Celebration',
    eventDate: '',
    deliveryLocation: '',
    packaging: 'Velvet gift box',
    personalisation: '',
    budget: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  if (!drawerOpen) return null;

  const totalUnits = quoteItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalLines = quoteItems.length;

  const handleInputChange = (field: keyof QuoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.eventDate) errors.eventDate = 'Required delivery or event date is required';
    if (!formData.deliveryLocation.trim()) errors.deliveryLocation = 'Postcode or destination country is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quoteItems.length === 0) {
      window.alert('Your shortlist is empty. Please add items before submitting.');
      return;
    }
    if (!validateForm()) {
      return;
    }
    await submitQuote(formData);
  };

  const handleClose = () => {
    closeDrawer();
    setTimeout(() => {
      resetSubmission();
    }, 400);
  };

  const handleCompleteAndClear = () => {
    clearQuote();
    handleClose();
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
            maxWidth: '540px',
            backgroundColor: '#fbf8f5',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '28px 24px',
            zIndex: 9996,
          }}
        >
          {/* Top Header Row with sticky close button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <span className="eyebrow" style={{ display: 'block', marginBottom: '2px', color: '#b5632a' }}>
                Hands of Heritage
              </span>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#251b14', margin: 0 }}>
                {isSubmitted ? 'Quote Receipt' : 'Your Quote Shortlist'}
              </h2>
            </div>
            <button
              type="button"
              className="drawer-close"
              onClick={handleClose}
              aria-label="Close quote drawer"
              style={{ position: 'relative', top: 0, right: 0 }}
            >
              ✕
            </button>
          </div>

          {/* VIEW A: SUBMISSION CONFIRMATION RECEIPT */}
          {isSubmitted && lastSubmissionData ? (
            <motion.div
              key="success-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                padding: '10px 0 24px',
              }}
            >
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #2d6a37',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(45, 106, 55, 0.08)',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#eef5ec',
                    color: '#2d6a37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    margin: '0 auto 12px',
                  }}
                >
                  ✓
                </div>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#f5efe8',
                    color: '#b5632a',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    letterSpacing: '0.08em',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    marginBottom: '8px',
                  }}
                >
                  REFERENCE: {lastSubmissionData.refId || 'HOH-CONFIRMED'}
                </span>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#251b14', margin: '4px 0 8px' }}>
                  Enquiry Received
                </h3>
                <p style={{ color: '#5f4f3b', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                  Thank you, <strong>{lastSubmissionData.name}</strong>. An automatic confirmation email listing your items and quantities has been sent to <strong>{lastSubmissionData.email}</strong>.
                </p>
              </div>

              {/* Response Promise Alert */}
              <div
                style={{
                  backgroundColor: '#eef5ec',
                  borderLeft: '4px solid #2d6a37',
                  color: '#2d6a37',
                  padding: '12px 14px',
                  borderRadius: '0 8px 8px 0',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>🕒</span>
                <div>
                  <strong>Our Response Promise:</strong> We normally review your selections and reply with pricing and digital packaging mockups within <strong>one working day</strong>.
                </div>
              </div>

              {/* Itemized Order Summary */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(37, 27, 18, 0.1)',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b5632a', fontWeight: 700 }}>
                    Requested Items ({totalLines} {totalLines === 1 ? 'item' : 'items'} • {totalUnits} total units)
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
                  {quoteItems.map((item) => (
                    <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                          <Image src={item.product.image} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <span style={{ color: '#251b14', fontWeight: 500, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.product.name}
                        </span>
                      </div>
                      <span style={{ fontWeight: 700, color: '#b5632a', fontSize: '0.88rem', flexShrink: 0, backgroundColor: '#fcf6f1', padding: '3px 8px', borderRadius: '6px' }}>
                        {item.quantity} units
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem', color: '#5f4f3b' }}>
                  <div><strong>Required Date:</strong> {lastSubmissionData.eventDate}</div>
                  <div><strong>Destination:</strong> {lastSubmissionData.deliveryLocation}</div>
                  <div><strong>Occasion:</strong> {lastSubmissionData.eventType || 'Celebration'}</div>
                  <div><strong>Packaging:</strong> {lastSubmissionData.packaging}</div>
                  {lastSubmissionData.budget && <div style={{ gridColumn: '1 / -1' }}><strong>Budget:</strong> {lastSubmissionData.budget}</div>}
                  {lastSubmissionData.personalisation && <div style={{ gridColumn: '1 / -1' }}><strong>Personalisation:</strong> {lastSubmissionData.personalisation}</div>}
                  {lastSubmissionData.notes && <div style={{ gridColumn: '1 / -1' }}><strong>Notes:</strong> {lastSubmissionData.notes}</div>}
                </div>
              </div>

              {/* Direct WhatsApp Contact CTA */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(37, 27, 18, 0.08)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#251b14' }}>Need urgent coordination?</div>
                  <div style={{ fontSize: '0.8rem', color: '#7c6950' }}>Chat directly with our gifting director on WhatsApp.</div>
                </div>
                <a
                  href={`https://wa.me/447911123456?text=${encodeURIComponent(`Hi Hands of Heritage, I just submitted quote request ${lastSubmissionData.refId || ''}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  💬 WhatsApp
                </a>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  className="button-primary"
                  onClick={handleCompleteAndClear}
                  style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}
                >
                  Continue shopping
                </button>
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => window.print()}
                  style={{ padding: '12px 18px', fontSize: '0.9rem' }}
                >
                  Print / Save Receipt
                </button>
              </div>
            </motion.div>
          ) : (
            /* VIEW B: ACTIVE BASKET & ENQUIRY FORM */
            <>
              {/* If Basket is Empty */}
              {quoteItems.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '48px 16px', gap: '16px', margin: 'auto 0' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f3eae0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                    🛒
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#251b14', margin: '0 0 6px' }}>
                      Your Shortlist is Empty
                    </h3>
                    <p style={{ color: '#7c6950', fontSize: '0.92rem', maxWidth: '360px', margin: 0, lineHeight: 1.5 }}>
                      Explore our handcrafted copper, brass and marble keepsakes. Click <strong>Add to quote</strong> on any product to begin curating your favours.
                    </p>
                  </div>
                  <Link
                    href="/gallery"
                    onClick={handleClose}
                    className="button-primary"
                    style={{ padding: '12px 24px', fontSize: '0.9rem', marginTop: '8px', textDecoration: 'none' }}
                  >
                    Browse Complete Catalogue (29 Items) →
                  </Link>

                  <div style={{ marginTop: '24px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '16px', width: '100%', fontSize: '0.82rem', color: '#7c6950' }}>
                    Have a custom request? Email us directly at{' '}
                    <a href="mailto:enquiries@handsofheritage.com" style={{ color: '#b5632a', fontWeight: 600 }}>
                      enquiries@handsofheritage.com
                    </a>
                  </div>
                </div>
              ) : (
                /* When items exist in basket */
                <>
                  {/* Summary Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#ffffff',
                      border: '1px solid rgba(37, 27, 18, 0.08)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      marginBottom: '16px',
                      fontSize: '0.86rem',
                    }}
                  >
                    <span style={{ color: '#251b14', fontWeight: 600 }}>
                      {totalLines} {totalLines === 1 ? 'Product line' : 'Product lines'} ({totalUnits} physical units)
                    </span>
                    <button
                      type="button"
                      onClick={clearQuote}
                      style={{ background: 'none', border: 'none', color: '#8c7d6b', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Clear basket
                    </button>
                  </div>

                  {/* Response Promise Banner */}
                  <div
                    style={{
                      backgroundColor: '#f3eae0',
                      borderLeft: '4px solid #b5632a',
                      padding: '10px 14px',
                      borderRadius: '0 8px 8px 0',
                      fontSize: '0.82rem',
                      color: '#4a3b2c',
                      marginBottom: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>🕒</span>
                    <span><strong>Response Promise:</strong> We normally respond with formal pricing within 1 working day.</span>
                  </div>

                  {/* Shortlist Item Cards */}
                  <div className="drawer-items" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {quoteItems.map((item) => {
                      const minMoq = item.product.moq || 50;
                      return (
                        <div
                          key={item.product.id}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            backgroundColor: '#ffffff',
                            padding: '12px 14px',
                            borderRadius: '12px',
                            border: '1px solid rgba(37, 27, 18, 0.08)',
                            boxShadow: '0 2px 8px rgba(37, 27, 18, 0.02)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ position: 'relative', width: '52px', height: '52px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f5efe8' }}>
                              <Image src={item.product.image} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div style={{ flexGrow: 1, minWidth: 0 }}>
                              <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#251b14', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.product.name}
                              </h4>
                              <span style={{ color: '#8f7a5f', fontSize: '0.78rem' }}>
                                {item.product.material} • Minimum {minMoq} units
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromQuote(item.product.id)}
                              style={{ background: 'none', border: 'none', color: '#a89885', cursor: 'pointer', fontSize: '0.82rem', padding: '6px', fontWeight: 600 }}
                              aria-label={`Remove ${item.product.name}`}
                            >
                              ✕ Remove
                            </button>
                          </div>

                          {/* Stepper with clear "Units Required" labelling */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '8px' }}>
                            <span style={{ fontSize: '0.82rem', color: '#5f4f3b', fontWeight: 600 }}>
                              Units Required:
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(34,24,14,0.2)', borderRadius: '6px', overflow: 'hidden' }}>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, Math.max(minMoq, item.quantity - 10))}
                                disabled={item.quantity <= minMoq}
                                style={{ border: 'none', padding: '4px 10px', background: '#f5efe8', cursor: item.quantity <= minMoq ? 'not-allowed' : 'pointer', fontSize: '0.82rem', fontWeight: 700, opacity: item.quantity <= minMoq ? 0.4 : 1 }}
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min={minMoq}
                                step={10}
                                aria-label={`Quantity for ${item.product.name}`}
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  updateQuantity(item.product.id, isNaN(val) ? minMoq : Math.max(minMoq, val));
                                }}
                                style={{
                                  width: '60px',
                                  textAlign: 'center',
                                  border: 'none',
                                  padding: '4px',
                                  fontSize: '0.86rem',
                                  fontWeight: 700,
                                  color: '#251b14',
                                  backgroundColor: '#fff',
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 10)}
                                style={{ border: 'none', padding: '4px 10px', background: '#f5efe8', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Enquiry Form */}
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: 'auto' }}>
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '16px' }}>
                      <span className="eyebrow" style={{ fontSize: '0.72rem', color: '#b5632a' }}>Step 2</span>
                      <h3 style={{ fontSize: '1.25rem', fontFamily: 'Cormorant Garamond, serif', color: '#251b14', margin: '2px 0 12px 0' }}>
                        Delivery & Contact Details
                      </h3>
                    </div>

                    {/* Occasion / Event Type */}
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '4px' }}>
                        Occasion / Event Type *
                      </label>
                      <select
                        value={formData.eventType}
                        onChange={(e) => handleInputChange('eventType', e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.18)', fontSize: '0.88rem', backgroundColor: '#fff' }}
                      >
                        <option value="Wedding / Celebration">Wedding / Sacred Ceremony</option>
                        <option value="Mehendi / Sangeet">Mehendi / Sangeet Giveaway</option>
                        <option value="Welcome Room Hampers">Guest Room Welcome Hampers</option>
                        <option value="Anniversary / Milestone">Anniversary / Milestone Event</option>
                        <option value="Corporate / Business">Corporate Client / Executive Gifting</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '4px' }}>
                          Delivery Date *
                        </label>
                        <input
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => handleInputChange('eventDate', e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '9px 10px',
                            borderRadius: '8px',
                            border: formErrors.eventDate ? '1.5px solid #dc2626' : '1px solid rgba(0,0,0,0.18)',
                            fontSize: '0.86rem',
                          }}
                        />
                        {formErrors.eventDate && <span style={{ color: '#dc2626', fontSize: '0.72rem' }}>{formErrors.eventDate}</span>}
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '4px' }}>
                          Postcode / Country *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. SW1A 1AA / Delhi / Dubai"
                          value={formData.deliveryLocation}
                          onChange={(e) => handleInputChange('deliveryLocation', e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: formErrors.deliveryLocation ? '1.5px solid #dc2626' : '1px solid rgba(0,0,0,0.18)',
                            fontSize: '0.86rem',
                          }}
                        />
                        {formErrors.deliveryLocation && <span style={{ color: '#dc2626', fontSize: '0.72rem' }}>{formErrors.deliveryLocation}</span>}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '4px' }}>
                          Packaging Finish
                        </label>
                        <select
                          value={formData.packaging}
                          onChange={(e) => handleInputChange('packaging', e.target.value)}
                          style={{ width: '100%', padding: '9px 10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.18)', fontSize: '0.86rem', backgroundColor: '#fff' }}
                        >
                          <option value="Velvet gift box">Velvet Gift Box + Wax Seal</option>
                          <option value="Cotton pouch">Organic Cotton Craft Pouch</option>
                          <option value="Rigid hamper box">Rigid Gift Hamper Box</option>
                          <option value="Standard bulk">Standard Protective Bulk Pack</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '4px' }}>
                          Target Budget (approx.)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. £15-£25/item or ₹50k total"
                          value={formData.budget}
                          onChange={(e) => handleInputChange('budget', e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.18)', fontSize: '0.86rem' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '4px' }}>
                        Personalisation Requirements
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Couple's initials engraved, custom gift tags, gold foil ribbon"
                        value={formData.personalisation}
                        onChange={(e) => handleInputChange('personalisation', e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.18)', fontSize: '0.86rem' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '4px' }}>
                          Your Name *
                        </label>
                        <input
                          type="text"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: formErrors.name ? '1.5px solid #dc2626' : '1px solid rgba(0,0,0,0.18)',
                            fontSize: '0.86rem',
                          }}
                        />
                        {formErrors.name && <span style={{ color: '#dc2626', fontSize: '0.72rem' }}>{formErrors.name}</span>}
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '4px' }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          placeholder="email@address.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: formErrors.email ? '1.5px solid #dc2626' : '1px solid rgba(0,0,0,0.18)',
                            fontSize: '0.86rem',
                          }}
                        />
                        {formErrors.email && <span style={{ color: '#dc2626', fontSize: '0.72rem' }}>{formErrors.email}</span>}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '4px' }}>
                        Telephone Number (for WhatsApp quote / dispatch updates)
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +44 7123 456789 or +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.18)', fontSize: '0.86rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '4px' }}>
                        Free-text Notes / Special Instructions
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Tell us about your celebration theme, bespoke packaging requests or questions..."
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.18)', fontSize: '0.86rem', resize: 'vertical' }}
                      />
                    </div>

                    {/* Company Direct Support Info */}
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid rgba(37,27,18,0.06)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', color: '#7c6950' }}>
                      Questions before submitting? Email{' '}
                      <a href="mailto:enquiries@handsofheritage.com" style={{ color: '#b5632a', fontWeight: 600 }}>
                        enquiries@handsofheritage.com
                      </a>{' '}
                      or message us on{' '}
                      <a href="https://wa.me/447911123456" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 700 }}>
                        WhatsApp
                      </a>.
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || quoteItems.length === 0}
                      className="button-primary"
                      style={{ width: '100%', padding: '14px', marginTop: '4px', fontSize: '0.96rem' }}
                    >
                      {isSubmitting ? 'Sending Your Quote Request...' : `Submit Quote Request (${totalUnits} Units)`}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
