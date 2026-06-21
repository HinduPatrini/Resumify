import { create } from 'zustand';

const defaultTheme = localStorage.getItem('resumify_theme') || 'indigo';

export const useThemeStore = create((set) => ({
  theme: defaultTheme,
  
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
  
  initTheme: () => {
    const activeTheme = localStorage.getItem('resumify_theme') || 'indigo';
    const root = document.documentElement;
    
    // Clean existing classes
    const classes = Array.from(root.classList);
    classes.forEach(c => {
      if (c.startsWith('theme-')) {
        root.classList.remove(c);
      }
    });
    
    root.classList.add(`theme-${activeTheme}`);
    set({ theme: activeTheme });
  }
}));
