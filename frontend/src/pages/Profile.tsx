import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Avatar,
    Divider,
} from '@mui/material';
import { RootState } from '../store';
import { AppDispatch } from '../store';
import { User } from '../types';

const Profile: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user) as User;

    const [formData, setFormData] = useState({
        fullName: user?.full_name || '',
        email: user?.email || '',
        companyName: user?.company_name || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement profile update
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Profile Settings
            </Typography>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Profile Picture */}
                    <Grid item xs={12} display="flex" justifyContent="center">
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                fontSize: '2.5rem',
                                mb: 2,
                            }}
                        >
                            {user?.full_name?.[0]?.toUpperCase() || user?.email[0]?.toUpperCase()}
                        </Avatar>
                    </Grid>

                    {/* User Information */}
                    <Grid item xs={12}>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        type="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Company Name"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Paper>

            {/* Account Information */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Account Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                            Account Type
                        </Typography>
                        <Typography variant="body1">
                            {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                            Member Since
                        </Typography>
                        <Typography variant="body1">
                            {new Date().toLocaleDateString()} {/* Replace with actual join date */}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Profile; 