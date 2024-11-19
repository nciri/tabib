import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Rating, Chip, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const doctors = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.8,
    image: "/doctors/doctor1.jpg",
    availability: "Available Today"
  },
  {
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    rating: 4.9,
    image: "/doctors/doctor2.jpg",
    availability: "Next Available: Tomorrow"
  },
  {
    name: "Dr. Emily Williams",
    specialty: "Pediatrician",
    rating: 4.7,
    image: "/doctors/doctor3.jpg",
    availability: "Available Today"
  }
];

export default function FeaturedDoctors() {
  const theme = useTheme();

  return (
    <Box sx={{ 
      py: 8,
      px: 2,
      borderRadius: 4,
      bgcolor: 'background.paper',
      boxShadow: theme => theme.shadows[4],
      mb: 8
    }}>
      <Typography 
        variant="h4" 
        component="h2" 
        gutterBottom 
        align="center"
        sx={{
          mb: 4,
          fontWeight: 'bold',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Featured Doctors
      </Typography>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {doctors.map((doctor, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  transition: '0.3s',
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[10]
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={doctor.image}
                  alt={doctor.name}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                    {doctor.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom sx={{ opacity: 0.8 }}>
                    {doctor.specialty}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={doctor.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }} >
                      ({doctor.rating})
                    </Typography>
                  </Box>
                  <Chip 
                    label={doctor.availability}
                    color="primary"
                    size="small"
                    sx={{ 
                      mt: 1,
                      borderRadius: 1,
                      '& .MuiChip-label': {
                        px: 2
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 