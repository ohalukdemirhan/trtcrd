import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

const DashboardHeader: React.FC = () => (
  <AppBar position="static" color="primary" elevation={1}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        TrtCrd Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome back!
      </Typography>
    </Toolbar>
  </AppBar>
);

export default DashboardHeader; 