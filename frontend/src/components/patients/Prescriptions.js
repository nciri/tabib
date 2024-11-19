import React from 'react';
import { Paper, Typography, Card, CardContent, Grid, Chip } from '@mui/material';

export default function Prescriptions({ prescriptions }) {
  if (!prescriptions?.length) return <Typography>No prescriptions available</Typography>;

  return (
    <Grid container spacing={2}>
      {prescriptions.map((prescription) => (
        <Grid item xs={12} md={6} key={prescription.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{prescription.medication}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Dosage: {prescription.dosage}
              </Typography>
              <Typography variant="body2">
                Frequency: {prescription.frequency}
              </Typography>
              <Typography variant="body2">
                Duration: {prescription.startDate} - {prescription.endDate || 'Ongoing'}
              </Typography>
              <Chip 
                label={new Date(prescription.endDate) < new Date() ? 'Completed' : 'Active'} 
                color={new Date(prescription.endDate) < new Date() ? 'default' : 'primary'} 
                size="small" 
                sx={{ mt: 1 }} 
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
} 