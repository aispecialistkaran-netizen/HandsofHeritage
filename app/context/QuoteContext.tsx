'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [quoteItems, setQuoteItems] = useState<BasketItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmissionData, setLastSubmissionData] = useState<QuoteFormData | null>(null);

  // Trigger custom event listener for backwards compatibility
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
    }, 3000);
  };

  const addToQuote = (product: Product, quantity = 1) => {
    setQuoteItems((current) => {
      const existingIndex = current.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...current, { product, quantity }];
    });

    showToast(`"Added to your shortlist" - ${product.name}`);
  };

  const removeFromQuote = (productId: number) => {
    setQuoteItems((current) => current.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromQuote(productId);
      return;
    }
    setQuoteItems((current) =>
      current.map((item) => (item.product.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearQuote = () => {
    setQuoteItems([]);
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
    if (!formData.name || !formData.email) {
      window.alert('Please fill in both your name and email address.');
      return false;
    }
    if (quoteItems.length === 0) {
      window.alert('Your shortlist is empty. Please add at least one product to submit a quote.');
      return false;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'quotes'), {
        type: 'basket',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        eventDate: formData.eventDate,
        deliveryLocation: formData.deliveryLocation,
        packaging: formData.packaging,
        personalisation: formData.personalisation,
        budget: formData.budget,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        status: 'New',
        items: quoteItems.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          material: item.product.material,
          category: item.product.category,
          image: item.product.image,
          min: item.product.min,
          quantity: item.quantity,
        })),
      });

      setLastSubmissionData(formData);
      setIsSubmitted(true);
      return true;
    } catch (error) {
      console.error('Failed to submit quote to Firebase:', error);
      window.alert('Failed to submit quote. Please check your network connection and try again.');
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
