import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './theme';

interface ThemeContextType {
    toggleColorMode: () => void;
    mode: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextType>({
    toggleColorMode: () => {},
    mode: 'light',
});

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>(() => {
        const savedMode = localStorage.getItem('theme-mode');
        return (savedMode === 'dark' ? 'dark' : 'light');
    });

    useEffect(() => {
        localStorage.setItem('theme-mode', mode);
        document.documentElement.setAttribute('data-theme', mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
            mode,
        }),
        [mode]
    );

    const theme: Theme = useMemo(
        () => (mode === 'light' ? lightTheme : darkTheme),
        [mode]
    );

    return (
        <ThemeContext.Provider value={colorMode}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 