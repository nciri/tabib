import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Chip, CircularProgress, Alert,
  Grid, Button, Rating, Divider, Card, CardContent, List, ListItem,
  ListItemText, ListItemIcon
} from '@mui/material';
import {
  LocationOn, Phone, Email, AccessTime, EventAvailable,
  Star, CalendarMonth, School, WorkHistory, DirectionsBus, Info
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import DoctorMap from '../components/DoctorMap';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`/api/practitioner/${id}`);
        if (!response.ok) throw new Error('Failed to fetch doctor details');
        const data = await response.json();
        
        // Transform the data to match the frontend structure
        const transformedData = {
          id: data.id,
          name: data.user.username,
          specialty: data.specialty || 'General Practitioner',
          location: data.location || 'Not specified',
          experience: data.experience_years || 0,
          email: data.user.email,
          phone: data.user.phone,
          bio: data.bio,
          presentation: data.bio, // Using bio for presentation
          address: data.location, // Using location for address
          city: '', // You might want to add this to your backend
          consultation_fee: data.consultation_fee,
          availability: 'Available' // You might want to add this to your backend
        };
        
        setDoctor(transformedData);
      } catch (err) {
        console.error('Fetch Error:', err);
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
                  
                  <Box sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    gap: 1, 
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}>
                    <Chip icon={<LocationOn />} label={doctor.location} />
                    {doctor.phone && <Chip icon={<Phone />} label={doctor.phone} />}
                    {doctor.email && <Chip icon={<Email />} label={doctor.email} />}
                    <Chip 
                      icon={<AccessTime />}
                      label={doctor.availability}
                      color={doctor.availability === 'Available' ? 'success' : 'warning'}
                    />
                  </Box>

                  <Box sx={{ mt: 3 }} display="none">
                    <Rating value={4.5} readOnly precision={0.5} />
                    <Typography variant="body2" color="text.secondary">
                      4.5 out of 5 stars (125 reviews)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />



              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom color="primary">Presentation</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {doctor.presentation || `${doctor.name} welcomes you to their practice at ${doctor.location}. 
                  As a ${doctor.specialty}, they provide comprehensive care and treatment for various conditions.`}
                </Typography>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom color="primary">Public Reception</Typography>
                <Typography variant="body1" color="text.secondary">
                  {doctor.publicReceptionInfo || "This healthcare professional does not accept online appointments for patients under 6 years old"}
                </Typography>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom color="primary">Location and Access</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <List>
                      <ListItem>
                        <ListItemIcon><LocationOn /></ListItemIcon>
                        <ListItemText 
                          primary={`${doctor.address || '7 Rue d\'Orange'}`}
                          secondary={`${doctor.city || '13003 Marseille'}`}
                        />
                      </ListItem>
                    </List>

                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }} >
                      Transportation
                    </Typography>
                    <List dense>
                      {doctor.transportation?.length > 0 ? (
                        doctor.transportation.map((transport, index) => (
                          <ListItem key={index}>
                            <ListItemIcon><DirectionsBus /></ListItemIcon>
                            <ListItemText primary={transport} />
                          </ListItem>
                        ))
                      ) : (
                        <>
                          <ListItem>
                            <ListItemIcon><DirectionsBus /></ListItemIcon>
                            <ListItemText primary="Bus - Jourdan Bonnardel (ligne 49)" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><DirectionsBus /></ListItemIcon>
                            <ListItemText primary="Bus - Place Caffo (lignes 31 et 32)" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><DirectionsBus /></ListItemIcon>
                            <ListItemText primary="Bus - Bernard Clovis Hugues (ligne 52)" />
                          </ListItem>
                        </>
                      )}
                    </List>

                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }} >
                      Practical Information
                    </Typography>
                    <List dense>
                      {doctor.practicalInfo?.length > 0 ? (
                        doctor.practicalInfo.map((info, index) => (
                          <ListItem key={index}>
                            <ListItemIcon><Info /></ListItemIcon>
                            <ListItemText primary={info} />
                          </ListItem>
                        ))
                      ) : (
                        <>
                          <ListItem>
                            <ListItemIcon><Info /></ListItemIcon>
                            <ListItemText primary="1er étage sans ascenseur" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><Info /></ListItemIcon>
                            <ListItemText primary="Parking gratuit" />
                          </ListItem>
                        </>
                      )}
                    </List>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ position: 'relative' }}>
                      <DoctorMap address={doctor.address} city={doctor.city} />
                      <Button
                        variant="contained"
                        sx={{ position: 'absolute', bottom: 16, right: 16 }}
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${doctor.address} ${doctor.city}`)}`)}
                      >
                        Open in Google Maps
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom color="primary" >Qualifications & Experience</Typography>
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