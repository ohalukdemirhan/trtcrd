import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Divider,
    Box,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Translate as TranslateIcon,
    History as HistoryIcon,
    Settings as SettingsIcon,
    AccountCircle as AccountIcon,
    Assessment as AssessmentIcon,
    Dashboard as DashboardIcon,
    EnhancedEncryption as EnhancedEncryptionIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavItem {
    title: string;
    path: string;
    icon: React.ReactNode;
    roles?: string[];
}

const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <DashboardIcon />,
    },
    {
        title: 'Translations',
        path: '/translations',
        icon: <TranslateIcon />,
    },
    {
        title: 'Professional Translation',
        path: '/professional-translation',
        icon: <EnhancedEncryptionIcon />,
    },
    {
        title: 'Compliance Rules',
        path: '/compliance-rules',
        icon: <SecurityIcon />,
    },
    {
        title: 'History',
        path: '/history',
        icon: <HistoryIcon />,
    },
    {
        title: 'Usage & Billing',
        path: '/usage',
        icon: <AssessmentIcon />,
    },
    {
        title: 'Profile',
        path: '/profile',
        icon: <AccountIcon />,
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <SettingsIcon />,
    },
];

const DRAWER_WIDTH = 240;

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const user = useSelector((state: RootState) => state.auth.user);

    const filteredNavItems = navItems.filter(
        (item) => !item.roles || (user && item.roles.includes(user.role))
    );

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) {
            onClose();
        }
    };

    const drawer = (
        <Box>
            {/* Toolbar spacer to push content below app bar */}
            <Box sx={{ height: 64 }} />
            
            <List sx={{ px: 2 }}>
                {filteredNavItems.map((item, index) => (
                    <React.Fragment key={item.path}>
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    borderRadius: 1,
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.main',
                                        color: 'primary.contrastText',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.contrastText',
                                        },
                                    },
                                    '&:hover': {
                                        borderRadius: 1,
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                        color: location.pathname === item.path
                                            ? 'inherit'
                                            : 'text.primary',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.title}
                                    primaryTypographyProps={{
                                        fontSize: '0.9rem',
                                        fontWeight: location.pathname === item.path ? 600 : 400
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                        {item.title === 'Usage & Billing' && (
                            <Divider sx={{ my: 2 }} />
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{
                width: { sm: DRAWER_WIDTH },
                flexShrink: { sm: 0 },
            }}
        >
            <Drawer
                variant={isMobile ? 'temporary' : 'permanent'}
                open={isOpen}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    display: { xs: 'block', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        backgroundColor: 'background.default',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                    },
                }}
            >
                {drawer}
            </Drawer>
        </Box>
    );
}; 