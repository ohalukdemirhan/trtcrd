import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box, 
  Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GavelIcon from '@mui/icons-material/Gavel';
import TranslateIcon from '@mui/icons-material/Translate';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          TrtCrd
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Main Navigation */}
      <List>
        <ListItem button component={RouterLink} to="/dashboard">
          <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        
        <ListItem button component={RouterLink} to="/compliance">
          <ListItemIcon><GavelIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Compliance Check" />
        </ListItem>
        
        <ListItem button component={RouterLink} to="/translations/upload">
          <ListItemIcon><TranslateIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Translations" />
        </ListItem>
        
        <ListItem button component={RouterLink} to="/subscriptions">
          <ListItemIcon><SubscriptionsIcon color="primary" /></ListItemIcon>
          <ListItemText primary="Subscriptions" />
        </ListItem>
      </List>
      
      <Divider />
      
      {/* Admin Section - Only visible to admins */}
      {isAdmin && (
        <>
          <List subheader={
            <Typography variant="subtitle2" sx={{ pl: 2, pt: 1, opacity: 0.7 }}>
              Admin
            </Typography>
          }>
            <ListItem button component={RouterLink} to="/admin/dashboard">
              <ListItemIcon><AdminPanelSettingsIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="Admin Dashboard" />
            </ListItem>
            
            <ListItem button component={RouterLink} to="/admin/users">
              <ListItemIcon><PeopleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="Manage Users" />
            </ListItem>
            
            <ListItem button component={RouterLink} to="/admin/compliance">
              <ListItemIcon><GavelIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="Compliance Requests" />
            </ListItem>
            
            <ListItem button component={RouterLink} to="/admin/translations">
              <ListItemIcon><LanguageIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="Translation Requests" />
            </ListItem>
          </List>
          
          <Divider />
        </>
      )}
      
      {/* User Section */}
      <List subheader={
        <Typography variant="subtitle2" sx={{ pl: 2, pt: 1, opacity: 0.7 }}>
          User
        </Typography>
      }>
        <ListItem button component={RouterLink} to="/profile">
          <ListItemIcon><AccountCircleIcon /></ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        
        <ListItem button component={RouterLink} to="/settings">
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar; 