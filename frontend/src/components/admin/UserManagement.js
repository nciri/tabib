import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, Typography, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tabs, Tab, Box } from '@mui/material';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, userId: null, isClient: false });
  const [roleChangeConfirmation, setRoleChangeConfirmation] = useState({ open: false, userId: null, newRole: null, isClient: false });
  const [currentTab, setCurrentTab] = useState(0);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchClients();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/clients', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const initiateDeleteUser = (userId) => {
    setDeleteConfirmation({ open: true, userId, isClient: false });
  };

  const initiateChangeUserRole = (userId, newRole) => {
    setRoleChangeConfirmation({ open: true, userId, newRole, isClient: false });
  };

  const initiateDeleteClient = (clientId) => {
    setDeleteConfirmation({ open: true, userId: clientId, isClient: true });
  };

  const deleteUser = async () => {
    const { userId, isClient } = deleteConfirmation;
    setDeleteConfirmation({ open: false, userId: null, isClient: false });
    try {
      const endpoint = isClient ? `http://localhost:5000/api/admin/clients/${userId}` : `http://localhost:5000/api/admin/users/${userId}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error(`Failed to delete ${isClient ? 'client' : 'user'}`);
      if (isClient) {
        setClients(clients.filter(client => client.id !== userId));
      } else {
        setUsers(users.filter(user => user.id !== userId));
      }
      setSnackbar({ open: true, message: `${isClient ? 'Client' : 'User'} deleted successfully`, severity: 'success' });
    } catch (err) {
      setError(err.message);
      setSnackbar({ open: true, message: `Failed to delete ${isClient ? 'client' : 'user'}`, severity: 'error' });
    }
  };

  const changeUserRole = async () => {
    const { userId, newRole, isClient } = roleChangeConfirmation;
    setRoleChangeConfirmation({ open: false, userId: null, newRole: null, isClient: false });
    try {
      const endpoint = isClient 
        ? `http://localhost:5000/api/admin/clients/${userId}/role`
        : `http://localhost:5000/api/admin/users/${userId}/role`;
      
      console.log(`Changing role for ${isClient ? 'client' : 'user'} ${userId} to ${newRole}`);
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || `Failed to change ${isClient ? 'client' : 'user'} role`);
      }
      const data = await response.json();
      console.log('Success response:', data);
      if (isClient) {
        setClients(clients.map(client => client.id === userId ? { ...client, role: newRole } : client));
      } else {
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
      }
      setSnackbar({ open: true, message: `${isClient ? 'Client' : 'User'} role updated successfully`, severity: 'success' });
    } catch (err) {
      console.error('Error in changeUserRole:', err);
      setError(err.message);
      setSnackbar({ open: true, message: `Failed to update ${isClient ? 'client' : 'user'} role`, severity: 'error' });
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const initiateChangeClientRole = (clientId, newRole) => {
    setRoleChangeConfirmation({ open: true, userId: clientId, newRole, isClient: true });
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={currentTab} onChange={handleTabChange}>
        <Tab label="Users" />
        <Tab label="Clients" />
      </Tabs>
      {currentTab === 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) => initiateChangeUserRole(user.id, e.target.value)}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="patient">Patient</MenuItem>
                      <MenuItem value="doctor">Doctor</MenuItem>
                      <MenuItem value="hospitalAdmin">Hospital Admin</MenuItem>
                      <MenuItem value="hospitalStaff">Hospital staff</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => initiateDeleteUser(user.id)} color="secondary">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Speciality</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.speciality}</TableCell>
                  <TableCell>{client.city}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.type}</TableCell>
                  <TableCell>
                    <Select
                      value={client.role}
                      onChange={(e) => initiateChangeClientRole(client.id, e.target.value)}
                    >
                      <MenuItem value="client">Client</MenuItem>
                      <MenuItem value="doctor">Doctor</MenuItem>
                      <MenuItem value="hospitalAdmin">Hospital Admin</MenuItem>
                      <MenuItem value="hospitalStaff">Hospital Staff</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => initiateDeleteClient(client.id)} color="secondary">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={deleteConfirmation.open}
        onClose={() => setDeleteConfirmation({ open: false, userId: null, isClient: false })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmation({ open: false, userId: null, isClient: false })}>Cancel</Button>
          <Button onClick={deleteUser} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={roleChangeConfirmation.open}
        onClose={() => setRoleChangeConfirmation({ open: false, userId: null, newRole: null, isClient: false })}
      >
        <DialogTitle>Confirm Role Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change this {roleChangeConfirmation.isClient ? 'client' : 'user'}'s role to {roleChangeConfirmation.newRole}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleChangeConfirmation({ open: false, userId: null, newRole: null, isClient: false })}>Cancel</Button>
          <Button onClick={changeUserRole} color="primary">Change Role</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
