import { create } from 'zustand';

const defaultTheme = localStorage.getItem('resumify_theme') || 'indigo';
const defaultMode = localStorage.getItem('resumify_mode') || 'dark';

export const useThemeStore = create((set) => ({
  theme: defaultTheme,
  mode: defaultMode,
  
  setTheme: (newTheme) => {
    localStorage.setItem('resumify_theme', newTheme);
    
    // Apply theme class to document root
    const root = document.documentElement;
    
    // Remove all previous theme- classes
    const classes = Array.from(root.classList);
    classes.forEach(c => {
      if (c.startsWith('theme-')) {
        root.classList.remove(c);
      }
    });
    
    // Add new theme class
    root.classList.add(`theme-${newTheme}`);
    
    set({ theme: newTheme });
  },
  
  setMode: (newMode) => {
    localStorage.setItem('resumify_mode', newMode);
    
    const root = document.documentElement;
    if (newMode === 'light') {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }
    
    set({ mode: newMode });
  },
  
  initTheme: () => {
    const activeTheme = localStorage.getItem('resumify_theme') || 'indigo';
    const activeMode = localStorage.getItem('resumify_mode') || 'dark';
    const root = document.documentElement;
    
    // Clean theme classes
    const classes = Array.from(root.classList);
    classes.forEach(c => {
      if (c.startsWith('theme-')) {
        root.classList.remove(c);
      }
    });
    root.classList.add(`theme-${activeTheme}`);
    
    // Set light mode class
    if (activeMode === 'light') {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }
    
    set({ theme: activeTheme, mode: activeMode });
  }
}));
