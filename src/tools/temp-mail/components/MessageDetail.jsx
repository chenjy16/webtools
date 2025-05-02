import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
  Tooltip,
  Button,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PrintIcon from '@mui/icons-material/Print';
import { formatDate, renderHtmlContent, copyToClipboard } from '../utils/helpers';

export default function MessageDetail({ message, loading, onBack, onDelete, showSnackbar }) {
  if (!message) return null;
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${message.subject || '(No Subject)'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { margin-bottom: 20px; }
            .content { border: 1px solid #eee; padding: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${message.subject || '(No Subject)'}</h2>
            <p><strong>From:</strong> ${message.from?.name || ''} &lt;${message.from?.address || ''}&gt;</p>
            <p><strong>To:</strong> ${message.to?.map(to => `${to.name || ''} <${to.address || ''}>`).join(', ')}</p>
            <p><strong>Date:</strong> ${formatDate(message.createdAt)}</p>
          </div>
          <div class="content">
            ${message.html || message.text || '(No Content)'}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const copyEmailContent = () => {
    const content = message.text || (message.html ? message.html.replace(/<[^>]*>/g, ' ') : '');
    copyToClipboard(content, showSnackbar);
  };

  return (
    <Box sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton 
          onClick={onBack} 
          sx={{ mr: 1 }}
          color="primary"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {message.subject || '(No Subject)'}
        </Typography>
        <Box>
          <Tooltip title="复制内容">
            <IconButton color="primary" onClick={copyEmailContent} sx={{ mr: 1 }}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="打印邮件">
            <IconButton color="primary" onClick={handlePrint} sx={{ mr: 1 }}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="删除邮件">
            <IconButton color="error" onClick={() => onDelete(message.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ mb: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)', p: 2, borderRadius: 1 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>发件人:</strong> {message.from?.name || ''} &lt;{message.from?.address || ''}&gt;
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>收件人:</strong> {message.to?.map(to => `${to.name || ''} <${to.address || ''}>`).join(', ')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>日期:</strong> {formatDate(message.createdAt)}
        </Typography>
        {message.attachments && message.attachments.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>附件:</strong>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {message.attachments.map((attachment, index) => (
                <Chip 
                  key={index}
                  label={attachment.filename}
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(attachment.downloadUrl)}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box 
            sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: 1, 
              p: 2, 
              maxHeight: '60vh', 
              overflow: 'auto',
              backgroundColor: '#ffffff'
            }}
          >
            {message.html ? (
              <Box 
                sx={{ 
                  '& img': { maxWidth: '100%' },
                  '& a': { wordBreak: 'break-all' },
                  '& table': { maxWidth: '100%' }
                }}
                dangerouslySetInnerHTML={renderHtmlContent(message.html)} 
              />
            ) : (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.text || '(No Content)'}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}