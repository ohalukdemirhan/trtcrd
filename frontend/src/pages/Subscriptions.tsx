import React from 'react';
import { Typography, Paper, Box, Button } from '@mui/material';

const Subscriptions: React.FC = () => {
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Subscription Management
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Your Plans
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            View and manage your subscription plans here.
          </Typography>
        </Box>
        <Button variant="contained">Upgrade Plan</Button>
      </Paper>
    </Box>
  );
};

export default Subscriptions; 