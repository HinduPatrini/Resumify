import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import PublicResumeView from './pages/PublicResumeView';
import AccountSettings from './pages/AccountSettings';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { checkAuth, token } = useAuthStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
    if (token) {
      checkAuth();
    }
  }, []);

  return (
    <BrowserRouter>
      {/* Premium Notification Toast System */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--card-color)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: {
              primary: 'rgb(var(--color-accent-rgb))',
              secondary: 'var(--card-color)',
            },
          },
        }}
      />
      <Routes>
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public view (no authentication) */}
        <Route path="/r/:slug" element={<PublicResumeView />} />

        {/* Protected Dashboard & Builder */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder/:id" element={<ResumeBuilder />} />
          <Route path="/account" element={<AccountSettings />} />
        </Route>

        {/* Root Fallback Redirects */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Separate component to reactive-check root routing based on token presence
function HomeRedirect() {
  const { token } = useAuthStore();
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

export default App;
