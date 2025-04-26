import { createTheme, Theme, Components, ThemeOptions } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }
}

// Common theme settings
const themeSettings: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 500,
    },
  },
};

// Common component overrides
const getCommonComponents = (mode: 'light' | 'dark'): Components<Theme> => ({
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: '8px',
        fontWeight: 500,
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
      },
    },
  },
});

// Light theme base
const lightThemeBase = createTheme({
  ...themeSettings,
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed',
      light: '#a78bfa',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    neutral: {
      main: '#64748b',
      light: '#94a3b8',
      dark: '#475569',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
});

// Light theme with components
export const lightTheme = createTheme(lightThemeBase, {
  components: {
    ...getCommonComponents('light'),
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: lightThemeBase.palette.background.paper,
          borderBottom: `1px solid ${lightThemeBase.palette.divider}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: lightThemeBase.palette.background.paper,
          borderRight: `1px solid ${lightThemeBase.palette.divider}`,
        },
      },
    },
  },
});

// Dark theme base
const darkThemeBase = createTheme({
  ...themeSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa',
      light: '#93c5fd',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#a78bfa',
      light: '#c4b5fd',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    neutral: {
      main: '#94a3b8',
      light: '#cbd5e1',
      dark: '#64748b',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
});

// Dark theme with components
export const darkTheme = createTheme(darkThemeBase, {
  components: {
    ...getCommonComponents('dark'),
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: darkThemeBase.palette.background.paper,
          borderBottom: `1px solid ${darkThemeBase.palette.divider}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: darkThemeBase.palette.background.paper,
          borderRight: `1px solid ${darkThemeBase.palette.divider}`,
        },
      },
    },
  },
}); 