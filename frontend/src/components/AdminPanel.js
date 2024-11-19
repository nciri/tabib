import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Box, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { People, Settings, Dashboard as DashboardIcon } from '@mui/icons-material';
import UserManagement from './admin/UserManagement';
import AdminDashboard from './admin/AdminDashboard';
import SystemSettings from './admin/SystemSettings';

const drawerWidth = 240;

export function AdminPanel() {
  const { isAdmin } = useAuth();
  const [selectedFeature, setSelectedFeature] = useState('dashboard');

  if (!isAdmin) {
    return <Typography>You do not have permission to view this page.</Typography>;
  }

  const renderFeature = () => {
    switch (selectedFeature) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {[
              { text: 'Dashboard', icon: <DashboardIcon />, feature: 'dashboard' },
              { text: 'User Management', icon: <People />, feature: 'users' },
              { text: 'System Settings', icon: <Settings />, feature: 'settings' },
            ].map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => setSelectedFeature(item.feature)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderFeature()}
      </Box>
    </Box>
  );
}
