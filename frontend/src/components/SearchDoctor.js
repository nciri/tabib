import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paper,
  InputBase,
  IconButton,
  Divider,
  Autocomplete,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  ClickAwayListener
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  LocalHospital,
  Person
} from '@mui/icons-material';
import { useSearchDoctors } from '../hooks/useSearchDoctors';
import { useNavigate } from 'react-router-dom';

const SearchDoctor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { results, loading, error, searchDoctors } = useSearchDoctors();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim()) {
      searchDoctors('all', searchTerm, location);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchTerm, location]);

  const handleSearch = () => {
    if (searchTerm.trim() || location.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.append('type', 'all');
      searchParams.append('term', searchTerm);
      searchParams.append('location', location);
      
      navigate({
        pathname: '/practitioners/search',
        search: searchParams.toString()
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDoctorClick = (id) => {
    navigate(`/practitioners/${id}`);
    setShowResults(false);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 800, zIndex: 1 }}>
      <ClickAwayListener onClickAway={() => setShowResults(false)}>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                borderRadius: 3,
                bgcolor: 'background.paper',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: 'primary.dark'
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1.5 }}
                placeholder="Search doctors, specialties, hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                startAdornment={<SearchIcon color="action" sx={{ mr: 1 }} />}
              />
              
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Location..."
                startAdornment={<LocationOn color="action" sx={{ mr: 1 }} />}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              
              <IconButton 
                onClick={handleSearch}
                sx={{ 
                  p: '10px', 
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
              </IconButton>
            </Paper>
          </motion.div>

          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Paper
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    mt: 1,
                    maxHeight: 400,
                    overflow: 'auto',
                    zIndex: 2,
                    borderRadius: 2
                  }}
                >
                  {error && (
                    <Alert severity="error" sx={{ m: 2 }}>
                      {error}
                    </Alert>
                  )}
                  
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : results.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography color="text.secondary">
                        No doctors found matching your search criteria
                      </Typography>
                    </Box>
                  ) : (
                    <List>
                      {results.map((doctor) => (
                        <ListItem
                          key={doctor.id}
                          component="button"
                          onClick={() => handleDoctorClick(doctor.id)}
                          sx={{
                            '&:hover': {
                              bgcolor: 'action.hover'
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar src={doctor.image} alt={doctor.name}>
                              <Person />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={doctor.name}
                            secondary={
                              <Typography component="div" variant="body2">
                                <Typography component="span" variant="body2" color="text.secondary">
                                  {doctor.specialty}
                                </Typography>
                                <Box component="span" sx={{ display: 'block', mt: 1 }}>
                                  <Chip
                                    size="small"
                                    label={doctor.availability}
                                    color={doctor.availability.includes('Available') ? 'success' : 'warning'}
                                    sx={{ mr: 1 }}
                                  />
                                  <Chip
                                    size="small"
                                    label={doctor.location}
                                    icon={<LocationOn />}
                                  />
                                </Box>
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ClickAwayListener>
    </Box>
  );
};

export default SearchDoctor; 