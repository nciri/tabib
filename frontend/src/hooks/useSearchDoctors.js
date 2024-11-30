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
      
      const response = await axios.get('http://localhost:5001/practitioners/search', {
        params: {
          type: searchType,
          term: searchTerm,
          location: location
        },
        headers: {
          'Content-Type': 'application/json'
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