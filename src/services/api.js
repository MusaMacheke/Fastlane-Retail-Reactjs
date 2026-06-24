import axios from 'axios';

const API_URL = 'https://fastlane-retail-api.onrender.com';

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

// 🆕 Get single product by ID
export const getProduct = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};

export const addProduct = async (product) => {
  const response = await axios.post(`${API_URL}/products`, product);
  return response.data;
};

export const editProduct = async (id, updateData) => {
  const response = await axios.patch(`${API_URL}/products/${id}`, updateData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/products/${id}`);
  return response.data;
};

export const getOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`);
  return response.data;
};

export const createOrder = async (order) => {
  const response = await axios.post(`${API_URL}/orders`, order);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/orders/${id}/status`, { status });
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axios.delete(`${API_URL}/orders/${id}`);
  return response.data;
};

export const trackOrders = async (phoneNumber) => {
  const response = await axios.get(`${API_URL}/orders/track/${phoneNumber}`);
  return response.data;
};

export const getBankDetails = async () => {
  const response = await axios.get(`${API_URL}/config/bank-details`);
  return response.data;
};

// 🆕 Seller authentication
export const sellerLogin = async (sellerId) => {
  const response = await axios.post(`${API_URL}/sellers/login`, { sellerId });
  return response.data;
};

export const getSellerInfo = async (sellerId) => {
  const response = await axios.get(`${API_URL}/sellers/me`, { 
    params: { sellerId } 
  });
  return response.data;
};

export const setupSeller = async (sellerData) => {
  const response = await axios.post(`${API_URL}/sellers/setup`, sellerData);
  return response.data;
};