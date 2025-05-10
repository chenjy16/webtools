import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';

function ChatMessage({ message }) {
  // 修正：使用正确的属性名
  const isUser = message.isUser;
  const content = message.text;
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        maxWidth: '100%',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: '12px',
          backgroundColor: isUser ? 'primary.light' : '#f5f5f5',
          color: isUser ? 'white' : 'text.primary',
          maxWidth: '85%',
          overflowWrap: 'break-word',
        }}
      >
        {isUser ? (
          <Typography variant="body1">{content}</Typography>
        ) : (
          <Box sx={{ 
            '& p': { mt: 0, mb: 1.5 },
            '& p:last-child': { mb: 0 },
            '& pre': { 
              backgroundColor: '#f0f0f0', 
              p: 1.5, 
              borderRadius: 1,
              overflowX: 'auto',
              fontSize: '0.875rem'
            },
            '& code': {
              backgroundColor: '#f0f0f0',
              p: 0.5,
              borderRadius: 0.5,
              fontSize: '0.875rem'
            },
            '& ul, & ol': { pl: 2.5, mb: 1.5 },
            '& a': { color: 'primary.main' }
          }}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default ChatMessage;