import React from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';

const AdminTranslations: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin: Translations Requests
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6">Translations Requests List</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          List, review, and manage translation requests here.
        </Typography>
        <Button variant="contained">Add Translation Request</Button>
      </Paper>
    </Container>
  );
};

export default AdminTranslations; 