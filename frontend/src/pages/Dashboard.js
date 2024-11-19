import React from 'react';
import { Container, Box, Typography, Grid, Paper, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

function Dashboard() {
  const { user } = useAuth();

  const renderPatientDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
          <CalendarTodayIcon fontSize="large" color="primary" />
          <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
            My Appointments
          </Typography>
          <Button
            component={RouterLink}
            to="/appointments"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            View Appointments
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
          <PersonIcon fontSize="large" color="primary" />
          <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
            My Medical Records
          </Typography>
          <Button
            component={RouterLink}
            to="/patient-records"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            View Records
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderDoctorDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
          <CalendarTodayIcon fontSize="large" color="primary" />
          <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
            Appointments
          </Typography>
          <Button
            component={RouterLink}
            to="/appointments"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Manage Appointments
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
          <LocalHospitalIcon fontSize="large" color="primary" />
          <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
            Patient Management
          </Typography>
          <Button
            component={RouterLink}
            to="/patient-records"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            View Patients
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to your Dashboard, {user?.name}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Quick Actions
        </Typography>
        {user?.role === 'patient' ? renderPatientDashboard() : renderDoctorDashboard()}
      </Box>
    </Container>
  );
}

export default Dashboard;
