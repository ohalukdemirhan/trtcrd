import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const PrivacyPolicy: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is a placeholder for the GDPR-compliant privacy policy.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy; 