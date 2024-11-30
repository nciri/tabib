import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Grid, TextField,
  Button, Alert, CircularProgress, MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointment, setAppointment] = useState({
    title: '',
    date: '',
    time: '',
    duration: 30,
    notes: '',
    doctor_id: id
  });

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/doctors/${id}`);
        if (!response.ok) throw new Error('Failed to fetch doctor details');
        const data = await response.json();
        setDoctor(data);
        setAppointment(prev => ({
          ...prev,
          title: `Appointment with Dr. ${data.name}`
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(appointment)
      });

      if (!response.ok) throw new Error('Failed to book appointment');
      
      navigate('/appointments', { 
        state: { message: 'Appointment request sent successfully!' }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Container>
  );

  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Book Appointment
          </Typography>
          {doctor && (
            <Typography variant="h6" color="primary" gutterBottom>
              with Dr. {doctor.name}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={appointment.title}
                  onChange={(e) => setAppointment({ ...appointment, title: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  value={appointment.date}
                  onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Time"
                  value={appointment.time}
                  onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Duration"
                  value={appointment.duration}
                  onChange={(e) => setAppointment({ ...appointment, duration: e.target.value })}
                  required
                >
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={45}>45 minutes</MenuItem>
                  <MenuItem value={60}>1 hour</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Notes"
                  value={appointment.notes}
                  onChange={(e) => setAppointment({ ...appointment, notes: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  Request Appointment
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default BookAppointment;