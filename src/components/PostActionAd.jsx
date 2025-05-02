import { useState, useEffect } from 'react';
import { Box, Paper, IconButton, Typography, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AdBanner from './AdBanner';
import { adConfig } from '../config/adConfig';

const PostActionAd = ({ 
  action = 'completion', 
  timeout = 500,
  format = 'rectangle',
  duration = 0,
  onClose
}) => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    // 延迟显示广告，给用户一个缓冲时间
    const timer = setTimeout(() => {
      setShow(true);
    }, timeout);
    
    // 如果设置了持续时间，则在指定时间后自动关闭
    let durationTimer;
    if (duration > 0) {
      durationTimer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, timeout + duration);
    }
    
    return () => {
      clearTimeout(timer);
      if (durationTimer) clearTimeout(durationTimer);
    };
  }, [timeout, duration, onClose]);
  
  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };
  
  if (!show) return null;
  
  return (
    <Fade in={show} timeout={300}>
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          maxWidth: format === 'rectangle' ? '336px' : '100%',
          margin: '20px auto',
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          border: '1px solid #e0e0e0',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: 5, right: 5, zIndex: 2 }}>
          <IconButton size="small" onClick={handleClose} aria-label="关闭广告">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontSize: '0.7rem' }}>
          赞助内容
        </Typography>
        
        <AdBanner
          slot={adConfig.inContent.slot}
          format={format}
          responsive={true}
          lazyLoad={false}
        />
      </Paper>
    </Fade>
  );
};

export default PostActionAd;