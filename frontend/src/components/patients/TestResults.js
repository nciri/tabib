import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

export default function TestResults({ testResults }) {
  if (!testResults?.length) return <Typography>No test results available</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Test Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Result</TableCell>
            <TableCell>Normal Range</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Report</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {testResults.map((test) => (
            <TableRow key={test.id}>
              <TableCell>{test.testName}</TableCell>
              <TableCell>{new Date(test.testDate).toLocaleDateString()}</TableCell>
              <TableCell>{test.result}</TableCell>
              <TableCell>{test.normalRange}</TableCell>
              <TableCell>
                <Chip
                  label={test.result > test.normalRange ? 'High' : 
                         test.result < test.normalRange ? 'Low' : 'Normal'}
                  color={test.result > test.normalRange ? 'error' :
                         test.result < test.normalRange ? 'warning' : 'success'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {test.fileUrl && (
                  <IconButton
                    size="small"
                    onClick={() => window.open(test.fileUrl, '_blank')}
                  >
                    <DownloadIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 