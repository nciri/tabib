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
      
      const response = await axios.get('http://localhost:5000/api/doctors/search', {
        params: {
          type: searchType,
          term: searchTerm,
          location: location
        }
      });

      setResults(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchDoctors };
}; 