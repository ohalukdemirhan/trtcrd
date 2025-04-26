import React from 'react';
import { Box, Container } from '@mui/material';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const DRAWER_WIDTH = 240;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ height: 64 }} /> {/* Toolbar spacer */}
        <Container
          maxWidth="lg"
          sx={{
            py: 3,
            px: { xs: 2, sm: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 