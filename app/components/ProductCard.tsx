'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Product } from '../site-content';
import { useQuote } from '../context/QuoteContext';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToQuote, openProductDetail } = useQuote();

  return (
    <motion.div
      className="product-card"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(37, 27, 18, 0.08)',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(37, 27, 18, 0.03)',
      }}
    >
      {/* Clickable Image Container opens Detail Modal */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => openProductDetail(product)}
        style={{ position: 'relative', width: '100%', aspectRatio: '1', cursor: 'pointer', overflow: 'hidden', backgroundColor: '#f5efe8' }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 560px) 100vw, (max-width: 780px) 50vw, (max-width: 1040px) 33vw, 25vw"
          style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
        />
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(247, 240, 232, 0.92)',
            backdropFilter: 'blur(4px)',
            color: '#b5632a',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {product.material}
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px' }}>
        <h3
          role="button"
          tabIndex={0}
          onClick={() => openProductDetail(product)}
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.25rem',
            color: '#251b14',
            margin: 0,
            cursor: 'pointer',
            lineHeight: 1.3,
            fontWeight: 600,
          }}
        >
          {product.name}
        </h3>

        <p style={{ fontSize: '0.82rem', color: '#7c6950', margin: 0 }}>{product.min}</p>

        {/* Buttons Row */}
        <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <button
            type="button"
            onClick={() => addToQuote(product)}
            style={{
              padding: '8px 10px',
              backgroundColor: '#b5632a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              textAlign: 'center',
            }}
          >
            Add to quote
          </button>
          <button
            type="button"
            onClick={() => openProductDetail(product)}
            style={{
              padding: '8px 10px',
              backgroundColor: 'transparent',
              color: '#251b14',
              border: '1px solid rgba(37, 27, 18, 0.2)',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center',
            }}
          >
            View details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
