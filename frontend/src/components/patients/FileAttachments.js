import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Box
} from '@mui/material';
import {
  Description as FileIcon,
  Download as DownloadIcon,
  Add as AddIcon
} from '@mui/icons-material';

export default function FileAttachments({ files }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Implement file upload logic
      console.log('File to upload:', file);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Medical Documents</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component="label"
        >
          Upload File
          <input
            type="file"
            hidden
            onChange={handleFileUpload}
          />
        </Button>
      </Box>

      {!files?.length ? (
        <Typography>No files attached</Typography>
      ) : (
        <List>
          {files.map((file) => (
            <ListItem key={file.id}>
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={`Uploaded on ${new Date(file.uploadDate).toLocaleDateString()}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => window.open(file.url, '_blank')}
                >
                  <DownloadIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
} 