import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Terms: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is a placeholder for the Terms of Service.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Terms; 