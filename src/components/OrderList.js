import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, deleteOrder, getBankDetails } from '../services/api';
import { sendWhatsAppToBuyer, getWhatsAppButtonLabel } from '../utils/whatsapp';

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

const OrderList = () => {
  const { width } = useWindowSize();
  const mobile = isMobile(width);
  const tablet = isTablet(width);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bankDetails, setBankDetails] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchBankDetails();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBankDetails = async () => {
    try {
      const details = await getBankDetails();
      setBankDetails(details);
    } catch (error) {
      console.error('Error fetching bank details:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setSaving(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`✓ Order status updated to ${newStatus}`, 'success');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('✗ Failed to update order status', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (orderId, orderNumber) => {
    if (window.confirm(`Are you sure you want to delete order #${orderNumber}?`)) {
      try {
        await deleteOrder(orderId);
        showToast('✓ Order deleted successfully', 'success');
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        showToast('✗ Failed to delete order', 'error');
      }
    }
  };

  const handleWhatsAppNotify = (order) => {
    if (!bankDetails) {
      showToast('⚠ Bank details not loaded. Please refresh the page.', 'warning');
      return;
    }
    sendWhatsAppToBuyer(order, bankDetails);
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

  const getStatusHint = (status) => {
    switch (status) {
      case 'Pending':
        return {
          icon: '⚠️',
          text: 'This order is pending payment. Click "💬 Request Payment" to send banking details to the buyer.',
          bg: 'rgba(255, 165, 0, 0.08)',
          border: 'rgba(255, 165, 0, 0.3)',
          textColor: '#FFA500',
        };
      case 'Processing':
        return {
          icon: '📦',
          text: 'Payment received! Click "💬 Notify: Preparing" to inform the buyer their order is being packaged.',
          bg: 'rgba(33, 150, 243, 0.08)',
          border: 'rgba(33, 150, 243, 0.3)',
          textColor: '#2196F3',
        };
      case 'Shipped':
        return {
          icon: '🚚',
          text: 'Order has been shipped. Consider notifying the buyer with tracking details.',
          bg: 'rgba(156, 39, 176, 0.08)',
          border: 'rgba(156, 39, 176, 0.3)',
          textColor: '#9c27b0',
        };
      case 'Delivered':
        return {
          icon: '✅',
          text: 'Order delivered successfully. A thank-you message would be appreciated!',
          bg: 'rgba(76, 175, 80, 0.08)',
          border: 'rgba(76, 175, 80, 0.3)',
          textColor: '#4CAF50',
        };
      default:
        return null;
    }
  };

  const getWhatsAppButtonColor = (status) => {
    switch (status) {
      case 'Pending': return '#25D366';
      case 'Processing': return '#2196F3';
      case 'Shipped': return '#9c27b0';
      case 'Delivered': return '#4CAF50';
      case 'Cancelled': return '#f44336';
      default: return '#25D366';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.buyerSurname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phoneNumber.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStyles = () => ({
    // ===== CONTAINER =====
    container: {
      animation: 'fadeIn 0.4s ease',
    },
    
    // ===== HEADER =====
    header: {
      display: 'flex',
      flexDirection: mobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: mobile ? 'stretch' : 'center',
      gap: mobile ? '16px' : '0',
      marginBottom: mobile ? '20px' : '28px',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    headerIcon: {
      fontSize: mobile ? '32px' : '40px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    headerText: {
      margin: 0,
      fontSize: mobile ? '20px' : '26px',
      color: 'white',
      fontWeight: '800',
      letterSpacing: '-0.5px',
    },
    headerSubtitle: {
      margin: '4px 0 0 0',
      fontSize: mobile ? '12px' : '13px',
      color: 'rgba(255, 255, 255, 0.6)',
    },
    statsContainer: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    statsBadge: (color) => ({
      padding: mobile ? '8px 14px' : '10px 18px',
      background: `linear-gradient(135deg, ${color}, ${color}dd)`,
      color: color === '#FFD700' || color === '#FFA500' ? '#000' : 'white',
      borderRadius: '20px',
      fontSize: mobile ? '12px' : '13px',
      fontWeight: '800',
      boxShadow: `0 4px 16px ${color}40`,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    }),
    
    // ===== FILTERS CONTAINER (NEW ENHANCED) =====
    filtersContainer: {
      marginBottom: mobile ? '20px' : '28px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      borderRadius: '16px',
      padding: mobile ? '16px' : '20px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    },
    filterHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: mobile ? '14px' : '18px',
      paddingBottom: mobile ? '12px' : '14px',
      borderBottom: '1px solid rgba(255, 215, 0, 0.15)',
    },
    filterHeaderLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    filterHeaderIcon: {
      fontSize: mobile ? '20px' : '24px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    filterHeaderText: {
      margin: 0,
      fontSize: mobile ? '15px' : '17px',
      color: 'white',
      fontWeight: '800',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    filterCount: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '6px',
      padding: mobile ? '6px 12px' : '8px 16px',
      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1))',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '20px',
    },
    filterCountNumber: {
      fontSize: mobile ? '16px' : '18px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    filterCountLabel: {
      fontSize: mobile ? '11px' : '12px',
      color: 'rgba(255, 255, 255, 0.7)',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    filterControls: {
      display: 'flex',
      flexDirection: mobile ? 'column' : 'row',
      gap: mobile ? '12px' : '14px',
      alignItems: mobile ? 'stretch' : 'flex-end',
    },
    
    // ===== SEARCH BOX =====
    searchBox: {
      position: 'relative',
      flex: 1,
    },
    searchIconWrapper: {
      position: 'absolute',
      left: mobile ? '14px' : '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: mobile ? '32px' : '36px',
      height: mobile ? '32px' : '36px',
      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1))',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
      border: '1px solid rgba(255, 215, 0, 0.2)',
    },
    searchIcon: {
      fontSize: mobile ? '14px' : '16px',
    },
    searchInput: {
      width: '100%',
      padding: mobile ? '14px 40px 14px 56px' : '16px 44px 16px 64px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '12px',
      fontSize: mobile ? '14px' : '15px',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease',
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'white',
      fontFamily: 'inherit',
    },
    clearSearchButton: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '28px',
      height: '28px',
      background: 'rgba(244, 67, 54, 0.15)',
      border: '1px solid rgba(244, 67, 54, 0.3)',
      borderRadius: '50%',
      color: '#f44336',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: '700',
      transition: 'all 0.2s ease',
    },
    
    // ===== FILTER SELECT =====
    filterSelectWrapper: {
      minWidth: mobile ? '100%' : '240px',
    },
    filterSelectLabel: {
      fontSize: mobile ? '11px' : '12px',
      color: 'rgba(255, 255, 255, 0.6)',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '6px',
      paddingLeft: '4px',
    },
    customSelectContainer: {
      position: 'relative',
    },
    filterSelect: {
      width: '100%',
      padding: mobile ? '14px 44px 14px 16px' : '16px 48px 16px 18px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '12px',
      fontSize: mobile ? '14px' : '15px',
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
    },
    customSelectArrow: {
      position: 'absolute',
      right: mobile ? '14px' : '18px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#FFD700',
      pointerEvents: 'none',
      transition: 'transform 0.2s ease',
    },
    activeFilterDot: {
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
    
    // ===== RESET BUTTON =====
    resetButton: {
      padding: mobile ? '14px 18px' : '16px 20px',
      background: 'rgba(244, 67, 54, 0.1)',
      color: '#f44336',
      border: '1px solid rgba(244, 67, 54, 0.3)',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: mobile ? '13px' : '14px',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      whiteSpace: 'nowrap',
    },
    
    // ===== ORDERS LIST =====
    ordersList: {
      display: 'flex',
      flexDirection: 'column',
      gap: mobile ? '16px' : '20px',
    },
    orderCard: {
      border: '1px solid rgba(255, 215, 0, 0.15)',
      borderRadius: '16px',
      padding: mobile ? '16px' : '24px',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
    },
    orderHeader: {
      display: 'flex',
      flexDirection: mobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: mobile ? 'flex-start' : 'center',
      gap: mobile ? '12px' : '0',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
    },
    orderNumber: {
      margin: 0,
      fontSize: mobile ? '16px' : '18px',
      fontWeight: '700',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    orderDate: {
      margin: '6px 0 0 0',
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: mobile ? '12px' : '13px',
    },
    statusBadge: (status) => ({
      padding: '6px 16px',
      borderRadius: '20px',
      color: 'white',
      fontWeight: '700',
      fontSize: mobile ? '12px' : '14px',
      backgroundColor: getStatusColor(status),
      boxShadow: `0 2px 8px ${getStatusColor(status)}40`,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    }),
    
    // ===== CUSTOMER INFO =====
    customerInfo: {
      display: 'grid',
      gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
      gap: '12px',
      marginBottom: '16px',
      padding: mobile ? '12px' : '16px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 215, 0, 0.1)',
    },
    infoItem: {
      fontSize: mobile ? '13px' : '14px',
      color: 'white',
    },
    infoLabel: {
      color: 'rgba(255, 255, 255, 0.5)',
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
    
    // ===== ADDRESS SECTION =====
    addressSection: {
      padding: mobile ? '12px' : '16px',
      background: 'rgba(33, 150, 243, 0.08)',
      border: '1px solid rgba(33, 150, 243, 0.25)',
      borderRadius: '12px',
      marginBottom: '16px',
    },
    addressTitle: {
      fontWeight: '700',
      color: '#2196F3',
      marginBottom: '8px',
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
    
    // ===== ITEMS SECTION =====
    itemsSection: {
      marginBottom: '16px',
    },
    itemsTitle: {
      margin: '0 0 10px 0',
      fontSize: mobile ? '14px' : '15px',
      fontWeight: '700',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    itemsList: {
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '10px',
      padding: mobile ? '10px' : '12px',
      border: '1px solid rgba(255, 215, 0, 0.1)',
    },
    item: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: mobile ? '8px 0' : '10px 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      fontSize: mobile ? '13px' : '14px',
    },
    itemLast: {
      borderBottom: 'none',
    },
    itemName: {
      fontWeight: '600',
      color: 'white',
    },
    itemPrice: {
      fontWeight: '800',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    
    // ===== TOTALS SECTION =====
    totalsSection: {
      background: 'rgba(255, 215, 0, 0.05)',
      padding: mobile ? '12px' : '16px',
      borderRadius: '12px',
      marginBottom: '16px',
      border: '1px solid rgba(255, 215, 0, 0.2)',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '4px 0',
      fontSize: mobile ? '13px' : '14px',
      color: 'rgba(255, 255, 255, 0.75)',
    },
    totalFinal: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0 0 0',
      marginTop: '8px',
      borderTop: '1px solid rgba(255, 215, 0, 0.3)',
      fontWeight: '900',
      fontSize: mobile ? '16px' : '18px',
    },
    
    // ===== ACTIONS =====
    actions: {
      display: 'flex',
      flexDirection: mobile ? 'column' : 'row',
      gap: '10px',
      marginBottom: '12px',
    },
    select: {
      flex: mobile ? 'none' : 1,
      padding: mobile ? '12px' : '10px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '10px',
      fontSize: mobile ? '14px' : '14px',
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'white',
      cursor: 'pointer',
      fontWeight: '600',
    },
    whatsappButton: (status) => ({
      flex: mobile ? 'none' : 1,
      padding: mobile ? '12px' : '10px 15px',
      background: `linear-gradient(135deg, ${getWhatsAppButtonColor(status)}, ${getWhatsAppButtonColor(status)}dd)`,
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '700',
      fontSize: mobile ? '14px' : '14px',
      transition: 'all 0.2s ease',
      boxShadow: `0 4px 12px ${getWhatsAppButtonColor(status)}40`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }),
    deleteButton: {
      flex: mobile ? 'none' : 'none',
      padding: mobile ? '12px' : '10px 15px',
      background: 'rgba(244, 67, 54, 0.1)',
      color: '#f44336',
      border: '1px solid rgba(244, 67, 54, 0.3)',
      borderRadius: '10px',
      cursor: 'pointer',
      fontWeight: '700',
      fontSize: mobile ? '14px' : '14px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    // ===== STATUS HINT =====
    statusHint: (hint) => ({
      marginTop: '12px',
      padding: mobile ? '12px' : '14px',
      border: '1px solid',
      borderRadius: '10px',
      fontSize: mobile ? '12px' : '13px',
      lineHeight: '1.5',
      backgroundColor: hint.bg,
      borderColor: hint.border,
      color: hint.textColor,
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
    }),
    
    // ===== TOAST =====
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
    
    // ===== EMPTY STATE =====
    emptyState: {
      textAlign: 'center',
      padding: mobile ? '40px 20px' : '60px 40px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
    },
    emptyIcon: {
      fontSize: mobile ? '60px' : '80px',
      marginBottom: '16px',
    },
    emptyText: {
      fontSize: mobile ? '16px' : '18px',
      color: 'white',
      margin: '0 0 8px 0',
      fontWeight: '700',
    },
    emptySubtext: {
      fontSize: mobile ? '13px' : '14px',
      color: 'rgba(255, 255, 255, 0.6)',
      margin: 0,
    },
  });

  const styles = getStyles();

  const LoadingSkeleton = () => (
    <div>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          ...styles.orderCard,
          animation: 'pulse 1.5s infinite',
        }}>
          <div style={{ height: '24px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '4px', marginBottom: '12px', width: '40%' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ height: '60px', background: 'rgba(255, 215, 0, 0.05)', borderRadius: '8px' }} />
            <div style={{ height: '60px', background: 'rgba(255, 215, 0, 0.05)', borderRadius: '8px' }} />
          </div>
          <div style={{ height: '80px', background: 'rgba(255, 215, 0, 0.05)', borderRadius: '8px', marginBottom: '16px' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, height: '44px', background: 'rgba(255, 215, 0, 0.08)', borderRadius: '8px' }} />
            <div style={{ flex: 1, height: '44px', background: 'rgba(255, 215, 0, 0.08)', borderRadius: '8px' }} />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>📋</div>
            <div>
              <h3 style={styles.headerText}>Manage Orders</h3>
              <p style={styles.headerSubtitle}>Loading your orders...</p>
            </div>
          </div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
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
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        input:focus, select:focus {
          outline: none;
          border-color: #FFD700 !important;
          background: rgba(255, 215, 0, 0.08) !important;
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }
        /* Custom select dropdown styling */
        select option {
          background: #1a1a1a;
          color: white;
          padding: 12px;
          font-weight: 600;
        }
        select option:hover {
          background: rgba(255, 215, 0, 0.2);
        }
        select option:checked {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          font-weight: 800;
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
        <div style={{
          ...styles.toast,
          backgroundColor: toast.type === 'error' ? '#f44336' : toast.type === 'warning' ? '#FFA500' : '#4CAF50',
        }}>
          {toast.message}
        </div>
      )}

      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>📋</div>
          <div>
            <h3 style={styles.headerText}>Manage Orders</h3>
            <p style={styles.headerSubtitle}>View, process, and manage customer orders</p>
          </div>
        </div>
        <div style={styles.statsContainer}>
          <div style={styles.statsBadge('#FFA500')}>
            <span>⏳</span>
            {orders.filter(o => o.status === 'Pending').length} Pending
          </div>
          <div style={styles.statsBadge('#FFD700')}>
            <span>✓</span>
            {orders.length} Total
          </div>
          {/* 🆕 Gender Analytics */}
          <div style={styles.statsBadge('#25D366')}>
            <span>👩</span>
            {orders.filter(o => o.gender === 'Female').length} Female
          </div>
          <div style={styles.statsBadge('#2196F3')}>
            <span>👨</span>
            {orders.filter(o => o.gender === 'Male').length} Male
          </div>
        </div>
      </div>

      {orders.length > 0 && (
        <div style={styles.filtersContainer}>
          {/* Filter Section Header */}
          <div style={styles.filterHeader}>
            <div style={styles.filterHeaderLeft}>
              <span style={styles.filterHeaderIcon}>🎯</span>
              <h4 style={styles.filterHeaderText}>Filter & Search</h4>
            </div>
            <div style={styles.filterCount}>
              <span style={styles.filterCountNumber}>{filteredOrders.length}</span>
              <span style={styles.filterCountLabel}>
                {filteredOrders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>
          </div>

          {/* Filter Controls */}
          <div style={styles.filterControls}>
            {/* Search Box */}
            <div style={styles.searchBox}>
              <div style={styles.searchIconWrapper}>
                <span style={styles.searchIcon}>🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search by order number, name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={styles.clearSearchButton}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Filter - Custom Styled Select */}
            <div style={styles.filterSelectWrapper}>
              <div style={styles.filterSelectLabel}>
                <span>Status</span>
              </div>
              <div style={styles.customSelectContainer}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="all">📊 All Status</option>
                  <option value="Pending">⏳ Pending</option>
                  <option value="Processing">📦 Processing</option>
                  <option value="Shipped">🚚 Shipped</option>
                  <option value="Delivered">✅ Delivered</option>
                  <option value="Cancelled">❌ Cancelled</option>
                </select>
                <div style={styles.customSelectArrow}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path 
                      d="M1 1L6 6L11 1" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                {/* Active Status Indicator */}
                {statusFilter !== 'all' && (
                  <div style={styles.activeFilterDot} />
                )}
              </div>
            </div>

            {/* Reset Filters Button (only shows when filters are active) */}
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                style={styles.resetButton}
                title="Reset all filters"
              >
                <span>↺</span>
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            {orders.length === 0 ? '📭' : '🔍'}
          </div>
          <p style={styles.emptyText}>
            {orders.length === 0 ? 'No orders yet' : 'No orders found'}
          </p>
          <p style={styles.emptySubtext}>
            {orders.length === 0 
              ? 'Orders will appear here when customers place them' 
              : 'Try adjusting your search or filter'}
          </p>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {filteredOrders.map(order => {
            const hint = getStatusHint(order.status);
            const parsedAddress = order.address.split(',').map(p => p.trim());
            
            return (
              <div key={order._id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div>
                    <h4 style={styles.orderNumber}>
                      <span>{getStatusIcon(order.status)}</span>
                      Order #{order.orderNumber}
                    </h4>
                    <p style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span style={styles.statusBadge(order.status)}>
                    {order.status}
                  </span>
                </div>

                <div style={styles.customerInfo}>
                  <div style={styles.infoItem}>
                    <div style={styles.infoLabel}>Customer Name</div>
                    <div style={styles.infoValue}>{order.buyerName} {order.buyerSurname}</div>
                  </div>
                  {/* 🆕 Gender Display */}
                  <div style={styles.infoItem}>
                    <div style={styles.infoLabel}>Gender</div>
                    <div style={styles.infoValue}>
                      {order.gender === 'Male' && '👨 '}
                      {order.gender === 'Female' && '👩 '}
                      {order.gender === 'Prefer not to say' && '🤫 '}
                      {order.gender || 'Prefer not to say'}
                    </div>
                  </div>
                  <div style={styles.infoItem}>
                    <div style={styles.infoLabel}>Phone Number</div>
                    <div style={styles.infoValue}>{order.phoneNumber}</div>
                  </div>
                  <div style={styles.infoItem}>
                    <div style={styles.infoLabel}>Language</div>
                    <div style={styles.infoValue}>{order.language}</div>
                  </div>
                </div>

                <div style={styles.addressSection}>
                  <div style={styles.addressTitle}>
                    <span>📍</span>
                    Delivery Address (PEP Store via PAXI)
                  </div>
                  <div style={styles.addressGrid}>
                    <div><span style={styles.addressLabel}>Street:</span> {parsedAddress[0] || ''}</div>
                    <div><span style={styles.addressLabel}>City:</span> {parsedAddress[1] || ''}</div>
                    <div><span style={styles.addressLabel}>Province:</span> {parsedAddress[2] || ''}</div>
                    <div><span style={styles.addressLabel}>Code:</span> {parsedAddress[3] || ''}</div>
                  </div>
                </div>

                <div style={styles.itemsSection}>
                  <h5 style={styles.itemsTitle}>
                    <span>📦</span>
                    Items ({order.items.length})
                  </h5>
                  <div style={styles.itemsList}>
                    {order.items.map((item, index) => (
                      <div key={index} style={{
                        ...styles.item,
                        ...(index === order.items.length - 1 ? styles.itemLast : {}),
                      }}>
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
                    <span>Subtotal:</span>
                    <span>R{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div style={styles.totalRow}>
                    <span>Delivery Fee (PAXI):</span>
                    <span>R{order.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div style={styles.totalFinal}>
                    <span style={{ color: 'white' }}>Total:</span>
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

                <div style={styles.actions}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={saving}
                    style={styles.select}
                  >
                    <option value="Pending">⏳ Pending</option>
                    <option value="Processing">📦 Processing</option>
                    <option value="Shipped">🚚 Shipped</option>
                    <option value="Delivered">✅ Delivered</option>
                    <option value="Cancelled">❌ Cancelled</option>
                  </select>

                  <button
                    onClick={() => handleWhatsAppNotify(order)}
                    style={styles.whatsappButton(order.status)}
                    title={`Send ${order.status.toLowerCase()} notification to buyer`}
                  >
                    <span>💬</span>
                    {getWhatsAppButtonLabel(order.status)}
                  </button>

                  <button
                    onClick={() => handleDelete(order._id, order.orderNumber)}
                    style={styles.deleteButton}
                  >
                    <span>🗑️</span>
                    Delete
                  </button>
                </div>

                {hint && (
                  <div style={styles.statusHint(hint)}>
                    <span style={{ fontSize: '16px' }}>{hint.icon}</span>
                    <span>{hint.text}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderList;