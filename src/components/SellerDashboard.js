import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getOrders } from '../services/api';
import ProductList from './ProductList';
import AddProduct from './AddProduct';
import OrderList from './OrderList';

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

const SellerDashboard = () => {
  const { width } = useWindowSize();
  const mobile = isMobile(width);
  const tablet = isTablet(width);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  // 🆕 Add seller info display in header (pulled directly from DB login data)
  const [sellerInfo] = useState({
    name: localStorage.getItem('sellerName') || 'Seller',
    email: localStorage.getItem('sellerEmail') || '',
  });
  
  // 🆕 Sales Analytics State
  const [orders, setOrders] = useState([]);
  const [salesLoading, setSalesLoading] = useState(true);

  const tabs = [
    { id: 'products', label: 'Products', icon: '📦', color: '#FFD700' },
    { id: 'add-product', label: 'Add Product', icon: '➕', color: '#FFA500' },
    { id: 'orders', label: 'Orders', icon: '📋', color: '#FF6347' },
  ];

  // 🆕 Fetch orders for sales analytics
  useEffect(() => {
    fetchOrdersForAnalytics();
  }, []);

  const fetchOrdersForAnalytics = async () => {
    try {
      setSalesLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders for analytics:', error);
    } finally {
      setSalesLoading(false);
    }
  };

  // 🆕 Calculate sales metrics
  const calculateSalesMetrics = () => {
    const deliveredOrders = orders.filter(o => o.status === 'Delivered');
    const pendingOrders = orders.filter(o => o.status === 'Pending');
    const processingOrders = orders.filter(o => o.status === 'Processing');
    const shippedOrders = orders.filter(o => o.status === 'Shipped');
    
    const totalSales = deliveredOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
    const totalDeliveryFees = deliveredOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingRevenue = pendingOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const processingRevenue = processingOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const shippedRevenue = shippedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    
    return {
      deliveredCount: deliveredOrders.length,
      totalSales, // subtotal from delivered orders (actual product sales)
      totalDeliveryFees,
      totalRevenue, // total including delivery
      pendingCount: pendingOrders.length,
      pendingRevenue,
      processingCount: processingOrders.length,
      processingRevenue,
      shippedCount: shippedOrders.length,
      shippedRevenue,
      totalOrders: orders.length,
    };
  };

  const salesMetrics = calculateSalesMetrics();

  // 🆕 FIXED LOGOUT: Removed 'isSeller' boolean cleanup
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // 🆕 Clear ONLY database-driven seller data
      localStorage.removeItem('sellerId');
      localStorage.removeItem('sellerName');
      localStorage.removeItem('sellerEmail');
      localStorage.removeItem('sellerSessionTimestamp');
      
      console.log('🔐 Manual logout - session ended');
      navigate('/seller-login', { replace: true });
    }
  };

  // 🆕 Format currency with commas
  const formatCurrency = (amount) => {
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStyles = () => ({
    page: {
      minHeight: '100vh',
      background: '#0a0a0a',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      flexDirection: 'column',
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
      flexWrap: 'wrap',
      gap: '12px',
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
    logoutButton: {
      padding: mobile ? '8px 16px' : '10px 20px',
      background: 'rgba(244, 67, 54, 0.1)',
      color: '#f44336',
      border: '1px solid rgba(244, 67, 54, 0.3)',
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
    },
    hero: {
      position: 'relative',
      padding: mobile ? '40px 20px' : '60px 40px',
      background: `
        radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(255, 165, 0, 0.08) 0%, transparent 50%),
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
      fontSize: mobile ? '48px' : '64px',
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
      color: 'white',
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
    salesSection: {
      maxWidth: '1400px',
      margin: mobile ? '-30px auto 0' : '-40px auto 0',
      padding: mobile ? '0 20px' : '0 40px',
      position: 'relative',
      zIndex: 3,
      boxSizing: 'border-box',
    },
    salesContainer: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      borderRadius: '20px',
      padding: mobile ? '20px' : '28px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
    },
    salesHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: mobile ? '16px' : '20px',
      paddingBottom: mobile ? '12px' : '16px',
      borderBottom: '1px solid rgba(255, 215, 0, 0.15)',
      flexWrap: 'wrap',
      gap: '12px',
    },
    salesHeaderLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    salesHeaderIcon: {
      fontSize: mobile ? '24px' : '28px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    salesHeaderTitle: {
      margin: 0,
      fontSize: mobile ? '16px' : '18px',
      color: 'white',
      fontWeight: '800',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    salesHeaderSubtitle: {
      margin: '2px 0 0 0',
      fontSize: mobile ? '11px' : '12px',
      color: 'rgba(255, 255, 255, 0.5)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    salesGrid: {
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : tablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: mobile ? '12px' : '16px',
    },
    salesCard: (variant) => {
      const variants = {
        primary: {
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.08))',
          border: '1px solid rgba(255, 215, 0, 0.4)',
          accentColor: '#FFD700',
        },
        success: {
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.12), rgba(76, 175, 80, 0.05))',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          accentColor: '#4CAF50',
        },
        info: {
          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.12), rgba(33, 150, 243, 0.05))',
          border: '1px solid rgba(33, 150, 243, 0.3)',
          accentColor: '#2196F3',
        },
        warning: {
          background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.12), rgba(255, 165, 0, 0.05))',
          border: '1px solid rgba(255, 165, 0, 0.3)',
          accentColor: '#FFA500',
        },
      };
      const v = variants[variant] || variants.primary;
      return {
        padding: mobile ? '16px' : '20px',
        background: v.background,
        border: v.border,
        borderRadius: '14px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      };
    },
    salesCardIcon: {
      fontSize: mobile ? '24px' : '28px',
      marginBottom: '8px',
    },
    salesCardLabel: {
      fontSize: mobile ? '11px' : '12px',
      color: 'rgba(255, 255, 255, 0.6)',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '6px',
    },
    salesCardValue: (accentColor) => ({
      fontSize: mobile ? '22px' : '28px',
      fontWeight: '900',
      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '-0.5px',
      lineHeight: '1.2',
      marginBottom: '4px',
    }),
    salesCardMeta: {
      fontSize: mobile ? '11px' : '12px',
      color: 'rgba(255, 255, 255, 0.5)',
      fontWeight: '600',
    },
    salesCardGlow: (accentColor) => ({
      position: 'absolute',
      top: '-20px',
      right: '-20px',
      width: '80px',
      height: '80px',
      background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
      borderRadius: '50%',
    }),
    mainContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: mobile ? '20px' : '40px',
      flex: 1,
      width: '100%',
      boxSizing: 'border-box',
    },
    tabsContainer: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      borderRadius: '20px',
      padding: mobile ? '10px' : '14px',
      backdropFilter: 'blur(10px)',
      marginBottom: mobile ? '20px' : '28px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    tabsWrapper: {
      display: 'flex',
      flexDirection: mobile ? 'column' : 'row',
      gap: mobile ? '8px' : '10px',
    },
    tabButton: (tab, isActive) => ({
      flex: mobile ? 'none' : 1,
      padding: mobile ? '14px 16px' : '16px 24px',
      background: isActive 
        ? `linear-gradient(135deg, ${tab.color}, ${tab.color}dd)`
        : 'transparent',
      color: isActive ? '#000' : 'rgba(255, 255, 255, 0.7)',
      border: isActive ? 'none' : '1px solid rgba(255, 215, 0, 0.15)',
      borderRadius: '14px',
      cursor: 'pointer',
      fontSize: mobile ? '14px' : '15px',
      fontWeight: isActive ? '800' : '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: mobile ? 'flex-start' : 'center',
      gap: '10px',
      boxShadow: isActive ? `0 4px 16px ${tab.color}40` : 'none',
      transform: isActive ? 'scale(1)' : 'scale(0.98)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }),
    tabIcon: {
      fontSize: mobile ? '18px' : '20px',
    },
    contentCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      borderRadius: '24px',
      padding: mobile ? '20px' : '32px',
      backdropFilter: 'blur(10px)',
      minHeight: '500px',
      animation: 'fadeIn 0.3s ease',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
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
    loadingPulse: {
      animation: 'pulse 1.5s ease-in-out infinite',
    },
  });

  const styles = getStyles();

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.08);
        }
        button:active:not(:disabled) {
          transform: translateY(0);
        }
        .sales-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
        }
        body { margin: 0; background: #0a0a0a; }
      `}</style>

      {/* Navigation */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <h1 style={styles.logoText}>FASTLANE</h1>
        </Link>
        <div style={styles.navActions}>
          <div style={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: '13px',
            textAlign: 'right',
          }}>
            <div style={{ fontWeight: '700', color: '#FFD700' }}>
              {sellerInfo.name}
            </div>
            <div style={{ fontSize: '11px' }}>
              {sellerInfo.email}
            </div>
          </div>
          <Link to="/buyer" style={styles.navButton}>🛍️ Shop</Link>
          <button onClick={handleLogout} style={styles.logoutButton}>
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroDecoration} />
        <div style={styles.heroContent}>
          <div style={styles.heroIcon}>🏪</div>
          <h1 style={styles.heroTitle}>
            Seller <span style={styles.heroAccent}>Dashboard</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Manage your products, inventory, and orders with premium tools
          </p>
        </div>
      </section>

      {/* 🆕 Sales Analytics Section */}
      <section style={styles.salesSection}>
        <div style={styles.salesContainer}>
          {/* Header */}
          <div style={styles.salesHeader}>
            <div style={styles.salesHeaderLeft}>
              <span style={styles.salesHeaderIcon}>💰</span>
              <div>
                <h3 style={styles.salesHeaderTitle}>Sales Analytics</h3>
                <p style={styles.salesHeaderSubtitle}>Revenue from delivered orders</p>
              </div>
            </div>
            {!salesLoading && (
              <div style={{
                padding: mobile ? '6px 12px' : '8px 16px',
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                borderRadius: '20px',
                fontSize: mobile ? '11px' : '12px',
                color: '#4CAF50',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  background: '#4CAF50',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px rgba(76, 175, 80, 0.6)',
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
                Live Data
              </div>
            )}
          </div>

          {/* Sales Cards Grid */}
          {salesLoading ? (
            <div style={styles.salesGrid}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ ...styles.salesCard('primary'), ...styles.loadingPulse }}>
                  <div style={{ height: '24px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '4px', marginBottom: '12px', width: '60%' }} />
                  <div style={{ height: '32px', background: 'rgba(255, 215, 0, 0.15)', borderRadius: '4px', marginBottom: '8px' }} />
                  <div style={{ height: '14px', background: 'rgba(255, 215, 0, 0.08)', borderRadius: '4px', width: '80%' }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.salesGrid}>
              {/* Primary: Total Sales (Subtotal from Delivered) */}
              <div className="sales-card" style={styles.salesCard('primary')}>
                <div style={styles.salesCardGlow('#FFD700')} />
                <div style={styles.salesCardIcon}>💎</div>
                <div style={styles.salesCardLabel}>Total Sales</div>
                <div style={styles.salesCardValue('#FFD700')}>
                  {formatCurrency(salesMetrics.totalSales)}
                </div>
                <div style={styles.salesCardMeta}>
                  From {salesMetrics.deliveredCount} delivered {salesMetrics.deliveredCount === 1 ? 'order' : 'orders'}
                </div>
              </div>

              {/* Success: Delivered Orders Count */}
              <div className="sales-card" style={styles.salesCard('success')}>
                <div style={styles.salesCardGlow('#4CAF50')} />
                <div style={styles.salesCardIcon}>✅</div>
                <div style={styles.salesCardLabel}>Delivered Orders</div>
                <div style={styles.salesCardValue('#4CAF50')}>
                  {salesMetrics.deliveredCount}
                </div>
                <div style={styles.salesCardMeta}>
                  Successfully completed
                </div>
              </div>

              {/* Info: Total Revenue (Including Delivery) */}
              <div className="sales-card" style={styles.salesCard('info')}>
                <div style={styles.salesCardGlow('#2196F3')} />
                <div style={styles.salesCardIcon}>💵</div>
                <div style={styles.salesCardLabel}>Total Revenue</div>
                <div style={styles.salesCardValue('#2196F3')}>
                  {formatCurrency(salesMetrics.totalRevenue)}
                </div>
                <div style={styles.salesCardMeta}>
                  Including R{salesMetrics.totalDeliveryFees.toFixed(2)} delivery fees
                </div>
              </div>

              {/* Warning: Pending Revenue */}
              <div className="sales-card" style={styles.salesCard('warning')}>
                <div style={styles.salesCardGlow('#FFA500')} />
                <div style={styles.salesCardIcon}>⏳</div>
                <div style={styles.salesCardLabel}>Pending Revenue</div>
                <div style={styles.salesCardValue('#FFA500')}>
                  {formatCurrency(salesMetrics.pendingRevenue + salesMetrics.processingRevenue + salesMetrics.shippedRevenue)}
                </div>
                <div style={styles.salesCardMeta}>
                  {salesMetrics.pendingCount} pending • {salesMetrics.processingCount} processing • {salesMetrics.shippedCount} shipped
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Tab Navigation */}
        <div style={styles.tabsContainer}>
          <div style={styles.tabsWrapper}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={styles.tabButton(tab, isActive)}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 215, 0, 0.08)';
                      e.currentTarget.style.color = '#FFD700';
                      e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                      e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.15)';
                    }
                  }}
                >
                  <span style={styles.tabIcon}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div style={styles.contentCard}>
          {activeTab === 'products' && <ProductList />}
          {activeTab === 'add-product' && <AddProduct />}
          {activeTab === 'orders' && <OrderList />}
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <h3 style={styles.footerLogo}>⚡ FASTLANE</h3>
        <p style={styles.footerText}>Premium Retail • Fast PAXI Delivery • Proudly South African</p>
        <p style={styles.footerText}>© 2026 Fastlane Retail. All rights reserved.</p>
        <div style={styles.footerPride}>
          <span>🇿🇦</span>
          <span>100% Black-Owned • Proudly South African</span>
        </div>
      </footer>
    </div>
  );
};

export default SellerDashboard;