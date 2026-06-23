import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct } from '../services/api';
import { addToCart, getCartCount } from '../utils/cart';
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

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const mobile = isMobile(width);
  const { t } = useTranslation(); // 🆕 Translation hook
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);
  const [cartCount, setCartCount] = useState(getCartCount());

  useEffect(() => {
    fetchProduct();
    const handleCartUpdate = () => setCartCount(getCartCount());
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(id);
      setProduct(data);
      // Combine images array with single image for backward compatibility
      if (data.images && data.images.length > 0) {
        // Use images array
      } else if (data.image) {
        data.images = [data.image];
      } else {
        data.images = [];
      }
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      setToast({ message: 'Failed to load product', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    
    // 🆕 Pass the selected quantity to addToCart
    const result = addToCart(product, quantity);
    
    if (result.success) {
      showToast(result.message, 'success');
      setCartCount(getCartCount());
      setQuantity(1); // Reset quantity after successful add
    } else {
      // 🆕 Show stock limit error
      showToast(result.message, 'warning');
    }
  };

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
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
      cursor: 'pointer', textDecoration: 'none',
    },
    container: { maxWidth: '1400px', margin: '0 auto', padding: mobile ? '20px' : '40px' },
    breadcrumb: {
      display: 'flex', alignItems: 'center', gap: '8px',
      marginBottom: mobile ? '20px' : '30px',
      fontSize: mobile ? '13px' : '14px', color: 'rgba(255,255,255,0.6)',
      flexWrap: 'wrap',
    },
    breadcrumbLink: { color: '#FFD700', textDecoration: 'none', cursor: 'pointer' },
    content: {
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
      gap: mobile ? '30px' : '50px',
      alignItems: 'start',
    },
    // Gallery
    gallery: { position: 'sticky', top: '100px' },
    mainImage: {
      width: '100%', aspectRatio: '1',
      borderRadius: '20px', overflow: 'hidden',
      background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    mainImageImg: { width: '100%', height: '100%', objectFit: 'cover' },
    thumbnails: {
      display: 'grid',
      gridTemplateColumns: `repeat(${Math.min(product?.images?.length || 1, 4)}, 1fr)`,
      gap: '10px',
    },
    thumbnail: {
      aspectRatio: '1', borderRadius: '10px', overflow: 'hidden',
      border: '2px solid transparent', cursor: 'pointer',
      transition: 'all 0.2s ease', background: '#1a1a1a',
    },
    thumbnailActive: { borderColor: '#FFD700', boxShadow: '0 0 12px rgba(255, 215, 0, 0.4)' },
    thumbnailImg: { width: '100%', height: '100%', objectFit: 'cover' },
    // Details
    details: {},
    category: {
      display: 'inline-block', padding: '6px 14px',
      background: 'rgba(255, 215, 0, 0.1)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '20px', fontSize: '11px', fontWeight: '700',
      color: '#FFD700', textTransform: 'uppercase', letterSpacing: '1px',
      marginBottom: '16px',
    },
    productName: {
      fontSize: mobile ? '28px' : '40px', fontWeight: '900',
      lineHeight: '1.1', margin: '0 0 16px 0',
      letterSpacing: '-1px', color: 'white',
    },
    price: {
      fontSize: mobile ? '32px' : '44px', fontWeight: '900',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      margin: '0 0 20px 0', letterSpacing: '-1px',
    },
    stockBadge: (stock) => ({
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '8px 16px', borderRadius: '20px',
      fontSize: '13px', fontWeight: '700',
      background: stock === 0 ? 'rgba(244, 67, 54, 0.15)' : stock < 5 ? 'rgba(255, 165, 0, 0.15)' : 'rgba(76, 175, 80, 0.15)',
      color: stock === 0 ? '#f44336' : stock < 5 ? '#FFA500' : '#4CAF50',
      border: `1px solid ${stock === 0 ? 'rgba(244, 67, 54, 0.3)' : stock < 5 ? 'rgba(255, 165, 0, 0.3)' : 'rgba(76, 175, 80, 0.3)'}`,
      marginBottom: '24px',
    }),
    description: {
      fontSize: mobile ? '15px' : '16px',
      color: 'rgba(255,255,255,0.75)',
      lineHeight: '1.7', marginBottom: '28px',
    },
    quantitySection: {
      display: 'flex', alignItems: 'center', gap: '16px',
      marginBottom: '24px', flexWrap: 'wrap',
    },
    quantityLabel: {
      fontSize: '14px', fontWeight: '600',
      color: 'rgba(255,255,255,0.7)',
    },
    quantityControl: {
      display: 'flex', alignItems: 'center',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '12px', overflow: 'hidden',
    },
    quantityButton: {
      width: '40px', height: '40px',
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'white', border: 'none',
      cursor: 'pointer', fontSize: '18px', fontWeight: '700',
      transition: 'all 0.2s ease',
    },
    quantityValue: {
      width: '50px', textAlign: 'center',
      fontSize: '16px', fontWeight: '700', color: 'white',
    },
    addToCartButton: {
      width: '100%', padding: mobile ? '16px' : '18px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#000', border: 'none', borderRadius: '14px',
      cursor: 'pointer', fontSize: mobile ? '15px' : '17px',
      fontWeight: '800', transition: 'all 0.2s ease',
      boxShadow: '0 6px 24px rgba(255, 215, 0, 0.4)',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
      marginBottom: '12px',
    },
    checkoutButton: {
      width: '100%', padding: mobile ? '14px' : '16px',
      background: 'transparent', color: 'white',
      border: '2px solid rgba(255, 215, 0, 0.5)',
      borderRadius: '14px', cursor: 'pointer',
      fontSize: mobile ? '14px' : '15px', fontWeight: '700',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      transition: 'all 0.2s ease',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
      textDecoration: 'none',
    },
    deliveryBanner: {
      marginTop: '28px', padding: mobile ? '16px' : '20px',
      background: 'rgba(33, 150, 243, 0.08)',
      border: '1px solid rgba(33, 150, 243, 0.25)',
      borderRadius: '14px',
      display: 'flex', gap: '14px', alignItems: 'flex-start',
    },
    deliveryIcon: { fontSize: mobile ? '28px' : '36px', flexShrink: 0 },
    deliveryTitle: {
      margin: '0 0 4px 0', color: '#2196F3',
      fontSize: mobile ? '14px' : '15px', fontWeight: '700',
    },
    deliveryText: {
      margin: 0, fontSize: mobile ? '12px' : '13px',
      color: 'rgba(255,255,255,0.7)', lineHeight: '1.5',
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
    loadingContainer: {
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', gap: '20px',
    },
    spinner: {
      width: '50px', height: '50px',
      border: '4px solid rgba(255, 215, 0, 0.2)',
      borderTop: '4px solid #FFD700',
      borderRadius: '50%', animation: 'spin 1s linear infinite',
    },
    noImage: {
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
      fontSize: mobile ? '60px' : '80px',
    },
  });

  const styles = getStyles();

  if (loading) {
    return (
      <div style={styles.page}>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          
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
        `}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.loadingContainer, minHeight: '80vh' }}>
          <div style={{ fontSize: '80px' }}>🔍</div>
          <h2 style={{ color: 'white' }}>{t('product.notFound')}</h2>
          <Link to="/buyer" style={{ ...styles.navButton, padding: '12px 24px' }}>
            ← {t('nav.backToShop')}
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock < 5;

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes slideIn {
          from { transform: ${mobile ? 'translateX(50%) translateY(-20px)' : 'translateX(100%)'}; opacity: 0; }
          to { transform: ${mobile ? 'translateX(50%) translateY(0)' : 'translateX(0)'}; opacity: 1; }
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
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
        
        button:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.08); }
      `}</style>

      {toast && (
        <div style={{ ...styles.toast, backgroundColor: toast.type === 'error' ? '#f44336' : toast.type === 'warning' ? '#FFA500' : '#4CAF50' }}>
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
          <Link to="/buyer" style={styles.navButton}>🛍️ {t('nav.shop')}</Link>
          {cartCount > 0 && (
            <Link to="/checkout" style={styles.cartBadge}>
              🛒 {cartCount}
            </Link>
          )}
        </div>
      </nav>

      <div style={styles.container}>
        {/* Breadcrumb - translate UI only, NOT product data */}
        <div style={styles.breadcrumb}>
          <Link to="/buyer" style={styles.breadcrumbLink}>{t('nav.shop')}</Link>
          <span>›</span>
          <span style={styles.breadcrumbLink}>{product.category}</span> {/* ← DO NOT translate */}
          <span>›</span>
          <span>{product.name}</span> {/* ← DO NOT translate */}
        </div>

        <div style={styles.content}>
          {/* Image Gallery */}
          <div style={styles.gallery}>
            <div style={styles.mainImage}>
              {images[selectedImage] ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  style={styles.mainImageImg}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:80px;">📷</div>';
                  }}
                />
              ) : (
                <div style={styles.noImage}>📷</div>
              )}
            </div>
            
            {images.length > 1 && (
              <div style={styles.thumbnails}>
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      ...styles.thumbnail,
                      ...(selectedImage === index ? styles.thumbnailActive : {}),
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      style={styles.thumbnailImg}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#FFD700;">❌</div>';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details - translate UI only, NOT product data */}
          <div style={styles.details}>
            <div style={styles.category}>{product.category}</div> {/* ← DO NOT translate */}
            <h1 style={styles.productName}>{product.name}</h1> {/* ← DO NOT translate */}
            <div style={styles.price}>R{product.price.toFixed(2)}</div> {/* ← DO NOT translate */}
            
            {/* Stock badge - translate UI text only */}
            <div style={styles.stockBadge(product.stock)}>
              {outOfStock ? `🚫 ${t('product.outOfStock')}` : lowStock ? `⚠️ ${t('product.onlyLeft')} ${product.stock}` : `✓ ${product.stock} ${t('product.inStock')}`}
            </div>

            <p style={styles.description}>{product.description}</p> {/* ← DO NOT translate */}

            {/* Quantity Selector */}
            {!outOfStock && (
              <div style={styles.quantitySection}>
                <span style={styles.quantityLabel}>{t('product.quantity')}:</span>
                <div style={styles.quantityControl}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    style={styles.quantityButton}
                    disabled={quantity <= 1}
                  >−</button>
                  <div style={styles.quantityValue}>{quantity}</div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    style={styles.quantityButton}
                    disabled={quantity >= product.stock}
                  >+</button>
                </div>
              </div>
            )}

            {/* Add to Cart - translate button text only */}
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              style={{
                ...styles.addToCartButton,
                background: outOfStock ? 'linear-gradient(135deg, #424242, #303030)' : 'linear-gradient(135deg, #FFD700, #FFA500)',
                cursor: outOfStock ? 'not-allowed' : 'pointer',
                color: outOfStock ? '#999' : '#000',
              }}
            >
              {outOfStock ? `🚫 ${t('product.unavailable')}` : `🛒 ${t('product.addToCart')}`}
            </button>

            {/* Buy Now - Goes to Checkout */}
            {!outOfStock && (
              <Link to="/checkout" style={styles.checkoutButton}>
                💳 {t('product.buyNow')}
              </Link>
            )}

            {/* Delivery Info - translate UI text only */}
            <div style={styles.deliveryBanner}>
              <div style={styles.deliveryIcon}>📦</div>
              <div>
                <h4 style={styles.deliveryTitle}>{t('product.paxiDelivery')}</h4>
                <p style={styles.deliveryText}>
                  {t('product.paxiText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;