import React from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';

const AdminUsers: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin: Users Management
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6">Users List</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          List, create, update, and delete users here.
        </Typography>
        <Button variant="contained">Add User</Button>
      </Paper>
    </Container>
  );
};

export default AdminUsers; 