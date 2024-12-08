import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Container,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Notes as NotesIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext'; // Adjust the import path

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    patientName: '',
    date: '',
    time: '',
    duration: 30,
    notes: '',
    status: 'scheduled'
  });
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const { user } = useAuth();
  const [userRole, setUserRole] = useState(user?.type || user?.role);

  useEffect(() => {
    console.log('Current user role:', user?.type || user?.role);
    setUserRole(user?.type || user?.role);
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/appointment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newAppointment)
      });
      if (!response.ok) throw new Error('Failed to create appointment');
      await fetchAppointments();
      setIsNewAppointmentModalOpen(false);
      setNewAppointment({
        title: '',
        patientName: '',
        date: '',
        time: '',
        duration: 30,
        notes: '',
        status: 'scheduled'
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'primary',
      completed: 'success',
      cancelled: 'error',
      pending: 'warning',
      approved: 'info',
      rejected: 'error'
    };
    return colors[status] || 'default';
  };

  const calendarEvents = appointments.map(apt => {
    const startDate = new Date(`${apt.date}T${apt.time}`);
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + apt.duration);
    
    return {
      id: apt.id,
      title: `${apt.title} - ${apt.patientName}`,
      start: startDate,
      end: endDate,
      resource: apt
    };
  });

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/appointment/${selectedAppointment.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      await fetchAppointments();
      setIsStatusDialogOpen(false);
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleNotesUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${selectedAppointment.id}/notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ notes: newNotes })
      });
      
      if (!response.ok) throw new Error('Failed to update notes');
      await fetchAppointments();
      setIsNotesDialogOpen(false);
    } catch (error) {
      console.error('Error updating appointment notes:', error);
    }
  };

  const handleCancelAppointment = async (appointment) => {
    try {
      setSelectedAppointment(appointment);
      const response = await fetch(`http://localhost:5000/api/appointments/${appointment.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      
      if (!response.ok) throw new Error('Failed to cancel appointment');
      await fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Appointments
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
          >
            {viewMode === 'list' ? 'Calendar View' : 'List View'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsNewAppointmentModalOpen(true)}
          >
            New Appointment
          </Button>
        </Box>
      </Box>

      {viewMode === 'calendar' ? (
        <Paper sx={{ p: 2, height: 600, mb: 3 }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            views={['month', 'week', 'day']}
            defaultView="month"
            onSelectEvent={(event) => {
              // Handle event click - you can show appointment details here
              console.log('Selected event:', event);
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.resource.status === 'completed' ? '#4caf50' :
                                 event.resource.status === 'cancelled' ? '#f44336' :
                                 event.resource.status === 'pending' ? '#ff9800' : '#1976d2'
              }
            })}
          />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {appointments.map((appointment) => (
            <Grid item xs={12} md={6} lg={4} key={appointment.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {appointment.title}
                    </Typography>
                    <Chip
                      label={appointment.status}
                      color={getStatusColor(appointment.status)}
                      size="small"
                    />
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    <EventIcon sx={{ fontSize: 'small', mr: 1, verticalAlign: 'middle' }} />
                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Patient: {appointment.patientName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Duration: {appointment.duration} minutes
                  </Typography>
                  {appointment.notes && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Notes: {appointment.notes}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  {(userRole === 'doctor' || userRole === 'client') && (
                    <>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setNewStatus(appointment.status);
                          setIsStatusDialogOpen(true);
                        }}
                        title="Update Status"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="info"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setNewNotes(appointment.notes || '');
                          setIsNotesDialogOpen(true);
                        }}
                        title="Update Notes"
                      >
                        <NotesIcon />
                      </IconButton>
                    </>
                  )}
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleCancelAppointment(appointment)}
                    title="Cancel Appointment"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={isNewAppointmentModalOpen}
        onClose={() => setIsNewAppointmentModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box component="form" onSubmit={handleCreateAppointment} sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            New Appointment
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={newAppointment.title}
                onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Patient Name"
                name="patientName"
                value={newAppointment.patientName}
                onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                name="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="time"
                label="Time"
                name="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Duration (minutes)"
                value={newAppointment.duration}
                onChange={(e) => setNewAppointment({ ...newAppointment, duration: e.target.value })}
              >
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={45}>45 minutes</MenuItem>
                <MenuItem value={60}>1 hour</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                name="notes"
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setIsNewAppointmentModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create Appointment
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onClose={() => setIsStatusDialogOpen(false)}>
        <DialogTitle>Update Appointment Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            margin="normal"
          >
            {['pending', 'approved', 'completed', 'cancelled'].map((status) => (
              <MenuItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Notes Update Dialog */}
      <Dialog open={isNotesDialogOpen} onClose={() => setIsNotesDialogOpen(false)}>
        <DialogTitle>Update Appointment Notes</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNotesDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleNotesUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
