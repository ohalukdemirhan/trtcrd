import React, { useEffect, useState } from 'react';
import { Typography, Grid, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Card, CardContent, Button, Divider, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Translation, Subscription } from '../../types';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardFooter from '../../components/DashboardFooter';
import TranslateIcon from '@mui/icons-material/Translate';
import GavelIcon from '@mui/icons-material/Gavel';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Activity Card Component
const ActivityCard = ({ icon, title, description, linkTo, buttonText }: any) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box display="flex" alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6" ml={1}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
    <CardContent>
      <Button 
        size="small" 
        component={RouterLink} 
        to={linkTo} 
        variant="contained" 
        fullWidth
      >
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);

// Stats Card Component
const StatsCard = ({ title, value, icon, color }: any) => (
  <Paper sx={{ p: 2 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" component="div" fontWeight="bold">
          {value}
        </Typography>
      </Box>
      <Box 
        sx={{ 
          bgcolor: `${color}.light`, 
          color: `${color}.main`,
          p: 1.5,
          borderRadius: 2
        }}
      >
        {icon}
      </Box>
    </Box>
  </Paper>
);

// Subscription Status Component
const SubscriptionStatus = ({ plan, expiryDate, usagePercent, isLoading, error }: any) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Subscription Status</Typography>
        <Chip 
          label={plan} 
          color={
            plan === 'Free' ? 'default' : 
            plan === 'Basic' ? 'primary' : 
            plan === 'Pro' ? 'secondary' : 'success'
          } 
        />
      </Box>
      
      {isLoading ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress size={40} />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Expiry: {expiryDate || 'N/A'}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Usage</Typography>
              <Typography variant="body2">{usagePercent}%</Typography>
            </Box>
            <Box 
              sx={{ 
                mt: 1, 
                height: 10, 
                bgcolor: 'grey.200', 
                borderRadius: 5,
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  height: '100%', 
                  width: `${usagePercent}%`, 
                  bgcolor: usagePercent > 90 ? 'error.main' : usagePercent > 70 ? 'warning.main' : 'success.main',
                  transition: 'width 0.5s ease'
                }} 
              />
            </Box>
          </Box>
          
          <Button 
            fullWidth 
            component={RouterLink} 
            to="/subscriptions" 
            sx={{ mt: 2 }}
            variant="outlined"
          >
            Manage Subscription
          </Button>
        </>
      )}
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [translationsRes, subscriptionRes] = await Promise.all([
          apiService.listTranslations(0, 5),
          apiService.getCurrentSubscription(),
        ]);
        setTranslations(translationsRes);
        setSubscription(subscriptionRes);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <DashboardHeader />
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.full_name || 'User'}!
        </Typography>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Translations</Typography>
                <Typography variant="body2" color="text.secondary">
                  {translations.length} recent translation{translations.length !== 1 ? 's' : ''}.
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }} fullWidth onClick={() => navigate('/translations')}>
                  Go to Translations
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Compliance</Typography>
                <Typography variant="body2" color="text.secondary">
                  Check your documents for GDPR/KVKK compliance.
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }} fullWidth onClick={() => navigate('/compliance')}>
                  Go to Compliance
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Subscriptions</Typography>
                <Typography variant="body2" color="text.secondary">
                  {subscription ? `Tier: ${subscription.tier}` : 'No subscription info.'}
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }} fullWidth onClick={() => navigate('/subscriptions')}>
                  Go to Subscriptions
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {/* Subscription Status */}
            <Grid item xs={12} md={4}>
              <SubscriptionStatus 
                plan={subscription?.tier || 'Basic'}
                expiryDate={subscription?.expiryDate || '2025-05-27'}
                usagePercent={subscription?.usagePercent || 45}
                isLoading={loading}
                error={error}
              />
            </Grid>
            {/* Last Translations */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Last Translations</Typography>
                {translations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No translations found.</Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Source</TableCell>
                          <TableCell>Target</TableCell>
                          <TableCell>Text</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {translations.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell>{t.created_at ? new Date(t.created_at).toLocaleString() : '-'}</TableCell>
                            <TableCell>{t.source_lang}</TableCell>
                            <TableCell>{t.target_lang}</TableCell>
                            <TableCell>{t.source_text.slice(0, 40)}...</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Grid>
            {/* Last Compliance Checks (TODO) */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom>Last Compliance Checks</Typography>
                <Typography variant="body2" color="text.secondary">TODO: Implement compliance checks listing when API is available.</Typography>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/compliance')}>
                  Go to Compliance
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
      <DashboardFooter />
    </>
  );
};

export default Dashboard; 