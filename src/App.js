import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Home from './components/Home';
import SellerLogin from './components/SellerLogin';
import BuyerPage from './components/BuyerPage';
import ProductDetails from './components/ProductDetails';
import Checkout from './components/Checkout';
import SellerDashboard from './components/SellerDashboard';
import TrackOrders from './components/TrackOrders';

// 🆕 Session Management Hook - FIXED: Less aggressive, only on refresh/timeout
const useSessionManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run on seller dashboard
    if (location.pathname !== '/seller-dashboard') {
      return;
    }

    const sellerId = localStorage.getItem('sellerId');
    const sessionTimestamp = localStorage.getItem('sellerSessionTimestamp');

    // Check if authenticated
    if (!sellerId) {
      console.log('🔒 Access denied: No seller ID found');
      navigate('/seller-login', { replace: true });
      return;
    }

    // Check session validity (30-minute timeout)
    if (sessionTimestamp) {
      const sessionAge = Date.now() - parseInt(sessionTimestamp);
      const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
      
      if (sessionAge > SESSION_TIMEOUT) {
        console.log('⏰ Session expired');
        endSession();
        navigate('/seller-login', { replace: true });
        return;
      }
    }

    // Set session timestamp if not exists
    if (!sessionTimestamp) {
      localStorage.setItem('sellerSessionTimestamp', Date.now().toString());
    }

    // 🆕 FIXED: Only detect ACTUAL page refresh, not client-side navigation
    const handleBeforeUnload = () => {
      console.log('🔄 Page refresh detected - ending session');
      endSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // 🆕 FIXED: Cleanup only removes event listener, does NOT end session
    return () => {
      console.log('🧹 Cleaning up session listener');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location, navigate]);

  const endSession = () => {
    localStorage.removeItem('sellerId');
    localStorage.removeItem('sellerName');
    localStorage.removeItem('sellerEmail');
    localStorage.removeItem('sellerSessionTimestamp');
    console.log('🔐 Session ended');
  };

  return { endSession };
};

// 🆕 Protected Route Component - Simple authentication check
const ProtectedRoute = ({ children }) => {
  const sellerId = localStorage.getItem('sellerId');
  
  // ✅ Simple check: If no sellerId, redirect to login
  if (!sellerId) {
    console.log('🔒 Protected route: No seller ID, redirecting to login');
    return <Navigate to="/seller-login" replace />;
  }

  return children;
};

// 🆕 Seller Dashboard Wrapper with Session Management
const SellerDashboardWrapper = () => {
  useSessionManagement();
  return <SellerDashboard />;
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
          <Routes>
            {/* Public Routes - No Security */}
            <Route path="/" element={<Home />} />
            <Route path="/seller-login" element={<SellerLogin />} />
            <Route path="/buyer" element={<BuyerPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track-orders" element={<TrackOrders />} />
            
            {/* Protected Route - Seller Dashboard Only */}
            <Route
              path="/seller-dashboard"
              element={
                <ProtectedRoute>
                  <SellerDashboardWrapper />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all route for invalid paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;