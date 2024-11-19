import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Grid, Typography, Link, useTheme } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: 'Home', path: '/' },
    { title: 'About Us', path: '/about' },
    { title: 'Our Services', path: '/services' },
    { title: 'Contact Us', path: '/contact' }
  ];

  return (
    <Box 
      component="footer" 
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              HealthCare Platform
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Providing efficient healthcare management solutions for a better tomorrow.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {footerLinks.map((link) => (
                <Link
                  key={link.title}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    mb: 1,
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'none'
                    }
                  }}
                >
                  {link.title}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email color="primary" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  info@healthcareplatform.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone color="primary" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  (123) 456-7890
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="primary" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  123 Health St, Medical City, MC 12345
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center"
          sx={{ 
            mt: 4,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          © {currentYear} HealthCare Platform. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;

  