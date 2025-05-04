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

const ParamsTab = ({ params, onParamChange, onRemoveParam }) => {
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
          {params.map((param, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  value={param.key}
                  onChange={(e) => onParamChange(index, 'key', e.target.value)}
                  placeholder="Parameter name"
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  value={param.value}
                  onChange={(e) => onParamChange(index, 'value', e.target.value)}
                  placeholder="Parameter value"
                />
              </TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => onRemoveParam(index)}
                  disabled={params.length === 1 && !param.key && !param.value}
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

export default ParamsTab;