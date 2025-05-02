import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress
} from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { formatDate } from '../utils/helpers';

export default function MessageList({ messages, loading, onMessageClick }) {
  return (
    <Box sx={{ borderRadius: 2, boxShadow: 2, overflow: 'hidden' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        px: 3, 
        py: 2,
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'rgba(0, 0, 0, 0.02)'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Inbox
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {messages.length > 0 ? `${messages.length} message(s)` : ''}
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : messages.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, px: 3 }}>
          <MarkEmailReadIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Messages
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Messages will automatically refresh every 10 seconds, or you can manually refresh
          </Typography>
        </Box>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              {index > 0 && <Divider component="li" />}
              <ListItem 
                alignItems="flex-start" 
                button 
                onClick={() => onMessageClick(message.id)}
                sx={{ 
                  py: 1.5,
                  px: 2,
                  bgcolor: message.seen ? 'inherit' : 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  },
                  transition: 'background-color 0.2s'
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: message.seen ? 'action.disabled' : 'primary.main' }}>
                    {message.seen ? <MarkEmailReadIcon /> : <MarkEmailUnreadIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        component="span"
                        variant="body1"
                        color="text.primary"
                        sx={{ 
                          fontWeight: message.seen ? 'normal' : 'bold',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: { xs: '180px', sm: '250px', md: '400px' }
                        }}
                      >
                        {message.subject || '(No Subject)'}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1, flexShrink: 0 }}
                      >
                        {formatDate(message.createdAt)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block', fontWeight: message.seen ? 'normal' : 'medium' }}
                      >
                        {message.from?.address || 'Unknown'}
                      </Typography>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {message.intro || '(No preview)'}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}