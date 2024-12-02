import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '@mui/material';
import { Box } from '@mui/material';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import PatientRecords from './pages/PatientRecords';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';
import ClientSignup from './pages/ClientSignup';
import { AdminPanel } from './components/AdminPanel';
import DoctorDetails from './pages/DoctorDetails';
import BookAppointment from './pages/BookAppointment';
// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c'
    },
    success: {
      main: '#4caf50',
      light: '#e8f5e9',
      contrastText: '#1b5e20'
    },
    warning: {
      main: '#ff9800',
      light: '#fff3e0',
      contrastText: '#e65100'
    },
    background: {
      default: '#ffffff',
      paper: '#e6ffe6'
    },
    text: {
      primary: '#2c2c2c',
      secondary: '#5f5f5f'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
          backgroundColor: '#ffffff'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#4caf50',
          '&:hover': {
            backgroundColor: '#388e3c'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#e6ffe6'
        },
        colorSuccess: {
          backgroundColor: '#e8f5e9',
          color: '#1b5e20',
          '& .MuiChip-icon': {
            color: '#1b5e20'
          }
        },
        colorWarning: {
          backgroundColor: '#fff3e0',
          color: '#e65100',
          '& .MuiChip-icon': {
            color: '#e65100'
          }
        }
      }
    }
  }
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Header />
            <Box sx={{ pt: 8 }}>
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                  <Route path="/patient-records" element={<ProtectedRoute><PatientRecords /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/client-signup" element={<ClientSignup />} />
                  <Route path="/practitioners/:id" element={<DoctorDetails />} />
                  <Route path="/book-appointment/:id" element={<BookAppointment />} />  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </Box>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
