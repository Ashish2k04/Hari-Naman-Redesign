import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Mosaic } from 'react-loading-indicators';
import { CartProvider } from './context/CartContext';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Configuration: Custom logo path can be configured here
const LOGO_IMAGE_PATH = '/src/assets/logo.jpg';

function App() {
  const [admin, setAdmin] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if admin is already authenticated via cookies
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (response.ok && data.success && data.admin) {
          setAdmin(data.admin);
        } else {
          setAdmin(null);
        }
      } catch (err) {
        console.warn('Authentication session check offline or failed:', err.message);
        setAdmin(null);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleLoginSuccess = (adminData) => {
    setAdmin(adminData);
  };

  const handleLogoutSuccess = () => {
    setAdmin(null);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-warm-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Mosaic color="#32cd32" size="medium" text="" textColor="" />
          <p className="text-sm font-bold text-gray-500">Checking secure session...</p>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public Customer Landing Page */}
          <Route 
            path="/" 
            element={<LandingPage logoPath={LOGO_IMAGE_PATH} />} 
          />

          {/* Admin Workflow */}
          <Route 
            path="/admin" 
            element={
              admin ? (
                <AdminDashboard admin={admin} onLogout={handleLogoutSuccess} />
              ) : (
                <AdminLogin onLoginSuccess={handleLoginSuccess} />
              )
            } 
          />

          {/* Fallback Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
