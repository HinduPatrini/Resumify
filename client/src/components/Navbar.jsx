import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar({ title, children }) {
  const { user } = useAuthStore();

  return (
    <header className="w-full bg-dark-card/30 backdrop-blur-md border-b border-dark-border px-8 py-4 items-center justify-between sticky top-0 z-20 hidden md:flex shrink-0">
      {/* Title / Breadcrumb */}
      <div className="flex items-center gap-4">
        {title && (
          <h2 className="text-lg font-heading font-bold text-text-primary tracking-tight">
            {title}
          </h2>
        )}
      </div>

      {/* Right Actions & User Badge */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          {children}
        </div>
        
        {user && (
          <Link 
            to="/account" 
            className="flex items-center gap-3 pl-4 border-l border-dark-border hover:opacity-80 transition-all duration-200 select-none group"
          >
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 text-accent font-heading font-bold text-xs flex items-center justify-center shadow-inner group-hover:border-accent/60 group-hover:bg-accent/30 transition-all">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-sans font-medium text-text-secondary group-hover:text-text-primary transition-colors">
              {user.name}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}
