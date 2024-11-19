import React, { useState } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  Paper,
  CircularProgress
} from '@mui/material';
import PatientInfo from './PatientInfo';
import MedicalHistory from './MedicalHistory';
import Prescriptions from './Prescriptions';
import TestResults from './TestResults';
import FileAttachments from './FileAttachments';

function PatientDetails({ data, isLoading }) {
  const [tabValue, setTabValue] = useState(0);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Medical Records
        </Typography>
        
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Patient Info" />
          <Tab label="Medical History" />
          <Tab label="Prescriptions" />
          <Tab label="Test Results" />
          <Tab label="Files" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <PatientInfo data={data?.basicInfo} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <MedicalHistory history={data?.medicalHistory} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Prescriptions prescriptions={data?.prescriptions} />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <TestResults testResults={data?.testResults} />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <FileAttachments files={data?.files} />
        </TabPanel>
      </Paper>
    </Container>
  );
}

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default PatientDetails; 