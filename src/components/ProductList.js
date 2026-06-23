import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct, editProduct } from '../services/api';

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

const ProductList = () => {
  const { width } = useWindowSize();
  const mobile = isMobile(width);
  const tablet = isTablet(width);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ price: '', stock: '' });
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await deleteProduct(id);
        showToast('✓ Product deleted successfully', 'success');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        showToast('✗ Failed to delete product', 'error');
      }
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      price: product.price,
      stock: product.stock,
    });
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setEditForm({ price: '', stock: '' });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await editProduct(editingProduct._id, {
        price: parseFloat(editForm.price),
        stock: parseInt(editForm.stock),
      });
      showToast('✓ Product updated successfully', 'success');
      closeEditModal();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      showToast(error.response?.data?.message || '✗ Failed to update product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: '#f44336', bg: 'rgba(244, 67, 54, 0.15)', label: 'Out of Stock', icon: '🚫' };
    if (stock < 5) return { color: '#FFA500', bg: 'rgba(255, 165, 0, 0.15)', label: 'Low Stock', icon: '⚠️' };
    return { color: '#4CAF50', bg: 'rgba(76, 175, 80, 0.15)', label: 'In Stock', icon: '✓' };
  };

  const getStyles = () => ({
    container: {
      animation: 'fadeIn 0.4s ease',
    },
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
    statsBadge: {
      padding: mobile ? '8px 14px' : '10px 18px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#000',
      borderRadius: '20px',
      fontSize: mobile ? '13px' : '14px',
      fontWeight: '800',
      boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    searchBox: {
      position: 'relative',
      marginBottom: mobile ? '16px' : '20px',
    },
    searchInput: {
      width: '100%',
      padding: mobile ? '12px 14px 12px 44px' : '14px 16px 14px 48px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '12px',
      fontSize: mobile ? '15px' : '16px',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease',
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'white',
    },
    searchIcon: {
      position: 'absolute',
      left: mobile ? '14px' : '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: mobile ? '18px' : '20px',
      color: 'rgba(255, 215, 0, 0.5)',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
    },
    th: {
      backgroundColor: 'rgba(255, 215, 0, 0.08)',
      color: '#FFD700',
      padding: mobile ? '12px' : '16px',
      textAlign: 'left',
      fontWeight: '700',
      fontSize: mobile ? '12px' : '13px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '2px solid rgba(255, 215, 0, 0.2)',
    },
    td: {
      padding: mobile ? '12px' : '16px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      fontSize: mobile ? '13px' : '14px',
      color: 'white',
    },
    tableRow: {
      transition: 'all 0.2s ease',
    },
    productCard: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      borderRadius: '16px',
      padding: mobile ? '16px' : '20px',
      marginBottom: '16px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
      gap: '12px',
    },
    cardTitle: {
      margin: 0,
      fontSize: mobile ? '16px' : '18px',
      fontWeight: '700',
      color: 'white',
      flex: 1,
    },
    cardCategory: {
      display: 'inline-block',
      padding: '4px 10px',
      background: 'rgba(255, 215, 0, 0.1)',
      color: '#FFD700',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '700',
      marginTop: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    cardDetails: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '16px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '10px',
      border: '1px solid rgba(255, 215, 0, 0.1)',
    },
    cardDetailItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    cardDetailLabel: {
      fontSize: '11px',
      color: 'rgba(255, 255, 255, 0.5)',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    cardDetailValue: {
      fontSize: mobile ? '15px' : '16px',
      fontWeight: '700',
      color: 'white',
    },
    cardActions: {
      display: 'flex',
      gap: '10px',
    },
    editButton: {
      flex: 1,
      padding: mobile ? '10px' : '12px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#000',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: mobile ? '13px' : '14px',
      fontWeight: '800',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    deleteButton: {
      flex: 1,
      padding: mobile ? '10px' : '12px',
      background: 'rgba(244, 67, 54, 0.1)',
      color: '#f44336',
      border: '1px solid rgba(244, 67, 54, 0.3)',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: mobile ? '13px' : '14px',
      fontWeight: '700',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    stockBadge: (stock) => {
      const status = getStockStatus(stock);
      return {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        backgroundColor: status.bg,
        color: status.color,
        borderRadius: '20px',
        fontSize: mobile ? '12px' : '13px',
        fontWeight: '700',
        border: `1px solid ${status.color}40`,
      };
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: mobile ? '16px' : '20px',
      animation: 'fadeIn 0.2s ease',
    },
    modal: {
      backgroundColor: 'rgba(20, 20, 20, 0.95)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '20px',
      width: '100%',
      maxWidth: '500px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      overflow: 'hidden',
      animation: 'slideUp 0.3s ease',
    },
    modalHeader: {
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      padding: mobile ? '20px' : '24px',
      color: '#000',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalTitle: {
      margin: 0,
      fontSize: mobile ? '20px' : '22px',
      fontWeight: '900',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    closeButton: {
      background: 'rgba(0, 0, 0, 0.2)',
      border: 'none',
      color: '#000',
      fontSize: '24px',
      cursor: 'pointer',
      lineHeight: '1',
      padding: '4px 10px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      fontWeight: '700',
    },
    modalBody: {
      padding: mobile ? '20px' : '28px',
    },
    productInfo: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 215, 0, 0.2)',
      padding: mobile ? '14px' : '18px',
      borderRadius: '12px',
      marginBottom: '20px',
    },
    productName: {
      fontSize: mobile ? '16px' : '18px',
      fontWeight: '700',
      color: 'white',
      margin: '0 0 6px 0',
    },
    productCategory: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: mobile ? '13px' : '14px',
      margin: 0,
    },
    formGroup: {
      marginBottom: mobile ? '16px' : '20px',
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
    input: {
      width: '100%',
      padding: mobile ? '12px 14px' : '14px 16px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '10px',
      fontSize: mobile ? '15px' : '16px',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease',
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'white',
    },
    modalActions: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
    },
    cancelButton: {
      flex: 1,
      padding: mobile ? '12px' : '14px',
      backgroundColor: 'transparent',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: mobile ? '14px' : '15px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    saveButton: {
      flex: 1,
      padding: mobile ? '12px' : '14px',
      background: saving 
        ? 'linear-gradient(135deg, #424242, #303030)'
        : 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: saving ? '#999' : '#000',
      border: 'none',
      borderRadius: '10px',
      cursor: saving ? 'not-allowed' : 'pointer',
      fontSize: mobile ? '14px' : '15px',
      fontWeight: '800',
      transition: 'all 0.2s ease',
      boxShadow: saving ? 'none' : '0 4px 16px rgba(255, 215, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
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
    spinner: {
      width: '18px',
      height: '18px',
      border: '3px solid rgba(0, 0, 0, 0.3)',
      borderTop: '3px solid #000',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  });

  const styles = getStyles();

  const LoadingSkeleton = () => (
    <div>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          ...styles.productCard,
          animation: 'pulse 1.5s infinite',
        }}>
          <div style={{ height: '20px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '4px', marginBottom: '12px', width: '60%' }} />
          <div style={{ height: '14px', background: 'rgba(255, 215, 0, 0.08)', borderRadius: '4px', marginBottom: '8px', width: '40%' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
            <div style={{ height: '60px', background: 'rgba(255, 215, 0, 0.05)', borderRadius: '8px' }} />
            <div style={{ height: '60px', background: 'rgba(255, 215, 0, 0.05)', borderRadius: '8px' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <div style={{ flex: 1, height: '40px', background: 'rgba(255, 215, 0, 0.08)', borderRadius: '8px' }} />
            <div style={{ flex: 1, height: '40px', background: 'rgba(255, 215, 0, 0.08)', borderRadius: '8px' }} />
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
            <div style={styles.headerIcon}>📦</div>
            <div>
              <h3 style={styles.headerText}>Manage Products</h3>
              <p style={styles.headerSubtitle}>Loading your product inventory...</p>
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
        tr:hover {
          background: rgba(255, 215, 0, 0.05);
        }
      `}</style>

      {toast && (
        <div style={{
          ...styles.toast,
          backgroundColor: toast.type === 'error' ? '#f44336' : '#4CAF50',
        }}>
          {toast.message}
        </div>
      )}

      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>📦</div>
          <div>
            <h3 style={styles.headerText}>Manage Products</h3>
            <p style={styles.headerSubtitle}>View, edit, and manage your product inventory</p>
          </div>
        </div>
        <div style={styles.statsBadge}>
          <span>📊</span>
          {products.length} {products.length === 1 ? 'Product' : 'Products'}
        </div>
      </div>

      {products.length > 0 && (
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            {products.length === 0 ? '📭' : '🔍'}
          </div>
          <p style={styles.emptyText}>
            {products.length === 0 ? 'No products yet' : 'No products found'}
          </p>
          <p style={styles.emptySubtext}>
            {products.length === 0 
              ? 'Start by adding your first product' 
              : 'Try a different search term'}
          </p>
        </div>
      ) : mobile ? (
        <div>
          {filteredProducts.map(product => {
            const stockStatus = getStockStatus(product.stock);
            return (
              <div key={product._id} style={styles.productCard}>
                <div style={styles.cardHeader}>
                  <div style={{ flex: 1 }}>
                    <h4 style={styles.cardTitle}>{product.name}</h4>
                    <span style={styles.cardCategory}>{product.category}</span>
                  </div>
                  <div style={styles.stockBadge(product.stock)}>
                    <span>{stockStatus.icon}</span>
                    <span>{product.stock}</span>
                  </div>
                </div>

                <div style={styles.cardDetails}>
                  <div style={styles.cardDetailItem}>
                    <span style={styles.cardDetailLabel}>Price</span>
                    <span style={{ 
                      ...styles.cardDetailValue,
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      R{product.price.toFixed(2)}
                    </span>
                  </div>
                  <div style={styles.cardDetailItem}>
                    <span style={styles.cardDetailLabel}>Status</span>
                    <span style={{ ...styles.cardDetailValue, color: stockStatus.color, fontSize: '13px' }}>
                      {stockStatus.label}
                    </span>
                  </div>
                </div>

                <div style={styles.cardActions}>
                  <button
                    onClick={() => openEditModal(product)}
                    style={styles.editButton}
                  >
                    <span>✏️</span>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id, product.name)}
                    style={styles.deleteButton}
                  >
                    <span>🗑️</span>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Product Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <tr key={product._id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: '600', color: 'white' }}>{product.name}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.cardCategory}>
                      {product.category}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ 
                      fontWeight: '800',
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      R{product.price.toFixed(2)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.stockBadge(product.stock)}>
                      <span>{stockStatus.icon}</span>
                      <span>{product.stock}</span>
                      <span style={{ fontSize: '11px', opacity: 0.9 }}>
                        {stockStatus.label}
                      </span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(product)}
                        style={{
                          ...styles.editButton,
                          flex: 'none',
                          padding: '8px 14px',
                          fontSize: '13px',
                        }}
                      >
                        <span>✏️</span>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        style={{
                          ...styles.deleteButton,
                          flex: 'none',
                          padding: '8px 14px',
                          fontSize: '13px',
                        }}
                      >
                        <span>🗑️</span>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {editingProduct && (
        <div style={styles.modalOverlay} onClick={closeEditModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <span>✏️</span>
                Edit Product
              </h3>
              <button 
                onClick={closeEditModal} 
                style={styles.closeButton}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)'}
              >
                ×
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.productInfo}>
                <p style={styles.productName}>{editingProduct.name}</p>
                <p style={styles.productCategory}>Category: {editingProduct.category}</p>
              </div>
              
              <form onSubmit={handleEditSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price (R) *</label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={editForm.stock}
                    onChange={handleEditChange}
                    required
                    min="0"
                    step="1"
                    placeholder="0"
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.modalActions}>
                  <button 
                    type="button" 
                    onClick={closeEditModal} 
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving}
                    style={styles.saveButton}
                  >
                    {saving ? (
                      <>
                        <div style={styles.spinner} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <span>✓</span>
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;