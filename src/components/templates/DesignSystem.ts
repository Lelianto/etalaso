/** 
 * DesignSystem.ts
 * Defines the style tokens and themes for the 100-template factory.
 */

export type ThemeType = 
  | 'minimal' | 'glass' | 'elegant' | 'midnight' | 'emerald' | 'sunset' | 'ocean' | 'candy'
  | 'neobrutalist' | 'retro' | 'industrial' | 'organic' | 'luxury'
  | 'cyberpunk' | 'nordic' | 'playful' | 'business' | 'creative'
  | 'nordic_dark' | 'elegant_dark';

export type LayoutType = 
  | 'standard' | 'split' | 'app' | 'gallery' | 'cards';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
  };
  typography: {
    fontSans: string;
    fontSerif: string;
    fontDisplay: string;
  };
  styles: {
    borderRadius: string;
    shadow: string;
    glass: boolean;
    borderWidth: string;
  };
}

export const THEMES: Record<ThemeType, ThemeConfig> = {
  minimal: {
    id: 'minimal',
    name: 'Pure Minimalist',
    colors: {
      primary: '#000000',
      secondary: '#4b5563',
      accent: '#3b82f6',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      muted: '#6b7280',
      border: '#e5e7eb',
    },
    typography: {
      fontSans: 'Inter, system-ui, sans-serif',
      fontSerif: 'Georgia, serif',
      fontDisplay: 'Inter, sans-serif',
    },
    styles: { borderRadius: '0.375rem', shadow: 'none', glass: false, borderWidth: '1px' },
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Premium',
    colors: {
      primary: '#60a5fa',
      secondary: '#94a3b8',
      accent: '#f59e0b',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      muted: '#6b7280',
      border: '#334155',
    },
    typography: {
      fontSans: 'Outfit, sans-serif',
      fontSerif: 'serif',
      fontDisplay: 'Outfit, sans-serif',
    },
    styles: { borderRadius: '0.75rem', shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)', glass: true, borderWidth: '1px' },
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Forest',
    colors: {
      primary: '#059669',
      secondary: '#6ee7b7',
      accent: '#fbbf24',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#064e3b',
      muted: '#34d399',
      border: '#d1fae5',
    },
    typography: {
      fontSans: 'Inter, sans-serif',
      fontSerif: 'serif',
      fontDisplay: 'Inter, sans-serif',
    },
    styles: { borderRadius: '1rem', shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', glass: false, borderWidth: '1px' },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    colors: {
      primary: '#db2777',
      secondary: '#fb7185',
      accent: '#f59e0b',
      background: '#fff1f2',
      surface: '#ffffff',
      text: '#881337',
      muted: '#fb7185',
      border: '#ffe4e6',
    },
    typography: {
      fontSans: 'Outfit, sans-serif',
      fontSerif: 'serif',
      fontDisplay: 'Outfit, sans-serif',
    },
    styles: { borderRadius: '1.5rem', shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', glass: false, borderWidth: '1px' },
  },
  glass: {
    id: 'glass',
    name: 'Aero Glass',
    colors: {
      primary: '#ffffff',
      secondary: '#e2e8f0',
      accent: '#0ea5e9',
      background: '#f8fafc',
      surface: 'rgba(255, 255, 255, 0.7)',
      text: '#1e293b',
      muted: '#64748b',
      border: 'rgba(255, 255, 255, 0.5)',
    },
    typography: {
      fontSans: 'Inter, sans-serif',
      fontSerif: 'serif',
      fontDisplay: 'Inter, sans-serif',
    },
    styles: { borderRadius: '2rem', shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)', glass: true, borderWidth: '1px' },
  },
  elegant: {
    id: 'elegant',
    name: 'Elegant Classic',
    colors: {
      primary: '#111827',
      secondary: '#4b5563',
      accent: '#c5a059',
      background: '#ffffff',
      surface: '#fafaf9',
      text: '#1c1917',
      muted: '#a8a29e',
      border: '#e7e5e4',
    },
    typography: {
      fontSans: 'Inter, sans-serif',
      fontSerif: 'Playfair Display, serif',
      fontDisplay: 'Playfair Display, serif',
    },
    styles: { borderRadius: '0.125rem', shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', glass: false, borderWidth: '1px' },
  },
  neobrutalist: {
    id: 'neobrutalist',
    name: 'Neo-Brutalist',
    colors: {
      primary: '#000000',
      secondary: '#000000',
      accent: '#facc15',
      background: '#ffffff',
      surface: '#ffffff',
      text: '#000000',
      muted: '#262626',
      border: '#000000',
    },
    typography: {
      fontSans: 'Space Grotesk, sans-serif',
      fontSerif: 'serif',
      fontDisplay: 'Space Grotesk, sans-serif',
    },
    styles: { borderRadius: '0', shadow: '8px 8px 0px 0px #000000', glass: false, borderWidth: '3px' },
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Clean',
    colors: {
      primary: '#2e3440',
      secondary: '#4c566a',
      accent: '#88c0d0',
      background: '#eceff4',
      surface: '#ffffff',
      text: '#2e3440',
      muted: '#4c566a',
      border: '#d8dee9',
    },
    typography: {
      fontSans: 'Inter, sans-serif',
      fontSerif: 'serif',
      fontDisplay: 'Inter, sans-serif',
    },
    styles: { borderRadius: '0px', shadow: 'none', glass: false, borderWidth: '1px' },
  },
  luxury: {
    id: 'luxury',
    name: 'Luxury Gold',
    colors: {
      primary: '#1a1a1a',
      secondary: '#404040',
      accent: '#d4af37',
      background: '#0a0a0a',
      surface: '#121212',
      text: '#ffffff',
      muted: '#a3a3a3',
      border: '#262626',
    },
    typography: {
      fontSans: 'Playfair Display, serif',
      fontSerif: 'Playfair Display, serif',
      fontDisplay: 'Playfair Display, serif',
    },
    styles: { borderRadius: '0px', shadow: 'none', glass: false, borderWidth: '1px' },
  },
  playful: {
    id: 'playful',
    name: 'Candy Playful',
    colors: {
      primary: '#ff6b6b',
      secondary: '#ff9f43',
      accent: '#48dbfb',
      background: '#fef7e5',
      surface: '#ffffff',
      text: '#2d3436',
      muted: '#636e72',
      border: '#fab1a0',
    },
    typography: {
      fontSans: 'Quicksand, sans-serif',
      fontSerif: 'serif',
      fontDisplay: 'Quicksand, sans-serif',
    },
    styles: { borderRadius: '2rem', shadow: '0 10px 0px #fab1a0', glass: false, borderWidth: '2px' },
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Cyber',
    colors: {
      primary: '#f0f',
      secondary: '#0ff',
      accent: '#ff0',
      background: '#000',
      surface: '#111',
      text: '#fff',
      muted: '#444',
      border: '#f0f',
    },
    typography: {
      fontSans: 'JetBrains Mono, monospace',
      fontSerif: 'monospace',
      fontDisplay: 'JetBrains Mono, monospace',
    },
    styles: { borderRadius: '0', shadow: '0 0 10px #f0f', glass: false, borderWidth: '2px' },
  },
  industrial: {
    id: 'industrial',
    name: 'Loft Industrial',
    colors: {
      primary: '#333333',
      secondary: '#555555',
      accent: '#e67e22',
      background: '#f2f2f2',
      surface: '#ffffff',
      text: '#2c3e50',
      muted: '#7f8c8d',
      border: '#bdc3c7',
    },
    typography: {
      fontSans: 'Roboto Condensed, sans-serif',
      fontSerif: 'serif',
      fontDisplay: 'Roboto Condensed, sans-serif',
    },
    styles: { borderRadius: '0', shadow: 'none', glass: false, borderWidth: '2px' },
  },
  organic: {
    id: 'organic',
    name: 'Earth Organic',
    colors: {
      primary: '#5d4037',
      secondary: '#8d6e63',
      accent: '#829e58',
      background: '#fdfbf7',
      surface: '#ffffff',
      text: '#3e2723',
      muted: '#a1887f',
      border: '#d7ccc8',
    },
    typography: {
      fontSans: 'Quicksand, sans-serif',
      fontSerif: 'serif',
      fontDisplay: 'Quicksand, sans-serif',
    },
    styles: { borderRadius: '2rem', shadow: 'none', glass: false, borderWidth: '1px' },
  },
  creative: {
    id: 'creative',
    name: 'Bold Creative',
    colors: {
      primary: '#6c5ce7',
      secondary: '#a29bfe',
      accent: '#ffeaa7',
      background: '#ffffff',
      surface: '#f9f9ff',
      text: '#2d3436',
      muted: '#636e72',
      border: '#dfe6e9',
    },
    typography: {
      fontSans: 'Inter, sans-serif',
      fontSerif: 'serif',
      fontDisplay: 'Inter, sans-serif',
    },
    styles: { borderRadius: '1.2rem', shadow: '10px 10px 0px #a29bfe', glass: false, borderWidth: '2px' },
  },
  business: {
    id: 'business',
    name: 'Trust Business',
    colors: {
      primary: '#0f172a',
      secondary: '#334155',
      accent: '#2563eb',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      muted: '#64748b',
      border: '#e2e8f0',
    },
    typography: {
      fontSans: 'Inter, sans-serif',
      fontSerif: 'serif',
      fontDisplay: 'Inter, sans-serif',
    },
    styles: { borderRadius: '0.5rem', shadow: '0 1px 3px rgba(0,0,0,0.1)', glass: false, borderWidth: '1px' },
  },
  ocean: {
    id: 'ocean',
    name: 'Deep Ocean',
    colors: {
      primary: '#0c4a6e',
      secondary: '#075985',
      accent: '#38bdf8',
      background: '#f0f9ff',
      surface: '#ffffff',
      text: '#0c4a6e',
      muted: '#0ea5e9',
      border: '#bae6fd',
    },
    typography: {
      fontSans: 'Inter, sans-serif',
      fontSerif: 'serif',
      fontDisplay: 'Inter, sans-serif',
    },
    styles: { borderRadius: '1rem', shadow: '0 4px 6px -1px rgba(0,0,0,0.1)', glass: false, borderWidth: '1px' },
  },
  candy: {
    id: 'candy',
    name: 'Sweet Candy',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#fde047',
      background: '#fdf2f8',
      surface: '#ffffff',
      text: '#831843',
      muted: '#f472b6',
      border: '#fbcfe8',
    },
    typography: {
      fontSans: 'Inter, sans-serif',
      fontSerif: 'serif',
      fontDisplay: 'Inter, sans-serif',
    },
    styles: { borderRadius: '2rem', shadow: '0 10px 15px -3px rgba(236, 72, 153, 0.2)', glass: false, borderWidth: '1px' },
  },
  retro: {
    id: 'retro',
    name: '80s Retro',
    colors: {
      primary: '#2d3436',
      secondary: '#636e72',
      accent: '#fdcb6e',
      background: '#fab1a0',
      surface: '#ffeaa7',
      text: '#2d3436',
      muted: '#636e72',
      border: '#d63031',
    },
    typography: {
      fontSans: 'Courier New, monospace',
      fontSerif: 'serif',
      fontDisplay: 'Courier New, monospace',
    },
    styles: { borderRadius: '0', shadow: '5px 5px 0px #d63031', glass: false, borderWidth: '2px' },
  },
  nordic_dark: {
    id: 'nordic',
    name: 'Nordic Dark',
    colors: {
      primary: '#88c0d0',
      secondary: '#81a1c1',
      accent: '#ebcb8b',
      background: '#2e3440',
      surface: '#3b4252',
      text: '#eceff4',
      muted: '#4c566a',
      border: '#434c5e',
    },
    typography: {
      fontSans: 'Inter, sans-serif',
      fontSerif: 'serif',
      fontDisplay: 'Inter, sans-serif',
    },
    styles: { borderRadius: '0', shadow: 'none', glass: false, borderWidth: '1px' },
  },
  elegant_dark: {
    id: 'elegant_dark',
    name: 'Elegant Dark',
    colors: {
      primary: '#ffffff',
      secondary: '#a3a3a3',
      accent: '#c5a059',
      background: '#171717',
      surface: '#262626',
      text: '#ffffff',
      muted: '#737373',
      border: '#404040',
    },
    typography: {
      fontSans: 'Inter, sans-serif',
      fontSerif: 'Playfair Display, serif',
      fontDisplay: 'Playfair Display, serif',
    },
    styles: { borderRadius: '0', shadow: 'none', glass: false, borderWidth: '1px' },
  }
};

export function getTheme(id: ThemeType): ThemeConfig {
  return THEMES[id] || THEMES.minimal;
}
