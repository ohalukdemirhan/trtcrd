import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted', { email, password });
    try {
      await login(email, password);
      console.log('Login function called');
    } catch (err) {
      console.error('Error in login component:', err);
    }
  };

  // Direct login attempt on first render - for testing
  useEffect(() => {
    const directLogin = async () => {
      try {
        console.log('Attempting direct login');
        await login(email, password);
      } catch (err) {
        console.error('Error in direct login:', err);
      }
    };
    // Uncomment to auto-login (for testing only)
    // directLogin();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          
          {/* Debug button to test API connection directly */}
          <Button 
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{ mt: 1 }}
            onClick={() => {
              fetch('http://localhost:8000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                  username: 'admin@example.com',
                  password: 'admin123',
                }),
              })
              .then(res => res.json())
              .then(data => {
                console.log('API response:', data);
                alert('API test: ' + (data.access_token ? 'Success!' : 'Failed!'));
              })
              .catch(err => {
                console.error('API test error:', err);
                alert('API test error: ' + err.message);
              });
            }}
          >
            Test API Directly
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 