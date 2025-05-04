import React from 'react';
import {
  Box,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const HeadersTab = ({ headers, onHeaderChange, onRemoveHeader }) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>Value</TableCell>
            <TableCell width="50px"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {headers.map((header, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  value={header.key}
                  onChange={(e) => onHeaderChange(index, 'key', e.target.value)}
                  placeholder="Header name"
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  value={header.value}
                  onChange={(e) => onHeaderChange(index, 'value', e.target.value)}
                  placeholder="Header value"
                />
              </TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => onRemoveHeader(index)}
                  disabled={headers.length === 1 && !header.key && !header.value}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HeadersTab;