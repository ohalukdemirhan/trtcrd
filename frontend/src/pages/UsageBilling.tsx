import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    LinearProgress,
    Divider,
    Tabs,
    Tab,
    Alert,
    Chip,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import {
    CheckCircle,
    CreditCard,
    Receipt,
    History,
    ArrowUpward,
    Star,
    StarBorder,
} from '@mui/icons-material';
import { RootState } from '../store';
import { AppDispatch } from '../store';
import {
    fetchCurrentSubscription,
    fetchUsageStats,
    createCheckoutSession,
} from '../store/slices/subscriptionSlice';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`usage-tabpanel-${index}`}
            aria-labelledby={`usage-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

const SUBSCRIPTION_TIERS = [
    {
        name: 'Basic',
        price: '$29',
        features: [
            '50,000 words/month',
            'Basic compliance rules',
            'Email support',
            'API access',
        ],
        recommended: false,
    },
    {
        name: 'Professional',
        price: '$99',
        features: [
            '200,000 words/month',
            'Advanced compliance rules',
            'Priority support',
            'API access',
            'Custom templates',
        ],
        recommended: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        features: [
            'Unlimited words',
            'Custom compliance rules',
            'Dedicated support',
            'API access',
            'Custom templates',
            'SLA guarantee',
        ],
        recommended: false,
    },
];

// Mock invoice data - keeping this since there's no API endpoint for invoices yet
const MOCK_INVOICES = [
    {
        id: 'INV-001',
        date: '2023-02-15',
        amount: '$99.00',
        status: 'Paid',
    },
    {
        id: 'INV-002',
        date: '2023-01-15',
        amount: '$99.00',
        status: 'Paid',
    },
    {
        id: 'INV-003',
        date: '2022-12-15',
        amount: '$29.00',
        status: 'Paid',
    },
];

const UsageBilling: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { subscription, usageStats, checkoutUrl, isLoading, error } = useSelector(
        (state: RootState) => state.subscription
    );
    
    const [tabValue, setTabValue] = useState(0);
    const [selectedTier, setSelectedTier] = useState<string>('');
    const [openDialog, setOpenDialog] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFetchError(null);
                await dispatch(fetchCurrentSubscription()).unwrap();
                await dispatch(fetchUsageStats()).unwrap();
            } catch (err) {
                setFetchError(typeof err === 'string' ? err : 'Failed to load subscription data');
                console.error('Error fetching subscription data:', err);
            }
        };
        
        fetchData();
    }, [dispatch]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleUpgradeClick = (tier: string) => {
        setSelectedTier(tier);
        setOpenDialog(true);
    };

    const handleUpgradeConfirm = async () => {
        await dispatch(createCheckoutSession({ tier: selectedTier, paymentProvider: 'stripe' }));
        setOpenDialog(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Render invoices tab
    const renderInvoicesTab = () => (
        <Box>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6">Billing History</Typography>
                    
                    {/* Mock data indicator */}
                    <Chip 
                        label="Demo Data" 
                        color="secondary" 
                        size="small" 
                        sx={{ 
                            backgroundColor: 'rgba(156, 39, 176, 0.1)', 
                            color: 'secondary.main',
                            fontWeight: 500
                        }} 
                    />
                </Box>
                
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : fetchError ? (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {fetchError}
                    </Alert>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Invoice #</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {MOCK_INVOICES.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell>{invoice.id}</TableCell>
                                        <TableCell>{invoice.date}</TableCell>
                                        <TableCell>{invoice.amount}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={invoice.status}
                                                color="success"
                                                size="small"
                                                sx={{ fontWeight: 500 }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="primary"
                                            >
                                                Download
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Box>
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Usage & Billing
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="usage and billing tabs">
                    <Tab icon={<CreditCard />} label="Subscription" />
                    <Tab icon={<History />} label="Usage History" />
                    <Tab icon={<Receipt />} label="Invoices" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                {/* Current Plan */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Current Plan
                    </Typography>
                    {subscription ? (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h5" color="primary" sx={{ mr: 2 }}>
                                    {subscription.tier.charAt(0).toUpperCase() +
                                        subscription.tier.slice(1)}
                                </Typography>
                                <Chip 
                                    label="Active" 
                                    color="success" 
                                    size="small" 
                                    icon={<CheckCircle />} 
                                />
                            </Box>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Monthly Usage
                                    </Typography>
                                    {usageStats && (
                                        <>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    mb: 1,
                                                }}
                                            >
                                                <Typography variant="body2">
                                                    {usageStats.current_requests} /{' '}
                                                    {usageStats.monthly_limit} requests
                                                </Typography>
                                                <Typography variant="body2">
                                                    {usageStats.usage_percentage}%
                                                </Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={usageStats.usage_percentage}
                                                sx={{ height: 8, borderRadius: 4 }}
                                            />
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Remaining: {usageStats.monthly_limit - usageStats.current_requests} requests
                                            </Typography>
                                        </>
                                    )}
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Billing Details
                                    </Typography>
                                    <Stack spacing={1}>
                                        <Typography variant="body2">
                                            Next billing date: March 15, 2023
                                        </Typography>
                                        <Typography variant="body2">
                                            Payment method: •••• 4242
                                        </Typography>
                                    </Stack>
                                    <Button 
                                        variant="outlined" 
                                        size="small" 
                                        sx={{ mt: 2 }}
                                    >
                                        Update Payment Method
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    ) : isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Typography variant="body1" color="text.secondary">
                            No active subscription found.
                        </Typography>
                    )}
                </Paper>

                {/* Available Plans */}
                <Typography variant="h6" gutterBottom>
                    Available Plans
                </Typography>
                <Grid container spacing={3}>
                    {SUBSCRIPTION_TIERS.map((tier) => (
                        <Grid item xs={12} md={4} key={tier.name}>
                            <Card 
                                sx={{ 
                                    position: 'relative',
                                    border: tier.recommended ? '2px solid' : 'none',
                                    borderColor: 'primary.main',
                                }}
                            >
                                {tier.recommended && (
                                    <Box 
                                        sx={{ 
                                            position: 'absolute', 
                                            top: 10, 
                                            right: 10,
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: 'primary.main',
                                        }}
                                    >
                                        <Star fontSize="small" sx={{ mr: 0.5 }} />
                                        <Typography variant="caption" fontWeight="bold">
                                            RECOMMENDED
                                        </Typography>
                                    </Box>
                                )}
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        {tier.name}
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        color="primary"
                                        gutterBottom
                                        sx={{ mb: 2 }}
                                    >
                                        {tier.price}
                                        {tier.price !== 'Custom' && (
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                /month
                                            </Typography>
                                        )}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    {tier.features.map((feature) => (
                                        <Typography
                                            key={feature}
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ py: 0.5 }}
                                        >
                                            ✓ {feature}
                                        </Typography>
                                    ))}
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                    <Button
                                        variant={tier.recommended ? "contained" : "outlined"}
                                        color="primary"
                                        onClick={() => handleUpgradeClick(tier.name.toLowerCase())}
                                        disabled={
                                            isLoading ||
                                            subscription?.tier.toLowerCase() ===
                                                tier.name.toLowerCase()
                                        }
                                        startIcon={tier.recommended ? <ArrowUpward /> : undefined}
                                    >
                                        {subscription?.tier.toLowerCase() ===
                                        tier.name.toLowerCase()
                                            ? 'Current Plan'
                                            : tier.name === 'Enterprise'
                                            ? 'Contact Sales'
                                            : 'Upgrade'}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Monthly Usage History
                    </Typography>
                    
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            Usage history chart will be displayed here
                        </Typography>
                    </Box>
                </Paper>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                {renderInvoicesTab()}
            </TabPanel>

            {/* Upgrade Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Subscription Change</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to upgrade to the {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} plan? 
                        Your card will be charged immediately and the new plan will be active right away.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
                    <Button 
                        onClick={handleUpgradeConfirm} 
                        color="primary" 
                        variant="contained"
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Confirm Upgrade'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsageBilling; 