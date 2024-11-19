import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';

export default function PatientInfo({ data }) {
  if (!data) return <Typography>No patient information available</Typography>;

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
            <Typography variant="body1">{data.name}</Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
            <Typography variant="body1">{data.dateOfBirth}</Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
            <Typography variant="body1">{data.gender}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Blood Type</Typography>
            <Typography variant="body1">{data.bloodType}</Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="subtitle2" color="text.secondary">Emergency Contact</Typography>
            <Typography variant="body1">{data.emergencyContact}</Typography>
            <Typography variant="body1">{data.emergencyPhone}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box mt={2}>
            <Typography variant="subtitle2" color="text.secondary">Allergies</Typography>
            <Typography variant="body1">{data.allergies || 'None reported'}</Typography>
          </Box>
          <Box mt={2}>
            <Typography variant="subtitle2" color="text.secondary">Medical Conditions</Typography>
            <Typography variant="body1">{data.medicalConditions || 'None reported'}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
} 