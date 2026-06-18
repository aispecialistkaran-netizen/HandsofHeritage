'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';

type QuoteItem = {
  name: string;
  material: string;
  category: string;
  image: string;
  min?: string;
};

type Quote = {
  id: string;
  createdAt: string;
  status: 'New' | 'Contacted' | 'Archived';
  type: 'basket' | 'single';
  name: string;
  email: string;
  phone?: string;
  eventType?: string;
  occasion?: string;
  guestCount?: number;
  quantity?: number;
  city?: string;
  items: QuoteItem[];
};

// Mock Unit Prices for estimating deal values
const getMockUnitPrice = (material: string): number => {
  switch (material.toLowerCase()) {
    case 'copper': return 800;  // INR per unit
    case 'brass': return 1200; // INR per unit
    case 'marble': return 1500; // INR per unit
    default: return 500;
  }
};

export default function AdminDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list');

  // Filtering & searching states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Selected quote for detailed modal
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  
  // Quote ID targeted for custom delete confirmation
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);

  // Placeholder for manual refresh triggers
  const fetchQuotes = () => {
    console.log('Firebase subscription is active and syncing automatically.');
  };

  // Set up real-time listener for quotes from Firestore
  useEffect(() => {
    const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Quote[];
        setQuotes(data);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore subscription error:', err);
        setError('Failed to sync quotes in real-time with Firebase.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Update quote status in Firestore
  const updateStatus = async (id: string, newStatus: 'New' | 'Contacted' | 'Archived') => {
    try {
      const docRef = doc(db, 'quotes', id);
      await updateDoc(docRef, { status: newStatus });
      
      // Update local detailed selected modal view if active
      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error('Firestore update error:', err);
      window.alert('Error updating status.');
    }
  };

  // Trigger custom delete confirmation modal
  const deleteQuote = (id: string) => {
    setQuoteToDelete(id);
  };

  // Perform actual delete from Firestore
  const executeDelete = async (id: string) => {
    try {
      const docRef = doc(db, 'quotes', id);
      await deleteDoc(docRef);
      
      // Clear local detailed selected modal view if active
      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote(null);
      }
    } catch (err) {
      console.error('Firestore delete error:', err);
      window.alert('Error deleting quote.');
    }
  };

  // Filtered & Searched quotes list (used in List view)
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
      const matchesType = typeFilter === 'all' || q.type === typeFilter;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        q.name.toLowerCase().includes(searchLower) ||
        q.email.toLowerCase().includes(searchLower) ||
        (q.phone && q.phone.toLowerCase().includes(searchLower)) ||
        (q.city && q.city.toLowerCase().includes(searchLower)) ||
        q.items.some((item) => item.name.toLowerCase().includes(searchLower));

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [quotes, statusFilter, typeFilter, searchTerm]);

  // Compute base stats
  const stats = useMemo(() => {
    const total = quotes.length;
    const newCount = quotes.filter((q) => q.status === 'New').length;
    const contactedCount = quotes.filter((q) => q.status === 'Contacted').length;
    const totalItemsRequested = quotes.reduce((acc, q) => acc + (q.items?.length || 0), 0);
    return { total, newCount, contactedCount, totalItemsRequested };
  }, [quotes]);

  // Calculate quote item deal value
  const getQuoteValue = (quote: Quote) => {
    const qty = quote.type === 'basket' ? (quote.guestCount || 50) : (quote.quantity || 50);
    const sumPrices = quote.items.reduce((acc, item) => acc + getMockUnitPrice(item.material), 0);
    return qty * sumPrices;
  };

  // Compute deeper business analytics
  const analytics = useMemo(() => {
    if (quotes.length === 0) {
      return {
        pipelineValue: 0,
        avgDealValue: 0,
        materialShare: { copper: 0, brass: 0, marble: 0 },
        categoryShare: {},
        topProducts: [],
        topOccasions: [],
        topCities: [],
      };
    }

    let pipelineValue = 0;
    const materialCounts: Record<string, number> = { copper: 0, brass: 0, marble: 0 };
    const categoryCounts: Record<string, number> = {};
    const productDetails: Record<string, { count: number; image: string; material: string }> = {};
    const occasionCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    quotes.forEach((q) => {
      // 1. Calculate Estimated Deal Value
      const val = getQuoteValue(q);
      pipelineValue += val;

      const qty = q.type === 'basket' ? (q.guestCount || 50) : (q.quantity || 50);

      // 2. Material & Category Share, and Product Leaderboard
      q.items.forEach((item) => {
        const mat = item.material.toLowerCase();
        if (mat in materialCounts) {
          materialCounts[mat] += qty;
        } else {
          materialCounts[mat] = qty;
        }

        const cat = item.category.toLowerCase();
        categoryCounts[cat] = (categoryCounts[cat] || 0) + qty;

        if (!productDetails[item.name]) {
          productDetails[item.name] = { count: 0, image: item.image, material: item.material };
        }
        productDetails[item.name].count += qty;
      });

      // 3. Occasion Breakdowns
      const rawOcc = (q.eventType || q.occasion || 'General enquiry').trim();
      const occ = rawOcc.charAt(0).toUpperCase() + rawOcc.slice(1).toLowerCase();
      occasionCounts[occ] = (occasionCounts[occ] || 0) + 1;

      // 4. Delivery Cities
      if (q.city) {
        const city = q.city.trim();
        const normalizedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
        cityCounts[normalizedCity] = (cityCounts[normalizedCity] || 0) + 1;
      }
    });

    const avgDealValue = Math.round(pipelineValue / quotes.length);

    // Sort product leaderboard
    const topProducts = Object.entries(productDetails)
      .map(([name, info]) => ({ name, ...info }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Sort occasions
    const topOccasions = Object.entries(occasionCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Sort cities
    const topCities = Object.entries(cityCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      pipelineValue,
      avgDealValue,
      materialShare: materialCounts,
      categoryShare: categoryCounts,
      topProducts,
      topOccasions,
      topCities,
    };
  }, [quotes]);

  return (
    <div className="admin-layout" style={{ minHeight: '100vh', backgroundColor: '#fdfbfa', color: '#251b14', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#251b14', color: '#f7f0e8', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Image src="/logohoh.png" alt="Hands of Heritage logo" width={44} height={40} />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'Georgia, serif', fontWeight: 'normal', letterSpacing: '1px' }}>Hands of Heritage</h1>
            <span style={{ fontSize: '0.8rem', color: '#c5b6a5', letterSpacing: '0.5px' }}>QUOTE ENQUIRY ADMIN PANEL</span>
          </div>
        </div>
        <Link href="/" style={{ color: '#f7f0e8', textDecoration: 'none', border: '1px solid #c5b6a5', padding: '8px 16px', borderRadius: '4px', fontSize: '0.9rem', transition: 'all 0.2s' }}>
          Back to Live Site
        </Link>
      </header>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(37,27,20,0.08)', padding: '0 40px', backgroundColor: '#fff' }}>
        <button
          onClick={() => setActiveTab('list')}
          style={{
            padding: '16px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'list' ? '2px solid #b5632a' : '2px solid transparent',
            color: activeTab === 'list' ? '#b5632a' : '#5f4f3b',
            fontWeight: activeTab === 'list' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
            outline: 'none',
          }}
        >
          📋 Enquiry List
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '16px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'analytics' ? '2px solid #b5632a' : '2px solid transparent',
            color: activeTab === 'analytics' ? '#b5632a' : '#5f4f3b',
            fontWeight: activeTab === 'analytics' ? 600 : 400,
            cursor: 'pointer',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
            outline: 'none',
          }}
        >
          📈 Analytics Dashboard
        </button>
      </div>

      {/* Main Container */}
      <main style={{ padding: '40px' }}>
        
        {/* VIEW 1: ENQUIRY LIST VIEW */}
        {activeTab === 'list' && (
          <>
            {/* Stats Dashboard */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.85rem', color: '#5f4f3b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Enquiries</span>
                <p style={{ margin: '8px 0 0', fontSize: '2.5rem', fontWeight: 300, color: '#251b14' }}>{stats.total}</p>
              </div>
              <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.85rem', color: '#b5632a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Requests</span>
                <p style={{ margin: '8px 0 0', fontSize: '2.5rem', fontWeight: 400, color: '#b5632a' }}>{stats.newCount}</p>
              </div>
              <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.85rem', color: '#4d684f', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>In Conversation</span>
                <p style={{ margin: '8px 0 0', fontSize: '2.5rem', fontWeight: 300, color: '#4d684f' }}>{stats.contactedCount}</p>
              </div>
              <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.85rem', color: '#251b14', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unique Items Selected</span>
                <p style={{ margin: '8px 0 0', fontSize: '2.5rem', fontWeight: 300, color: '#251b14' }}>{stats.totalItemsRequested}</p>
              </div>
            </section>

            {/* Toolbar */}
            <section style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px 12px 0 0', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between', borderBottom: 'none' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search client, email, phone or item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: '10px 16px', border: '1px solid #c5b6a5', borderRadius: '6px', fontSize: '0.9rem', width: '280px', outline: 'none', backgroundColor: '#fdfcfa' }}
                />
                
                {/* Status Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#5f4f3b' }}>Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #c5b6a5', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', backgroundColor: '#fff' }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#5f4f3b' }}>Type:</span>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    style={{ padding: '8px 12px', border: '1px solid #c5b6a5', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', backgroundColor: '#fff' }}
                  >
                    <option value="all">All Types</option>
                    <option value="basket">Basket Quote</option>
                    <option value="single">Single Item</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={fetchQuotes}
                style={{ padding: '10px 16px', backgroundColor: '#f7f0e8', border: '1px solid #c5b6a5', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: '#5f4f3b', display: 'flex', gap: '6px', alignItems: 'center' }}
              >
                🔄 Refresh
              </button>
            </section>

            {/* Data Table */}
            <section style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '0 0 12px 12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              {loading ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#5f4f3b' }}>
                  <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid rgba(181, 99, 42, 0.3)', borderTopColor: '#b5632a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <p style={{ marginTop: '16px', fontSize: '0.95rem' }}>Loading quote data...</p>
                </div>
              ) : error ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#d9534f' }}>
                  <p style={{ fontSize: '1.1rem', margin: 0 }}>⚠️ {error}</p>
                  <button onClick={fetchQuotes} style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: '#f2dede', border: '1px solid #ebccd1', borderRadius: '4px', color: '#a94442', cursor: 'pointer' }}>Retry</button>
                </div>
              ) : filteredQuotes.length === 0 ? (
                <div style={{ padding: '80px 40px', textAlign: 'center', color: '#5f4f3b' }}>
                  <p style={{ fontSize: '1.2rem', margin: 0, fontWeight: 300 }}>No matching quote requests found.</p>
                  <p style={{ fontSize: '0.9rem', color: '#8c7d6b', marginTop: '8px' }}>Submit a quote from the front end, or clear search queries/filters.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f7f5f2', borderBottom: '1px solid rgba(37,27,20,0.08)' }}>
                        <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 600, color: '#5f4f3b', textTransform: 'uppercase', width: '150px' }}>Received</th>
                        <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 600, color: '#5f4f3b', textTransform: 'uppercase', width: '220px' }}>Client</th>
                        <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 600, color: '#5f4f3b', textTransform: 'uppercase', width: '110px' }}>Type</th>
                        <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 600, color: '#5f4f3b', textTransform: 'uppercase' }}>Details</th>
                        <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 600, color: '#5f4f3b', textTransform: 'uppercase', width: '110px' }}>Status</th>
                        <th style={{ padding: '16px 24px', fontSize: '0.8rem', fontWeight: 600, color: '#5f4f3b', textTransform: 'uppercase', width: '180px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuotes.map((quote) => {
                        const receivedDate = new Date(quote.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                        
                        return (
                          <tr
                            key={quote.id}
                            onClick={() => setSelectedQuote(quote)}
                            style={{ borderBottom: '1px solid rgba(37,27,20,0.06)', cursor: 'pointer', transition: 'background-color 0.15s' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fdfbfa')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <td style={{ padding: '18px 24px', fontSize: '0.9rem', color: '#5f4f3b' }}>
                              {receivedDate}
                            </td>
                            <td style={{ padding: '18px 24px' }}>
                              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem', color: '#251b14' }}>{quote.name}</p>
                              <small style={{ color: '#8c7d6b', fontSize: '0.8rem', display: 'block' }}>{quote.email}</small>
                              {quote.phone && <small style={{ color: '#8c7d6b', fontSize: '0.8rem', display: 'block' }}>{quote.phone}</small>}
                            </td>
                            <td style={{ padding: '18px 24px' }}>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                padding: '4px 8px',
                                borderRadius: '12px',
                                textTransform: 'uppercase',
                                backgroundColor: quote.type === 'basket' ? '#eef4fb' : '#fef2f2',
                                color: quote.type === 'basket' ? '#1c3d5a' : '#7f1d1d',
                              }}>
                                {quote.type === 'basket' ? '💼 Basket' : '🛍️ Single'}
                              </span>
                            </td>
                            <td style={{ padding: '18px 24px', fontSize: '0.9rem', color: '#5f4f3b' }}>
                              {quote.type === 'basket' ? (
                                <div>
                                  <span><strong>{quote.items.length} items</strong> for {quote.eventType || 'Event'}</span>
                                  {quote.guestCount ? <span style={{ color: '#8c7d6b' }}> • {quote.guestCount} guests</span> : null}
                                </div>
                              ) : (
                                <div>
                                  <span><strong>Enquiry: </strong> {quote.items[0]?.name || 'Item'}</span>
                                  {quote.quantity ? <span style={{ color: '#8c7d6b' }}> ({quote.quantity} units)</span> : null}
                                </div>
                              )}
                            </td>
                            <td style={{ padding: '18px 24px' }}>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                padding: '4px 10px',
                                borderRadius: '12px',
                                backgroundColor: 
                                  quote.status === 'New' ? '#fff3cd' : 
                                  quote.status === 'Contacted' ? '#d4edda' : '#e2e3e5',
                                color: 
                                  quote.status === 'New' ? '#856404' : 
                                  quote.status === 'Contacted' ? '#155724' : '#383d41',
                              }}>
                                {quote.status}
                              </span>
                            </td>
                            <td style={{ padding: '18px 24px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                              <div style={{ display: 'inline-flex', gap: '8px' }}>
                                {quote.status === 'New' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatus(quote.id, 'Contacted');
                                    }}
                                    title="Mark as Contacted"
                                    style={{ padding: '6px 10px', backgroundColor: '#eefcf1', border: '1px solid #c7eed2', borderRadius: '4px', color: '#2e7d32', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                  >
                                    ✓ Contact
                                  </button>
                                )}
                                {quote.status !== 'Archived' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatus(quote.id, 'Archived');
                                    }}
                                    title="Archive"
                                    style={{ padding: '6px 10px', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRadius: '4px', color: '#495057', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
                                  >
                                    📦 Archive
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteQuote(quote.id);
                                  }}
                                  title="Delete enquiry record"
                                  style={{ padding: '6px 10px', backgroundColor: '#fff5f5', border: '1px solid #ffd8d8', borderRadius: '4px', color: '#c53030', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {/* VIEW 2: ANALYTICS OVERVIEW VIEW */}
        {activeTab === 'analytics' && (
          <>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#5f4f3b' }}>
                <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid rgba(181, 99, 42, 0.3)', borderTopColor: '#b5632a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ marginTop: '16px', fontSize: '0.95rem' }}>Evaluating pipeline analytics...</p>
              </div>
            ) : quotes.length === 0 ? (
              <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#5f4f3b' }}>
                <p style={{ fontSize: '1.2rem', margin: 0, fontWeight: 300 }}>No enquiries available to analyze.</p>
                <p style={{ fontSize: '0.9rem', color: '#8c7d6b', marginTop: '8px' }}>Submit quote requests from the live store to compile dashboard charts.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
                
                {/* Financial Summary Cards */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                  <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)' }}>
                    <span style={{ fontSize: '0.85rem', color: '#8c7d6b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estimated pipeline value</span>
                    <h2 style={{ margin: '8px 0 0', fontSize: '3rem', fontWeight: 300, color: '#b5632a', fontFamily: 'Georgia, serif' }}>
                      ₹{analytics.pipelineValue.toLocaleString('en-IN')}
                    </h2>
                    <p style={{ margin: '12px 0 0 0', fontSize: '0.85rem', color: '#8c7d6b' }}>
                      Based on mock valuation: Copper (₹800), Brass (₹1,200), Marble (₹1,500) per unit.
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.015)' }}>
                    <span style={{ fontSize: '0.85rem', color: '#8c7d6b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average Estimated Quote value</span>
                    <h2 style={{ margin: '8px 0 0', fontSize: '3rem', fontWeight: 300, color: '#251b14', fontFamily: 'Georgia, serif' }}>
                      ₹{analytics.avgDealValue.toLocaleString('en-IN')}
                    </h2>
                    <p style={{ margin: '12px 0 0 0', fontSize: '0.85rem', color: '#8c7d6b' }}>
                      Average deal size calculated across {quotes.length} total active requests.
                    </p>
                  </div>
                </section>

                {/* Main Charts Row */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px' }}>
                  
                  {/* Left Column: Top items & Cities */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* Top Requested Products */}
                    <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                      <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontFamily: 'Georgia, serif', color: '#251b14' }}>🔥 Top Requested Products</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {analytics.topProducts.map((prod, index) => (
                          <div key={prod.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#b5632a', width: '24px' }}>#{index + 1}</span>
                            <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(0,0,0,0.05)' }}>
                              <Image src={prod.image} alt={prod.name} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#251b14' }}>{prod.name}</p>
                              <small style={{ color: '#8c7d6b' }}>{prod.material} • {prod.count} units requested</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Delivery Cities */}
                    <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                      <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontFamily: 'Georgia, serif', color: '#251b14' }}>📍 Top Delivery Cities</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {analytics.topCities.length === 0 ? (
                          <p style={{ margin: 0, color: '#8c7d6b', fontSize: '0.9rem' }}>No delivery cities specified in requests yet.</p>
                        ) : (
                          analytics.topCities.map((city, index) => {
                            const totalQuotesWithCity = quotes.filter(q => q.city).length;
                            const pct = Math.round((city.count / totalQuotesWithCity) * 100);
                            return (
                              <div key={city.name}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                                  <span><strong>{index + 1}. {city.name}</strong></span>
                                  <span style={{ color: '#b5632a', fontWeight: 600 }}>{city.count} requests ({pct}%)</span>
                                </div>
                                <div style={{ height: '6px', backgroundColor: '#f5efe8', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#b5632a', borderRadius: '3px' }}></div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Material & Category Splits */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* Material Share */}
                    <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                      <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontFamily: 'Georgia, serif', color: '#251b14' }}>🎨 Material Share</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {Object.entries(analytics.materialShare).map(([material, count]) => {
                          const totalUnits = Object.values(analytics.materialShare).reduce((a, b) => a + b, 0);
                          const pct = totalUnits > 0 ? Math.round((count / totalUnits) * 100) : 0;
                          
                          // Color mapping
                          const barColor = 
                            material === 'copper' ? '#b5632a' :
                            material === 'brass' ? '#d4af37' : '#8fa6a9';
                          
                          return (
                            <div key={material}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px', textTransform: 'capitalize' }}>
                                <span><strong>{material}</strong> <span style={{ color: '#8c7d6b', fontSize: '0.8rem' }}>({count.toLocaleString()} units)</span></span>
                                <span style={{ fontWeight: 600, color: barColor }}>{pct}%</span>
                              </div>
                              <div style={{ height: '10px', backgroundColor: '#f5efe8', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: barColor, borderRadius: '5px' }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Occasion Breakdowns */}
                    <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                      <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontFamily: 'Georgia, serif', color: '#251b14' }}>🎉 Top Occasions</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {analytics.topOccasions.map((occ, index) => {
                          const totalOccs = quotes.length;
                          const pct = Math.round((occ.count / totalOccs) * 100);
                          return (
                            <div key={occ.name}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                                <span><strong>{index + 1}. {occ.name}</strong></span>
                                <span style={{ color: '#4d684f', fontWeight: 600 }}>{occ.count} requests ({pct}%)</span>
                              </div>
                              <div style={{ height: '6px', backgroundColor: '#f5efe8', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#4d684f', borderRadius: '3px' }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </section>
                
                {/* Category Share Table/Grid */}
                <section style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                  <h3 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontFamily: 'Georgia, serif', color: '#251b14' }}>📦 Category Popularity</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {Object.entries(analytics.categoryShare).map(([category, count]) => {
                      const totalCats = Object.values(analytics.categoryShare).reduce((a, b) => a + b, 0);
                      const pct = totalCats > 0 ? Math.round((count / totalCats) * 100) : 0;
                      return (
                        <div key={category} style={{ border: '1px solid rgba(37,27,20,0.06)', borderRadius: '8px', padding: '16px', backgroundColor: '#fdfbfa', textTransform: 'capitalize' }}>
                          <span style={{ fontSize: '0.8rem', color: '#8c7d6b', fontWeight: 600, textTransform: 'uppercase' }}>{category}</span>
                          <p style={{ margin: '6px 0 0', fontSize: '1.8rem', fontWeight: 300, color: '#251b14' }}>{pct}%</p>
                          <small style={{ color: '#8c7d6b' }}>{count.toLocaleString()} total units</small>
                        </div>
                      );
                    })}
                  </div>
                </section>
                
              </div>
            )}
          </>
        )}
      </main>

      {/* Quote Details Modal */}
      {selectedQuote && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(37,27,20,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedQuote(null)}
        >
          <div
            style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid rgba(37,27,20,0.1)', width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 30px', borderBottom: '1px solid rgba(37,27,20,0.08)', backgroundColor: '#fcfaf7' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b5632a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {selectedQuote.type === 'basket' ? 'Enquiry Basket Details' : 'Product Enquiry Details'}
                </span>
                <h2 style={{ margin: '4px 0 0', fontFamily: 'Georgia, serif', fontWeight: 'normal', fontSize: '1.5rem', color: '#251b14' }}>
                  Enquiry ID: {selectedQuote.id.slice(2, 12)}
                </h2>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#8c7d6b', padding: '0 4px', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '30px', flex: 1 }}>
              
              {/* Status and Action bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '16px 20px', backgroundColor: '#fdfbfa', border: '1px solid rgba(37,27,20,0.06)', borderRadius: '8px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#5f4f3b' }}>Status:</span>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '12px',
                    backgroundColor: 
                      selectedQuote.status === 'New' ? '#fff3cd' : 
                      selectedQuote.status === 'Contacted' ? '#d4edda' : '#e2e3e5',
                    color: 
                      selectedQuote.status === 'New' ? '#856404' : 
                      selectedQuote.status === 'Contacted' ? '#155724' : '#383d41',
                  }}>
                    {selectedQuote.status}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => updateStatus(selectedQuote.id, 'New')}
                    disabled={selectedQuote.status === 'New'}
                    style={{ padding: '6px 12px', border: '1px solid #ced4da', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', opacity: selectedQuote.status === 'New' ? 0.5 : 1, backgroundColor: '#fff', color: '#333' }}
                  >
                    Mark New
                  </button>
                  <button
                    onClick={() => updateStatus(selectedQuote.id, 'Contacted')}
                    disabled={selectedQuote.status === 'Contacted'}
                    style={{ padding: '6px 12px', border: '1px solid #ced4da', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', opacity: selectedQuote.status === 'Contacted' ? 0.5 : 1, backgroundColor: '#fff', color: '#333' }}
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => updateStatus(selectedQuote.id, 'Archived')}
                    disabled={selectedQuote.status === 'Archived'}
                    style={{ padding: '6px 12px', border: '1px solid #ced4da', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', opacity: selectedQuote.status === 'Archived' ? 0.5 : 1, backgroundColor: '#fff', color: '#333' }}
                  >
                    Archive
                  </button>
                </div>
              </div>

              {/* Client Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '30px' }}>
                <div>
                  <h3 style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#8c7d6b', textTransform: 'uppercase', borderBottom: '1px solid rgba(37,27,20,0.06)', paddingBottom: '6px' }}>Client Contact Details</h3>
                  <table style={{ width: '100%', fontSize: '0.95rem' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '4px 0', color: '#5f4f3b', width: '100px' }}>Name:</td>
                        <td style={{ padding: '4px 0', fontWeight: 600, color: '#251b14' }}>{selectedQuote.name}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px 0', color: '#5f4f3b' }}>Email:</td>
                        <td style={{ padding: '4px 0', color: '#251b14' }}>
                          <a href={`mailto:${selectedQuote.email}`} style={{ color: '#b5632a', textDecoration: 'none' }}>{selectedQuote.email}</a>
                        </td>
                      </tr>
                      {selectedQuote.phone && (
                        <tr>
                          <td style={{ padding: '4px 0', color: '#5f4f3b' }}>Phone:</td>
                          <td style={{ padding: '4px 0', color: '#251b14' }}>
                            <a href={`tel:${selectedQuote.phone}`} style={{ color: '#b5632a', textDecoration: 'none' }}>{selectedQuote.phone}</a>
                          </td>
                        </tr>
                      )}
                      {selectedQuote.city && (
                        <tr>
                          <td style={{ padding: '4px 0', color: '#5f4f3b' }}>City:</td>
                          <td style={{ padding: '4px 0', color: '#251b14' }}>{selectedQuote.city}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#8c7d6b', textTransform: 'uppercase', borderBottom: '1px solid rgba(37,27,20,0.06)', paddingBottom: '6px' }}>Event & Gifting details</h3>
                  <table style={{ width: '100%', fontSize: '0.95rem' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '4px 0', color: '#5f4f3b', width: '120px' }}>Occasion/Event:</td>
                        <td style={{ padding: '4px 0', color: '#251b14', fontWeight: 500 }}>
                          {selectedQuote.eventType || selectedQuote.occasion || 'General Curation'}
                        </td>
                      </tr>
                      {selectedQuote.type === 'basket' ? (
                        <tr>
                          <td style={{ padding: '4px 0', color: '#5f4f3b' }}>Guest Count:</td>
                          <td style={{ padding: '4px 0', color: '#251b14' }}>{selectedQuote.guestCount || 'Not specified'}</td>
                        </tr>
                      ) : (
                        <tr>
                          <td style={{ padding: '4px 0', color: '#5f4f3b' }}>Approx Quantity:</td>
                          <td style={{ padding: '4px 0', color: '#251b14' }}>{selectedQuote.quantity || 'Not specified'}</td>
                        </tr>
                      )}
                      {/* Deal Value Calculation Display */}
                      <tr>
                        <td style={{ padding: '4px 0', color: '#5f4f3b' }}>Est. Deal Value:</td>
                        <td style={{ padding: '4px 0', color: '#b5632a', fontWeight: 600 }}>
                          ₹{getQuoteValue(selectedQuote).toLocaleString('en-IN')}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px 0', color: '#5f4f3b' }}>Quote Date:</td>
                        <td style={{ padding: '4px 0', color: '#251b14' }}>
                          {new Date(selectedQuote.createdAt).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Items Selected Section */}
              <h3 style={{ margin: '30px 0 16px', fontSize: '0.9rem', color: '#8c7d6b', textTransform: 'uppercase', borderBottom: '1px solid rgba(37,27,20,0.06)', paddingBottom: '6px' }}>
                Items Requested ({selectedQuote.items.length})
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                {selectedQuote.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', border: '1px solid rgba(37,27,20,0.06)', borderRadius: '8px', backgroundColor: '#fcfaf8' }}
                  >
                    <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem', color: '#251b14' }}>{item.name}</p>
                      <small style={{ color: '#8c7d6b', fontSize: '0.8rem' }}>Material: {item.material} | Category: {item.category}</small>
                    </div>
                    {item.min && (
                      <span style={{ fontSize: '0.8rem', color: '#b5632a', fontWeight: 500, backgroundColor: '#fdf3ed', padding: '4px 8px', borderRadius: '4px' }}>
                        {item.min}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '20px 30px', borderTop: '1px solid rgba(37,27,20,0.08)', backgroundColor: '#fcfaf7' }}>
              <button
                onClick={() => setSelectedQuote(null)}
                style={{ padding: '10px 20px', border: '1px solid #ced4da', borderRadius: '6px', color: '#495057', backgroundColor: '#fff', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  deleteQuote(selectedQuote.id);
                }}
                style={{ padding: '10px 20px', border: '1px solid #f5c6cb', borderRadius: '6px', color: '#721c24', backgroundColor: '#f8d7da', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
              >
                🗑️ Delete Request
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Delete Confirmation Modal */}
      {quoteToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(37,27,20,0.6)',
            zIndex: 1100, // Higher than details modal
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setQuoteToDelete(null)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '1px solid rgba(37,27,20,0.1)',
              width: '100%',
              maxWidth: '450px',
              padding: '30px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#c53030' }}>
              <span style={{ fontSize: '2rem' }}>⚠️</span>
              <h3 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 'normal' }}>
                Confirm Delete
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#5f4f3b', lineHeight: 1.5 }}>
              Are you sure you want to permanently delete this quote request? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button
                onClick={() => setQuoteToDelete(null)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  color: '#495057',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const id = quoteToDelete;
                  setQuoteToDelete(null);
                  await executeDelete(id);
                }}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  backgroundColor: '#c53030',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9b1c1c')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#c53030')}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Keyframe animation for spinner */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
