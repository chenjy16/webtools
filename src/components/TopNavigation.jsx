import { Button, Box, Grid, Typography, Paper, useMediaQuery, useTheme, IconButton, Drawer, List, ListItem, ListItemText, Divider, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AdBanner from './AdBanner'; // 导入广告组件
import { adConfig } from '../config/adConfig'; // 导入广告配置

// 工具分类
const toolCategories = [
  {
    name: 'Encoding & Formatting',
    tools: [
      { name: 'Base64 Converter', path: '/base64-converter' },
      { name: 'URL Encoder/Decoder', path: '/url-encoder' },
      { name: 'JWT Decoder', path: '/jwt-decoder' },
      { name: 'Hash Calculator', path: '/hash-calculator' },
      { name: 'HMAC Calculator', path: '/hmac-calculator' },
      { name: 'JSON Formatter', path: '/json-formatter' },
      { name: 'Code Formatter', path: '/code-formatter' },
      { name: 'Regex Tester', path: '/regex-tester' },
      { name: 'Password Generator', path: '/password-generator' },
      { name: 'Cron Generator', path: '/cron-generator' },
    ]
  },

  // 在 toolCategories 数组中的 "Network & Finance Tools" 分类中添加网络延迟测试工具
  {
    name: 'Network',
    tools: [
      { name: 'IP Lookup', path: '/ip-lookup' },
      { name: 'DNS Lookup', path: '/dns-lookup' },
      { name: 'Speed Test', path: '/speed-test' },
      { name: 'Network Latency', path: '/network-latency' }, // 添加网络延迟测试工具
      { name: 'Country Info', path: '/country-info' },
      { name: 'Currency Converter', path: '/CurrencyConverter' },
      { name: 'Mortgage Calculator', path: '/mortgage-calculator' },
      { name: 'Temporary Email Generator', path: '/temp-mail' },
    ]
  },

  {
    name: 'Media',
    tools: [
      { name: 'QR Code Generator', path: '/qrcode-generator' },
      { name: 'Image Compressor', path: '/image-compressor' },
      { name: 'PDF Tools', path: '/pdf-tools' },
      { name: 'Unit Converter', path: '/unit-converter' },
      { name: 'Color Converter', path: '/color-converter' },
      { name: 'Personal Information ', path: '/fake-data-generator' },

    ]
  },
  {
    name: 'Time & Date',
    tools: [
      { name: 'Date Calculator', path: '/date-calculator' },
      { name: 'Timer', path: '/timer' },
      { name: 'public holidays', path: '/public-holidays' },
    ]
  },

  {
    name: 'Games',
    tools: [
      { name: 'Snake Game', path: '/games/snake' },
      { name: 'Tetris', path: '/games/tetris' },
    ]
  },
  {
    name: 'Website Navigation',
    tools: [
      { name: 'Stream Videos', path: '/stream-videos' }, // 添加Stream Videos选项
      { name: 'Video Tools', path: '/video-tools' }, // 添加Video Tools选项
    ]
  },
];


export default function TopNavigation({ location, onNavigate, vertical = false }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAd, setShowAd] = useState(false); // 添加广告显示状态

  // 判断是否为游戏路径
  const isGamePath = (path) => {
    return path.startsWith('/games/');
  };

  // 修改点击处理函数，添加广告显示逻辑
  const handleClick = (path) => {
    // 如果是游戏路径，显示广告
    if (isGamePath(path)) {
      setShowAd(true);
      
      // 5秒后自动关闭广告
      setTimeout(() => {
        setShowAd(false);
      }, 5000);
    }
    
    // 原有的导航逻辑
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  // 关闭广告的处理函数
  const handleCloseAd = () => {
    setShowAd(false);
  };

  const isActive = (path) => location?.pathname === path;

  // 移动端抽屉菜单
  const renderMobileDrawer = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <IconButton 
          onClick={() => setDrawerOpen(true)}
          sx={{ color: 'primary.main' }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            工具导航
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {toolCategories.map((category) => (
            <Box key={category.name} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                {category.name}
              </Typography>
              <List dense>
                {category.tools.map((tool) => (
                  <ListItem 
                    button 
                    key={tool.path}
                    onClick={() => handleClick(tool.path)}
                    selected={isActive(tool.path)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      backgroundColor: isActive(tool.path) ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                    }}
                  >
                    <ListItemText primary={tool.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Box>
      </Drawer>
    </>
  );

  // 桌面版网格布局
  const renderDesktopGrid = () => (
    <Grid container spacing={1} sx={{ maxWidth: '100%' }}>  {/* 添加maxWidth: '100%'确保网格可以占用全部可用宽度 */}
      {toolCategories.map((category) => (
        <Grid item xs={12} sm={6} md={4} lg={2} xl={2} key={category.name} sx={{ 
          display: 'flex',
          mb: 1
        }}>
          <Paper
            elevation={2}
            sx={{
              p: 1.5,  // 将内边距从2减小为1.5
              width: '100%',
              height: '100%',
              borderRadius: 2,  // 将圆角从3减小为2
              backgroundColor: 'background.paper',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
              },
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 1.5,  // 将底部外边距从2减小为1.5
                color: 'primary.main',
                borderBottom: '2px solid',
                borderColor: 'primary.light',
                pb: 0.5,
                letterSpacing: '0.5px',
                fontSize: '0.9rem',
              }}
            >
              {category.name}
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              flexGrow: 1 // 让内容区域填充剩余空间
            }}>
              {category.tools.map((tool) => (
                <Button
                  key={tool.path}
                  onClick={() => handleClick(tool.path)}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    py: 0.75, // 减小垂直内边距
                    px: 1,    // 减小水平内边距
                    mb: 0.5,
                    borderRadius: 2,
                    fontSize: '0.85rem', // 稍微减小字体大小
                    fontWeight: isActive(tool.path) ? 600 : 400,
                    color: isActive(tool.path) ? 'primary.main' : 'text.primary',
                    backgroundColor: isActive(tool.path)
                      ? 'rgba(25, 118, 210, 0.1)'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive(tool.path)
                        ? 'rgba(25, 118, 210, 0.15)'
                        : 'action.hover',
                    },
                    transition: 'all 0.2s ease-in-out',
                    textTransform: 'none',
                    whiteSpace: 'nowrap', // 防止按钮文字换行
                    overflow: 'hidden',
                    textOverflow: 'ellipsis', // 超出部分显示省略号
                    minWidth: 'unset', // 移除按钮的最小宽度限制
                    width: '100%' // 确保按钮占满容器宽度
                  }}
                >
                  {tool.name}
                </Button>
              ))}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', py: isMobile ? 1 : 3 }}>
      {isMobile ? renderMobileDrawer() : renderDesktopGrid()}
      
      {/* 操作完成后显示的广告 */} 
      {showAd && ( 
        <Fade in={showAd} timeout={500}> 
          <Paper 
            elevation={3} 
            sx={{ 
              mt: 3, 
              p: 2, 
              position: 'relative', 
              borderRadius: 2, 
              border: '1px solid #e0e0e0', 
              backgroundColor: '#f9f9f9', 
              maxWidth: 800, 
              mx: 'auto' 
            }} 
          > 
            <Box sx={{ position: 'absolute', top: 5, right: 5, zIndex: 2 }}> 
              <IconButton size="small" onClick={handleCloseAd} aria-label="Close Advertisement"> 
                <CloseIcon fontSize="small" /> 
              </IconButton> 
            </Box> 
            
            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontSize: '0.7rem' }}> 
              Promoted Content 
            </Typography> 
            
            <AdBanner 
              slot={adConfig.postAction ? adConfig.inContent.slot : adConfig.postAction.slot } 
              format="rectangle" 
              responsive={true} 
              lazyLoad={false} 
            /> 
          </Paper> 
        </Fade> 
      )}
    </Box>
  );
}
