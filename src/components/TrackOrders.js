import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trackOrders } from '../services/api';
import useTranslation from '../hooks/useTranslation';
import LanguageSelector from './LanguageSelector';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const isMobile = (width) => width < 768;
const isTablet = (width) => width >= 768 && width < 1024;

const TrackOrders = () => {
  const { width } = useWindowSize();
  const mobile = isMobile(width);
  const tablet = isTablet(width);
  const { t } = useTranslation(); // 🆕 Translation hook

  const [phoneNumber, setPhoneNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const parseAddress = (addressString) => {
    if (!addressString) return { street: '', city: '', province: '', code: '' };
    const parts = addressString.split(',').map(p => p.trim());
    return {
      street: parts[0] || '',
      city: parts[1] || '',
      province: parts[2] || '',
      code: parts[3] || '',
    };
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      showToast(`⚠ ${t('track.enterPhone')}`, 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await trackOrders(phoneNumber);
      setOrders(data);
      setSearched(true);
      
      if (data.length === 0) {
        showToast(`📭 ${t('track.noOrders')}`, 'warning');
      } else {
        showToast(`✓ ${data.length} ${t('track.ordersFound')}`, 'success');
      }
    } catch (error) {
      console.error('Error tracking orders:', error);
      showToast(`✗ ${t('common.error')}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^\d\s\-\+\(\)]/g, '');
    setPhoneNumber(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#FFA500';
      case 'Processing': return '#2196F3';
      case 'Shipped': return '#9c27b0';
      case 'Delivered': return '#4CAF50';
      case 'Cancelled': return '#f44336';
      default: return '#999';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'Processing': return '📦';
      case 'Shipped': return '🚚';
      case 'Delivered': return '✅';
      case 'Cancelled': return '❌';
      default: return '📋';
    }
  };

  const getStatusStep = (status) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    return steps.indexOf(status);
  };

  // 🆕 Get translated status label
  const getStatusLabel = (status) => {
    return t(`status.${status.toLowerCase()}`);
  };

  const getStyles = () => ({
    page: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: '#0a0a0a',
      color: 'white',
      minHeight: '100vh',
    },
    nav: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: mobile ? '14px 20px' : '18px 40px',
      background: 'rgba(10, 10, 10, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textDecoration: 'none',
    },
    logoIcon: {
      fontSize: mobile ? '28px' : '32px',
      filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))',
    },
    logoText: {
      fontSize: mobile ? '20px' : '24px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '2px',
      margin: 0,
    },
    navActions: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    navButton: {
      padding: mobile ? '8px 16px' : '10px 20px',
      background: 'transparent',
      color: 'white',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '30px',
      fontSize: mobile ? '12px' : '13px',
      fontWeight: '700',
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      textDecoration: 'none',
    },
    hero: {
      position: 'relative',
      padding: mobile ? '40px 20px' : '60px 40px',
      background: `
        radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(33, 150, 243, 0.08) 0%, transparent 50%),
        linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)
      `,
      textAlign: 'center',
      overflow: 'hidden',
    },
    heroDecoration: {
      position: 'absolute',
      top: '-30%',
      right: '-10%',
      width: mobile ? '200px' : '400px',
      height: mobile ? '200px' : '400px',
      background: 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)',
      borderRadius: '50%',
      animation: 'float 8s ease-in-out infinite',
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
      maxWidth: '800px',
      margin: '0 auto',
    },
    heroIcon: {
      fontSize: mobile ? '56px' : '72px',
      marginBottom: '16px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      filter: 'drop-shadow(0 4px 12px rgba(255, 215, 0, 0.3))',
    },
    heroTitle: {
      fontSize: mobile ? '28px' : tablet ? '38px' : '48px',
      fontWeight: '900',
      lineHeight: '1.1',
      margin: '0 0 12px 0',
      letterSpacing: '-1px',
    },
    heroAccent: {
      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    heroSubtitle: {
      fontSize: mobile ? '14px' : '16px',
      color: 'rgba(255, 255, 255, 0.7)',
      margin: '0 0 24px 0',
      lineHeight: '1.6',
    },
    searchContainer: {
      maxWidth: '700px',
      margin: mobile ? '0 auto 28px' : '0 auto 36px',
      padding: mobile ? '0 20px' : '0 40px',
    },
    searchCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      padding: mobile ? '24px 20px' : '36px 32px',
      borderRadius: '24px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    searchTitle: {
      margin: '0 0 8px 0',
      fontSize: mobile ? '18px' : '22px',
      color: '#FFD700',
      fontWeight: '800',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    searchSubtitle: {
      margin: '0 0 24px 0',
      fontSize: mobile ? '13px' : '14px',
      color: 'rgba(255, 255, 255, 0.6)',
      lineHeight: '1.5',
    },
    searchForm: {
      display: 'flex',
      flexDirection: mobile ? 'column' : 'row',
      gap: '12px',
    },
    inputWrapper: {
      position: 'relative',
      flex: 1,
    },
    inputIcon: {
      position: 'absolute',
      left: mobile ? '14px' : '18px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: mobile ? '20px' : '22px',
      color: 'rgba(255, 215, 0, 0.5)',
      zIndex: 2,
    },
    input: {
      width: '100%',
      padding: mobile ? '14px 16px 14px 46px' : '16px 18px 16px 52px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '14px',
      fontSize: mobile ? '16px' : '17px',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease',
      background: 'rgba(255, 255, 255, 0.05)',
      fontFamily: 'monospace',
      fontWeight: '600',
      color: 'white',
    },
    searchButton: {
      padding: mobile ? '14px 24px' : '16px 32px',
      background: loading
        ? 'linear-gradient(135deg, #424242, #303030)'
        : 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: loading ? '#999' : '#000',
      border: 'none',
      borderRadius: '14px',
      cursor: loading ? 'not-allowed' : 'pointer',
      fontSize: mobile ? '15px' : '16px',
      fontWeight: '800',
      transition: 'all 0.2s ease',
      boxShadow: loading ? 'none' : '0 6px 24px rgba(255, 215, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      minWidth: mobile ? '100%' : 'auto',
    },
    spinner: {
      width: '18px',
      height: '18px',
      border: '3px solid rgba(0, 0, 0, 0.3)',
      borderTop: '3px solid #000',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    resultsContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: mobile ? '0 20px 40px' : '0 40px 60px',
    },
    resultsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '12px',
    },
    resultsTitle: {
      margin: 0,
      fontSize: mobile ? '18px' : '22px',
      color: 'white',
      fontWeight: '800',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    resultsBadge: {
      padding: '8px 16px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#000',
      borderRadius: '20px',
      fontSize: mobile ? '13px' : '14px',
      fontWeight: '800',
      boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
    },
    ordersList: {
      display: 'flex',
      flexDirection: 'column',
      gap: mobile ? '16px' : '24px',
    },
    orderCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      borderRadius: '20px',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      animation: 'slideUp 0.4s ease',
    },
    orderHeader: {
      display: 'flex',
      flexDirection: mobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: mobile ? 'flex-start' : 'center',
      gap: mobile ? '12px' : '0',
      padding: mobile ? '18px' : '24px',
      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 165, 0, 0.04))',
      borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
    },
    orderNumber: {
      margin: 0,
      fontSize: mobile ? '17px' : '20px',
      fontWeight: '800',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    orderDate: {
      margin: '6px 0 0 0',
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: mobile ? '12px' : '13px',
    },
    statusBadge: (status) => ({
      padding: '8px 18px',
      borderRadius: '20px',
      color: 'white',
      fontWeight: '700',
      fontSize: mobile ? '13px' : '14px',
      backgroundColor: getStatusColor(status),
      boxShadow: `0 2px 8px ${getStatusColor(status)}40`,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    }),
    progressTracker: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: mobile ? '20px 12px' : '28px 24px',
      background: 'rgba(255, 255, 255, 0.02)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      overflowX: mobile ? 'auto' : 'visible',
    },
    progressStep: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flex: 1,
      minWidth: mobile ? '70px' : 'auto',
      position: 'relative',
    },
    progressCircle: (isActive, status) => ({
      width: mobile ? '36px' : '44px',
      height: mobile ? '36px' : '44px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '10px',
      fontWeight: '800',
      fontSize: mobile ? '14px' : '16px',
      backgroundColor: isActive ? getStatusColor(status) : 'rgba(255, 255, 255, 0.08)',
      color: isActive ? 'white' : 'rgba(255, 255, 255, 0.3)',
      boxShadow: isActive ? `0 4px 12px ${getStatusColor(status)}50` : 'none',
      transition: 'all 0.3s ease',
    }),
    progressLabel: (isActive) => ({
      fontSize: mobile ? '11px' : '13px',
      color: isActive ? 'white' : 'rgba(255, 255, 255, 0.4)',
      fontWeight: isActive ? '700' : '500',
      textAlign: 'center',
    }),
    orderBody: {
      padding: mobile ? '18px' : '24px',
    },
    customerInfo: {
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
      gap: '12px',
      marginBottom: '16px',
      padding: mobile ? '14px' : '18px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '12px',
    },
    infoItem: {
      fontSize: mobile ? '13px' : '14px',
      color: 'white',
    },
    infoLabel: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: mobile ? '11px' : '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '4px',
    },
    infoValue: {
      color: 'white',
      fontWeight: '600',
    },
    addressSection: {
      padding: mobile ? '14px' : '18px',
      background: 'rgba(33, 150, 243, 0.08)',
      border: '1px solid rgba(33, 150, 243, 0.25)',
      borderRadius: '12px',
      marginBottom: '16px',
    },
    addressTitle: {
      fontWeight: '700',
      color: '#2196F3',
      marginBottom: '10px',
      fontSize: mobile ? '13px' : '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    addressGrid: {
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
      gap: '8px',
      fontSize: mobile ? '12px' : '13px',
      color: 'white',
    },
    addressLabel: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontWeight: '600',
    },
    itemsSection: {
      marginBottom: '16px',
    },
    itemsTitle: {
      margin: '0 0 10px 0',
      fontSize: mobile ? '15px' : '16px',
      fontWeight: '700',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    itemsList: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '10px',
      padding: mobile ? '12px' : '14px',
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: mobile ? '10px 0' : '12px 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      fontSize: mobile ? '13px' : '14px',
    },
    itemLast: {
      borderBottom: 'none',
    },
    itemName: {
      fontWeight: '600',
      color: 'white',
      flex: 1,
      paddingRight: '10px',
    },
    itemPrice: {
      fontWeight: '800',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      whiteSpace: 'nowrap',
    },
    totalsSection: {
      background: 'rgba(255, 215, 0, 0.05)',
      padding: mobile ? '14px' : '18px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 215, 0, 0.2)',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '5px 0',
      fontSize: mobile ? '13px' : '14px',
      color: 'rgba(255, 255, 255, 0.75)',
    },
    totalFinal: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 0 0 0',
      marginTop: '10px',
      borderTop: '1px solid rgba(255, 215, 0, 0.3)',
      fontWeight: '900',
      fontSize: mobile ? '17px' : '19px',
    },
    paxiNotice: {
      marginTop: '16px',
      padding: mobile ? '14px' : '18px',
      background: 'rgba(33, 150, 243, 0.08)',
      border: '1px solid rgba(33, 150, 243, 0.25)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
    },
    paxiIcon: {
      fontSize: mobile ? '28px' : '32px',
      flexShrink: 0,
    },
    paxiText: {
      fontSize: mobile ? '12px' : '13px',
      color: 'rgba(255, 255, 255, 0.75)',
      lineHeight: '1.6',
      margin: 0,
    },
    toast: {
      position: 'fixed',
      top: mobile ? '20px' : '30px',
      right: mobile ? '50%' : '30px',
      transform: mobile ? 'translateX(50%)' : 'none',
      padding: '16px 24px',
      borderRadius: '12px',
      color: 'white',
      fontWeight: '600',
      fontSize: '15px',
      zIndex: 9999,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      animation: 'slideIn 0.3s ease',
      maxWidth: mobile ? '85%' : '400px',
      backdropFilter: 'blur(10px)',
    },
    emptyState: {
      textAlign: 'center',
      padding: mobile ? '48px 24px' : '64px 48px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      borderRadius: '24px',
      backdropFilter: 'blur(10px)',
    },
    emptyIcon: {
      fontSize: mobile ? '64px' : '80px',
      marginBottom: '16px',
    },
    emptyText: {
      fontSize: mobile ? '17px' : '20px',
      color: 'white',
      margin: '0 0 8px 0',
      fontWeight: '800',
    },
    emptySubtext: {
      fontSize: mobile ? '13px' : '15px',
      color: 'rgba(255, 255, 255, 0.6)',
      margin: 0,
      lineHeight: '1.6',
    },
    initialState: {
      textAlign: 'center',
      padding: mobile ? '48px 24px' : '64px 48px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      borderRadius: '24px',
      backdropFilter: 'blur(10px)',
      maxWidth: '600px',
      margin: '0 auto',
    },
    initialStateIcon: {
      fontSize: mobile ? '72px' : '96px',
      marginBottom: '20px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    initialStateText: {
      fontSize: mobile ? '16px' : '18px',
      color: 'rgba(255, 255, 255, 0.7)',
      margin: '0 0 16px 0',
      lineHeight: '1.6',
    },
    featureList: {
      textAlign: 'left',
      maxWidth: '400px',
      margin: '0 auto',
      paddingLeft: mobile ? '20px' : '24px',
    },
    featureItem: {
      padding: '8px 0',
      fontSize: mobile ? '13px' : '14px',
      color: 'rgba(255, 255, 255, 0.6)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    footer: {
      padding: mobile ? '30px 20px' : '40px',
      background: '#000',
      borderTop: '1px solid rgba(255, 215, 0, 0.15)',
      textAlign: 'center',
    },
    footerLogo: {
      fontSize: mobile ? '22px' : '26px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '3px',
      margin: '0 0 10px 0',
    },
    footerText: {
      fontSize: mobile ? '12px' : '13px',
      color: 'rgba(255, 255, 255, 0.5)',
      margin: '0 0 8px 0',
      lineHeight: '1.6',
    },
    footerPride: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '16px',
      padding: '8px 16px',
      background: 'rgba(255, 215, 0, 0.08)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      borderRadius: '20px',
      fontSize: mobile ? '11px' : '12px',
      color: '#FFD700',
      fontWeight: '700',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
  });

  const styles = getStyles();

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { 
            transform: ${mobile ? 'translateX(50%) translateY(-20px)' : 'translateX(100%)'}; 
            opacity: 0; 
          }
          to { 
            transform: ${mobile ? 'translateX(50%) translateY(0)' : 'translateX(0)'}; 
            opacity: 1; 
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        /* 🆕 HIDE SCROLLBAR - Cross-browser compatible */
        html {
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        html::-webkit-scrollbar {
          display: none;
        }
        
        body {
          margin: 0;
          background: #0a0a0a;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        body::-webkit-scrollbar {
          display: none;
        }
        
        input:focus {
          outline: none;
          border-color: #FFD700 !important;
          background: rgba(255, 215, 0, 0.08) !important;
        }
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.08);
        }
        button:active:not(:disabled) {
          transform: translateY(0);
        }
        .order-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 215, 0, 0.4) !important;
          box-shadow: 0 12px 32px rgba(255, 215, 0, 0.15);
        }
      `}</style>

      {toast && (
        <div style={{
          ...styles.toast,
          backgroundColor: toast.type === 'error' 
            ? '#f44336' 
            : toast.type === 'warning' 
              ? '#FFA500' 
              : '#4CAF50',
        }}>
          {toast.message}
        </div>
      )}

      {/* Navigation */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <h1 style={styles.logoText}>FASTLANE</h1>
        </Link>
        <div style={styles.navActions}>
          <LanguageSelector /> {/* 🆕 Language selector */}
          <Link to="/buyer" style={styles.navButton}>
            🛍️ {t('nav.shop')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroDecoration} />
        <div style={styles.heroContent}>
          <div style={styles.heroIcon}>📱</div>
          <h1 style={styles.heroTitle}>
            {t('track.title')} <span style={styles.heroAccent}>{t('track.orders')}</span>
          </h1>
          <p style={styles.heroSubtitle}>
            {t('track.subtitle')}
          </p>
        </div>
      </section>

      {/* Search Section */}
      <div style={styles.searchContainer}>
        <div style={styles.searchCard}>
          <h2 style={styles.searchTitle}>
            <span>🔍</span>
            {t('track.findOrders')}
          </h2>
          <p style={styles.searchSubtitle}>
            {t('track.enterPhone')}
          </p>
          
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>📞</span>
              <input
                type="tel"
                placeholder="e.g., 0110111101"
                value={phoneNumber}
                onChange={handlePhoneChange}
                required
                autoFocus
                style={styles.input}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={styles.searchButton}
            >
              {loading ? (
                <>
                  <div style={styles.spinner} />
                  {t('track.searching')}
                </>
              ) : (
                <>
                  <span>🔍</span>
                  {t('track.trackBtn')}
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div style={styles.resultsContainer}>
        {!searched ? (
          <div style={styles.initialState}>
            <div style={styles.initialStateIcon}>📦</div>
            <p style={styles.initialStateText}>
              {t('track.trackInfo')}
            </p>
            <div style={styles.featureList}>
              <div style={styles.featureItem}>
                <span style={{ color: '#FFD700' }}>✓</span>
                <span>{t('track.feature1')}</span>
              </div>
              <div style={styles.featureItem}>
                <span style={{ color: '#FFD700' }}>✓</span>
                <span>{t('track.feature2')}</span>
              </div>
              <div style={styles.featureItem}>
                <span style={{ color: '#FFD700' }}>✓</span>
                <span>{t('track.feature3')}</span>
              </div>
              <div style={styles.featureItem}>
                <span style={{ color: '#FFD700' }}>✓</span>
                <span>{t('track.feature4')}</span>
              </div>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h3 style={styles.emptyText}>{t('track.noOrders')}</h3>
            <p style={styles.emptySubtext}>
              {t('track.noOrdersText')} <strong style={{ color: '#FFD700' }}>{phoneNumber}</strong>.<br />
              {t('track.tryAgain')}
            </p>
          </div>
        ) : (
          <>
            <div style={styles.resultsHeader}>
              <h2 style={styles.resultsTitle}>
                <span>📋</span>
                {t('track.yourOrders')}
              </h2>
              <div style={styles.resultsBadge}>
                {orders.length} {orders.length === 1 ? t('track.order') : t('track.orders')} {t('track.ordersFound')}
              </div>
            </div>

            <div style={styles.ordersList}>
              {orders.map((order, index) => {
                const parsedAddress = parseAddress(order.address);
                const currentStep = getStatusStep(order.status);
                
                return (
                  <div 
                    key={order._id} 
                    className="order-card"
                    style={{
                      ...styles.orderCard,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div style={styles.orderHeader}>
                      <div>
                        <h3 style={styles.orderNumber}>
                          <span>{getStatusIcon(order.status)}</span>
                          {t('track.order')} #{order.orderNumber}
                        </h3>
                        <p style={styles.orderDate}>
                          {t('track.placedOn')} {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span style={styles.statusBadge(order.status)}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    {order.status !== 'Cancelled' && (
                      <div style={styles.progressTracker}>
                        {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                          const isActive = i <= currentStep;
                          return (
                            <div key={step} style={styles.progressStep}>
                              <div style={styles.progressCircle(isActive, order.status)}>
                                {isActive ? '✓' : i + 1}
                              </div>
                              <span style={styles.progressLabel(isActive)}>
                                {getStatusLabel(step)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div style={styles.orderBody}>
                      <div style={styles.customerInfo}>
                        <div style={styles.infoItem}>
                          <div style={styles.infoLabel}>{t('track.customerName')}</div>
                          <div style={styles.infoValue}>
                            {order.buyerName} {order.buyerSurname}
                          </div>
                        </div>
                        <div style={styles.infoItem}>
                          <div style={styles.infoLabel}>{t('track.phoneNumber')}</div>
                          <div style={styles.infoValue}>{order.phoneNumber}</div>
                        </div>
                        <div style={styles.infoItem}>
                          <div style={styles.infoLabel}>{t('track.language')}</div>
                          <div style={styles.infoValue}>{order.language}</div>
                        </div>
                        <div style={styles.infoItem}>
                          <div style={styles.infoLabel}>{t('track.orderDate')}</div>
                          <div style={styles.infoValue}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div style={styles.addressSection}>
                        <div style={styles.addressTitle}>
                          <span>📍</span>
                          {t('track.deliveryAddress')}
                        </div>
                        <div style={styles.addressGrid}>
                          <div>
                            <span style={styles.addressLabel}>{t('track.street')}: </span>
                            {parsedAddress.street}
                          </div>
                          <div>
                            <span style={styles.addressLabel}>{t('track.city')}: </span>
                            {parsedAddress.city}
                          </div>
                          <div>
                            <span style={styles.addressLabel}>{t('track.province')}: </span>
                            {parsedAddress.province}
                          </div>
                          <div>
                            <span style={styles.addressLabel}>{t('track.code')}: </span>
                            {parsedAddress.code}
                          </div>
                        </div>
                      </div>

                      <div style={styles.itemsSection}>
                        <h4 style={styles.itemsTitle}>
                          <span>📦</span>
                          {t('track.items')} ({order.items.length})
                        </h4>
                        <div style={styles.itemsList}>
                          {order.items.map((item, i) => (
                            <div 
                              key={i} 
                              style={{
                                ...styles.item,
                                ...(i === order.items.length - 1 ? styles.itemLast : {}),
                              }}
                            >
                              <span style={styles.itemName}>
                                {item.productName} × {item.quantity}
                              </span>
                              <span style={styles.itemPrice}>
                                R{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={styles.totalsSection}>
                        <div style={styles.totalRow}>
                          <span>{t('track.subtotal')}:</span>
                          <span>R{order.subtotal.toFixed(2)}</span>
                        </div>
                        <div style={styles.totalRow}>
                          <span>{t('track.deliveryFee')}:</span>
                          <span>R{order.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div style={styles.totalFinal}>
                          <span style={{ color: 'white' }}>{t('track.totalPaid')}:</span>
                          <span style={{
                            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}>
                            R{order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div style={styles.paxiNotice}>
                        <div style={styles.paxiIcon}>📦</div>
                        <p style={styles.paxiText}>
                          <strong style={{ color: '#2196F3' }}>{t('track.paxiNotice')}:</strong> {t('track.paxiText')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <h3 style={styles.footerLogo}>⚡ FASTLANE</h3>
        <p style={styles.footerText}>{t('footer.tagline')}</p>
        <p style={styles.footerText}>© 2026 Fastlane Retail. {t('footer.rights')}</p>
        <div style={styles.footerPride}>
          <span>🇿🇦</span>
          <span>{t('footer.pride')}</span>
        </div>
      </footer>
    </div>
  );
};

export default TrackOrders;