import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import AdBanner from './AdBanner';
import { getToolAdConfig } from '../config/adConfig';

const ToolLayout = ({ 
  title, 
  description, 
  children, 
  toolType = 'default',
  showTopAd = true,
  showBottomAd = true
}) => {
  const adConfig = getToolAdConfig(toolType);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [userEngaged, setUserEngaged] = useState(false);
  const [pageLoadTime, setPageLoadTime] = useState(Date.now());
  const [showAds, setShowAds] = useState(false);
  
  // 监听用户交互
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserEngaged(true);
    };
    
    // 页面加载3秒后或用户交互后显示广告
    const timer = setTimeout(() => {
      setShowAds(true);
    }, 3000);
    
    window.addEventListener('scroll', handleUserInteraction);
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);
  
  // 用户交互后显示广告
  useEffect(() => {
    if (userEngaged) {
      setShowAds(true);
    }
  }, [userEngaged]);
  
  return (
    <Box sx={{ 
      maxWidth: '100%',  // 确保使用100%宽度
      width: '100%',     // 添加宽度100%
      mx: 'auto', 
      p: { xs: 1, sm: 2 } 
    }}>
      {/* 工具标题和描述 */}
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>
      )}
      
      {/* 顶部广告 - 仅在页面加载后延迟显示 */}
      {showTopAd && showAds && (
        <Box sx={{ mb: 3, transition: 'opacity 0.5s ease', opacity: 1 }}>
          <AdBanner 
            slot={adConfig.slot} 
            format={isMobile ? 'rectangle' : adConfig.format} 
            responsive={adConfig.responsive} 
            lazyLoad={true}
          />
        </Box>
      )}
      
      {/* 工具内容 */}
      {children}
      
      {/* 底部广告 - 始终延迟加载 */}
      {showBottomAd && (
        <Box sx={{ mt: 3 }}>
          <AdBanner 
            slot={adConfig.slot} 
            format={adConfig.format} 
            responsive={adConfig.responsive} 
            lazyLoad={true}
          />
        </Box>
      )}
    </Box>
  );
};

export default ToolLayout;