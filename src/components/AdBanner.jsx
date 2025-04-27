import { Box, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { shouldShowAd } from '../config/adConfig';

export default function AdBanner({ slot, format = 'auto', responsive = true, style = {} }) {
  const [isLoaded, setIsLoaded] = useState(false);
  // 添加您的新域名到允许的域名列表中
  const allowedDomains = ['tool.blog'];
  const isAllowedDomain = allowedDomains.includes(window.location.hostname);
  const showAd = shouldShowAd() && isAllowedDomain;
  
  useEffect(() => {
    if (!showAd) return;
    
    // 设置超时，如果广告长时间未加载，也显示内容区域
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
    
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({
        callback: () => {
          setIsLoaded(true);
          clearTimeout(timeout);
        }
      });
    } catch (e) {
      console.error('AdSense 广告加载失败:', e);
      setIsLoaded(true);
      clearTimeout(timeout);
    }
    
    return () => clearTimeout(timeout);
  }, [showAd]);
  
  if (!showAd) return null;
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        my: 2,
        minHeight: isLoaded ? 'auto' : '100px',
        ...style 
      }}
      className="ad-container"
    >
      {!isLoaded && <Skeleton variant="rectangular" width="100%" height={100} />}
      <ins
        className="adsbygoogle"
        style={{
          display: isLoaded ? 'block' : 'none',
          textAlign: 'center',
          width: '100%',
        }}
        data-ad-client="ca-pub-5760733313637437"  // 应更新为您的实际发布商ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      ></ins>
    </Box>
  );
}