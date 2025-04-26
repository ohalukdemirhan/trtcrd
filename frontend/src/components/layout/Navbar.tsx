import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Button,
  Divider,
  Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useAuth } from '../../contexts/AuthContext';

// Get environment to show dev mode indicator
const isDevelopment = process.env.NODE_ENV === 'development';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, fontWeight: 600 }}
        >
          TrtCrd
        </Typography>
        
        {isDevelopment && (
          <Chip 
            label="Development Mode" 
            color="warning" 
            size="small" 
            sx={{ 
              mr: 2, 
              fontWeight: 500,
              backgroundColor: 'rgba(255, 152, 0, 0.2)',
              color: 'warning.light',
              '& .MuiChip-label': { px: 1 }
            }} 
          />
        )}
        
        <Button
          color="inherit"
          onClick={() => navigate('/dashboard')}
          sx={{ mr: 1, display: { xs: 'none', md: 'flex' } }}
        >
          Dashboard
        </Button>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/usage')}
              sx={{ fontWeight: 500 }}
            >
              Usage & Billing
            </Button>
            
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user.full_name?.[0] || user.email[0]}
              </Avatar>
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{ fontWeight: 500 }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{ fontWeight: 500 }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}; 