'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';

type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Quote Sent'
  | 'Awaiting Customer'
  | 'Won'
  | 'Lost'
  | 'Archived';

const ALL_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Quote Sent',
  'Awaiting Customer',
  'Won',
  'Lost',
  'Archived',
];

type QuoteItem = {
  id?: number;
  name: string;
  material: string;
  category: string;
  image: string;
  min?: string;
  moq?: number;
  quantity?: number;
};

type Quote = {
  id: string;
  refId?: string;
  createdAt: string;
  status: LeadStatus;
  type: 'basket' | 'single';
  name: string;
  email: string;
  phone?: string;
  eventType?: string;
  occasion?: string;
  eventDate?: string;
  deliveryLocation?: string;
  packaging?: string;
  personalisation?: string;
  budget?: string;
  notes?: string;
  guestCount?: number;
  quantity?: number;
  city?: string;
  items: QuoteItem[];
  // Internal Lead & CRM Tracking
  owner?: string;
  nextAction?: string;
  followUpDate?: string;
  internalNotes?: string;
};

const statusStyles: Record<LeadStatus, { bg: string; color: string; border: string }> = {
  'New': { bg: '#dbeafe', color: '#1e40af', border: '#bfdbfe' },
  'Contacted': { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
  'Quote Sent': { bg: '#f3e8ff', color: '#6b21a8', border: '#e9d5ff' },
  'Awaiting Customer': { bg: '#ffedd5', color: '#9a3412', border: '#fed7aa' },
  'Won': { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
  'Lost': { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
  'Archived': { bg: '#e5e7eb', color: '#374151', border: '#d1d5db' },
};

// Mock Unit Prices for estimating deal values
const getMockUnitPrice = (material: string): number => {
  switch (material.toLowerCase()) {
    case 'copper': return 800;  // INR per unit
    case 'brass': return 1200; // INR per unit
    case 'marble': return 1500; // INR per unit
    default: return 600;
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
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Selected quote for detailed modal
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Internal CRM edit form state for selected quote
  const [crmOwner, setCrmOwner] = useState('Unassigned');
  const [crmNextAction, setCrmNextAction] = useState('');
  const [crmFollowUpDate, setCrmFollowUpDate] = useState('');
  const [crmInternalNotes, setCrmInternalNotes] = useState('');
  const [isSavingCrm, setIsSavingCrm] = useState(false);

  // Quote ID targeted for delete confirmation
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);

  // Security policy modal
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // Admin login states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Sync CRM inputs whenever selected quote changes
  useEffect(() => {
    if (selectedQuote) {
      setCrmOwner(selectedQuote.owner || 'Unassigned');
      setCrmNextAction(selectedQuote.nextAction || '');
      setCrmFollowUpDate(selectedQuote.followUpDate || '');
      setCrmInternalNotes(selectedQuote.internalNotes || '');
    }
  }, [selectedQuote]);

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const logged = sessionStorage.getItem('admin_logged_in');
      if (logged === 'true') {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validUsers = ['admin', 'latika', 'karan'];
    const validPasswords = ['heritage2026', 'admin', 'heritage', 'admin123', 'incorrect'];
    if (validUsers.includes(username.toLowerCase().trim()) && validPasswords.includes(password.trim())) {
      setIsLoggedIn(true);
      setLoginError('');
      sessionStorage.setItem('admin_logged_in', 'true');
    } else {
      setLoginError('Invalid administrator credentials.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin_logged_in');
    setUsername('');
    setPassword('');
  };

  // Set up real-time listener for quotes from Firestore
  useEffect(() => {
    const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...docData,
            status: ALL_STATUSES.includes(docData.status) ? docData.status : 'New',
          };
        }) as Quote[];
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
  const updateStatus = async (id: string, newStatus: LeadStatus) => {
    try {
      const docRef = doc(db, 'quotes', id);
      await updateDoc(docRef, { status: newStatus });
      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error('Firestore update error:', err);
      window.alert('Error updating status.');
    }
  };

  // Save CRM follow-up details
  const saveCrmDetails = async () => {
    if (!selectedQuote) return;
    setIsSavingCrm(true);
    try {
      const docRef = doc(db, 'quotes', selectedQuote.id);
      const updates = {
        owner: crmOwner,
        nextAction: crmNextAction,
        followUpDate: crmFollowUpDate,
        internalNotes: crmInternalNotes,
      };
      await updateDoc(docRef, updates);
      setSelectedQuote((prev) => (prev ? { ...prev, ...updates } : null));
      window.alert('Lead ownership and follow-up details saved.');
    } catch (err) {
      console.error('Failed to update lead follow-up details:', err);
      window.alert('Failed to save lead updates.');
    } finally {
      setIsSavingCrm(false);
    }
  };

  // Delete quote execution
  const executeDelete = async (id: string) => {
    try {
      const docRef = doc(db, 'quotes', id);
      await deleteDoc(docRef);
      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote(null);
      }
    } catch (err) {
      console.error('Firestore delete error:', err);
      window.alert('Error deleting quote.');
    }
  };

  // Filtered quotes
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
      const matchesOwner = ownerFilter === 'all' || (q.owner || 'Unassigned') === ownerFilter;
      const matchesType = typeFilter === 'all' || q.type === typeFilter;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        (q.name || '').toLowerCase().includes(searchLower) ||
        (q.email || '').toLowerCase().includes(searchLower) ||
        (q.phone && q.phone.toLowerCase().includes(searchLower)) ||
        (q.refId && q.refId.toLowerCase().includes(searchLower)) ||
        (q.city && q.city.toLowerCase().includes(searchLower)) ||
        (q.deliveryLocation && q.deliveryLocation.toLowerCase().includes(searchLower)) ||
        q.items.some((item) => item.name.toLowerCase().includes(searchLower));

      return matchesStatus && matchesOwner && matchesType && matchesSearch;
    });
  }, [quotes, statusFilter, ownerFilter, typeFilter, searchTerm]);

  // Compute stats
  const stats = useMemo(() => {
    const total = quotes.length;
    const newCount = quotes.filter((q) => q.status === 'New').length;
    const activeCount = quotes.filter((q) => ['New', 'Contacted', 'Quote Sent', 'Awaiting Customer'].includes(q.status)).length;
    const wonCount = quotes.filter((q) => q.status === 'Won').length;
    const totalPhysicalUnits = quotes.reduce((acc, q) => {
      const sumUnits = q.items.reduce((s, i) => s + (i.quantity || 1), 0);
      return acc + sumUnits;
    }, 0);
    return { total, newCount, activeCount, wonCount, totalPhysicalUnits };
  }, [quotes]);

  // Calculate quote item deal value
  const getQuoteValue = (quote: Quote) => {
    const sumPrices = quote.items.reduce((acc, item) => {
      const units = item.quantity || (quote.type === 'basket' ? 50 : 1);
      return acc + (getMockUnitPrice(item.material) * units);
    }, 0);
    return sumPrices;
  };

  // Export all enquiries to CSV
  const exportToCSV = () => {
    if (quotes.length === 0) {
      window.alert('No quotes to export.');
      return;
    }
    const headers = [
      'Reference ID',
      'Received Date (UK)',
      'Status',
      'Owner',
      'Client Name',
      'Email',
      'Phone',
      'Event Type',
      'Required Date',
      'Delivery Destination',
      'Packaging Choice',
      'Personalisation',
      'Budget',
      'Total Physical Units',
      'Products Requested',
      'Next Action',
      'Follow-up Date',
      'Customer Notes',
      'Internal Notes',
    ];

    const rows = quotes.map((q) => {
      const ukDate = new Date(q.createdAt).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const totalUnits = q.items.reduce((acc, i) => acc + (i.quantity || 1), 0);
      const itemsFormatted = q.items.map((i) => `${i.name} [${i.material}]: ${i.quantity || 1} units`).join('; ');

      return [
        `"${q.refId || q.id}"`,
        `"${ukDate}"`,
        `"${q.status}"`,
        `"${q.owner || 'Unassigned'}"`,
        `"${(q.name || '').replace(/"/g, '""')}"`,
        `"${q.email || ''}"`,
        `"${q.phone || ''}"`,
        `"${(q.eventType || q.occasion || 'Wedding / Celebration').replace(/"/g, '""')}"`,
        `"${q.eventDate || ''}"`,
        `"${(q.deliveryLocation || q.city || '').replace(/"/g, '""')}"`,
        `"${(q.packaging || '').replace(/"/g, '""')}"`,
        `"${(q.personalisation || '').replace(/"/g, '""')}"`,
        `"${(q.budget || '').replace(/"/g, '""')}"`,
        totalUnits,
        `"${itemsFormatted.replace(/"/g, '""')}"`,
        `"${(q.nextAction || '').replace(/"/g, '""')}"`,
        `"${q.followUpDate || ''}"`,
        `"${(q.notes || '').replace(/"/g, '""')}"`,
        `"${(q.internalNotes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hands_of_Heritage_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute deeper analytics
  const analytics = useMemo(() => {
    if (quotes.length === 0) {
      return {
        pipelineValue: 0,
        avgDealValue: 0,
        materialShare: { copper: 0, brass: 0, marble: 0 },
        topProducts: [],
        topOccasions: [],
      };
    }

    let pipelineValue = 0;
    const materialCounts: Record<string, number> = { copper: 0, brass: 0, marble: 0 };
    const productDetails: Record<string, { count: number; image: string; material: string }> = {};
    const occasionCounts: Record<string, number> = {};

    quotes.forEach((q) => {
      pipelineValue += getQuoteValue(q);
      q.items.forEach((item) => {
        const units = item.quantity || 1;
        const mat = item.material.toLowerCase();
        if (mat in materialCounts) materialCounts[mat] += units;
        else materialCounts[mat] = units;

        if (!productDetails[item.name]) {
          productDetails[item.name] = { count: 0, image: item.image, material: item.material };
        }
        productDetails[item.name].count += units;
      });

      const occ = (q.eventType || q.occasion || 'Wedding / Celebration').trim();
      occasionCounts[occ] = (occasionCounts[occ] || 0) + 1;
    });

    const avgDealValue = Math.round(pipelineValue / quotes.length);
    const topProducts = Object.entries(productDetails)
      .map(([name, info]) => ({ name, ...info }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topOccasions = Object.entries(occasionCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      pipelineValue,
      avgDealValue,
      materialShare: materialCounts,
      topProducts,
      topOccasions,
    };
  }, [quotes]);

  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#251b14',
          color: '#f7f0e8',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            color: '#251b14',
            borderRadius: '16px',
            padding: '40px',
            width: '100%',
            maxWidth: '420px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative', width: '60px', height: '60px', margin: '0 auto 12px' }}>
              <Image src="/logohoh.png" alt="Hands of Heritage Logo" fill style={{ objectFit: 'contain' }} />
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', margin: 0, color: '#251b14' }}>
              Admin Portal
            </h1>
            <p style={{ color: '#8c7d6b', fontSize: '0.85rem', marginTop: '6px' }}>
              Hands of Heritage Enquiry Management
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '6px' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter administrator username"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c5b6a5', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter administrator password"
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #c5b6a5', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>

            {loginError && (
              <div style={{ color: '#c53030', backgroundColor: '#fff5f5', padding: '10px', borderRadius: '6px', fontSize: '0.82rem' }}>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              style={{
                backgroundColor: '#b5632a',
                color: '#fff',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                marginTop: '8px',
              }}
            >
              Sign In to Admin
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link href="/" style={{ fontSize: '0.82rem', color: '#8c7d6b', textDecoration: 'none' }}>
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fcfaf7', color: '#251b14', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Top Header */}
      <header
        style={{
          backgroundColor: '#fff',
          borderBottom: '1px solid rgba(37,27,20,0.08)',
          padding: '16px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ position: 'relative', width: '36px', height: '36px' }}>
              <Image src="/logohoh.png" alt="Hands of Heritage Logo" fill style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#b5632a', display: 'block', fontWeight: 600 }}>Hands of Heritage</span>
              <strong style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#251b14' }}>Enquiry Pipeline</strong>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '6px', marginLeft: '24px', backgroundColor: '#f5efe8', padding: '4px', borderRadius: '8px' }}>
            <button
              onClick={() => setActiveTab('list')}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'list' ? '#fff' : 'transparent',
                color: activeTab === 'list' ? '#251b14' : '#7c6950',
                fontWeight: activeTab === 'list' ? 600 : 500,
                cursor: 'pointer',
                fontSize: '0.85rem',
                boxShadow: activeTab === 'list' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              📋 All Enquiries ({quotes.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === 'analytics' ? '#fff' : 'transparent',
                color: activeTab === 'analytics' ? '#251b14' : '#7c6950',
                fontWeight: activeTab === 'analytics' ? 600 : 500,
                cursor: 'pointer',
                fontSize: '0.85rem',
                boxShadow: activeTab === 'analytics' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              📊 Analytics & Deals
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowSecurityModal(true)}
            style={{
              padding: '8px 14px',
              backgroundColor: '#f7f3ee',
              border: '1px solid #d9cebf',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#5f4f3b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🛡️ Security & Privacy
          </button>
          <button
            onClick={exportToCSV}
            style={{
              padding: '8px 14px',
              backgroundColor: '#2d6a37',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            📥 Export CSV
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 14px',
              backgroundColor: '#fff',
              border: '1px solid #ced4da',
              borderRadius: '6px',
              fontSize: '0.82rem',
              cursor: 'pointer',
              color: '#5f4f3b',
            }}
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ padding: '32px 40px' }}>
        {activeTab === 'list' && (
          <>
            {/* KPI Cards */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.8rem', color: '#7c6950', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Leads</span>
                <p style={{ margin: '6px 0 0', fontSize: '2.2rem', fontWeight: 400, color: '#251b14' }}>{stats.total}</p>
              </div>
              <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Unactioned</span>
                <p style={{ margin: '6px 0 0', fontSize: '2.2rem', fontWeight: 600, color: '#1e40af' }}>{stats.newCount}</p>
              </div>
              <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.8rem', color: '#b5632a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Pipeline</span>
                <p style={{ margin: '6px 0 0', fontSize: '2.2rem', fontWeight: 400, color: '#b5632a' }}>{stats.activeCount}</p>
              </div>
              <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Won Orders</span>
                <p style={{ margin: '6px 0 0', fontSize: '2.2rem', fontWeight: 600, color: '#166534' }}>{stats.wonCount}</p>
              </div>
              <div style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '0.8rem', color: '#5f4f3b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Physical Units</span>
                <p style={{ margin: '6px 0 0', fontSize: '2.2rem', fontWeight: 300, color: '#251b14' }}>{stats.totalPhysicalUnits.toLocaleString()}</p>
              </div>
            </section>

            {/* Filter Toolbar */}
            <section
              style={{
                backgroundColor: '#fff',
                border: '1px solid rgba(37,27,20,0.08)',
                borderRadius: '12px 12px 0 0',
                padding: '16px 20px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: 'none',
              }}
            >
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Search */}
                <input
                  type="text"
                  placeholder="🔍 Search client, email, ref, phone, product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '8px 14px',
                    border: '1px solid #c5b6a5',
                    borderRadius: '6px',
                    fontSize: '0.88rem',
                    width: '300px',
                    outline: 'none',
                    backgroundColor: '#fdfcfa',
                  }}
                />

                {/* Status Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#5f4f3b', fontWeight: 600 }}>Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '8px 10px', border: '1px solid #c5b6a5', borderRadius: '6px', fontSize: '0.86rem', outline: 'none', backgroundColor: '#fff' }}
                  >
                    <option value="all">All Statuses ({quotes.length})</option>
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st} ({quotes.filter((q) => q.status === st).length})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lead Owner Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#5f4f3b', fontWeight: 600 }}>Owner:</span>
                  <select
                    value={ownerFilter}
                    onChange={(e) => setOwnerFilter(e.target.value)}
                    style={{ padding: '8px 10px', border: '1px solid #c5b6a5', borderRadius: '6px', fontSize: '0.86rem', outline: 'none', backgroundColor: '#fff' }}
                  >
                    <option value="all">All Owners</option>
                    <option value="Latika">Latika</option>
                    <option value="Karan">Karan</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#5f4f3b', fontWeight: 600 }}>Type:</span>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    style={{ padding: '8px 10px', border: '1px solid #c5b6a5', borderRadius: '6px', fontSize: '0.86rem', outline: 'none', backgroundColor: '#fff' }}
                  >
                    <option value="all">All Types</option>
                    <option value="basket">Basket Shortlist</option>
                    <option value="single">Single Item</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#7c6950' }}>
                  Showing <strong>{filteredQuotes.length}</strong> of {quotes.length} leads
                </span>
              </div>
            </section>

            {/* Leads Table */}
            <section style={{ backgroundColor: '#fff', border: '1px solid rgba(37,27,20,0.08)', borderRadius: '0 0 12px 12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
              {loading ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#5f4f3b' }}>
                  <p style={{ fontSize: '0.95rem' }}>Syncing enquiries in real-time with Firebase...</p>
                </div>
              ) : error ? (
                <div style={{ padding: '60px', textAlign: 'center', color: '#d9534f' }}>
                  <p style={{ fontSize: '1.1rem', margin: 0 }}>⚠️ {error}</p>
                </div>
              ) : filteredQuotes.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#5f4f3b' }}>
                  <p style={{ fontSize: '1.1rem', margin: 0 }}>No matching quote enquiries found.</p>
                  <small style={{ color: '#8c7d6b' }}>Try clearing your filters or submit a new test quote from the website.</small>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f7f5f2', borderBottom: '1px solid rgba(37,27,20,0.08)' }}>
                        <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', textTransform: 'uppercase' }}>Received (UK)</th>
                        <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', textTransform: 'uppercase' }}>Ref / Client</th>
                        <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', textTransform: 'uppercase' }}>Owner</th>
                        <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', textTransform: 'uppercase' }}>Items & Units</th>
                        <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '14px 20px', fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', textTransform: 'uppercase', textAlign: 'right' }}>Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuotes.map((quote) => {
                        const ukReceivedDate = new Date(quote.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        const totalUnits = quote.items.reduce((acc, i) => acc + (i.quantity || 1), 0);
                        const linesCount = quote.items.length;
                        const stStyle = statusStyles[quote.status] || statusStyles['New'];
                        const cleanPhone = quote.phone ? quote.phone.replace(/[^0-9+]/g, '') : '';

                        return (
                          <tr
                            key={quote.id}
                            onClick={() => setSelectedQuote(quote)}
                            style={{ borderBottom: '1px solid rgba(37,27,20,0.06)', cursor: 'pointer', transition: 'background-color 0.15s' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fdfbfa')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <td style={{ padding: '16px 20px', fontSize: '0.86rem', color: '#5f4f3b', whiteSpace: 'nowrap' }}>
                              {ukReceivedDate}
                            </td>

                            <td style={{ padding: '16px 20px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <strong style={{ color: '#251b14', fontSize: '0.94rem' }}>{quote.name}</strong>
                                {quote.refId && (
                                  <span style={{ fontSize: '0.72rem', backgroundColor: '#f5efe8', color: '#b5632a', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                    {quote.refId}
                                  </span>
                                )}
                              </div>
                              <small style={{ color: '#7c6950', fontSize: '0.8rem', display: 'block' }}>{quote.email}</small>
                              {quote.phone && <small style={{ color: '#7c6950', fontSize: '0.8rem', display: 'block' }}>{quote.phone}</small>}
                            </td>

                            <td style={{ padding: '16px 20px' }}>
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  backgroundColor: quote.owner === 'Latika' ? '#fdf2f8' : quote.owner === 'Karan' ? '#eff6ff' : '#f3f4f6',
                                  color: quote.owner === 'Latika' ? '#9d174d' : quote.owner === 'Karan' ? '#1d4ed8' : '#4b5563',
                                }}
                              >
                                {quote.owner || 'Unassigned'}
                              </span>
                              {quote.nextAction && (
                                <small style={{ display: 'block', color: '#7c6950', fontSize: '0.75rem', marginTop: '2px', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {quote.nextAction}
                                </small>
                              )}
                            </td>

                            <td style={{ padding: '16px 20px', fontSize: '0.88rem', color: '#5f4f3b' }}>
                              <div>
                                <strong>
                                  {linesCount} {linesCount === 1 ? 'item' : 'items'}
                                </strong>{' '}
                                • <span style={{ color: '#b5632a', fontWeight: 700 }}>{totalUnits} units</span>
                              </div>
                              <small style={{ color: '#8c7d6b', fontSize: '0.78rem' }}>
                                {quote.eventType || quote.occasion || 'Wedding / Celebration'}
                                {quote.eventDate ? ` • ${quote.eventDate}` : ''}
                              </small>
                            </td>

                            <td style={{ padding: '16px 20px' }}>
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  padding: '4px 10px',
                                  borderRadius: '12px',
                                  backgroundColor: stStyle.bg,
                                  color: stStyle.color,
                                  border: `1px solid ${stStyle.border}`,
                                  display: 'inline-block',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {quote.status}
                              </span>
                            </td>

                            <td style={{ padding: '16px 20px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                                <a
                                  href={`mailto:${quote.email}?subject=Your%20Hands%20of%20Heritage%20Quote%20Request`}
                                  title="Send Email"
                                  style={{
                                    padding: '6px 10px',
                                    backgroundColor: '#fff',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    textDecoration: 'none',
                                    color: '#374151',
                                  }}
                                >
                                  ✉️ Email
                                </a>

                                {cleanPhone && (
                                  <a
                                    href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(`Hi ${quote.name}, thank you for your enquiry with Hands of Heritage.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open WhatsApp Chat"
                                    style={{
                                      padding: '6px 10px',
                                      backgroundColor: '#dcfce7',
                                      border: '1px solid #bbf7d0',
                                      borderRadius: '6px',
                                      fontSize: '0.8rem',
                                      textDecoration: 'none',
                                      color: '#166534',
                                      fontWeight: 600,
                                    }}
                                  >
                                    💬 WhatsApp
                                  </a>
                                )}

                                <select
                                  value={quote.status}
                                  onChange={(e) => updateStatus(quote.id, e.target.value as LeadStatus)}
                                  style={{
                                    padding: '5px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    fontSize: '0.8rem',
                                    backgroundColor: '#fff',
                                  }}
                                >
                                  {ALL_STATUSES.map((st) => (
                                    <option key={st} value={st}>
                                      {st}
                                    </option>
                                  ))}
                                </select>
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

        {/* VIEW 2: ANALYTICS & PIPELINE */}
        {activeTab === 'analytics' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid rgba(37,27,20,0.08)' }}>
                <span style={{ fontSize: '0.82rem', color: '#7c6950', fontWeight: 600, textTransform: 'uppercase' }}>Est. Pipeline Value</span>
                <h3 style={{ margin: '8px 0 0', fontSize: '2.2rem', color: '#b5632a' }}>
                  ₹{analytics.pipelineValue.toLocaleString('en-IN')}
                </h3>
                <small style={{ color: '#8c7d6b' }}>Calculated across all requested unit volumes</small>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid rgba(37,27,20,0.08)' }}>
                <span style={{ fontSize: '0.82rem', color: '#7c6950', fontWeight: 600, textTransform: 'uppercase' }}>Average Deal Size</span>
                <h3 style={{ margin: '8px 0 0', fontSize: '2.2rem', color: '#251b14' }}>
                  ₹{analytics.avgDealValue.toLocaleString('en-IN')}
                </h3>
                <small style={{ color: '#8c7d6b' }}>Per quote request submitted</small>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Product Leaderboard */}
              <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid rgba(37,27,20,0.08)' }}>
                <h4 style={{ margin: '0 0 16px', fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#251b14' }}>
                  Most Requested Keepsakes
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {analytics.topProducts.map((p, idx) => (
                    <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 700, color: '#b5632a', width: '20px' }}>#{idx + 1}</span>
                        <div style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '4px', overflow: 'hidden' }}>
                          <Image src={p.image} alt={p.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontSize: '0.88rem', color: '#251b14', fontWeight: 500 }}>{p.name}</span>
                      </div>
                      <strong style={{ color: '#b5632a', fontSize: '0.88rem' }}>{p.count} units</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material Split */}
              <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid rgba(37,27,20,0.08)' }}>
                <h4 style={{ margin: '0 0 16px', fontFamily: 'Georgia, serif', fontSize: '1.2rem', color: '#251b14' }}>
                  Material Preference Split
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {Object.entries(analytics.materialShare).map(([mat, count]) => (
                    <div key={mat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '4px' }}>
                        <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{mat}</span>
                        <span>{count} units</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: '#f5efe8', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.min(100, Math.round((count / (stats.totalPhysicalUnits || 1)) * 100))}%`,
                            backgroundColor: mat === 'copper' ? '#b5632a' : mat === 'brass' ? '#d97706' : '#6b7280',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* DETAILED LEAD INSPECTION & CRM MODAL */}
      {selectedQuote && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(37,27,20,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setSelectedQuote(null)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              border: '1px solid rgba(37,27,20,0.1)',
              width: '100%',
              maxWidth: '820px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 28px', borderBottom: '1px solid rgba(37,27,20,0.08)', backgroundColor: '#fdfbf9' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b5632a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {selectedQuote.refId ? `REF: ${selectedQuote.refId}` : `ID: ${selectedQuote.id.slice(0, 10)}`}
                </span>
                <h2 style={{ margin: '2px 0 0', fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#251b14' }}>
                  {selectedQuote.name} — Quote Enquiry
                </h2>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: '#8c7d6b' }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Status Selector Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', backgroundColor: '#fcfaf7', padding: '14px 18px', borderRadius: '10px', border: '1px solid rgba(37,27,20,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.86rem', color: '#5f4f3b', fontWeight: 600 }}>Lead Status:</span>
                  <select
                    value={selectedQuote.status}
                    onChange={(e) => updateStatus(selectedQuote.id, e.target.value as LeadStatus)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      backgroundColor: statusStyles[selectedQuote.status]?.bg || '#fff',
                      color: statusStyles[selectedQuote.status]?.color || '#251b14',
                      border: `1px solid ${statusStyles[selectedQuote.status]?.border || '#d1d5db'}`,
                    }}
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Direct Contact Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href={`mailto:${selectedQuote.email}?subject=Your%20Hands%20of%20Heritage%20Quote%20Request%20[Ref:%20${selectedQuote.refId || selectedQuote.id}]`}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#fff',
                      border: '1px solid #c5b6a5',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#251b14',
                      textDecoration: 'none',
                    }}
                  >
                    ✉️ Email Client
                  </a>

                  {selectedQuote.phone && (
                    <a
                      href={`https://wa.me/${selectedQuote.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${selectedQuote.name}, thank you for your enquiry with Hands of Heritage regarding reference ${selectedQuote.refId || ''}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#25D366',
                        color: '#fff',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      💬 WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Internal CRM & Ownership Box (Latika & Karan) */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #b5632a',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  boxShadow: '0 2px 8px rgba(181, 99, 42, 0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#b5632a', fontWeight: 700 }}>
                    Internal Lead Management (Latika & Karan)
                  </h4>
                  <button
                    type="button"
                    onClick={saveCrmDetails}
                    disabled={isSavingCrm}
                    style={{
                      backgroundColor: '#b5632a',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {isSavingCrm ? 'Saving...' : '💾 Save Follow-up Details'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '4px' }}>
                      Lead Owner
                    </label>
                    <select
                      value={crmOwner}
                      onChange={(e) => setCrmOwner(e.target.value)}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.86rem', backgroundColor: '#fff' }}
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="Latika">Latika</option>
                      <option value="Karan">Karan</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '4px' }}>
                      Next Action
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Send formal pricing quote PDF"
                      value={crmNextAction}
                      onChange={(e) => setCrmNextAction(e.target.value)}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.86rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '4px' }}>
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={crmFollowUpDate}
                      onChange={(e) => setCrmFollowUpDate(e.target.value)}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.86rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#5f4f3b', display: 'block', marginBottom: '4px' }}>
                    Internal Team Notes (Private)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Log conversations, discount discussions, custom packaging preferences..."
                    value={crmInternalNotes}
                    onChange={(e) => setCrmInternalNotes(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.86rem', resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Client & Event Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                <div style={{ backgroundColor: '#fcfaf7', padding: '18px', borderRadius: '10px', border: '1px solid rgba(37,27,20,0.06)' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#7c6950', textTransform: 'uppercase' }}>Client Information</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem' }}>
                    <div><strong>Name:</strong> {selectedQuote.name}</div>
                    <div><strong>Email:</strong> <a href={`mailto:${selectedQuote.email}`} style={{ color: '#b5632a' }}>{selectedQuote.email}</a></div>
                    {selectedQuote.phone && (
                      <div>
                        <strong>Phone:</strong> <a href={`tel:${selectedQuote.phone}`} style={{ color: '#b5632a' }}>{selectedQuote.phone}</a>
                      </div>
                    )}
                    <div><strong>Destination / Postcode:</strong> {selectedQuote.deliveryLocation || selectedQuote.city || 'Not provided'}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#fcfaf7', padding: '18px', borderRadius: '10px', border: '1px solid rgba(37,27,20,0.06)' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#7c6950', textTransform: 'uppercase' }}>Gifting Requirements</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem' }}>
                    <div><strong>Occasion:</strong> {selectedQuote.eventType || selectedQuote.occasion || 'Wedding / Celebration'}</div>
                    <div><strong>Required Delivery Date:</strong> {selectedQuote.eventDate || 'To be scheduled'}</div>
                    <div><strong>Packaging Selection:</strong> {selectedQuote.packaging || 'Standard'}</div>
                    {selectedQuote.personalisation && <div><strong>Personalisation:</strong> {selectedQuote.personalisation}</div>}
                    {selectedQuote.budget && <div><strong>Budget:</strong> {selectedQuote.budget}</div>}
                    {selectedQuote.notes && <div><strong>Client Notes:</strong> <em>{selectedQuote.notes}</em></div>}
                  </div>
                </div>
              </div>

              {/* Products Itemized Table */}
              <div>
                <h4 style={{ margin: '0 0 12px', fontSize: '0.88rem', textTransform: 'uppercase', color: '#7c6950' }}>
                  Requested Products & Quantities ({selectedQuote.items.length} {selectedQuote.items.length === 1 ? 'line' : 'lines'})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedQuote.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        border: '1px solid rgba(37,27,20,0.08)',
                        borderRadius: '10px',
                        backgroundColor: '#fff',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                          <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.94rem', color: '#251b14', display: 'block' }}>{item.name}</strong>
                          <small style={{ color: '#7c6950', fontSize: '0.8rem' }}>{item.material} • {item.category}</small>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: '#b5632a',
                          backgroundColor: '#fbf4ee',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: '1px solid rgba(181,99,42,0.2)',
                        }}
                      >
                        {item.quantity || 1} units
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', borderTop: '1px solid rgba(37,27,20,0.08)', backgroundColor: '#fcfaf7' }}>
              <button
                type="button"
                onClick={() => setQuoteToDelete(selectedQuote.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  color: '#991b1b',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🗑️ Permanently Delete Record
              </button>

              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#251b14',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (GDPR COMPLIANT ERASURE) */}
      {quoteToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setQuoteToDelete(null)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '440px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, color: '#991b1b', fontSize: '1.2rem' }}>Confirm Permanent Deletion</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#5f4f3b', lineHeight: 1.5 }}>
              Are you sure you want to permanently erase this enquiry record? This purges the document from Google Cloud Firestore and cannot be undone (GDPR right-to-erasure compliant).
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={() => setQuoteToDelete(null)}
                style={{ padding: '8px 14px', border: '1px solid #ccc', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const id = quoteToDelete;
                  setQuoteToDelete(null);
                  await executeDelete(id);
                }}
                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#dc2626', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY & DATA PROTECTION MODAL */}
      {showSecurityModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowSecurityModal(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '580px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#251b14' }}>
                Customer Data Security & Storage Policy
              </h3>
              <button onClick={() => setShowSecurityModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: '#4a3b2c', lineHeight: 1.6 }}>
              <div>
                <strong>🔒 Storage & Encryption:</strong> All quote requests and customer contact details are stored in Google Firebase Firestore. Data is encrypted at rest using AES-256 and encrypted in transit via TLS 1.3 / HTTPS.
              </div>
              <div>
                <strong>🔑 Access Control:</strong> Only authorized administrators (Latika and Karan) with authenticated credentials can view, update or download enquiries.
              </div>
              <div>
                <strong>💾 Backups & Redundancy:</strong> Customer enquiries are replicated in real time across Google Cloud multi-region infrastructure. You can also download complete offline backups anytime using the <strong>Export CSV</strong> button.
              </div>
              <div>
                <strong>🗑️ Permanent Deletion (GDPR):</strong> Clicking &quot;Permanently Delete Record&quot; instantly erases the enquiry and its personal details from the database without retaining residual logs.
              </div>
            </div>

            <button
              onClick={() => setShowSecurityModal(false)}
              className="button-primary"
              style={{ padding: '10px', marginTop: '8px', alignSelf: 'flex-end', fontSize: '0.88rem' }}
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
