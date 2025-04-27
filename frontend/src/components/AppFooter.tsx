import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const AppFooter: React.FC = () => (
  <Box sx={{ mt: 8, py: 2, textAlign: 'center', bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} TrtCrd &nbsp;|&nbsp;
      <Link href="https://github.com/halukdemirhan/trtcrd" target="_blank" rel="noopener" color="inherit">
        GitHub
      </Link>
    </Typography>
  </Box>
);

export default AppFooter; 