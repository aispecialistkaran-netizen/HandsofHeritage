'use client';

import { useState, useMemo } from 'react';
import type { Product } from '../site-content';
import { ProductCard } from './ProductCard';

type GalleryGridProps = {
  items: Product[];
};

export function GalleryGrid({ items }: GalleryGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxMoq, setMaxMoq] = useState<number | 'all'>('all');
  const [onlyPersonalized, setOnlyPersonalized] = useState(false);
  const [onlyTravelFriendly, setOnlyTravelFriendly] = useState(false);
  const [onlyLightweight, setOnlyLightweight] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesMaterial = item.material.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesMaterial && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // Material filter
      if (selectedMaterial !== 'all' && item.material.toLowerCase() !== selectedMaterial) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && item.category.toLowerCase() !== selectedCategory) {
        return false;
      }

      // MOQ filter
      if (maxMoq !== 'all' && item.moq > maxMoq) {
        return false;
      }

      // Personalisation filter
      if (onlyPersonalized && !item.personalisation) {
        return false;
      }

      // Travel friendly filter
      if (onlyTravelFriendly && !item.isTravelFriendly) {
        return false;
      }

      // Lightweight filter (<300g or 'light' / 'medium')
      if (onlyLightweight && item.weightCategory === 'heavy') {
        return false;
      }

      return true;
    });
  }, [items, searchQuery, selectedMaterial, selectedCategory, maxMoq, onlyPersonalized, onlyTravelFriendly, onlyLightweight]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMaterial('all');
    setSelectedCategory('all');
    setMaxMoq('all');
    setOnlyPersonalized(false);
    setOnlyTravelFriendly(false);
    setOnlyLightweight(false);
  };

  return (
    <section className="gallery-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 80px' }}>
      {/* Search and Filters Container */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '36px',
          border: '1px solid rgba(37, 27, 18, 0.08)',
          boxShadow: '0 4px 20px rgba(37, 27, 18, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="text"
            placeholder="🔍 Search keepsakes by name, material, category or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '12px',
              border: '1px solid rgba(37, 27, 18, 0.15)',
              fontSize: '0.96rem',
              backgroundColor: '#fcfaf7',
              color: '#251b14',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#999',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Groups */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px 24px', fontSize: '0.88rem' }}>
          {/* Material Filter */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#b5632a', marginBottom: '6px', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Craft Material
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['all', 'copper', 'brass', 'marble'].map((mat) => (
                <button
                  type="button"
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: selectedMaterial === mat ? '1px solid #b5632a' : '1px solid rgba(0,0,0,0.1)',
                    backgroundColor: selectedMaterial === mat ? '#b5632a' : '#f7f0e8',
                    color: selectedMaterial === mat ? '#fff' : '#251b14',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#b5632a', marginBottom: '6px', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Product Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['all', 'drinkware', 'serveware', 'decor', 'accessories'].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: selectedCategory === cat ? '1px solid #b5632a' : '1px solid rgba(0,0,0,0.1)',
                    backgroundColor: selectedCategory === cat ? '#b5632a' : '#f7f0e8',
                    color: selectedCategory === cat ? '#fff' : '#251b14',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Order Quantity (MOQ) Filter */}
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#b5632a', marginBottom: '6px', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Max MOQ
            </label>
            <select
              value={maxMoq}
              onChange={(e) => setMaxMoq(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(0,0,0,0.15)',
                fontSize: '0.85rem',
                backgroundColor: '#f7f0e8',
              }}
            >
              <option value="all">Any MOQ</option>
              <option value="40">Min. 40 units or lower</option>
              <option value="50">Min. 50 units or lower</option>
              <option value="75">Min. 75 units or lower</option>
              <option value="100">Min. 100 units or lower</option>
            </select>
          </div>
        </div>

        {/* Feature Toggles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '16px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', color: '#251b14', fontWeight: 500 }}>
            <input
              type="checkbox"
              checked={onlyPersonalized}
              onChange={(e) => setOnlyPersonalized(e.target.checked)}
              style={{ accentColor: '#b5632a' }}
            />
            Personalisation Available
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', color: '#251b14', fontWeight: 500 }}>
            <input
              type="checkbox"
              checked={onlyTravelFriendly}
              onChange={(e) => setOnlyTravelFriendly(e.target.checked)}
              style={{ accentColor: '#b5632a' }}
            />
            ✈️ Suitable for Destination Weddings
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.86rem', color: '#251b14', fontWeight: 500 }}>
            <input
              type="checkbox"
              checked={onlyLightweight}
              onChange={(e) => setOnlyLightweight(e.target.checked)}
              style={{ accentColor: '#b5632a' }}
            />
            🪶 Compact / Lightweight (&lt;300g)
          </label>

          <button
            type="button"
            onClick={resetFilters}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: '#b5632a',
              textDecoration: 'underline',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ margin: 0, fontSize: '0.95rem', color: '#7c6950' }}>
          Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> handcrafted items
        </p>
      </div>

      {/* Product Grid */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px dashed rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#251b14', margin: '0 0 8px 0' }}>
            No matching items found
          </h3>
          <p style={{ color: '#7c6950', fontSize: '0.95rem', marginBottom: '20px' }}>
            Try adjusting your search criteria or clear your active filters.
          </p>
          <button type="button" className="button-secondary" onClick={resetFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
          {filteredItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
