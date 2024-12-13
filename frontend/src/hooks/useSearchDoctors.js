import { useState } from 'react';
import axios from 'axios';

export const useSearchDoctors = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchDoctors = async (searchType, searchTerm, location) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/practitioners/search', {
        params: {
          type: searchType,
          term: searchTerm,
          location: location
        }
      });

      console.log('API Response:', response.data);

      // Check if response.data exists and has the data array
      const practitioners = response.data?.data || [];

      // Transform the data to match the frontend structure
      const transformedResults = practitioners.map(practitioner => ({
        id: practitioner.id,
        name: practitioner.user?.username || 'Unknown Doctor',
        specialty: practitioner.specialty || 'General Practitioner',
        location: practitioner.location || 'Not specified',
        experience: practitioner.experience_years || 0,
        availability: 'Available',
        email: practitioner.user?.email || '',
        phone: practitioner.user?.phone || '',
        bio: practitioner.bio || '',
        consultation_fee: practitioner.consultation_fee || 0
      }));

      setResults(transformedResults);
    } catch (err) {
      console.error('Search Error:', err);
      setError(err.message);
      setResults([]); // Reset results on error
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchDoctors };
}; 