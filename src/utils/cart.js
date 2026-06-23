// Cart utility using localStorage - shared across all routes

const CART_KEY = 'fastlane_cart';

export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
};

export const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Dispatch custom event so other components can update
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

// 🆕 Updated: Now accepts quantity parameter and validates against stock
export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.productId === product._id);
  
  // 🆕 Validate quantity against stock
  if (quantity <= 0) {
    return { success: false, message: 'Invalid quantity' };
  }
  
  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    
    // 🆕 Check if adding would exceed stock
    if (newQuantity > product.stock) {
      const available = product.stock - existingItem.quantity;
      return { 
        success: false, 
        message: available > 0 
          ? `⚠️ Only ${available} more item${available > 1 ? 's' : ''} available. You already have ${existingItem.quantity} in cart.`
          : `⚠️ Stock limit reached. Maximum ${product.stock} item${product.stock > 1 ? 's' : ''} available.`
      };
    }
    
    existingItem.quantity = newQuantity;
  } else {
    // 🆕 Check if requested quantity exceeds stock
    if (quantity > product.stock) {
      return { 
        success: false, 
        message: `⚠️ Only ${product.stock} item${product.stock > 1 ? 's' : ''} available in stock.`
      };
    }
    
    cart.push({
      productId: product._id,
      productName: product.name,
      price: product.price,
      image: product.image || (product.images && product.images[0]) || '',
      quantity: quantity, // 🆕 Use the requested quantity
      stock: product.stock,
    });
  }
  
  saveCart(cart);
  return { 
    success: true, 
    message: quantity > 1 
      ? `✓ Added ${quantity} × ${product.name} to cart`
      : `✓ ${product.name} added to cart`
  };
};

export const removeFromCart = (productId) => {
  const cart = getCart().filter(item => item.productId !== productId);
  saveCart(cart);
  return cart;
};

export const updateCartQuantity = (productId, quantity) => {
  const cart = getCart();
  const item = cart.find(i => i.productId === productId);
  if (item) {
    // 🆕 Validate against stock
    if (quantity > item.stock) {
      return { 
        success: false, 
        message: `⚠️ Only ${item.stock} item${item.stock > 1 ? 's' : ''} available.`
      };
    }
    item.quantity = Math.max(1, quantity);
  }
  saveCart(cart);
  return { success: true, cart };
};

export const clearCart = () => {
  saveCart([]);
};

export const getCartCount = () => {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
};

export const getCartTotal = () => {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return {
    subtotal,
    deliveryFee: cart.length > 0 ? 100 : 0,
    total: subtotal + (cart.length > 0 ? 100 : 0),
  };
};