import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';

export default function AdminDashboard() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">100</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Active Appointments</Typography>
            <Typography variant="h4">25</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">System Status</Typography>
            <Typography variant="h4">Healthy</Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
