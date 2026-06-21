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
    bgRgb: '14, 16, 21',
    cardRgb: '22, 24, 34',
    borderRgb: '38, 41, 54',
    inputRgb: '29, 32, 48',
    hoverRgb: '34, 37, 56',
    textPrimaryRgb: '243, 244, 246',
    textSecondaryRgb: '156, 163, 175',
    textMutedRgb: '107, 114, 128',
  },
  light: {
    bgRgb: '249, 250, 251',
    cardRgb: '255, 255, 255',
    borderRgb: '229, 231, 235',
    inputRgb: '243, 244, 246',
    hoverRgb: '240, 240, 245',
    textPrimaryRgb: '17, 24, 39',
    textSecondaryRgb: '75, 85, 99',
    textMutedRgb: '156, 163, 175',
  },
};

function applyVars(theme, mode) {
  const root = document.documentElement;
  const t = THEMES[theme] || THEMES.indigo;
  const m = MODES[mode] || MODES.dark;

  // Accent color variables
  root.style.setProperty('--color-accent-rgb', t.accentRgb);
  root.style.setProperty('--color-accent-hover-rgb', t.accentHoverRgb);

  // Mode RGB variables
  root.style.setProperty('--bg-color-rgb', m.bgRgb);
  root.style.setProperty('--card-color-rgb', m.cardRgb);
  root.style.setProperty('--border-color-rgb', m.borderRgb);
  root.style.setProperty('--input-color-rgb', m.inputRgb);
  root.style.setProperty('--hover-color-rgb', m.hoverRgb);
  root.style.setProperty('--text-primary-rgb', m.textPrimaryRgb);
  root.style.setProperty('--text-secondary-rgb', m.textSecondaryRgb);
  root.style.setProperty('--text-muted-rgb', m.textMutedRgb);
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
