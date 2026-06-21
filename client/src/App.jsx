import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import PublicResumeView from './pages/PublicResumeView';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { checkAuth, token } = useAuthStore();

  useEffect(() => {
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
            background: '#161822',
            color: '#f3f4f6',
            border: '1px solid #262936',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#6e5cf5',
              secondary: '#161822',
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
