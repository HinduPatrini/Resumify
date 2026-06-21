import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function PrivateRoute() {
  const { token, user, checkAuth, loading } = useAuthStore();

  useEffect(() => {
    // If token exists but user details aren't fetched yet, check session
    if (token && !user) {
      checkAuth();
    }
  }, [token, user, checkAuth]);

  if (loading && token && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary font-sans font-medium text-sm">Resumify is warming up...</p>
        </div>
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
