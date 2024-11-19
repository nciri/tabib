import React from 'react';
import { Box, Typography, Grid, Paper, IconButton, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  LocalHospital, 
  Psychology, 
  Healing, 
  Medication,
  Visibility, 
  ChildCare,
  Favorite,
  Elderly
} from '@mui/icons-material';

const specialties = [
  { icon: <Psychology />, name: 'Psychiatry' },
  { icon: <Healing />, name: 'General Medicine' },
  { icon: <Medication />, name: 'Cardiology' },
  { icon: <Visibility />, name: 'Ophthalmology' },
  { icon: <ChildCare />, name: 'Pediatrics' },
  { icon: <Favorite />, name: 'Internal Medicine' },
  { icon: <LocalHospital />, name: 'Surgery' },
  { icon: <Elderly />, name: 'Geriatrics' }
];

export default function PopularSpecialties() {
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
        Popular Specialties
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {specialties.map((specialty, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  transition: '0.3s',
                  cursor: 'pointer',
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[10],
                    bgcolor: 'primary.dark',
                    '& .MuiTypography-root': { color: 'white' },
                    '& .MuiIconButton-root': { 
                      color: 'white',
                      bgcolor: 'primary.light'
                    }
                  }
                }}
              >
                <IconButton 
                  color="primary" 
                  sx={{ 
                    mb: 2,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'primary.light' }
                  }}
                >
                  {specialty.icon}
                </IconButton>
                <Typography 
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'medium',
                    color: 'text.primary'
                  }}
                >
                  {specialty.name}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 