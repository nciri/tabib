import React from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  Box 
} from '@mui/material';
import { format } from 'date-fns';

export default function MedicalHistory({ history }) {
  if (!history?.length) return <Typography>No medical history available</Typography>;

  return (
    <Paper sx={{ p: 2 }}>
      <List>
        {history.map((record, index) => (
          <React.Fragment key={record.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">{record.condition}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {format(new Date(record.date), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Treatment: {record.treatment}
                    </Typography>
                    {record.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Notes: {record.notes}
                      </Typography>
                    )}
                  </>
                }
              />
            </ListItem>
            {index < history.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
} 