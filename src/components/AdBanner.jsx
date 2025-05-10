import { useState, useEffect, useRef } from 'react';
import { Box, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { trackAdImpression, trackAdClick } from '../utils/analytics';

const AdBanner = ({
  slot,
  format = 'horizontal',
  responsive = true,
  lazyLoad = true,
  className = '',
  style = {}
}) => {
  const [isLoaded, setIsLoaded] = useState(!lazyLoad);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const adContainerRef = useRef(null);
  const adInsRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 根据设备类型自动调整广告格式
  const effectiveFormat = isMobile && format === 'horizontal' ? 'rectangle' : format;

  useEffect(() => {
    if (!lazyLoad) {
      setIsVisible(true);
      return;
    }
    // IntersectionObserver 懒加载
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );
    if (adContainerRef.current) {
      observer.observe(adContainerRef.current);
    }
    return () => {
      if (adContainerRef.current) {
        observer.unobserve(adContainerRef.current);
      }
      observer.disconnect();
    };
  }, [slot, lazyLoad]);

  // 只在广告首次可见且未加载时 push
  useEffect(() => {
    if (isVisible && !isLoaded) {
      setIsLoaded(true);
      // 确保只 push 一次
      setTimeout(() => {
        try {
          if (window.adsbygoogle && adInsRef.current) {
            window.adsbygoogle.push({});
          }
        } catch (error) {
          console.error('广告加载失败:', error);
          setHasError(true);
        }
      }, 100);
    }
  }, [isVisible, isLoaded]);

  // 广告加载失败时隐藏
  const handleAdError = () => {
    setHasError(true);
    console.log(`广告加载失败: ${slot}`);
  };

  // 根据格式确定广告尺寸
  const getAdSize = () => {
    switch (effectiveFormat) {
      case 'horizontal':
        return { width: '100%', height: isMobile ? '90px' : '90px' };
      case 'vertical':
        return { width: isMobile ? '120px' : '160px', height: isMobile ? '400px' : '600px' };
      case 'rectangle':
        return { width: isMobile ? '250px' : '300px', height: isMobile ? '200px' : '250px' };
      case 'adaptive':
        return { width: '100%', height: 'auto', minHeight: isMobile ? '100px' : '150px' };
      default:
        return { width: '100%', height: 'auto' };
    }
  };

  const adSize = getAdSize();

  if (hasError) return null;

  return (
    <Box
      ref={adContainerRef}
      id={`ad-container-${slot}`}
      className={`ad-container ${className}`}
      sx={{
        width: adSize.width,
        height: adSize.height,
        margin: '10px auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        ...style
      }}
    >
      {!isLoaded ? (
        <Skeleton
          variant="rectangular"
          width={adSize.width}
          height={adSize.height}
          animation="wave"
        />
      ) : (
        <ins
          ref={adInsRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            width: adSize.width,
            height: adSize.height,
          }}
          data-ad-client="ca-pub-5760733313637437"
          data-ad-slot={slot}
          data-ad-format={effectiveFormat}
          data-full-width-responsive={responsive ? 'true' : 'false'}
          onError={handleAdError}
        />
      )}
    </Box>
  );
};

export default AdBanner;