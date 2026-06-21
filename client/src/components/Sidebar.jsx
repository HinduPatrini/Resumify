import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Account', path: '/account', icon: User },
  ];

  return (
    <>
      {/* Mobile Top Header (only visible when width < 768px) */}
      <header className="md:hidden flex items-center justify-between px-5 py-3 bg-dark-card border-b border-dark-border sticky top-0 z-30 w-full shrink-0">
        <div className="flex items-center gap-2.5">
          <img src="/logo.jpeg" alt="Resumify Logo" className="w-8 h-8 object-cover rounded-lg shadow-sm" />
          <span className="font-heading font-semibold text-text-primary tracking-tight">Resumify</span>
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-dark-hover focus:outline-none transition-colors"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen bg-dark-card border-r border-dark-border z-40 transition-all duration-300 flex flex-col items-center justify-between py-6 shrink-0
          ${isOpen ? 'w-60 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-20'}
          overflow-y-auto overflow-x-hidden
        `}
      >
        <div className="flex flex-col items-center gap-8 w-full">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 w-full px-4">
            <img src="/logo.jpeg" alt="Resumify Logo" className="w-10 h-10 object-cover rounded-xl shrink-0 shadow-md" />
            {isOpen && (
              <span className="font-heading font-bold text-text-primary text-lg tracking-tight whitespace-nowrap">
                Resumify
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 w-full px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-3 py-2.5 rounded-lg font-sans font-medium text-sm transition-all duration-200 w-full group relative
                  ${isActive 
                    ? 'bg-accent/15 text-white border border-accent/20' 
                    : 'text-text-secondary hover:bg-dark-hover hover:text-text-primary border border-transparent'}
                `}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className={`${isOpen ? 'opacity-100 block' : 'opacity-0 hidden md:group-hover:block md:absolute md:left-20 md:bg-dark-card md:px-3 md:py-1.5 md:rounded-md md:border md:border-dark-border md:shadow-xl md:text-xs md:text-text-primary whitespace-nowrap z-50 transition-opacity'}`}>
                  {item.name}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Profile & Logout Bottom */}
        <div className="flex flex-col items-center gap-4 w-full px-3">
          {user && isOpen && (
            <div className="text-center w-full overflow-hidden px-2 mb-1 border-t border-dark-border/40 pt-4">
              <p className="text-xs font-semibold text-text-primary truncate">{user.name}</p>
              <p className="text-[10px] text-text-secondary truncate">{user.email}</p>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-3 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg text-sm transition-all duration-200 w-full group relative border border-transparent hover:border-red-500/10 focus:outline-none"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={`${isOpen ? 'opacity-100 block' : 'opacity-0 hidden md:group-hover:block md:absolute md:left-20 md:bg-dark-card md:px-3 md:py-1.5 md:rounded-md md:border md:border-dark-border md:shadow-xl md:text-xs md:text-red-400 whitespace-nowrap z-50 transition-opacity'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Overlay Backdrop for Mobile Drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 md:hidden z-30 backdrop-blur-sm"
        />
      )}
    </>
  );
}
