import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sellerLogin } from '../services/api';

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

const SellerLogin = () => {
  const { width } = useWindowSize();
  const mobile = isMobile(width);
  const tablet = isTablet(width);
  
  const [idNumber, setIdNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleIdChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 13);
    setIdNumber(value);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!idNumber.trim()) {
    showToast('⚠ Please enter your ID number', 'warning');
    return;
  }

  if (idNumber.length !== 13) {
    showToast('⚠ ID number must be 13 digits', 'warning');
    return;
  }

  setLoading(true);
  
  try {
    // 🆕 Call backend API to verify seller against database
    const response = await sellerLogin(idNumber);
    
    if (response.success) {
      // 🆕 Store ONLY seller data from database (NO boolean role flag)
      localStorage.setItem('sellerId', response.seller.sellerId);
      localStorage.setItem('sellerName', response.seller.name);
      localStorage.setItem('sellerEmail', response.seller.email);
      localStorage.setItem('sellerSessionTimestamp', Date.now().toString());
      
      console.log(`✅ Seller authenticated: ${response.seller.name}`);
      
      showToast('✓ Login successful! Redirecting...', 'success');
      setTimeout(() => navigate('/seller-dashboard'), 800);
    } else {
      showToast('✗ Invalid seller credentials', 'error');
      setLoading(false);
    }
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.response?.status === 401) {
      showToast('✗ Invalid seller credentials', 'error');
    } else if (error.response?.status === 400) {
      showToast('⚠ Invalid ID format', 'error');
    } else if (error.response?.status === 500) {
      showToast('✗ Server error. Please try again.', 'error');
    } else {
      showToast('✗ Connection error. Check your network.', 'error');
    }
    
    setLoading(false);
  }
};

  const getStyles = () => ({
    page: {
      minHeight: '100vh',
      background: '#0a0a0a',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: 'relative',
      overflow: 'hidden',
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
    container: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: mobile ? '40px 20px' : '60px 40px',
      position: 'relative',
      background: `
        radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(220, 20, 60, 0.05) 0%, transparent 50%),
        linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)
      `,
    },
    backgroundDecoration: {
      position: 'absolute',
      top: '-20%',
      right: '-10%',
      width: mobile ? '300px' : '600px',
      height: mobile ? '300px' : '600px',
      background: 'radial-gradient(circle, rgba(255, 215, 0, 0.06) 0%, transparent 70%)',
      borderRadius: '50%',
      animation: 'float 6s ease-in-out infinite',
    },
    backgroundDecoration2: {
      position: 'absolute',
      bottom: '-20%',
      left: '-10%',
      width: mobile ? '250px' : '500px',
      height: mobile ? '250px' : '500px',
      background: 'radial-gradient(circle, rgba(255, 215, 0, 0.04) 0%, transparent 70%)',
      borderRadius: '50%',
      animation: 'float 8s ease-in-out infinite reverse',
    },
    loginCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: mobile ? '32px 24px' : '48px 40px',
      maxWidth: '520px',
      width: '100%',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      position: 'relative',
      zIndex: 10,
      animation: 'slideUp 0.5s ease',
    },
    header: {
      textAlign: 'center',
      marginBottom: mobile ? '28px' : '36px',
    },
    lockIcon: {
      fontSize: mobile ? '56px' : '72px',
      marginBottom: '16px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      filter: 'drop-shadow(0 4px 12px rgba(255, 215, 0, 0.3))',
    },
    title: {
      margin: '0 0 8px 0',
      fontSize: mobile ? '24px' : '28px',
      fontWeight: '900',
      color: 'white',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      margin: 0,
      fontSize: mobile ? '14px' : '15px',
      color: 'rgba(255, 255, 255, 0.6)',
      lineHeight: '1.5',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: mobile ? '16px' : '20px',
    },
    inputGroup: {
      position: 'relative',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: mobile ? '13px' : '14px',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.7)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    inputIcon: {
      position: 'absolute',
      left: mobile ? '14px' : '16px',
      fontSize: mobile ? '18px' : '20px',
      color: 'rgba(255, 215, 0, 0.5)',
      zIndex: 2,
    },
    input: {
      width: '100%',
      padding: mobile ? '14px 14px 14px 46px' : '16px 16px 16px 52px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '12px',
      fontSize: mobile ? '16px' : '17px',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease',
      background: 'rgba(255, 255, 255, 0.05)',
      fontFamily: 'monospace',
      fontWeight: '600',
      letterSpacing: '1px',
      color: 'white',
    },
    clearButton: {
      position: 'absolute',
      right: '12px',
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      borderRadius: '50%',
      width: '28px',
      height: '28px',
      display: idNumber ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '16px',
      color: 'rgba(255, 255, 255, 0.6)',
      transition: 'all 0.2s ease',
    },
    helperText: {
      marginTop: '8px',
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.5)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    submitButton: {
      width: '100%',
      padding: mobile ? '14px' : '16px',
      background: loading
        ? 'linear-gradient(135deg, #424242, #303030)'
        : 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: loading ? '#999' : '#000',
      border: 'none',
      borderRadius: '12px',
      cursor: loading ? 'not-allowed' : 'pointer',
      fontSize: mobile ? '16px' : '17px',
      fontWeight: '800',
      transition: 'all 0.2s ease',
      boxShadow: loading ? 'none' : '0 6px 24px rgba(255, 215, 0, 0.4)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '8px',
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '3px solid rgba(0, 0, 0, 0.3)',
      borderTop: '3px solid #000',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    securityBadge: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px',
      background: 'rgba(255, 215, 0, 0.08)',
      border: '1px solid rgba(255, 215, 0, 0.25)',
      borderRadius: '10px',
      marginTop: '8px',
      fontSize: mobile ? '12px' : '13px',
      color: '#FFD700',
      fontWeight: '700',
      letterSpacing: '0.5px',
    },
    footer: {
      textAlign: 'center',
      marginTop: mobile ? '24px' : '32px',
      paddingTop: mobile ? '20px' : '24px',
      borderTop: '1px solid rgba(255, 215, 0, 0.15)',
    },
    footerText: {
      margin: 0,
      fontSize: mobile ? '12px' : '13px',
      color: 'rgba(255, 255, 255, 0.5)',
      lineHeight: '1.6',
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
    pageFooter: {
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
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
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
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
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
        body { margin: 0; background: #0a0a0a; }
      `}</style>

      {/* Navigation */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <h1 style={styles.logoText}>FASTLANE</h1>
        </Link>
        <Link to="/buyer" style={styles.navButton}>
          🛍️ Shop
        </Link>
      </nav>

      <div style={styles.container}>
        {/* Background Decorations */}
        <div style={styles.backgroundDecoration} />
        <div style={styles.backgroundDecoration2} />

        {/* Toast Notification */}
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

        {/* Login Card */}
        <div style={styles.loginCard}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.lockIcon}>🔒</div>
            <h1 style={styles.title}>Seller Access</h1>
            <p style={styles.subtitle}>
              Enter your ID number to access the seller dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                South African ID Number
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🆔</span>
                <input
                  type="text"
                  placeholder="e.g., 0000000000000"
                  value={idNumber}
                  onChange={handleIdChange}
                  style={styles.input}
                  maxLength="13"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIdNumber('')}
                  style={styles.clearButton}
                  aria-label="Clear input"
                >
                  ✕
                </button>
              </div>
              <div style={styles.helperText}>
                <span>ℹ️</span>
                <span>13-digit South African ID number required</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
            >
              {loading ? (
                <>
                  <div style={styles.spinner} />
                  Authenticating...
                </>
              ) : (
                <>
                  <span>🔓</span>
                  Login to Dashboard
                </>
              )}
            </button>

            {/* Security Badge */}
            <div style={styles.securityBadge}>
              <span>🔐</span>
              <span>Secure Login • Protected Access</span>
            </div>
          </form>

          {/* Footer */}
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Only authorized sellers can access this dashboard.<br />
              Contact support if you need assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer style={styles.pageFooter}>
        <h3 style={styles.footerLogo}>⚡ FASTLANE</h3>
        <div style={styles.footerPride}>
          <span>🇿🇦</span>
          <span>100% Black-Owned • Proudly South African</span>
        </div>
      </footer>
    </div>
  );
};

export default SellerLogin;