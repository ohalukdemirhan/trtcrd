import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import TranslateIcon from '@mui/icons-material/Translate';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportIcon from '@mui/icons-material/Support';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url(/images/hero-pattern.svg)',
    opacity: 0.1,
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: theme.shadows[10],
  }
}));

const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
}));

const Landing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <TranslateIcon fontSize="large" color="primary" />,
      title: 'Professional Translation',
      description: 'Get high-quality translations from certified professionals in multiple languages.'
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: 'Secure & Confidential',
      description: 'Your documents are protected with enterprise-grade security and encryption.'
    },
    {
      icon: <SpeedIcon fontSize="large" color="primary" />,
      title: 'Fast Turnaround',
      description: 'Quick delivery without compromising on quality. Get your translations when you need them.'
    },
    {
      icon: <SupportIcon fontSize="large" color="primary" />,
      title: '24/7 Support',
      description: 'Our dedicated support team is always here to help you with any questions.'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to TrtCrd
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your trusted platform for secure and efficient card transactions
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/register"
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={RouterLink}
            to="/login"
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Landing; 