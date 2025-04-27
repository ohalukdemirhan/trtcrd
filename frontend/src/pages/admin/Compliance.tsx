import React from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';

const AdminCompliance: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin: Compliance Requests
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6">Compliance Requests List</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          List, review, and manage compliance requests here.
        </Typography>
        <Button variant="contained">Add Compliance Request</Button>
      </Paper>
    </Container>
  );
};

export default AdminCompliance; 