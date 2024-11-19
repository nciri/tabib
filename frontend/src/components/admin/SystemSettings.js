import React from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';

export default function SystemSettings() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>System Settings</Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          margin="normal"
          required
          fullWidth
          id="siteName"
          label="Site Name"
          name="siteName"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="adminEmail"
          label="Admin Email"
          type="email"
          id="adminEmail"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Save Settings
        </Button>
      </Box>
    </div>
  );
}
