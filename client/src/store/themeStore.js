import { create } from 'zustand';

// Complete theme palette map — all values written directly as inline CSS variables
const THEMES = {
  indigo: {
    accentRgb: '110, 92, 245',
    accentHoverRgb: '90, 75, 227',
  },
  emerald: {
    accentRgb: '16, 185, 129',
    accentHoverRgb: '5, 150, 105',
  },
  rose: {
    accentRgb: '244, 63, 94',
    accentHoverRgb: '225, 29, 72',
  },
  amber: {
    accentRgb: '245, 158, 11',
    accentHoverRgb: '217, 119, 6',
  },
  cyan: {
    accentRgb: '6, 182, 212',
    accentHoverRgb: '8, 145, 178',
  },
  purple: {
    accentRgb: '168, 85, 247',
    accentHoverRgb: '147, 51, 234',
  },
};

const MODES = {
  dark: {
    bgColor: '#0e1015',
    cardColor: '#161822',
    borderColor: '#262936',
    inputColor: '#1d2030',
    hoverColor: '#222538',
    textPrimary: '#f3f4f6',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
  },
  light: {
    bgColor: '#f9fafb',
    cardColor: '#ffffff',
    borderColor: '#e5e7eb',
    inputColor: '#f3f4f6',
    hoverColor: '#f0f0f5',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    textMuted: '#9ca3af',
  },
};

function applyVars(theme, mode) {
  const root = document.documentElement;
  const t = THEMES[theme] || THEMES.indigo;
  const m = MODES[mode] || MODES.dark;

  // Accent color variables
  root.style.setProperty('--color-accent-rgb', t.accentRgb);
  root.style.setProperty('--color-accent-hover-rgb', t.accentHoverRgb);

  // Mode (background/text/card) variables
  root.style.setProperty('--bg-color', m.bgColor);
  root.style.setProperty('--card-color', m.cardColor);
  root.style.setProperty('--border-color', m.borderColor);
  root.style.setProperty('--input-color', m.inputColor);
  root.style.setProperty('--hover-color', m.hoverColor);
  root.style.setProperty('--text-primary', m.textPrimary);
  root.style.setProperty('--text-secondary', m.textSecondary);
  root.style.setProperty('--text-muted', m.textMuted);
}

const defaultTheme = localStorage.getItem('resumify_theme') || 'indigo';
const defaultMode = localStorage.getItem('resumify_mode') || 'dark';

export const useThemeStore = create((set) => ({
  theme: defaultTheme,
  mode: defaultMode,

  setTheme: (newTheme) => {
    const currentMode = localStorage.getItem('resumify_mode') || 'dark';
    localStorage.setItem('resumify_theme', newTheme);
    applyVars(newTheme, currentMode);
    set({ theme: newTheme });
  },

  setMode: (newMode) => {
    const currentTheme = localStorage.getItem('resumify_theme') || 'indigo';
    localStorage.setItem('resumify_mode', newMode);
    applyVars(currentTheme, newMode);
    set({ mode: newMode });
  },

  initTheme: () => {
    const activeTheme = localStorage.getItem('resumify_theme') || 'indigo';
    const activeMode = localStorage.getItem('resumify_mode') || 'dark';
    applyVars(activeTheme, activeMode);
    set({ theme: activeTheme, mode: activeMode });
  },
}));
