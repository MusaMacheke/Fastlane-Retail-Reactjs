import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import { getCart, getCartTotal, clearCart, getCartCount, removeFromCart } from '../utils/cart';
import useTranslation from '../hooks/useTranslation';
import LanguageSelector from './LanguageSelector';

const SA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
  'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape',
];

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

const Checkout = () => {
  const { width } = useWindowSize();
  const mobile = isMobile(width);
  const navigate = useNavigate();
  const { t } = useTranslation(); // 🆕 Translation hook
  
  const [cart, setCart] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, deliveryFee: 0, total: 0 });
  const [cartCount, setCartCount] = useState(getCartCount());
  const [formData, setFormData] = useState({
    buyerName: '', buyerSurname: '', phoneNumber: '', gender: '',
    streetAddress: '', city: '', province: '', postalCode: '', language: '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    const currentCart = getCart();
    setCart(currentCart);
    setTotals(getCartTotal());
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => {
      const currentCart = getCart();
      setCart(currentCart);
      setTotals(getCartTotal());
      setCartCount(getCartCount());
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePostalCode = (code) => /^\d{4}$/.test(code);

  const combineAddress = () => {
    return `${formData.streetAddress}, ${formData.city}, ${formData.province}, ${formData.postalCode}`;
  };

  const handleRemoveItem = (productId, productName) => {
    if (window.confirm(`${t('checkout.remove')} "${productName}"?`)) {
      removeFromCart(productId);
      const updatedCart = getCart();
      setCart(updatedCart);
      setTotals(getCartTotal());
      setCartCount(getCartCount());
      showToast(`${productName} ${t('checkout.removed')}`, 'success');
      
      if (updatedCart.length === 0) {
        setTimeout(() => {
          showToast(t('checkout.emptyCart'), 'warning');
        }, 500);
      }
    }
  };

  const handleCancelCheckout = () => {
    if (cart.length > 0) {
      setShowCancelConfirm(true);
    } else {
      navigate('/buyer');
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    navigate('/buyer');
    showToast(t('checkout.cartSaved'), 'success');
  };

  const handleCancelAndClear = () => {
    clearCart();
    setShowCancelConfirm(false);
    navigate('/buyer');
    showToast(t('checkout.cartCleared'), 'success');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!validatePostalCode(formData.postalCode)) {
      showToast(t('checkout.invalidPostal'), 'error');
      return;
    }

    if (cart.length === 0) {
      showToast(t('checkout.emptyCart'), 'error');
      return;
    }

    setLoading(true);
    
    try {
        const orderData = {
            buyerName: formData.buyerName,
            buyerSurname: formData.buyerSurname,
            phoneNumber: formData.phoneNumber,
            gender: formData.gender || 'Prefer not to say',
            address: combineAddress(),
            language: formData.language,
            items: cart.map(item => ({
                productId: item.productId,
                productName: item.productName,
                price: item.price,
                quantity: item.quantity,
            })),
        };
      
      const order = await createOrder(orderData);
      clearCart();
      setOrderPlaced(order);
      setCartCount(0);
      showToast(t('checkout.orderSuccess'), 'success');
    } catch (error) {
      console.error('Error placing order:', error);
      showToast(t('checkout.orderFailed'), 'error');
    } finally {
      setLoading(false);
    }
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

  const getStyles = () => ({
    genderSection: {
      marginBottom: '24px',
      padding: mobile ? '16px' : '20px',
      background: 'rgba(255, 215, 0, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      borderRadius: '14px',
    },
    genderHelperText: {
      margin: '0 0 14px 0',
      fontSize: mobile ? '11px' : '12px',
      color: 'rgba(255, 255, 255, 0.55)',
      lineHeight: '1.5',
      fontStyle: 'italic',
    },
    genderOptions: {
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)',
      gap: mobile ? '10px' : '12px',
    },
    genderCard: {
      position: 'relative',
      padding: mobile ? '16px 12px' : '20px 16px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '2px solid rgba(255, 215, 0, 0.15)',
      borderRadius: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      color: 'white',
      fontFamily: 'inherit',
      outline: 'none',
    },
    genderCardActive: {
      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1))',
      border: '2px solid #FFD700',
      boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
      transform: 'translateY(-2px)',
    },
    genderCardIcon: {
      fontSize: mobile ? '32px' : '40px',
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
    },
    genderCardLabel: {
      fontSize: mobile ? '13px' : '14px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      color: 'white',
    },
    genderCheckmark: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: '22px',
      height: '22px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#000',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: '900',
      boxShadow: '0 2px 8px rgba(255, 215, 0, 0.5)',
    },
    selectedGenderBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '12px',
      padding: '6px 14px',
      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1))',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      color: '#FFD700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    phoneFieldWrapper: {
      marginBottom: '20px',
    },
    whatsappHelperNote: {
      display: 'flex',
      gap: '12px',
      marginTop: '10px',
      padding: mobile ? '12px' : '14px',
      background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.08), rgba(37, 211, 102, 0.03))',
      border: '1px solid rgba(37, 211, 102, 0.25)',
      borderRadius: '12px',
      alignItems: 'flex-start',
    },
    whatsappHelperIcon: {
      fontSize: mobile ? '22px' : '26px',
      flexShrink: 0,
      background: 'linear-gradient(135deg, #25D366, #128C7E)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      filter: 'drop-shadow(0 2px 4px rgba(37, 211, 102, 0.3))',
    },
    whatsappHelperContent: {
      flex: 1,
    },
    whatsappHelperTitle: {
      display: 'block',
      fontSize: mobile ? '12px' : '13px',
      color: '#25D366',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '4px',
    },
    whatsappHelperText: {
      margin: 0,
      fontSize: mobile ? '11px' : '12px',
      color: 'rgba(255, 255, 255, 0.65)',
      lineHeight: '1.5',
    },
    required: {
      color: '#FFA500',
      marginLeft: '2px',
      fontSize: '14px',
    },
    customSelectWrapper: {
      marginBottom: '20px',
    },
    customSelectContainer: {
      position: 'relative',
    },
    customSelect: {
      width: '100%',
      padding: mobile ? '14px 44px 14px 16px' : '16px 48px 16px 18px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '12px',
      fontSize: mobile ? '15px' : '16px',
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'white',
      cursor: 'pointer',
      fontWeight: '600',
      fontFamily: 'inherit',
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      transition: 'all 0.2s ease',
      outline: 'none',
      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
    },
    customSelectArrow: {
      position: 'absolute',
      right: mobile ? '16px' : '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#FFD700',
      pointerEvents: 'none',
      transition: 'transform 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1))',
      borderRadius: '8px',
      border: '1px solid rgba(255, 215, 0, 0.2)',
    },
    activeSelectDot: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '8px',
      height: '8px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      borderRadius: '50%',
      boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
      animation: 'pulse 2s ease-in-out infinite',
    },
    selectedValueBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '8px',
      padding: '6px 12px',
      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1))',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      color: '#FFD700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
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
    },
    container: { maxWidth: '1200px', margin: '0 auto', padding: mobile ? '20px' : '40px' },
    header: {
      marginBottom: mobile ? '24px' : '36px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '16px',
    },
    headerLeft: {
      display: 'flex', alignItems: 'center', gap: '12px',
    },
    headerIcon: {
      fontSize: mobile ? '36px' : '48px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    },
    headerText: {
      margin: 0, fontSize: mobile ? '24px' : '32px',
      color: 'white', fontWeight: '900', letterSpacing: '-0.5px',
    },
    headerSubtitle: {
      margin: '4px 0 0 0', fontSize: mobile ? '13px' : '14px',
      color: 'rgba(255,255,255,0.6)',
    },
    cancelButton: {
      padding: mobile ? '10px 20px' : '12px 24px',
      background: 'transparent', color: '#f44336',
      border: '2px solid rgba(244, 67, 54, 0.4)',
      borderRadius: '12px', cursor: 'pointer',
      fontSize: mobile ? '13px' : '14px', fontWeight: '700',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      transition: 'all 0.2s ease',
      display: 'flex', alignItems: 'center', gap: '8px',
    },
    layout: {
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '2fr 1fr',
      gap: mobile ? '24px' : '32px',
      alignItems: 'start',
    },
    cartSection: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      padding: mobile ? '20px' : '28px',
      borderRadius: '20px', backdropFilter: 'blur(10px)',
    },
    sectionTitle: {
      margin: '0 0 20px 0', fontSize: mobile ? '17px' : '20px',
      color: '#FFD700', fontWeight: '800',
      display: 'flex', alignItems: 'center', gap: '10px',
      paddingBottom: '12px', borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
    },
    cartItem: {
      display: 'flex', gap: '14px', padding: '14px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      alignItems: 'center',
    },
    cartItemImage: {
      width: mobile ? '60px' : '80px',
      height: mobile ? '60px' : '80px',
      borderRadius: '10px', overflow: 'hidden',
      background: '#1a1a1a', flexShrink: 0,
      border: '1px solid rgba(255, 215, 0, 0.15)',
    },
    cartItemImg: { width: '100%', height: '100%', objectFit: 'cover' },
    cartItemInfo: { flex: 1, minWidth: 0 },
    cartItemName: {
      fontWeight: '700', fontSize: mobile ? '14px' : '15px',
      color: 'white', margin: '0 0 4px 0',
      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    },
    cartItemQty: {
      fontSize: mobile ? '12px' : '13px',
      color: 'rgba(255,255,255,0.5)',
    },
    cartItemPrice: {
      fontWeight: '800', fontSize: mobile ? '15px' : '16px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      whiteSpace: 'nowrap',
    },
    removeButton: {
      padding: mobile ? '8px 12px' : '10px 14px',
      background: 'rgba(244, 67, 54, 0.1)',
      color: '#f44336',
      border: '1px solid rgba(244, 67, 54, 0.3)',
      borderRadius: '8px', cursor: 'pointer',
      fontSize: mobile ? '11px' : '12px', fontWeight: '700',
      transition: 'all 0.2s ease',
      display: 'flex', alignItems: 'center', gap: '4px',
      flexShrink: 0,
    },
    emptyCart: {
      textAlign: 'center', padding: mobile ? '40px 20px' : '60px 40px',
    },
    emptyCartIcon: { fontSize: mobile ? '60px' : '80px', marginBottom: '16px' },
    emptyCartText: {
      fontSize: mobile ? '16px' : '18px',
      color: 'rgba(255,255,255,0.7)', marginBottom: '20px',
    },
    summarySection: {
      background: 'rgba(255, 215, 0, 0.05)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      padding: mobile ? '20px' : '24px',
      borderRadius: '20px', position: 'sticky', top: '100px',
    },
    summaryRow: {
      display: 'flex', justifyContent: 'space-between',
      padding: '8px 0', fontSize: mobile ? '14px' : '15px',
      color: 'rgba(255,255,255,0.75)',
    },
    summaryTotal: {
      display: 'flex', justifyContent: 'space-between',
      padding: '14px 0 0 0', marginTop: '12px',
      borderTop: '1px solid rgba(255, 215, 0, 0.3)',
      fontWeight: '900', fontSize: mobile ? '20px' : '24px',
    },
    formSection: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      padding: mobile ? '20px' : '28px',
      borderRadius: '20px', backdropFilter: 'blur(10px)',
    },
    formTitle: {
      margin: '0 0 20px 0', fontSize: mobile ? '17px' : '20px',
      color: '#FFD700', fontWeight: '800',
      display: 'flex', alignItems: 'center', gap: '10px',
      paddingBottom: '12px', borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
    },
    inputLabel: {
      display: 'block', marginBottom: '6px',
      fontSize: mobile ? '12px' : '13px',
      color: 'rgba(255,255,255,0.7)', fontWeight: '600',
      textTransform: 'uppercase', letterSpacing: '0.5px',
    },
    input: {
      width: '100%', padding: mobile ? '13px 15px' : '15px 18px',
      marginBottom: '16px',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '12px', fontSize: mobile ? '15px' : '16px',
      boxSizing: 'border-box', transition: 'all 0.2s ease',
      fontFamily: 'inherit', background: 'rgba(255, 255, 255, 0.05)',
      color: 'white',
    },
    twoColumnRow: {
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
      gap: mobile ? '0' : '15px',
    },
    hintBox: {
      padding: '12px', background: 'rgba(255, 215, 0, 0.08)',
      border: '1px solid rgba(255, 215, 0, 0.25)',
      borderRadius: '10px', fontSize: mobile ? '12px' : '13px',
      color: '#FFD700', marginBottom: '16px', lineHeight: '1.5',
    },
    paxiNotice: {
      display: 'flex', gap: '12px',
      padding: mobile ? '14px' : '18px',
      background: 'rgba(33, 150, 243, 0.08)',
      border: '1px solid rgba(33, 150, 243, 0.25)',
      borderRadius: '12px', marginBottom: '20px',
      alignItems: 'flex-start',
    },
    paxiIcon: { fontSize: mobile ? '28px' : '36px', flexShrink: 0 },
    paxiTitle: {
      margin: '0 0 4px 0', color: '#2196F3',
      fontSize: mobile ? '14px' : '15px', fontWeight: '700',
    },
    paxiText: {
      margin: 0, fontSize: mobile ? '12px' : '13px',
      color: 'rgba(255,255,255,0.7)', lineHeight: '1.5',
    },
    submitButton: {
      width: '100%', padding: mobile ? '16px' : '18px',
      background: loading ? 'linear-gradient(135deg, #424242, #303030)' : 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: loading ? '#999' : '#000', border: 'none', borderRadius: '14px',
      cursor: loading ? 'not-allowed' : 'pointer',
      fontSize: mobile ? '16px' : '18px', fontWeight: '800',
      transition: 'all 0.2s ease',
      boxShadow: loading ? 'none' : '0 6px 24px rgba(255, 215, 0, 0.4)',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    },
    spinner: {
      width: '20px', height: '20px',
      border: '3px solid rgba(0,0,0,0.3)', borderTop: '3px solid #000',
      borderRadius: '50%', animation: 'spin 1s linear infinite',
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
    modalOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: mobile ? '20px' : '40px',
      animation: 'fadeIn 0.2s ease',
    },
    modal: {
      background: 'rgba(20, 20, 20, 0.95)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '24px', padding: mobile ? '28px 24px' : '40px',
      maxWidth: '500px', width: '100%',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      animation: 'slideUp 0.3s ease',
    },
    modalIcon: {
      fontSize: mobile ? '48px' : '64px',
      marginBottom: '16px', textAlign: 'center',
    },
    modalTitle: {
      fontSize: mobile ? '20px' : '24px',
      fontWeight: '900', color: 'white',
      margin: '0 0 12px 0', textAlign: 'center',
    },
    modalText: {
      fontSize: mobile ? '14px' : '15px',
      color: 'rgba(255,255,255,0.7)',
      lineHeight: '1.6', marginBottom: '24px',
      textAlign: 'center',
    },
    modalButtons: {
      display: 'flex', flexDirection: mobile ? 'column' : 'row',
      gap: '12px',
    },
    modalButtonPrimary: {
      flex: 1, padding: mobile ? '14px' : '16px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#000', border: 'none', borderRadius: '12px',
      cursor: 'pointer', fontSize: mobile ? '14px' : '15px',
      fontWeight: '800', textTransform: 'uppercase',
      letterSpacing: '0.5px', transition: 'all 0.2s ease',
    },
    modalButtonSecondary: {
      flex: 1, padding: mobile ? '14px' : '16px',
      background: 'rgba(244, 67, 54, 0.1)',
      color: '#f44336', border: '2px solid rgba(244, 67, 54, 0.4)',
      borderRadius: '12px', cursor: 'pointer',
      fontSize: mobile ? '14px' : '15px', fontWeight: '700',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      transition: 'all 0.2s ease',
    },
    modalButtonCancel: {
      flex: 1, padding: mobile ? '14px' : '16px',
      background: 'transparent', color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px', cursor: 'pointer',
      fontSize: mobile ? '14px' : '15px', fontWeight: '600',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      transition: 'all 0.2s ease',
    },
    successContainer: {
      maxWidth: '800px', margin: '0 auto',
      padding: mobile ? '20px' : '40px',
    },
    successBox: {
      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(76, 175, 80, 0.05))',
      border: '1px solid rgba(76, 175, 80, 0.3)',
      padding: mobile ? '28px 20px' : '40px',
      borderRadius: '24px', marginBottom: '24px', textAlign: 'center',
    },
    successIcon: { fontSize: mobile ? '56px' : '72px', marginBottom: '12px' },
    successTitle: {
      color: '#4CAF50', margin: '0 0 8px 0',
      fontSize: mobile ? '24px' : '32px', fontWeight: '900',
    },
    successSubtitle: { color: 'rgba(255,255,255,0.7)', margin: 0 },
    orderDetailsBox: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      padding: mobile ? '22px' : '30px',
      borderRadius: '20px', backdropFilter: 'blur(10px)',
      marginBottom: '20px',
    },
    detailRow: {
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '12px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      flexWrap: 'wrap', gap: '8px',
    },
    addressBox: {
      background: 'rgba(33, 150, 243, 0.08)',
      padding: mobile ? '14px' : '18px',
      borderRadius: '12px', marginTop: '16px',
      border: '1px solid rgba(33, 150, 243, 0.25)',
    },
    addressGrid: {
      display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
      gap: '8px', marginTop: '10px', fontSize: mobile ? '12px' : '13px',
    },
    actionButtons: {
      display: 'flex', flexDirection: mobile ? 'column' : 'row',
      gap: '12px', marginTop: '24px',
    },
    primaryButton: {
      flex: 1, padding: mobile ? '14px' : '16px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#000', border: 'none', borderRadius: '14px',
      cursor: 'pointer', fontSize: mobile ? '15px' : '16px',
      fontWeight: '800', textTransform: 'uppercase',
      textDecoration: 'none', textAlign: 'center',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    },
    secondaryButton: {
      flex: 1, padding: mobile ? '14px' : '16px',
      background: 'transparent', color: 'white',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '14px', cursor: 'pointer',
      fontSize: mobile ? '14px' : '15px', fontWeight: '700',
      textTransform: 'uppercase', textDecoration: 'none',
      textAlign: 'center', display: 'flex',
      alignItems: 'center', justifyContent: 'center', gap: '8px',
    },
  });

  const styles = getStyles();

  // Order Success Screen
  if (orderPlaced) {
    const addressParts = orderPlaced.address.split(',').map(p => p.trim());
    return (
      <div style={styles.page}>
        <style>{`
          @keyframes slideIn { from { transform: ${mobile ? 'translateX(50%) translateY(-20px)' : 'translateX(100%)'}; opacity: 0; } to { transform: ${mobile ? 'translateX(50%) translateY(0)' : 'translateX(0)'}; opacity: 1; } }
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
          
          button:hover { transform: translateY(-2px); filter: brightness(1.08); }
        `}</style>

        {toast && (
          <div style={{ ...styles.toast, backgroundColor: '#4CAF50' }}>{toast.message}</div>
        )}

        <nav style={styles.nav}>
          <Link to="/" style={styles.logo}>
            <span style={styles.logoIcon}>⚡</span>
            <h1 style={styles.logoText}>FASTLANE</h1>
          </Link>
          <LanguageSelector /> {/* 🆕 Language selector */}
        </nav>

        <div style={styles.successContainer}>
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✅</div>
            <h2 style={styles.successTitle}>{t('checkout.success')}</h2>
            <p style={styles.successSubtitle}>{t('checkout.thankYou')}</p>
          </div>

          <div style={styles.orderDetailsBox}>
            <h3 style={{ ...styles.sectionTitle, fontSize: mobile ? '17px' : '20px' }}>
              📋 {t('checkout.orderDetails')}
            </h3>
            {[
                [t('checkout.orderNumber'), orderPlaced.orderNumber, true],
                [t('checkout.time'), new Date(orderPlaced.createdAt).toLocaleString()],
                [t('checkout.name'), `${orderPlaced.buyerName} ${orderPlaced.buyerSurname}`],
                [t('checkout.gender'), orderPlaced.gender || 'Prefer not to say'],
                [t('checkout.phone'), orderPlaced.phoneNumber],
                [t('checkout.language'), orderPlaced.language],
                [t('checkout.status'), orderPlaced.status],
                [t('checkout.total'), `R${orderPlaced.total.toFixed(2)}`],
            ].map(([label, value, isOrderNum]) => (
              <div key={label} style={styles.detailRow}>
                <strong style={{ color: 'rgba(255,255,255,0.6)', fontSize: mobile ? '13px' : '14px' }}>
                  {label}:
                </strong>
                <span style={{
                  color: label === t('checkout.total') ? '#FFD700' : 'white',
                  fontWeight: '700', fontSize: mobile ? '14px' : '15px',
                  padding: label === t('checkout.status') ? '5px 14px' : '0',
                  backgroundColor: label === t('checkout.status') ? getStatusColor(orderPlaced.status) : 'transparent',
                  borderRadius: label === t('checkout.status') ? '12px' : '0',
                  fontFamily: isOrderNum ? 'monospace' : 'inherit',
                }}>
                  {value}
                </span>
              </div>
            ))}

            <div style={styles.addressBox}>
              <strong style={{ color: '#2196F3', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                📍 {t('checkout.deliveryAddress')}
              </strong>
              <div style={styles.addressGrid}>
                <div><span style={{ color: 'rgba(255,255,255,0.6)' }}>{t('checkout.street')}:</span> {addressParts[0] || ''}</div>
                <div><span style={{ color: 'rgba(255,255,255,0.6)' }}>{t('checkout.city')}:</span> {addressParts[1] || ''}</div>
                <div><span style={{ color: 'rgba(255,255,255,0.6)' }}>{t('checkout.province')}:</span> {addressParts[2] || ''}</div>
                <div><span style={{ color: 'rgba(255,255,255,0.6)' }}>{t('checkout.code')}:</span> {addressParts[3] || ''}</div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 215, 0, 0.05)',
            padding: mobile ? '18px' : '24px',
            borderRadius: '16px', marginTop: '20px',
            border: '1px solid rgba(255, 215, 0, 0.2)',
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#FFD700', fontSize: mobile ? '16px' : '18px' }}>
              🚚 {t('checkout.paxiInfo')}
            </h4>
            <p style={{ margin: '0 0 12px 0', fontSize: mobile ? '13px' : '14px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' }}>
              {t('checkout.paxiText')}
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: mobile ? '12px' : '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8' }}>
              <li>{t('checkout.paxiCollect')}</li>
              <li>{t('checkout.paxiId')}</li>
              <li>{t('checkout.paxiSms')}</li>
              <li>{t('checkout.paxiFee')}</li>
            </ul>
          </div>

          <div style={styles.actionButtons}>
            <Link to="/buyer" style={styles.primaryButton}>
              🛍️ {t('checkout.continueShopping')}
            </Link>
            <Link to="/track-orders" style={styles.secondaryButton}>
              📦 {t('checkout.trackOrders')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes slideIn { 
            from { transform: ${mobile ? 'translateX(50%) translateY(-20px)' : 'translateX(100%)'}; opacity: 0; } 
            to { transform: ${mobile ? 'translateX(50%) translateY(0)' : 'translateX(0)'}; opacity: 1; } 
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.3); }
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
        
        input:focus, select:focus {
            outline: none !important;
            border-color: #FFD700 !important;
            background: rgba(255, 215, 0, 0.08) !important;
            box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1) !important;
        }
        
        select option {
            background: #1a1a1a !important;
            color: white !important;
            padding: 14px !important;
            font-weight: 600 !important;
            font-size: 15px !important;
            border-bottom: 1px solid rgba(255, 215, 0, 0.1) !important;
        }
        
        select option:hover {
            background: rgba(255, 215, 0, 0.2) !important;
        }
        
        select option:checked {
            background: linear-gradient(135deg, #FFD700, #FFA500) !important;
            color: #000 !important;
            font-weight: 800 !important;
        }
        
        select::-ms-expand {
            display: none;
        }
        
        select:focus + .custom-select-arrow {
            transform: translateY(-50%) rotate(180deg);
        }
        
        button:hover:not(:disabled) { 
            transform: translateY(-2px); 
            filter: brightness(1.08); 
        }
        
        button:active:not(:disabled) {
            transform: translateY(0);
        }
      `}</style>

      {toast && (
        <div style={{ ...styles.toast, backgroundColor: toast.type === 'error' ? '#f44336' : toast.type === 'warning' ? '#FFA500' : '#4CAF50' }}>
          {toast.message}
        </div>
      )}

      {showCancelConfirm && (
        <div style={styles.modalOverlay} onClick={() => setShowCancelConfirm(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalIcon}>⚠️</div>
            <h3 style={styles.modalTitle}>{t('checkout.cancelTitle')}</h3>
            <p style={styles.modalText}>
              {t('checkout.cancelText')}
            </p>
            <div style={styles.modalButtons}>
              <button onClick={handleConfirmCancel} style={styles.modalButtonPrimary}>
                ✓ {t('checkout.keepCart')}
              </button>
              <button onClick={handleCancelAndClear} style={styles.modalButtonSecondary}>
                🗑️ {t('checkout.clearCart')}
              </button>
              <button onClick={() => setShowCancelConfirm(false)} style={styles.modalButtonCancel}>
                ← {t('checkout.continueCheckout')}
              </button>
            </div>
          </div>
        </div>
      )}

      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <h1 style={styles.logoText}>FASTLANE</h1>
        </Link>
        <div style={styles.navActions}>
          <LanguageSelector /> {/* 🆕 Language selector */}
          <Link to="/buyer" style={styles.navButton}>🛍️ {t('nav.shop')}</Link>
          {cartCount > 0 && (
            <div style={styles.cartBadge}>
              🛒 {cartCount}
            </div>
          )}
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>💳</div>
            <div>
              <h1 style={styles.headerText}>{t('checkout.title')}</h1>
              <p style={styles.headerSubtitle}>{t('checkout.subtitle')}</p>
            </div>
          </div>
          
          {cart.length > 0 && (
            <button onClick={handleCancelCheckout} style={styles.cancelButton}>
              ✕ {t('checkout.cancel')}
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div style={{ ...styles.cartSection, ...styles.emptyCart }}>
            <div style={styles.emptyCartIcon}>🛒</div>
            <p style={styles.emptyCartText}>{t('checkout.emptyCart')}</p>
            <Link to="/buyer" style={{
              ...styles.primaryButton, display: 'inline-flex',
              padding: '14px 32px', maxWidth: '300px',
            }}>
              🛍️ {t('checkout.startShopping')}
            </Link>
          </div>
        ) : (
          <div style={styles.layout}>
            <div>
              <div style={styles.paxiNotice}>
                <div style={styles.paxiIcon}>📦</div>
                <div>
                  <h4 style={styles.paxiTitle}>{t('checkout.paxiInfo')}</h4>
                  <p style={styles.paxiText}>
                    {t('checkout.paxiText')}
                  </p>
                </div>
              </div>

              <div style={styles.formSection}>
                <h3 style={styles.formTitle}><span>👤</span> {t('checkout.personalDetails')}</h3>
                <form onSubmit={handlePlaceOrder}>
                  <label style={styles.inputLabel}>{t('checkout.firstName')}</label>
                  <input type="text" name="buyerName" placeholder="e.g., Thandiwe"
                    value={formData.buyerName} onChange={handleInputChange}
                    required style={styles.input} />
                  
                  <label style={styles.inputLabel}>{t('checkout.surname')}</label>
                  <input type="text" name="buyerSurname" placeholder="e.g., Dlamini"
                    value={formData.buyerSurname} onChange={handleInputChange}
                    required style={styles.input} />
                  
                  <div style={styles.phoneFieldWrapper}>
                    <label style={styles.inputLabel}>
                      <span>{t('checkout.phone')}</span>
                      <span style={styles.required}>*</span>
                    </label>
                    <input 
                      type="tel" 
                      name="phoneNumber" 
                      placeholder="e.g., 0110111101"
                      value={formData.phoneNumber} 
                      onChange={handleInputChange}
                      required 
                      style={styles.input} 
                    />
                    <div style={styles.whatsappHelperNote}>
                      <div style={styles.whatsappHelperIcon}>💬</div>
                      <div style={styles.whatsappHelperContent}>
                        <strong style={styles.whatsappHelperTitle}>{t('checkout.whatsappNote')}</strong>
                        <p style={styles.whatsappHelperText}>
                          {t('checkout.whatsappText')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={styles.genderSection}>
                    <label style={styles.inputLabel}>
                      <span>{t('checkout.gender')}</span>
                      <span style={styles.required}>*</span>
                    </label>
                    <p style={styles.genderHelperText}>
                      {t('checkout.genderNote')}
                    </p>
                    
                    <div style={styles.genderOptions}>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: 'Male' })}
                        style={{
                          ...styles.genderCard,
                          ...(formData.gender === 'Male' ? styles.genderCardActive : {}),
                        }}
                      >
                        <div style={styles.genderCardIcon}>👨</div>
                        <div style={styles.genderCardLabel}>{t('checkout.male')}</div>
                        {formData.gender === 'Male' && <div style={styles.genderCheckmark}>✓</div>}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: 'Female' })}
                        style={{
                          ...styles.genderCard,
                          ...(formData.gender === 'Female' ? styles.genderCardActive : {}),
                        }}
                      >
                        <div style={styles.genderCardIcon}>👩</div>
                        <div style={styles.genderCardLabel}>{t('checkout.female')}</div>
                        {formData.gender === 'Female' && <div style={styles.genderCheckmark}>✓</div>}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: 'Prefer not to say' })}
                        style={{
                          ...styles.genderCard,
                          ...(formData.gender === 'Prefer not to say' ? styles.genderCardActive : {}),
                        }}
                      >
                        <div style={styles.genderCardIcon}>🤫</div>
                        <div style={styles.genderCardLabel}>{t('checkout.preferNot')}</div>
                        {formData.gender === 'Prefer not to say' && <div style={styles.genderCheckmark}>✓</div>}
                      </button>
                    </div>
                    
                    {formData.gender && (
                      <div style={styles.selectedGenderBadge}>
                        👤 {formData.gender}
                      </div>
                    )}
                  </div>

                  <h3 style={{ ...styles.formTitle, marginTop: '28px' }}>
                    <span>📍</span> {t('checkout.deliveryAddress')}
                  </h3>
                  
                  <div style={styles.hintBox}>
                    💡 {t('checkout.addressHint')}
                  </div>

                  <label style={styles.inputLabel}>{t('checkout.street')}</label>
                  <input type="text" name="streetAddress" placeholder="e.g., 123 Main Street"
                    value={formData.streetAddress} onChange={handleInputChange}
                    required style={styles.input} />

                  <div style={styles.twoColumnRow}>
                    <div>
                      <label style={styles.inputLabel}>{t('checkout.city')}</label>
                      <input type="text" name="city" placeholder="e.g., Johannesburg"
                        value={formData.city} onChange={handleInputChange}
                        required style={styles.input} />
                    </div>
                    <div>
                      <label style={styles.inputLabel}>{t('checkout.postalCode')}</label>
                      <input type="text" name="postalCode" placeholder="e.g., 2000"
                        value={formData.postalCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                          setFormData({ ...formData, postalCode: value });
                        }}
                        required maxLength="4" pattern="\d{4}" style={styles.input} />
                    </div>
                  </div>

                  <div style={styles.customSelectWrapper}>
                    <label style={styles.inputLabel}>
                      <span>{t('checkout.province')}</span>
                      <span style={styles.required}>*</span>
                    </label>
                    <div style={styles.customSelectContainer}>
                      <select 
                        name="province" 
                        value={formData.province}
                        onChange={handleInputChange} 
                        required 
                        style={styles.customSelect}
                      >
                        <option value="">{t('checkout.selectProvince')}</option>
                        {SA_PROVINCES.map(prov => (
                          <option key={prov} value={prov}>{prov}</option>
                        ))}
                      </select>
                      <div style={styles.customSelectArrow}>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      {formData.province && (
                        <div style={styles.activeSelectDot} />
                      )}
                    </div>
                    {formData.province && (
                      <div style={styles.selectedValueBadge}>
                        📍 {formData.province}
                      </div>
                    )}
                  </div>

                  <h3 style={{ ...styles.formTitle, marginTop: '28px' }}>
                    <span>🌐</span> {t('checkout.language')}
                  </h3>

                  <div style={styles.customSelectWrapper}>
                    <label style={styles.inputLabel}>
                      <span>{t('checkout.selectLanguage')}</span>
                      <span style={styles.required}>*</span>
                    </label>
                    <div style={styles.customSelectContainer}>
                      <select 
                        name="language" 
                        value={formData.language}
                        onChange={handleInputChange} 
                        required 
                        style={styles.customSelect}
                      >
                        <option value="">🌐 {t('checkout.selectLanguage')}</option>
                        <option value="English">🇬🇧 English</option>
                        <option value="Zulu">🇿🇦 isiZulu (Zulu)</option>
                        <option value="Xhosa">🇿🇦 isiXhosa (Xhosa)</option>
                        <option value="Afrikaans">🇿🇦 Afrikaans</option>
                        <option value="Sepedi">🇿🇦 Sepedi (Northern Sotho)</option>
                        <option value="Setswana">🇿🇦 Setswana (Tswana)</option>
                        <option value="Sesotho">🇿🇦 Sesotho (Southern Sotho)</option>
                        <option value="Tsonga">🇿🇦 Xitsonga (Tsonga)</option>
                        <option value="Swati">🇿🇦 siSwati (Swazi)</option>
                        <option value="Venda">🇿🇦 Tshivenda (Venda)</option>
                        <option value="Ndebele">🇿🇦 isiNdebele (Ndebele)</option>
                      </select>
                      <div style={styles.customSelectArrow}>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      {formData.language && (
                        <div style={styles.activeSelectDot} />
                      )}
                    </div>
                    {formData.language && (
                      <div style={styles.selectedValueBadge}>
                        🌐 {formData.language}
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={loading} style={{ ...styles.submitButton, marginTop: '20px' }}>
                    {loading ? (
                      <><div style={styles.spinner} />{t('checkout.placing')}</>
                    ) : (
                      <>✓ {t('checkout.placeOrder')} - R{totals.total.toFixed(2)}</>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div style={styles.summarySection}>
              <h3 style={styles.sectionTitle}><span>🛒</span> {t('checkout.orderSummary')}</h3>
              
              {cart.map((item, index) => (
                <div key={index} style={styles.cartItem}>
                  <div style={styles.cartItemImage}>
                    {item.image ? (
                      <img src={item.image} alt={item.productName} style={styles.cartItemImg}
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '24px' }}>📦</div>
                    )}
                  </div>
                  <div style={styles.cartItemInfo}>
                    <div style={styles.cartItemName}>{item.productName}</div>
                    <div style={styles.cartItemQty}>Qty: {item.quantity} × R{item.price.toFixed(2)}</div>
                  </div>
                  <div style={styles.cartItemPrice}>
                    R{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.productId, item.productName)}
                    style={styles.removeButton}
                    title={t('checkout.remove')}
                  >
                    ✕
                  </button>
                </div>
              ))}

              <div style={{ marginTop: '20px' }}>
                <div style={styles.summaryRow}>
                  <span>{t('checkout.subtotal')}:</span>
                  <strong>R{totals.subtotal.toFixed(2)}</strong>
                </div>
                <div style={styles.summaryRow}>
                  <span>{t('checkout.deliveryFee')}:</span>
                  <strong>R{totals.deliveryFee.toFixed(2)}</strong>
                </div>
                <div style={styles.summaryTotal}>
                  <span style={{ color: 'white' }}>{t('checkout.total')}:</span>
                  <span style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    R{totals.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;