'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Product } from '../site-content';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export type BasketItem = {
  product: Product;
  quantity: number;
};

export type QuoteFormData = {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  deliveryLocation: string;
  packaging: string;
  personalisation: string;
  budget: string;
  notes: string;
  eventType?: string;
  refId?: string;
};

type QuoteContextType = {
  quoteItems: BasketItem[];
  drawerOpen: boolean;
  activeDetailProduct: Product | null;
  toastMessage: string | null;
  isSubmitting: boolean;
  isSubmitted: boolean;
  lastSubmissionData: QuoteFormData | null;
  addToQuote: (product: Product, quantity?: number) => void;
  removeFromQuote: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearQuote: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;
  submitQuote: (formData: QuoteFormData) => Promise<boolean>;
  resetSubmission: () => void;
};

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

const STORAGE_KEY = 'hoh_quote_basket';

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [quoteItems, setQuoteItems] = useState<BasketItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmissionData, setLastSubmissionData] = useState<QuoteFormData | null>(null);
  const isHydrated = useRef(false);

  // 1. Hydrate basket from localStorage on initial client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuoteItems(parsed);
          }
        }
      } catch (err) {
        console.error('Failed to restore quote basket from localStorage:', err);
      } finally {
        isHydrated.current = true;
      }
    }
  }, []);

  // 2. Persist basket to localStorage whenever quoteItems change
  useEffect(() => {
    if (isHydrated.current && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quoteItems));
      } catch (err) {
        console.error('Failed to save quote basket to localStorage:', err);
      }
    }
  }, [quoteItems]);

  // 3. Listen for changes across browser tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setQuoteItems(updated);
          }
        } catch (err) {
          console.error('Storage sync error:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for custom open-quote-drawer event
  useEffect(() => {
    const handleOpenDrawerEvent = () => {
      setDrawerOpen(true);
    };
    window.addEventListener('open-quote-drawer', handleOpenDrawerEvent);
    return () => window.removeEventListener('open-quote-drawer', handleOpenDrawerEvent);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  const addToQuote = (product: Product, quantity?: number) => {
    const minMoq = product.moq || 50;
    const qtyToAdd = quantity !== undefined && quantity > 0 ? Math.max(minMoq, quantity) : minMoq;

    setQuoteItems((current) => {
      const existingIndex = current.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + (quantity !== undefined ? quantity : 10),
        };
        return updated;
      }
      return [...current, { product, quantity: qtyToAdd }];
    });

    showToast(`Added ${qtyToAdd} units of "${product.name}" to your shortlist`);
  };

  const removeFromQuote = (productId: number) => {
    const removedItem = quoteItems.find((item) => item.product.id === productId);
    setQuoteItems((current) => current.filter((item) => item.product.id !== productId));
    if (removedItem) {
      showToast(`Removed "${removedItem.product.name}" from shortlist`);
    }
  };

  const updateQuantity = (productId: number, newQty: number) => {
    const item = quoteItems.find((i) => i.product.id === productId);
    if (!item) return;

    const minMoq = item.product.moq || 50;

    if (newQty <= 0) {
      removeFromQuote(productId);
      return;
    }

    if (newQty < minMoq) {
      showToast(`Minimum order for "${item.product.name}" is ${minMoq} units`);
      setQuoteItems((current) =>
        current.map((i) => (i.product.id === productId ? { ...i, quantity: minMoq } : i))
      );
      return;
    }

    setQuoteItems((current) =>
      current.map((i) => (i.product.id === productId ? { ...i, quantity: newQty } : i))
    );
  };

  const clearQuote = () => {
    setQuoteItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const openProductDetail = (product: Product) => {
    setActiveDetailProduct(product);
  };

  const closeProductDetail = () => {
    setActiveDetailProduct(null);
  };

  const resetSubmission = () => {
    setIsSubmitted(false);
    setLastSubmissionData(null);
  };

  const submitQuote = async (formData: QuoteFormData): Promise<boolean> => {
    if (quoteItems.length === 0) {
      window.alert('Your shortlist is empty. Please add at least one product before submitting a quote.');
      return false;
    }

    if (!formData.name?.trim() || !formData.email?.trim()) {
      window.alert('Please fill in both your name and email address.');
      return false;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      window.alert('Please provide a valid email address.');
      return false;
    }

    if (!formData.deliveryLocation?.trim()) {
      window.alert('Please provide your delivery postcode or destination country.');
      return false;
    }

    if (!formData.eventDate) {
      window.alert('Please select your required delivery or event date.');
      return false;
    }

    setIsSubmitting(true);
    const refId = `HOH-${Date.now().toString().slice(-6)}`;
    const submissionPayload = {
      ...formData,
      refId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      eventType: formData.eventType || 'Wedding / Celebration',
      createdAt: new Date().toISOString(),
      status: 'New' as const,
      owner: 'Unassigned',
      type: 'basket' as const,
      items: quoteItems.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        material: item.product.material,
        category: item.product.category,
        image: item.product.image,
        min: item.product.min,
        moq: item.product.moq,
        quantity: item.quantity,
      })),
    };

    try {
      // 1. Save to Firebase Firestore
      await addDoc(collection(db, 'quotes'), submissionPayload);

      // 2. Dispatch automated customer & business notification emails via API
      try {
        await fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionPayload),
        });
      } catch (emailErr) {
        console.warn('Email dispatch warning (logged):', emailErr);
      }

      setLastSubmissionData({ ...formData, refId });
      setIsSubmitted(true);
      return true;
    } catch (error) {
      console.error('Failed to submit quote to Firebase:', error);
      window.alert('Failed to submit quote. Please check your connection and try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <QuoteContext.Provider
      value={{
        quoteItems,
        drawerOpen,
        activeDetailProduct,
        toastMessage,
        isSubmitting,
        isSubmitted,
        lastSubmissionData,
        addToQuote,
        removeFromQuote,
        updateQuantity,
        clearQuote,
        openDrawer,
        closeDrawer,
        openProductDetail,
        closeProductDetail,
        submitQuote,
        resetSubmission,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
}
