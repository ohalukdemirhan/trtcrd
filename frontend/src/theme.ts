import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Dark blue
    },
    secondary: {
      main: '#2dd4bf', // Light green
    },
    background: {
      default: '#fff',
    },
    success: {
      main: '#2dd4bf', // Light green
    },
  },
  typography: {
    fontFamily: 'Inter, Poppins, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
});

export { theme }; 