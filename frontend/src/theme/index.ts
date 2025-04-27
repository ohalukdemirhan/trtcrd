import { createTheme, Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        neutral: Palette['primary'];
    }
    interface PaletteOptions {
        neutral: PaletteOptions['primary'];
    }
}

const baseTheme = {
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.57,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                    variants: [],
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow:
                        '0px 2px 4px -1px rgba(0,0,0,0.1), 0px 4px 5px 0px rgba(0,0,0,0.07), 0px 1px 10px 0px rgba(0,0,0,0.06)',
                },
            },
        },
    },
};

export const lightTheme: Theme = createTheme({
    ...baseTheme,
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
        error: {
            main: '#dc2626',
            light: '#ef4444',
            dark: '#b91c1c',
        },
        warning: {
            main: '#d97706',
            light: '#f59e0b',
            dark: '#b45309',
        },
        info: {
            main: '#0ea5e9',
            light: '#38bdf8',
            dark: '#0284c7',
        },
        success: {
            main: '#059669',
            light: '#10b981',
            dark: '#047857',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
        divider: '#e2e8f0',
    },
});

export const darkTheme: Theme = createTheme({
    ...baseTheme,
    palette: {
        mode: 'dark',
        primary: {
            main: '#60a5fa',
            light: '#93c5fd',
            dark: '#3b82f6',
            contrastText: '#1e293b',
        },
        secondary: {
            main: '#a78bfa',
            light: '#c4b5fd',
            dark: '#8b5cf6',
            contrastText: '#1e293b',
        },
        neutral: {
            main: '#94a3b8',
            light: '#cbd5e1',
            dark: '#64748b',
            contrastText: '#1e293b',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
        },
        info: {
            main: '#38bdf8',
            light: '#7dd3fc',
            dark: '#0ea5e9',
        },
        success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
        },
        background: {
            default: '#0f172a',
            paper: '#1e293b',
        },
        text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
        },
        divider: '#334155',
    },
});

export const theme = createTheme({
    palette: {
        primary: {
            main: '#2563eb',
            light: '#60a5fa',
            dark: '#1d4ed8',
        },
        secondary: {
            main: '#7c3aed',
            light: '#a78bfa',
            dark: '#5b21b6',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
    },
}); 