import React from 'react';
import { Container, Typography, Paper, Grid, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">Users</Typography>
            <Typography variant="body2">Manage all users</Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={() => navigate('/admin/users')}>Manage Users</Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">Compliance Submissions</Typography>
            <Typography variant="body2">Manage compliance checks</Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={() => navigate('/admin/compliance')}>Manage Compliance</Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">Translations</Typography>
            <Typography variant="body2">Manage translation requests</Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={() => navigate('/admin/translations')}>Manage Translations</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 