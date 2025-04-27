import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFound: React.FC = () => (
  <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
    <Typography variant="h2" color="primary" gutterBottom>
      404
    </Typography>
    <Typography variant="h5" gutterBottom>
      Page Not Found
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
      The page you are looking for does not exist.
    </Typography>
    <Box>
      <Button variant="contained" color="primary" component={RouterLink} to="/">
        Go Home
      </Button>
    </Box>
  </Container>
);

export default NotFound; 