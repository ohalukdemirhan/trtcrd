import React from 'react';
import { Box, Typography } from '@mui/material';

const DashboardFooter: React.FC = () => (
  <Box sx={{ mt: 6, py: 2, textAlign: 'center', bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} TrtCrd Dashboard
    </Typography>
  </Box>
);

export default DashboardFooter; 