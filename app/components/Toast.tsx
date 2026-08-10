'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useQuote } from '../context/QuoteContext';

export function Toast() {
  const { toastMessage, openDrawer } = useQuote();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          key="toast-notification"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: '88px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#251b14',
            color: '#f7f0e8',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.9rem',
            border: '1px solid rgba(181, 99, 42, 0.4)',
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>✨</span>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={openDrawer}
            style={{
              background: '#b5632a',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            View Shortlist
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
