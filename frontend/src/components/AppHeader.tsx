import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const AppHeader: React.FC = () => (
  <AppBar position="static" color="default" elevation={1}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        <Button component={RouterLink} to="/" color="inherit" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
          TrtCrd
        </Button>
      </Typography>
      <Box>
        <Button component={RouterLink} to="/translations" color="inherit">Translations</Button>
        <Button component={RouterLink} to="/compliance" color="inherit">Compliance</Button>
        <Button component={RouterLink} to="/subscriptions" color="inherit">Subscriptions</Button>
        <Button component={RouterLink} to="/dashboard" color="inherit">Dashboard</Button>
      </Box>
    </Toolbar>
  </AppBar>
);

export default AppHeader; 