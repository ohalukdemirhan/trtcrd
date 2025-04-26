import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    Switch,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useTheme } from '../theme/ThemeProvider';
import { RootState } from '../store';
import { AppDispatch } from '../store';

const Settings: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { mode, toggleColorMode } = useTheme();

    const [defaultSourceLang, setDefaultSourceLang] = React.useState('en');
    const [defaultTargetLang, setDefaultTargetLang] = React.useState('tr');
    const [emailNotifications, setEmailNotifications] = React.useState(true);
    const [autoSave, setAutoSave] = React.useState(true);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Settings
            </Typography>

            {/* Appearance Settings */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Appearance
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText
                            primary="Dark Mode"
                            secondary="Toggle between light and dark theme"
                        />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                checked={mode === 'dark'}
                                onChange={toggleColorMode}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Paper>

            {/* Translation Settings */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Translation Preferences
                </Typography>
                <List>
                    <ListItem>
                        <FormControl fullWidth>
                            <InputLabel>Default Source Language</InputLabel>
                            <Select
                                value={defaultSourceLang}
                                label="Default Source Language"
                                onChange={(e) => setDefaultSourceLang(e.target.value)}
                            >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="tr">Turkish</MenuItem>
                            </Select>
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <FormControl fullWidth>
                            <InputLabel>Default Target Language</InputLabel>
                            <Select
                                value={defaultTargetLang}
                                label="Default Target Language"
                                onChange={(e) => setDefaultTargetLang(e.target.value)}
                            >
                                <MenuItem value="tr">Turkish</MenuItem>
                                <MenuItem value="en">English</MenuItem>
                            </Select>
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Auto-Save Translations"
                            secondary="Automatically save translations to history"
                        />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                checked={autoSave}
                                onChange={(e) => setAutoSave(e.target.checked)}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Paper>

            {/* Notification Settings */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Notifications
                </Typography>
                <List>
                    <ListItem>
                        <ListItemText
                            primary="Email Notifications"
                            secondary="Receive email updates about your translations"
                        />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                checked={emailNotifications}
                                onChange={(e) => setEmailNotifications(e.target.checked)}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText
                            primary="Usage Alerts"
                            secondary="Get notified when approaching usage limits"
                        />
                        <ListItemSecondaryAction>
                            <Switch edge="end" defaultChecked />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText
                            primary="Compliance Updates"
                            secondary="Notifications about compliance rule changes"
                        />
                        <ListItemSecondaryAction>
                            <Switch edge="end" defaultChecked />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Paper>
        </Box>
    );
};

export default Settings; 