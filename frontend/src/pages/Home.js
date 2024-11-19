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
  alpha
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

  const features = [
    {
      icon: <AccessTime fontSize="large" />,
      title: "Quick Appointments",
      description: "Book appointments with top doctors instantly"
    },
    {
      icon: <Security fontSize="large" />,
      title: "Verified Doctors",
      description: "All doctors are verified and highly qualified"
    },
    {
      icon: <Star fontSize="large" />,
      title: "Quality Care",
      description: "Get the best healthcare experience"
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Box
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
          pt: 8,
          pb: 12,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2%, transparent 0%)',
            backgroundSize: '50px 50px',
            opacity: 0.4
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '150px',
            background: `linear-gradient(to top, ${theme.palette.background.default}, transparent)`,
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    color: 'white',
                    fontWeight: 900,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    mb: 2
                  }}
                >
                  Find Your Perfect Doctor
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ 
                    color: 'white',
                    opacity: 0.9,
                    mb: 4,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  Book appointments with the best doctors and specialists in your area
                </Typography>
              </motion.div>
              
              <SearchDoctor />
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="/doctor-illustration.png"
                  alt="Doctor"
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: 'auto'
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows[10]
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      <Box 
                        sx={{ 
                          color: 'primary.main', 
                          mb: 2,
                          '& .MuiSvgIcon-root': {
                            fontSize: '2.5rem'
                          }
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          color: 'text.primary',
                          fontWeight: 'bold' 
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography 
                        color="text.secondary"
                        sx={{ opacity: 0.8 }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        <PopularSpecialties />
        <FeaturedDoctors />
      </Container>
    </Box>
  );
}

export default Home;
