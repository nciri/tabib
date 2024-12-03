import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppBar, Toolbar, Typography, Button, Box, Container, useTheme } from '@mui/material';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const theme = useTheme();

  const renderAuthLinks = () => {
    if (!isAuthenticated) {
      return (
        <Button 
          variant="outlined" 
          color="inherit" 
          component={RouterLink} 
          to="/login"
          sx={{
            borderColor: 'rgba(255,255,255,0.3)',
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Login
        </Button>
      );
    }

    const commonButtonProps = {
      color: "inherit",
      sx: {
        mx: 1,
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.1)'
        }
      }
    };

    return (
      <>
        <Button {...commonButtonProps} component={RouterLink} to="/dashboard">
          Dashboard
        </Button>
        <Button {...commonButtonProps} component={RouterLink} to="/appointments">
          {user?.role === 'patient' ? 'My Appointments' : 'Appointments'}
        </Button>
        <Button {...commonButtonProps} component={RouterLink} to="/patient-records">
          {user?.role === 'patient' ? 'Medical Records' : 'Patient Records'}
        </Button>
        <Button {...commonButtonProps} component={RouterLink} to="/profile">
          Profile
        </Button>
      </>
    );
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'rgba(255,255,255,0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1 }}>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/"
            sx={{ 
              flexGrow: 1,
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Tabib
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/"
              sx={{
                mx: 1,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Home
            </Button>
            {renderAuthLinks()}
            {isAuthenticated && (
              <Button 
                variant="contained"
                color="error"
                onClick={logout}
                sx={{
                  ml: 2,
                  bgcolor: 'error.dark',
                  '&:hover': {
                    bgcolor: 'error.main'
                  }
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
