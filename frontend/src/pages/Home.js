import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Paper
} from '@mui/material';
import SearchDoctor from '../components/SearchDoctor';
import {
  AccessTime,
  Security,
  Star
} from '@mui/icons-material';
import PopularSpecialties from '../components/home/PopularSpecialties';
import FeaturedDoctors from '../components/home/FeaturedDoctors';

function Home() {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section with Search */}
      <Box
        sx={{
          background: theme.palette.background.paper,
          pt: 4,
          pb: 6,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="flex-start">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 700,
                  mb: 2
                }}
              >
                Find a healthcare professional
              </Typography>
              <Typography
                variant="h6"
                sx={{ 
                  color: theme.palette.text.secondary,
                  mb: 4,
                  fontWeight: 400
                }}
              >
                Book your appointments online, 24/7
              </Typography>
              
              <SearchDoctor />
            </Grid>

            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  mt: { xs: 4, md: 8 }
                }}
              >
                {[
                  { text: "Free service", icon: "✓" },
                  { text: "Verified healthcare professionals", icon: "✓" },
                  { text: "Instant confirmation", icon: "✓" }
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem'
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="body1" color="text.primary">
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Specialties Section */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 4, fontWeight: 600 }}
          >
            Book by specialty
          </Typography>
          <Grid container spacing={3}>
            {[
              { name: "General Practitioner", icon: "👨‍⚕️" },
              { name: "Dentist", icon: "🦷" },
              { name: "Dermatologist", icon: "🔬" },
              { name: "Psychologist", icon: "🧠" },
              { name: "Pediatrician", icon: "👶" },
              { name: "Ophthalmologist", icon: "👁️" }
            ].map((specialty, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {specialty.icon}
                  </Typography>
                  <Typography variant="body2">
                    {specialty.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How it works section */}
      <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}
          >
            How it works
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: "Find a doctor",
                description: "Search by specialty or doctor name",
                icon: "🔍"
              },
              {
                title: "Choose a time slot",
                description: "Select from available appointments",
                icon: "📅"
              },
              {
                title: "Book instantly",
                description: "Receive immediate confirmation",
                icon: "✅"
              }
            ].map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {step.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
