import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PatientList from '../components/patients/PatientList';
import PatientDetails from '../components/patients/PatientDetails';

function PatientRecords() {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user.role === 'patient') {
      fetchPatientData();
    }
  }, [user]);

  const fetchPatientData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patient-records', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch patient data');
      const data = await response.json();
      setPatientData(data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (user.role === 'patient') {
    return <PatientDetails data={patientData} isLoading={isLoading} />;
  }

  return <PatientList onSelectPatient={setSelectedPatient} selectedPatient={selectedPatient} />;
}

export default PatientRecords;
