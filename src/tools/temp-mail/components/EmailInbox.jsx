import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import MessageList from './MessageList';
import MessageDetail from './MessageDetail';
import { copyToClipboard } from '../utils/helpers';

export default function EmailInbox({ 
  account, 
  messages, 
  currentMessage, 
  messageLoading, 
  listLoading, 
  onRefresh, 
  onDeleteAccount, 
  onMessageClick, 
  onMessageBack, 
  onMessageDelete,
  showSnackbar
}) {
  return (
    <Box>
      {/* 邮箱信息卡片 */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Your Temporary Email:
          </Typography>
          <Box>
            <Tooltip title="Copy Email Address">
              <IconButton onClick={() => copyToClipboard(account.address, showSnackbar)} color="primary">
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh Inbox">
              <IconButton 
                onClick={onRefresh} 
                disabled={listLoading}
                color="primary"
                sx={{ mx: 1 }}
              >
                {listLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Email">
              <IconButton color="error" onClick={onDeleteAccount}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <TextField
          fullWidth
          value={account.address}
          InputProps={{
            readOnly: true,
            sx: { mt: 1, fontWeight: 'medium', fontSize: '1.05rem' }
          }}
        />
      </Paper>

      {/* 条件渲染：邮件详情或邮件列表 */}
      {currentMessage ? (
        <Paper>
          <MessageDetail 
            message={currentMessage} 
            loading={messageLoading} 
            onBack={onMessageBack} 
            onDelete={onMessageDelete} 
          />
        </Paper>
      ) : (
        <MessageList 
          messages={messages} 
          loading={listLoading} 
          onMessageClick={onMessageClick} 
        />
      )}
    </Box>
  );
}