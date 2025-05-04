import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const HistoryPanel = ({ history, onLoadHistory, onClearHistory }) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">
          History
        </Typography>
        {history.length > 0 && (
          <Button size="small" onClick={onClearHistory} startIcon={<DeleteIcon />}>
            Clear
          </Button>
        )}
      </Box>
      <List dense>
        {history.length === 0 ? (
          <ListItem>
            <ListItemText primary="No request history" />
          </ListItem>
        ) : (
          history.slice(0, 10).map((item) => (
            <ListItem key={item.id} button onClick={() => onLoadHistory(item)}>
              <ListItemText 
                primary={`${item.method} ${item.url.substring(0, 20)}...`}
                secondary={new Date(item.timestamp).toLocaleString()}
              />
            </ListItem>
          ))
        )}
      </List>
    </>
  );
};

export default HistoryPanel;