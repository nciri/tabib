import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Rating,
  Box,
  Button,
  CircularProgress,
  Pagination
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';

const PractitionerSearchResults = () => {
  const [searchParams] = useSearchParams();
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        setLoading(true);
        const type = searchParams.get('type') || '';
        const term = searchParams.get('term') || '';
        const location = searchParams.get('location') || '';
        
        const response = await fetch(
          `/api/practitioners/search?type=${type}&term=${term}&location=${location}&page=${page}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch practitioners');
        
        const data = await response.json();
        setPractitioners(data.practitioners);
        setTotalPages(data.total_pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPractitioners();
  }, [searchParams, page]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>
      
      <Grid container spacing={3}>
        {practitioners.map((practitioner) => (
          <Grid item xs={12} md={6} key={practitioner.id}>
            <Card sx={{ display: 'flex', height: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={practitioner.image}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6">
                        Dr. {practitioner.name}
                      </Typography>
                      <Typography color="textSecondary">
                        {practitioner.specialty}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {practitioner.location}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Rating value={practitioner.rating} readOnly />
                    <Typography variant="body2" color="textSecondary">
                      ({practitioner.reviewCount} reviews)
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      label={`${practitioner.experience} years exp.`}
                      size="small"
                    />
                    <Chip 
                      label={practitioner.availability}
                      color="primary"
                      size="small"
                    />
                  </Box>

                  <Button 
                    variant="contained" 
                    fullWidth
                    href={`/practitioners/${practitioner.id}`}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      )}
    </Container>
  );
};

export default PractitionerSearchResults; 