import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';
import { addToCart, getCartCount, getCart } from '../utils/cart';
import useTranslation from '../hooks/useTranslation';
import LanguageSelector from './LanguageSelector';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  });
  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
};

const isMobile = (width) => width < 768;
const isTablet = (width) => width >= 768 && width < 1024;

const BuyerPage = () => {
  const { width } = useWindowSize();
  const mobile = isMobile(width);
  const tablet = isTablet(width);
  const navigate = useNavigate();
  const { t } = useTranslation(); // 🆕 Translation hook

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cartCount, setCartCount] = useState(getCartCount());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProducts();
    const handleCartUpdate = () => setCartCount(getCartCount());
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast(t('common.error'), 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (product.stock <= 0) {
      showToast(t('product.outOfStock'), 'error');
      return;
    }
    
    const result = addToCart(product, 1);
    
    if (result.success) {
      showToast(result.message, 'success');
      setCartCount(getCartCount());
    } else {
      showToast(result.message, 'warning');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCartClick = () => {
    if (cartCount > 0) {
      navigate('/checkout');
    } else {
      showToast(t('checkout.emptyCart'), 'warning');
    }
  };

  const getStyles = () => ({
    page: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: '#0a0a0a', color: 'white', minHeight: '100vh',
    },
    nav: {
      position: 'sticky', top: 0, zIndex: 100,
      padding: mobile ? '14px 20px' : '18px 40px',
      background: 'rgba(10, 10, 10, 0.85)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      gap: '12px', flexWrap: 'wrap',
    },
    logo: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' },
    logoIcon: { fontSize: mobile ? '28px' : '32px', filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))' },
    logoText: {
      fontSize: mobile ? '20px' : '24px', fontWeight: '900',
      background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      letterSpacing: '2px', margin: 0,
    },
    navActions: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
    navButton: {
      padding: mobile ? '8px 16px' : '10px 20px',
      background: 'transparent', color: 'white',
      border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '30px',
      fontSize: mobile ? '12px' : '13px', fontWeight: '700',
      cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
      transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '6px',
      textDecoration: 'none',
    },
    cartBadge: {
      padding: mobile ? '8px 14px' : '10px 18px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#000', borderRadius: '30px',
      fontSize: mobile ? '12px' : '13px', fontWeight: '800',
      boxShadow: '0 4px 16px rgba(255, 215, 0, 0.4)',
      display: 'flex', alignItems: 'center', gap: '6px',
      cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px',
      transition: 'all 0.3s ease',
    },
    hero: {
      position: 'relative', padding: mobile ? '40px 20px' : '60px 40px',
      background: `
        radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(220, 20, 60, 0.08) 0%, transparent 50%),
        linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)
      `,
      textAlign: 'center', overflow: 'hidden',
    },
    heroDecoration: {
      position: 'absolute', top: '-30%', right: '-10%',
      width: mobile ? '200px' : '400px', height: mobile ? '200px' : '400px',
      background: 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)',
      borderRadius: '50%', animation: 'float 8s ease-in-out infinite',
    },
    heroContent: { position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' },
    heroTitle: {
      fontSize: mobile ? '28px' : tablet ? '38px' : '48px',
      fontWeight: '900', lineHeight: '1.1', margin: '0 0 12px 0', letterSpacing: '-1px',
    },
    heroAccent: {
      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    },
    heroSubtitle: {
      fontSize: mobile ? '14px' : '16px',
      color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 24px 0', lineHeight: '1.6',
    },
    deliveryBanner: {
      maxWidth: '1200px', margin: mobile ? '0 auto 24px' : '0 auto 32px',
      padding: mobile ? '16px' : '20px',
      background: 'rgba(255, 215, 0, 0.05)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      borderRadius: '16px',
      display: 'flex', flexDirection: mobile ? 'column' : 'row',
      alignItems: mobile ? 'flex-start' : 'center',
      gap: mobile ? '12px' : '16px', backdropFilter: 'blur(10px)',
    },
    contentContainer: { maxWidth: '1400px', margin: '0 auto', padding: mobile ? '0 20px 40px' : '0 40px 60px' },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: mobile
        ? 'repeat(auto-fill, minmax(160px, 1fr))'
        : tablet ? 'repeat(auto-fill, minmax(220px, 1fr))'
        : 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: mobile ? '14px' : '20px', marginBottom: '40px',
    },
    productCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      padding: mobile ? '14px' : '18px', borderRadius: '20px',
      display: 'flex', flexDirection: 'column',
      cursor: 'pointer', position: 'relative', overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
    },
    imageContainer: {
      width: '100%', height: mobile ? '150px' : '200px',
      marginBottom: '14px', borderRadius: '14px', overflow: 'hidden',
      background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid rgba(255, 215, 0, 0.1)',
    },
    productImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' },
    noImage: {
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
      fontSize: mobile ? '36px' : '48px',
    },
    productName: { margin: '0 0 8px 0', fontSize: mobile ? '15px' : '17px', color: 'white', fontWeight: '700', lineHeight: '1.3' },
    productDescription: {
      color: 'rgba(255, 255, 255, 0.6)', fontSize: mobile ? '12px' : '13px',
      marginBottom: '12px', minHeight: mobile ? '30px' : '40px', lineHeight: '1.5',
      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
    },
    productPrice: {
      fontSize: mobile ? '18px' : '22px', marginBottom: '8px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      fontWeight: '900', letterSpacing: '-0.5px',
    },
    productStock: {
      fontSize: mobile ? '11px' : '12px', marginBottom: '14px',
      fontWeight: '700', padding: '6px 12px', borderRadius: '20px',
      display: 'inline-block', textTransform: 'uppercase', letterSpacing: '0.5px',
    },
    viewDetailsButton: {
      width: '100%', padding: mobile ? '10px' : '11px',
      background: 'transparent', color: '#FFD700',
      border: '1px solid rgba(255, 215, 0, 0.4)',
      borderRadius: '10px', cursor: 'pointer',
      fontSize: mobile ? '12px' : '13px', fontWeight: '700',
      transition: 'all 0.2s ease', textTransform: 'uppercase',
      letterSpacing: '0.5px', marginBottom: '8px',
    },
    addButton: {
      width: '100%', padding: mobile ? '11px' : '13px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#000', border: 'none', borderRadius: '12px',
      cursor: 'pointer', marginTop: 'auto',
      fontSize: mobile ? '12px' : '13px', fontWeight: '800',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
      textTransform: 'uppercase', letterSpacing: '0.5px',
    },
    toast: {
      position: 'fixed', top: mobile ? '20px' : '30px',
      right: mobile ? '50%' : '30px',
      transform: mobile ? 'translateX(50%)' : 'none',
      padding: '14px 24px', borderRadius: '12px',
      color: 'white', fontWeight: '600', fontSize: '14px',
      zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      animation: 'slideIn 0.3s ease', maxWidth: mobile ? '80%' : '400px',
    },
    footer: {
      padding: mobile ? '30px 20px' : '40px',
      background: '#000', borderTop: '1px solid rgba(255, 215, 0, 0.15)',
      textAlign: 'center',
    },
    footerLogo: {
      fontSize: mobile ? '22px' : '26px', fontWeight: '900',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      letterSpacing: '3px', margin: '0 0 10px 0',
    },
    footerText: {
      fontSize: mobile ? '12px' : '13px',
      color: 'rgba(255, 255, 255, 0.5)', margin: '0 0 8px 0', lineHeight: '1.6',
    },
    footerPride: {
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      marginTop: '16px', padding: '8px 16px',
      background: 'rgba(255, 215, 0, 0.08)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      borderRadius: '20px', fontSize: mobile ? '11px' : '12px',
      color: '#FFD700', fontWeight: '700',
      letterSpacing: '1px', textTransform: 'uppercase',
    },
  });

  const styles = getStyles();

  const ProductSkeleton = () => (
    <div style={{ ...styles.productCard, animation: 'pulse 1.5s infinite' }}>
      <div style={{ ...styles.imageContainer, background: '#1a1a1a' }} />
      <div style={{ height: '18px', background: '#1a1a1a', borderRadius: '4px', marginBottom: '8px' }} />
      <div style={{ height: '12px', background: '#1a1a1a', borderRadius: '4px', marginBottom: '8px', width: '70%' }} />
      <div style={{ height: '22px', background: '#1a1a1a', borderRadius: '4px', marginBottom: '10px' }} />
      <div style={{ height: '38px', background: '#1a1a1a', borderRadius: '10px', marginBottom: '8px' }} />
      <div style={{ height: '40px', background: '#1a1a1a', borderRadius: '10px', marginTop: 'auto' }} />
    </div>
  );

  return (
    <div style={styles.page}>
    <style>{`
      @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      @keyframes slideIn {
        from { transform: ${mobile ? 'translateX(50%) translateY(-20px)' : 'translateX(100%)'}; opacity: 0; }
        to { transform: ${mobile ? 'translateX(50%) translateY(0)' : 'translateX(0)'}; opacity: 1; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      
      /* 🆕 HIDE SCROLLBAR - Cross-browser compatible */
      html {
        scroll-behavior: smooth;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
      }
      
      html::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }
      
      body {
        margin: 0;
        background: #0a0a0a;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
      }
      
      body::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }
      
      /* Rest of your existing styles */
      button:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.08); }
      .product-card:hover {
        transform: translateY(-6px);
        border-color: rgba(255, 215, 0, 0.4) !important;
        box-shadow: 0 12px 32px rgba(255, 215, 0, 0.15);
      }
      .product-card:hover img { transform: scale(1.08); }
    `}</style>

      {toast && (
        <div style={{ ...styles.toast, backgroundColor: toast.type === 'error' ? '#f44336' : toast.type === 'warning' ? '#FFA500' : '#4CAF50' }}>
          {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : '⚠'} {toast.message}
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
          <button onClick={() => navigate('/track-orders')} style={styles.navButton}>
            📦 {t('nav.trackOrders')}
          </button>
          <div
            onClick={handleCartClick}
            style={{
              ...styles.cartBadge,
              opacity: cartCount > 0 ? 1 : 0.5,
              cursor: cartCount > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            🛒 {cartCount}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroDecoration} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            {t('home.heroTitle')} <span style={styles.heroAccent}>{t('home.heroAccent')}</span>
          </h1>
          <p style={styles.heroSubtitle}>
            {t('home.heroSub')}
          </p>
        </div>
      </section>

      {/* Delivery Banner */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: mobile ? '0 20px' : '0 40px' }}>
        <div style={styles.deliveryBanner}>
          <div style={{ fontSize: mobile ? '32px' : '40px' }}>📦</div>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: mobile ? '15px' : '17px', color: '#FFD700', display: 'block', marginBottom: '4px' }}>
              {t('home.deliveryBanner')}
            </strong>
            <p style={{ margin: 0, fontSize: mobile ? '12px' : '14px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.5' }}>
              {t('home.deliveryText')} <strong style={{ color: '#FFD700' }}>R100</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div style={styles.contentContainer}>
        {loadingProducts ? (
          <div style={styles.productsGrid}>
            {[1, 2, 3, 4, 5, 6].map(i => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: mobile ? '50px 20px' : '80px 40px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 215, 0, 0.15)',
            borderRadius: '24px', backdropFilter: 'blur(10px)',
          }}>
            <div style={{ fontSize: mobile ? '64px' : '80px', marginBottom: '16px' }}>🛒</div>
            <p style={{ fontSize: mobile ? '16px' : '18px', color: 'rgba(255,255,255,0.7)' }}>
              {t('home.noProducts')}
            </p>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {products.map(product => {
              const outOfStock = product.stock === 0;
              const lowStock = product.stock > 0 && product.stock < 5;
              const primaryImage = (product.images && product.images[0]) || product.image;
              
              return (
                <div
                  key={product._id}
                  className="product-card"
                  onClick={() => handleProductClick(product._id)}
                  style={{ ...styles.productCard, opacity: outOfStock ? 0.5 : 1 }}
                >
                  {lowStock && (
                    <div style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: 'linear-gradient(135deg, #FFA500, #FF6347)',
                      color: 'white', padding: '5px 12px', borderRadius: '20px',
                      fontSize: '10px', fontWeight: '800', zIndex: 2,
                      boxShadow: '0 2px 8px rgba(255, 165, 0, 0.4)',
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>
                      🔥 {t('product.onlyLeft')} {product.stock}
                    </div>
                  )}
                  {outOfStock && (
                    <div style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                      color: 'white', padding: '5px 12px', borderRadius: '20px',
                      fontSize: '10px', fontWeight: '800', zIndex: 2,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>
                      {t('product.outOfStock')}
                    </div>
                  )}

                  <div style={styles.imageContainer}>
                    {primaryImage ? (
                      <img src={primaryImage} alt={product.name} style={styles.productImage}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%231a1a1a" width="200" height="200"/%3E%3Ctext fill="%23FFD700" font-family="Arial" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div style={styles.noImage}>📷</div>
                    )}
                  </div>

                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.productDescription}>{product.description}</p>
                  <p style={styles.productPrice}>R{product.price.toFixed(2)}</p>
                  <div style={{
                    ...styles.productStock,
                    color: outOfStock ? '#f44336' : lowStock ? '#FFA500' : '#4CAF50',
                    background: outOfStock ? 'rgba(244, 67, 54, 0.15)' : lowStock ? 'rgba(255, 165, 0, 0.15)' : 'rgba(76, 175, 80, 0.15)',
                    border: `1px solid ${outOfStock ? 'rgba(244, 67, 54, 0.3)' : lowStock ? 'rgba(255, 165, 0, 0.3)' : 'rgba(76, 175, 80, 0.3)'}`,
                  }}>
                    {outOfStock ? t('product.outOfStock') : `${product.stock} ${t('product.inStock')}`}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleProductClick(product._id); }}
                    style={styles.viewDetailsButton}
                  >
                    👁️ {t('product.viewDetails')}
                  </button>

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={outOfStock}
                    style={{
                      ...styles.addButton,
                      background: outOfStock ? 'linear-gradient(135deg, #424242, #303030)' : 'linear-gradient(135deg, #FFD700, #FFA500)',
                      cursor: outOfStock ? 'not-allowed' : 'pointer',
                      color: outOfStock ? '#999' : '#000',
                    }}
                  >
                    {outOfStock ? t('product.unavailable') : `🛒 ${t('product.addToCart')}`}
                  </button>
                </div>
              );
            })}
          </div>
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

export default BuyerPage;