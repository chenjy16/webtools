import { Box, Chip, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ResultSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#f5f5f5',
}));

export const KeywordChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export const ChatMessageContainer = styled(Box)(({ theme, isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  marginBottom: theme.spacing(2),
}));

export const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  maxWidth: '80%',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  backgroundColor: isUser 
    ? theme.palette.primary.main 
    : theme.palette.mode === 'dark' ? '#424242' : '#f1f1f1',
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
}));

// Add the missing StyledScrollBox component
export const StyledScrollBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(1),
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#c1c1c1',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#a8a8a8',
  },
}));