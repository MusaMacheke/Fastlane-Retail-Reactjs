import React, { useState, useEffect } from 'react';
import { addProduct } from '../services/api';

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

const AddProduct = () => {
  const { width } = useWindowSize();
  const mobile = isMobile(width);
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '',
    category: '', stock: '', images: '',
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'images') {
      const urls = value.split(/[\n,]+/).map(u => u.trim()).filter(u => u.length > 0);
      setPreviewImages(urls);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const imageUrls = formData.images
        .split(/[\n,]+/)
        .map(u => u.trim())
        .filter(u => u.length > 0);
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        images: imageUrls,
        image: imageUrls[0] || '',
      };
      
      await addProduct(productData);
      showToast('✓ Product added successfully!', 'success');
      setFormData({ name: '', description: '', price: '', category: '', stock: '', images: '' });
      setPreviewImages([]);
    } catch (error) {
      console.error('Error adding product:', error);
      showToast('✗ Failed to add product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStyles = () => ({
    container: { 
      maxWidth: '800px', 
      margin: '0 auto', 
      animation: 'fadeIn 0.4s ease',
      color: 'white',
    },
    header: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px', 
      marginBottom: mobile ? '20px' : '28px' 
    },
    headerIcon: {
      fontSize: mobile ? '36px' : '48px',
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      WebkitBackgroundClip: 'text', 
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 4px 12px rgba(255, 215, 0, 0.3))',
    },
    headerText: { 
      margin: 0, 
      fontSize: mobile ? '22px' : '28px', 
      color: 'white', 
      fontWeight: '900',
      letterSpacing: '-0.5px',
    },
    headerSubtitle: { 
      margin: '4px 0 0 0', 
      fontSize: mobile ? '13px' : '14px', 
      color: 'rgba(255,255,255,0.6)',
      lineHeight: '1.5',
    },
    form: {
      background: 'rgba(255, 255, 255, 0.03)', 
      border: '1px solid rgba(255, 215, 0, 0.15)',
      padding: mobile ? '20px' : '32px', 
      borderRadius: '20px', 
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    section: { 
      marginBottom: mobile ? '24px' : '32px' 
    },
    sectionTitle: {
      margin: '0 0 16px 0', 
      fontSize: mobile ? '16px' : '18px', 
      color: '#FFD700',
      fontWeight: '800',
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      paddingBottom: '8px', 
      borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    formGroup: { 
      marginBottom: mobile ? '16px' : '20px' 
    },
    label: { 
      display: 'block', 
      marginBottom: '8px', 
      fontSize: mobile ? '13px' : '14px', 
      fontWeight: '600', 
      color: 'rgba(255,255,255,0.7)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    required: { 
      color: '#FFA500', 
      marginLeft: '2px' 
    },
    input: {
      width: '100%', 
      padding: mobile ? '12px 14px' : '14px 16px',
      border: '1px solid rgba(255, 215, 0, 0.3)', 
      borderRadius: '10px',
      fontSize: mobile ? '15px' : '16px', 
      boxSizing: 'border-box',
      transition: 'all 0.2s ease', 
      fontFamily: 'inherit',
      background: 'rgba(255, 255, 255, 0.05)', 
      color: 'white',
    },
    textarea: {
      width: '100%', 
      padding: mobile ? '12px 14px' : '14px 16px',
      border: '1px solid rgba(255, 215, 0, 0.3)', 
      borderRadius: '10px',
      fontSize: mobile ? '15px' : '16px', 
      minHeight: mobile ? '100px' : '120px',
      boxSizing: 'border-box', 
      transition: 'all 0.2s ease',
      fontFamily: 'inherit', 
      background: 'rgba(255, 255, 255, 0.05)',
      color: 'white', 
      resize: 'vertical',
    },
    twoColumnRow: { 
      display: 'grid', 
      gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', 
      gap: mobile ? '0' : '16px' 
    },
    imagePreviewGrid: {
      display: 'grid', 
      gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
      gap: '10px', 
      marginTop: '12px',
    },
    imagePreviewItem: {
      aspectRatio: '1', 
      borderRadius: '10px', 
      overflow: 'hidden',
      border: '1px solid rgba(255, 215, 0, 0.2)', 
      background: '#1a1a1a',
      transition: 'all 0.3s ease',
    },
    imagePreviewImg: { 
      width: '100%', 
      height: '100%', 
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
    },
    helperText: { 
      fontSize: '12px', 
      color: 'rgba(255,255,255,0.5)', 
      marginTop: '6px', 
      fontStyle: 'italic',
      lineHeight: '1.5',
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
      fontSize: mobile ? '16px' : '18px', 
      fontWeight: '800',
      transition: 'all 0.2s ease',
      boxShadow: loading ? 'none' : '0 6px 24px rgba(255, 215, 0, 0.4)',
      textTransform: 'uppercase', 
      letterSpacing: '0.5px', 
      marginTop: '8px',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: '10px',
    },
    spinner: {
      width: '20px', 
      height: '20px',
      border: '3px solid rgba(0,0,0,0.3)', 
      borderTop: '3px solid #000',
      borderRadius: '50%', 
      animation: 'spin 1s linear infinite',
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
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      animation: 'slideIn 0.3s ease', 
      maxWidth: mobile ? '85%' : '400px',
      backdropFilter: 'blur(10px)',
    },
  });

  const styles = getStyles();

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
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
        input:focus, textarea:focus, select:focus {
          outline: none; 
          border-color: #FFD700 !important;
          background: rgba(255, 215, 0, 0.08) !important;
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }
        button:hover:not(:disabled) { 
          transform: translateY(-2px); 
          filter: brightness(1.08); 
        }
        button:active:not(:disabled) {
          transform: translateY(0);
        }
        .image-preview-item:hover {
          transform: scale(1.05);
          border-color: rgba(255, 215, 0, 0.5) !important;
        }
        .image-preview-item:hover img {
          transform: scale(1.1);
        }
      `}</style>

      {toast && (
        <div style={{ 
          ...styles.toast, 
          backgroundColor: toast.type === 'error' ? '#f44336' : '#4CAF50' 
        }}>
          {toast.message}
        </div>
      )}

      <div style={styles.header}>
        <div style={styles.headerIcon}>➕</div>
        <div>
          <h3 style={styles.headerText}>Add New Product</h3>
          <p style={styles.headerSubtitle}>Fill in the details below to add a product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}><span>📝</span> Basic Information</h4>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Product Name<span style={styles.required}>*</span></label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              required 
              placeholder="e.g., Wireless Bluetooth Headphones" 
              style={styles.input} 
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Description<span style={styles.required}>*</span></label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              required 
              placeholder="Describe your product..." 
              style={styles.textarea} 
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Category<span style={styles.required}>*</span></label>
            <input 
              type="text" 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              required 
              placeholder="e.g., Electronics, Clothing" 
              style={styles.input} 
            />
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}><span>💰</span> Pricing & Inventory</h4>
          <div style={styles.twoColumnRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price (R)<span style={styles.required}>*</span></label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange}
                required 
                min="0" 
                step="0.01" 
                placeholder="0.00" 
                style={styles.input} 
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Stock Quantity<span style={styles.required}>*</span></label>
              <input 
                type="number" 
                name="stock" 
                value={formData.stock} 
                onChange={handleChange}
                required 
                min="0" 
                step="1" 
                placeholder="0" 
                style={styles.input} 
              />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}><span>🖼️</span> Product Images</h4>
          <div style={styles.formGroup}>
            <label style={styles.label}>Image URLs</label>
            <textarea
              name="images"
              value={formData.images}
              onChange={handleChange}
              placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg\nhttps://example.com/image3.jpg"}
              style={{ ...styles.textarea, minHeight: '120px' }}
            />
            <p style={styles.helperText}>
              💡 Enter one image URL per line, or separate with commas. First image will be the primary display.
            </p>
            
            {previewImages.length > 0 && (
              <div style={styles.imagePreviewGrid}>
                {previewImages.map((url, index) => (
                  <div 
                    key={index} 
                    className="image-preview-item"
                    style={styles.imagePreviewItem}
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      style={styles.imagePreviewImg}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#FFD700;font-size:12px;font-weight:700;">❌ Invalid</div>';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button type="submit" disabled={loading} style={styles.submitButton}>
          {loading ? (
            <>
              <div style={styles.spinner} />
              Adding Product...
            </>
          ) : (
            <>
              <span>✓</span>
              Add Product
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;