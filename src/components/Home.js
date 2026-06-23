import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
import LanguageSelector from './LanguageSelector';

// 🆕 Custom hook for responsive design
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

const Home = () => {
  const { width } = useWindowSize();
  const mobile = isMobile(width);
  const tablet = isTablet(width);
  const { t } = useTranslation(); // 🆕 Translation hook

  // 🆕 Featured products showcase data (replace with your actual products)
  const showcaseProducts = [
    {
      id: 1,
      name: 'Premium Fashion',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
      category: 'Clothing',
    },
    {
      id: 2,
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
      category: 'Tech',
    },
    {
      id: 3,
      name: 'Home Essentials',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
      category: 'Home',
    },
    {
      id: 4,
      name: 'Beauty & Care',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
      category: 'Beauty',
    },
    {
      id: 5,
      name: 'Fresh Groceries',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
      category: 'Groceries',
    },
    {
      id: 6,
      name: 'Lifestyle',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
      category: 'Lifestyle',
    },
  ];

  // 🆕 Trust indicators - translate titles and descriptions
  const trustIndicators = [
    { icon: '🚚', title: t('home.trustDelivery'), desc: t('home.trustDeliveryDesc') },
    { icon: '💯', title: t('home.trustAuthentic'), desc: t('home.trustAuthenticDesc') },
    { icon: '🔒', title: t('home.trustSecure'), desc: t('home.trustSecureDesc') },
    { icon: '💬', title: t('home.trustSupport'), desc: t('home.trustSupportDesc') },
  ];

  // 🎨 Dynamic styles (unchanged - keeping the dark luxury aesthetic)
  const getStyles = () => ({
    page: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: '#0a0a0a',
      color: 'white',
      overflowX: 'hidden',
    },
    // ===== NAVIGATION =====
    nav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
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
    navCta: {
      padding: mobile ? '8px 16px' : '10px 22px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#000',
      textDecoration: 'none',
      borderRadius: '30px',
      fontSize: mobile ? '13px' : '14px',
      fontWeight: '800',
      boxShadow: '0 4px 16px rgba(255, 215, 0, 0.4)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      transition: 'all 0.3s ease',
    },
    // ===== HERO SECTION =====
    hero: {
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: mobile ? '100px 20px 60px' : '120px 40px 80px',
      background: `
        radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(220, 20, 60, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(34, 139, 34, 0.08) 0%, transparent 60%),
        linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)
      `,
      overflow: 'hidden',
    },
    heroDecoration: {
      position: 'absolute',
      top: '10%',
      right: '-5%',
      width: mobile ? '300px' : '600px',
      height: mobile ? '300px' : '600px',
      background: 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)',
      borderRadius: '50%',
      animation: 'float 8s ease-in-out infinite',
    },
    heroDecoration2: {
      position: 'absolute',
      bottom: '5%',
      left: '-10%',
      width: mobile ? '250px' : '500px',
      height: mobile ? '250px' : '500px',
      background: 'radial-gradient(circle, rgba(220, 20, 60, 0.06) 0%, transparent 70%)',
      borderRadius: '50%',
      animation: 'float 10s ease-in-out infinite reverse',
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
      textAlign: 'center',
      maxWidth: '1000px',
      animation: 'fadeInUp 1s ease',
    },
    prideBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      padding: mobile ? '8px 16px' : '10px 20px',
      background: 'rgba(255, 215, 0, 0.1)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '30px',
      marginBottom: mobile ? '20px' : '28px',
      fontSize: mobile ? '12px' : '14px',
      fontWeight: '700',
      color: '#FFD700',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      backdropFilter: 'blur(10px)',
    },
    prideFlag: {
      display: 'flex',
      gap: '3px',
    },
    flagStripe: (color) => ({
      width: '4px',
      height: '18px',
      background: color,
      borderRadius: '2px',
    }),
    heroTitle: {
      fontSize: mobile ? '38px' : tablet ? '56px' : '72px',
      fontWeight: '900',
      lineHeight: '1.05',
      margin: '0 0 20px 0',
      letterSpacing: '-2px',
    },
    heroTitleAccent: {
      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6347 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      display: 'inline-block',
    },
    heroSubtitle: {
      fontSize: mobile ? '16px' : tablet ? '18px' : '20px',
      color: 'rgba(255, 255, 255, 0.75)',
      maxWidth: '700px',
      margin: '0 auto 36px',
      lineHeight: '1.6',
      fontWeight: '400',
    },
    heroCtaContainer: {
      display: 'flex',
      flexDirection: mobile ? 'column' : 'row',
      gap: '16px',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    primaryCta: {
      padding: mobile ? '16px 32px' : '18px 40px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#000',
      textDecoration: 'none',
      borderRadius: '50px',
      fontSize: mobile ? '15px' : '17px',
      fontWeight: '800',
      boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
    },
    secondaryCta: {
      padding: mobile ? '16px 32px' : '18px 40px',
      background: 'transparent',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '50px',
      fontSize: mobile ? '15px' : '17px',
      fontWeight: '700',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
    },
    heroStats: {
      display: 'flex',
      justifyContent: 'center',
      gap: mobile ? '24px' : '48px',
      marginTop: mobile ? '40px' : '60px',
      flexWrap: 'wrap',
    },
    statItem: {
      textAlign: 'center',
    },
    statNumber: {
      fontSize: mobile ? '28px' : '36px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: 0,
      lineHeight: '1',
    },
    statLabel: {
      fontSize: mobile ? '11px' : '12px',
      color: 'rgba(255, 255, 255, 0.6)',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginTop: '6px',
      fontWeight: '600',
    },
    // ===== SECTION COMMON =====
    section: {
      padding: mobile ? '60px 20px' : '100px 40px',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    sectionLabel: {
      display: 'inline-block',
      fontSize: mobile ? '11px' : '12px',
      color: '#FFD700',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      fontWeight: '700',
      marginBottom: '12px',
    },
    sectionTitle: {
      fontSize: mobile ? '28px' : tablet ? '36px' : '44px',
      fontWeight: '900',
      margin: '0 0 16px 0',
      lineHeight: '1.1',
      letterSpacing: '-1px',
    },
    sectionSubtitle: {
      fontSize: mobile ? '15px' : '17px',
      color: 'rgba(255, 255, 255, 0.7)',
      maxWidth: '700px',
      margin: '0 auto 48px',
      lineHeight: '1.6',
      textAlign: 'center',
    },
    // ===== SHOWCASE SECTION =====
    showcaseSection: {
      padding: mobile ? '60px 20px' : '100px 40px',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #141414 50%, #0a0a0a 100%)',
    },
    showcaseHeader: {
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto 48px',
    },
    showcaseGrid: {
      display: 'grid',
      gridTemplateColumns: mobile 
        ? '1fr' 
        : tablet 
          ? 'repeat(2, 1fr)' 
          : 'repeat(3, 1fr)',
      gap: mobile ? '16px' : '24px',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    showcaseCard: {
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden',
      aspectRatio: mobile ? '4/3' : '1',
      cursor: 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    },
    showcaseImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    showcaseOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.9) 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: mobile ? '20px' : '28px',
    },
    showcaseCategory: {
      fontSize: mobile ? '10px' : '11px',
      color: '#FFD700',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      fontWeight: '700',
      marginBottom: '6px',
    },
    showcaseName: {
      fontSize: mobile ? '18px' : '22px',
      fontWeight: '800',
      color: 'white',
      margin: 0,
      letterSpacing: '-0.5px',
    },
    // ===== BRAND STORY =====
    brandSection: {
      padding: mobile ? '60px 20px' : '100px 40px',
      background: '#0a0a0a',
    },
    brandContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
      gap: mobile ? '40px' : '60px',
      alignItems: 'center',
    },
    brandImageContainer: {
      position: 'relative',
      borderRadius: '24px',
      overflow: 'hidden',
      aspectRatio: '1',
      boxShadow: '0 20px 60px rgba(255, 215, 0, 0.15)',
    },
    brandImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    brandImageOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, transparent 50%, rgba(220, 20, 60, 0.15) 100%)',
    },
    brandBadge: {
      position: 'absolute',
      bottom: mobile ? '16px' : '24px',
      left: mobile ? '16px' : '24px',
      padding: mobile ? '10px 16px' : '12px 20px',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      borderRadius: '30px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
    },
    brandBadgeText: {
      color: '#FFD700',
      fontSize: mobile ? '12px' : '13px',
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      margin: 0,
    },
    brandContent: {
      color: 'white',
    },
    brandTitle: {
      fontSize: mobile ? '28px' : tablet ? '36px' : '44px',
      fontWeight: '900',
      margin: '0 0 20px 0',
      lineHeight: '1.1',
      letterSpacing: '-1px',
    },
    brandText: {
      fontSize: mobile ? '15px' : '16px',
      color: 'rgba(255, 255, 255, 0.75)',
      lineHeight: '1.8',
      margin: '0 0 20px 0',
    },
    brandValues: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginTop: '28px',
    },
    valueItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px',
      background: 'rgba(255, 215, 0, 0.05)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      borderRadius: '12px',
    },
    valueIcon: {
      fontSize: '24px',
    },
    valueText: {
      fontSize: mobile ? '13px' : '14px',
      fontWeight: '700',
      color: 'white',
      margin: 0,
    },
    // ===== TRUST SECTION =====
    trustSection: {
      padding: mobile ? '60px 20px' : '100px 40px',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #141414 100%)',
    },
    trustGrid: {
      display: 'grid',
      gridTemplateColumns: mobile 
        ? '1fr' 
        : tablet 
          ? 'repeat(2, 1fr)' 
          : 'repeat(4, 1fr)',
      gap: mobile ? '16px' : '24px',
      maxWidth: '1400px',
      margin: '0 auto',
    },
    trustCard: {
      padding: mobile ? '24px 20px' : '32px 24px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      borderRadius: '20px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
    },
    trustIcon: {
      fontSize: mobile ? '40px' : '48px',
      marginBottom: '16px',
      display: 'inline-block',
      filter: 'drop-shadow(0 4px 12px rgba(255, 215, 0, 0.3))',
    },
    trustTitle: {
      fontSize: mobile ? '16px' : '18px',
      fontWeight: '800',
      color: 'white',
      margin: '0 0 8px 0',
    },
    trustDesc: {
      fontSize: mobile ? '13px' : '14px',
      color: 'rgba(255, 255, 255, 0.6)',
      margin: 0,
      lineHeight: '1.5',
    },
    // ===== CTA SECTION =====
    ctaSection: {
      padding: mobile ? '60px 20px' : '100px 40px',
      background: `
        radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.15) 0%, transparent 60%),
        linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)
      `,
      textAlign: 'center',
    },
    ctaContainer: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    ctaTitle: {
      fontSize: mobile ? '32px' : tablet ? '44px' : '56px',
      fontWeight: '900',
      margin: '0 0 20px 0',
      lineHeight: '1.1',
      letterSpacing: '-1.5px',
    },
    ctaSubtitle: {
      fontSize: mobile ? '15px' : '18px',
      color: 'rgba(255, 255, 255, 0.75)',
      margin: '0 0 36px 0',
      lineHeight: '1.6',
    },
    // ===== FOOTER =====
    footer: {
      padding: mobile ? '40px 20px' : '60px 40px 40px',
      background: '#000',
      borderTop: '1px solid rgba(255, 215, 0, 0.15)',
      textAlign: 'center',
    },
    footerLogo: {
      fontSize: mobile ? '24px' : '28px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '3px',
      margin: '0 0 12px 0',
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
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-30px) rotate(5deg); }
      }
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
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
      .showcase-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 60px rgba(255, 215, 0, 0.25) !important;
      }
      .showcase-card:hover .showcase-image {
        transform: scale(1.1);
      }
      .trust-card:hover {
        transform: translateY(-6px);
        border-color: rgba(255, 215, 0, 0.5) !important;
        background: rgba(255, 215, 0, 0.08) !important;
      }
      .nav-cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(255, 215, 0, 0.6);
      }
      .primary-cta:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 40px rgba(255, 215, 0, 0.6);
      }
      .secondary-cta:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.6);
        transform: translateY(-3px);
      }
    `}</style>

      {/* ===== NAVIGATION ===== */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <h1 style={styles.logoText}>FASTLANE</h1>
        </Link>
        <div style={styles.navActions}>
          <LanguageSelector /> {/* 🆕 Language selector */}
          <Link to="/buyer" className="nav-cta" style={styles.navCta}>
            {t('nav.shopNow')}
          </Link>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section style={styles.hero}>
        <div style={styles.heroDecoration} />
        <div style={styles.heroDecoration2} />
        
        <div style={styles.heroContent}>
          {/* Pride Badge */}
          <div style={styles.prideBadge}>
            <div style={styles.prideFlag}>
              <div style={styles.flagStripe('#000000')} />
              <div style={styles.flagStripe('#FFD700')} />
              <div style={styles.flagStripe('#DC143C')} />
              <div style={styles.flagStripe('#228B22')} />
            </div>
            <span>{t('home.prideBadge')}</span>
          </div>

          {/* Main Title */}
          <h1 style={styles.heroTitle}>
            {t('home.mainTitle1')} <span style={styles.heroTitleAccent}>{t('home.mainTitle2')}</span><br />
            {t('home.mainTitle3')} <span style={styles.heroTitleAccent}>{t('home.mainTitle4')}</span>
          </h1>

          {/* Subtitle */}
          <p style={styles.heroSubtitle}>
            {t('home.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div style={styles.heroCtaContainer}>
            <Link to="/buyer" className="primary-cta" style={styles.primaryCta}>
              <span>🛍️</span>
              {t('home.startShopping')}
            </Link>
            <a href="#showcase" className="secondary-cta" style={styles.secondaryCta}>
              <span>✨</span>
              {t('home.explore')}
            </a>
          </div>

          {/* Stats */}
          <div style={styles.heroStats}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>100%</div>
              <div style={styles.statLabel}>{t('home.statBlackOwned')}</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>R100</div>
              <div style={styles.statLabel}>{t('home.statFlatDelivery')}</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>24/7</div>
              <div style={styles.statLabel}>{t('home.statWhatsApp')}</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>🇿🇦</div>
              <div style={styles.statLabel}>{t('home.statProudlySA')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCT SHOWCASE ===== */}
      <section id="showcase" style={styles.showcaseSection}>
        <div style={styles.showcaseHeader}>
          <div style={styles.sectionLabel}>✨ {t('home.whatWeOffer')}</div>
          <h2 style={{ ...styles.sectionTitle, textAlign: 'center' }}>
            {t('home.curated')} <span style={{ color: '#FFD700' }}>{t('home.excellence')}</span>
          </h2>
          <p style={styles.sectionSubtitle}>
            {t('home.curatedDesc')}
          </p>
        </div>

        <div style={styles.showcaseGrid}>
          {showcaseProducts.map((product, index) => (
            <Link 
              to="/buyer" 
              key={product.id}
              className="showcase-card"
              style={{
                ...styles.showcaseCard,
                textDecoration: 'none',
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="showcase-image"
                style={styles.showcaseImage}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/600x600/1a1a1a/FFD700?text=${encodeURIComponent(product.name)}`;
                }}
              />
              <div style={styles.showcaseOverlay}>
                <div style={styles.showcaseCategory}>{product.category}</div>
                <h3 style={styles.showcaseName}>{product.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Story Section */}
      <section style={styles.brandSection}>
        <div style={styles.brandContainer}>
          <div style={styles.brandImageContainer}>
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" 
              alt="Fastlane Brand"
              style={styles.brandImage}
            />
            <div style={styles.brandImageOverlay} />
            <div style={styles.brandBadge}>
              <span>🏆</span>
              <p style={styles.brandBadgeText}>{t('home.brandBadge')}</p>
            </div>
          </div>

          <div style={styles.brandContent}>
            <div style={styles.sectionLabel}>{t('home.ourStory')}</div>
            <h2 style={styles.brandTitle}>
              {t('home.brandTitle1')} <span style={{ color: '#FFD700' }}>{t('home.brandTitle2')}</span><br />
              {t('home.brandTitle3')} <span style={{ color: '#FFD700' }}>{t('home.brandTitle4')}</span>
            </h2>
            <p style={styles.brandText}>
              {t('home.brandText1')}
            </p>
            <p style={styles.brandText}>
              {t('home.brandText2')}
            </p>

            <div style={styles.brandValues}>
              <div style={styles.valueItem}>
                <span style={styles.valueIcon}>💎</span>
                <p style={styles.valueText}>{t('home.valueCredibility')}</p>
              </div>
              <div style={styles.valueItem}>
                <span style={styles.valueIcon}>🔥</span>
                <p style={styles.valueText}>{t('home.valueAudacity')}</p>
              </div>
              <div style={styles.valueItem}>
                <span style={styles.valueIcon}>🤝</span>
                <p style={styles.valueText}>{t('home.valueReliability')}</p>
              </div>
              <div style={styles.valueItem}>
                <span style={styles.valueIcon}>🌍</span>
                <p style={styles.valueText}>{t('home.valueCommunity')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST INDICATORS ===== */}
      <section style={styles.trustSection}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
          <div style={styles.sectionLabel}>{t('home.whyChoose')}</div>
          <h2 style={{ ...styles.sectionTitle, textAlign: 'center' }}>
            {t('home.promise')}
          </h2>
          <p style={styles.sectionSubtitle}>
            {t('home.promiseDesc')}
          </p>
        </div>

        <div style={styles.trustGrid}>
          {trustIndicators.map((item, index) => (
            <div 
              key={index}
              className="trust-card"
              style={styles.trustCard}
            >
              <div style={styles.trustIcon}>{item.icon}</div>
              <h3 style={styles.trustTitle}>{item.title}</h3>
              <p style={styles.trustDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContainer}>
          <div style={styles.sectionLabel}>{t('home.ready')}</div>
          <h2 style={styles.ctaTitle}>
            {t('home.readyTitle')}<br />
            <span style={{ color: '#FFD700' }}>{t('home.readyAccent')}</span>
          </h2>
          <p style={styles.ctaSubtitle}>
            {t('home.readyDesc')}
          </p>
          <Link to="/buyer" className="primary-cta" style={styles.primaryCta}>
            <span>🛍️</span>
            {t('home.shopAtFastlane')}
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={styles.footer}>
        <h3 style={styles.footerLogo}>⚡ FASTLANE</h3>
        <p style={styles.footerText}>
          {t('footer.tagline')}
        </p>
        <p style={styles.footerText}>
          © 2026 Fastlane Retail. {t('footer.rights')}
        </p>
        <div style={styles.footerPride}>
          <span>🇿🇦</span>
          <span>{t('footer.pride')}</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;