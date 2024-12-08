import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Grid, TextField,
  Button, Alert, CircularProgress, MenuItem, Stepper,
  Step, StepLabel, List, ListItem, ListItemText, Radio,
  RadioGroup, FormControlLabel, FormControl
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';

const steps = [
  'Select consultation type',
  'Select location',
  'Choose date and time',
  'Confirm details'
];

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [consultationType, setConsultationType] = useState('');
  const [appointment, setAppointment] = useState({
    title: '',
    date: '',
    time: '',
    duration: 30,
    notes: '',
    doctor_id: id,
    consultation_type: '',
    location_id: null,
    location_name: '',
    location_city: ''
  });
  const [locations, setLocations] = useState([
    {
      id: 1,
      name: '76 Allées Jean Jaurès',
      city: '31000 Toulouse',
      isMain: true
    },
    {
      id: 2,
      name: '15 Avenue des Minimes',
      city: '31200 Toulouse',
      isMain: false
    }
  ]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5002/practitioners/${id}`);
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

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleConsultationTypeSelect = (type) => {
    setConsultationType(type);
    setAppointment(prev => ({
      ...prev,
      consultation_type: type,
      title: `${type} with Dr. ${doctor?.name}`
    }));
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setAppointment(prev => ({
      ...prev,
      location_id: location.id,
      location_name: location.name,
      location_city: location.city
    }));
  };

  const handleSubmit = async () => {
    try {
      //const token = localStorage.getItem('token');
      const token = "mocked.jwt.token";

      if (!token) {
        navigate('/login', { 
          state: { message: 'Please login to book an appointment', returnUrl: `/book-appointment/${id}` }
        });
        return;
      }
  
      //const decodedToken = JSON.parse(atob(token.split('.')[1]));

      const response = await fetch('/appointment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...appointment,
          // user_id: decodedToken.id,
          // role: decodedToken.type || decodedToken.role
          user_id: 3,
          role: "patient"
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server Error:', errorData);
        throw new Error(errorData.message || 'Failed to book appointment');
      }
      const data = await response.json();
      console.log('Success:', data);
  
      navigate('/appointment', { 
        state: { message: 'Appointment request sent successfully!' }
      });
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    }
  };
  

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Choisissez une catégorie pour votre consultation
            </Typography>
            <List>
              {['Consultation médicale – Contrôle de la vue', 
                'Avis – Pathologies (Diabète, Glaucome, DMLA, Rétine, etc)',
                'Avis – Chirurgies'].map((type) => (
                <ListItem 
                  button 
                  key={type}
                  onClick={() => handleConsultationTypeSelect(type)}
                  selected={consultationType === type}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                    }
                  }}
                >
                  <ListItemText primary={type} />
                  <Radio
                    checked={consultationType === type}
                    onChange={() => handleConsultationTypeSelect(type)}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select a location
            </Typography>
            <List>
              {locations.map((location) => (
                <ListItem 
                  button 
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  selected={selectedLocation?.id === location.id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                    }
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">
                      {location.name}
                      {location.isMain && (
                        <Typography
                          component="span"
                          sx={{
                            ml: 1,
                            px: 1,
                            py: 0.5,
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderRadius: 1,
                            fontSize: '0.75rem'
                          }}
                        >
                          Main Office
                        </Typography>
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {location.city}
                    </Typography>
                  </Box>
                  <Radio
                    checked={selectedLocation?.id === location.id}
                    sx={{ ml: 'auto' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        );

      case 2:
        const getDayDate = (day) => {
          const today = new Date();
          const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          
          // Start from tomorrow
          today.setDate(today.getDate() + 1);
          
          const currentDayIndex = today.getDay();
          let targetDayIndex = daysOfWeek.indexOf(day);
          
          // Calculate days to add to get to the next occurrence of the target day
          let daysToAdd = targetDayIndex - currentDayIndex;
          if (daysToAdd <= 0) {
            daysToAdd += 7; // Move to next week if the day has already passed
          }
          
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() + daysToAdd);
          
          // Format date as YYYY-MM-DD
          return targetDate.toISOString().split('T')[0];
        };

        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Choose a date and time
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Available slots for the next 7 days
              </Typography>
              <Grid container spacing={2}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                  const dateStr = getDayDate(day);
                  return (
                    <Grid item xs={12} key={day}>
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 2,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'background.paper' }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1">{day}</Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {['09:00', '10:00', '11:00', '14:00', '15:00'].map((time) => (
                              <Button
                                key={time}
                                variant={
                                  appointment.date === dateStr && appointment.time === time 
                                    ? 'contained' 
                                    : 'outlined'
                                }
                                size="small"
                                onClick={() => {
                                  setAppointment(prev => ({
                                    ...prev,
                                    time,
                                    date: dateStr
                                  }));
                                }}
                              >
                                {time}
                              </Button>
                            ))}
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Confirmez les détails de votre rendez-vous
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Type de consultation"
                  secondary={appointment.consultation_type}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Date"
                  secondary={appointment.date}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Heure"
                  secondary={appointment.time}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Durée"
                  secondary={`${appointment.duration} minutes`}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Location"
                  secondary={`${appointment.location_name}, ${appointment.location_city}`}
                />
              </ListItem>
            </List>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Notes additionnelles (optionnel)"
              value={appointment.notes}
              onChange={(e) => setAppointment({ ...appointment, notes: e.target.value })}
              sx={{ mt: 2 }}
            />
          </Box>
        );

      default:
        return null;
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
              >
                Étape précédente
              </Button>
              <Typography variant="h4" gutterBottom>
                Prenez votre rendez-vous en ligne
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Renseignez les informations suivantes
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {renderStepContent(activeStep)}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                disabled={
                  (activeStep === 0 && !consultationType) || 
                  (activeStep === 1 && !selectedLocation)
                }
              >
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Votre rendez-vous en détail
            </Typography>
            {doctor && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    component="img"
                    src={doctor.image || 'default-avatar.png'}
                    alt={doctor.name}
                    sx={{ width: 50, height: 50, borderRadius: '50%', mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">{doctor.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doctor.specialty}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2">
                  {selectedLocation ? 
                    `${selectedLocation.name}, ${selectedLocation.city}` : 
                    doctor.location
                  }
                </Typography>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BookAppointment;