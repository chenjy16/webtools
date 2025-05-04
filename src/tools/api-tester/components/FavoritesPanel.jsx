import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const FavoritesPanel = ({ favorites, onLoadFavorite, onDeleteFavorite }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Favorites
      </Typography>
      <List dense>
        {favorites.length === 0 ? (
          <ListItem>
            <ListItemText primary="No saved requests" />
          </ListItem>
        ) : (
          favorites.map((favorite) => (
            <ListItem key={favorite.id} button onClick={() => onLoadFavorite(favorite)}>
              <ListItemText 
                primary={favorite.name} 
                secondary={`${favorite.method} ${favorite.url.substring(0, 20)}...`} 
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => onDeleteFavorite(favorite.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        )}
      </List>
    </>
  );
};

export default FavoritesPanel;