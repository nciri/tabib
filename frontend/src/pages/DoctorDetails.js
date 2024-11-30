import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Chip, CircularProgress, Alert,
  Grid, Button, Rating, Divider, Card, CardContent, List, ListItem,
  ListItemText, ListItemIcon
} from '@mui/material';
import {
  LocationOn, Phone, Email, AccessTime, EventAvailable,
  Star, CalendarMonth, School, WorkHistory
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/doctors/${id}`);
        if (!response.ok) throw new Error('Failed to fetch doctor details');
        const data = await response.json();
        setDoctor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  const handleBookAppointment = () => {
    navigate(`/book-appointment/${id}`);
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

  if (!doctor) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={4}>
          {/* Left Column - Doctor Info */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" gutterBottom>{doctor.name}</Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {doctor.specialty}
                  </Typography>
                  
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip icon={<LocationOn />} label={doctor.location} />
                    <Chip icon={<Phone />} label={doctor.phone} />
                    <Chip icon={<Email />} label={doctor.email} />
                    <Chip 
                      icon={<AccessTime />}
                      label={doctor.availability}
                      color={doctor.availability === 'Available' ? 'success' : 'warning'}
                    />
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Rating value={4.5} readOnly precision={0.5} />
                    <Typography variant="body2" color="text.secondary">
                      4.5 out of 5 stars (125 reviews)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box>
                <Typography variant="h6" gutterBottom>About</Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Dr. {doctor.name} is a highly qualified {doctor.specialty} with extensive experience in treating various conditions. They are committed to providing the best possible care for their patients.
                </Typography>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>Qualifications & Experience</Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><School /></ListItemIcon>
                    <ListItemText 
                      primary="Medical Degree"
                      secondary="University Medical School"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><WorkHistory /></ListItemIcon>
                    <ListItemText 
                      primary="15+ Years Experience"
                      secondary="Specialized in Advanced Treatments"
                    />
                  </ListItem>
                </List>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Appointment Booking */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Book an Appointment
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Available slots for next week
                </Typography>
                
                <Box sx={{ mt: 2, mb: 3 }}>
                  <List>
                    {['Monday', 'Wednesday', 'Friday'].map((day) => (
                      <ListItem key={day}>
                        <ListItemIcon><CalendarMonth /></ListItemIcon>
                        <ListItemText primary={day} secondary="9:00 AM - 5:00 PM" />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<EventAvailable />}
                  onClick={handleBookAppointment}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default DoctorDetails;