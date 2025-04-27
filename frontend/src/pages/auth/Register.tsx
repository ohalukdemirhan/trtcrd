import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { useAuth } from '../../contexts/AuthContext';
import { Container as MuiContainer, Box, Typography, TextField, CircularProgress, Button as MuiButton } from '@mui/material';

// Import icons as images to avoid JSX issues
const GoogleIcon = () => (
  <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" width={20} height={20} />
);

const MicrosoftIcon = () => (
  <img src="https://cdn-icons-png.flaticon.com/512/732/732221.png" alt="Microsoft" width={18} height={18} />
);

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    await register({ email, password, full_name: fullName, company_name: companyName });
    if (!error) {
      navigate('/login');
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulate social login
    setTimeout(() => {
      console.log(`Logging in with ${provider}`);
      setIsLoading(false);
      // In a real app, this would redirect to OAuth flow
    }, 1000);
  };

  return (
    <MuiContainer component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        {(error || localError) && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {localError || error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullName"
            label="Full Name"
            name="fullName"
            autoComplete="name"
            autoFocus
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            fullWidth
            name="companyName"
            label="Company Name (Optional)"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={loading}
          />
          <MuiButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </MuiButton>
        </Box>
      </Box>
    </MuiContainer>
  );
};

export default Register; 