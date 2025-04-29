import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../components/AdBanner';
import Footer from '../components/Footer';
import CategorizedSidebar from '../components/CategorizedSidebar';
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Paper
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DragHandleIcon from '@mui/icons-material/DragHandle';

// --- Constants ---
const defaultDrawerWidth = 240;
const minDrawerWidth = 180;
const maxDrawerWidth = 400;

// --- Tool Data (for titles, descriptions, etc.) ---
const toolData = [
  { name: 'Password Generator', path: '/password-generator' },
  { name: 'JSON Formatter', path: '/json-formatter' },
  { name: 'HMAC Calculator', path: '/hmac-calculator' },
  { name: 'QR Code Generator', path: '/qrcode-generator' },
  { name: 'URL Encoder/Decoder', path: '/url-encoder' },
  { name: 'Base64 Converter', path: '/base64-converter' },
  { name: 'Hash Calculator', path: '/hash-calculator' },
  { name: 'Color Converter', path: '/color-converter' },
  { name: 'IP Address Lookup', path: '/ip-lookup' },
  { name: 'JWT Decoder', path: '/jwt-decoder' },
  { name: 'Date Calculator', path: '/date-calculator' },
  { name: 'Regex Tester', path: '/regex-tester' },
  { name: 'Timer Tool', path: '/timer' },
  { name: 'Code Formatter/Minifier', path: '/code-formatter' },
  { name: 'Unit Converter', path: '/unit-converter' },
  { name: 'Currency Converter', path: '/CurrencyConverter' },
  { name: 'Mortgage Calculator', path: '/mortgage-calculator' },
  { name: 'Country Information Finder', path: '/country-info' },
  { name: 'Mock Data Generator', path: '/fake-data-generator' },
  { name: 'Cron Expression Generator', path: '/cron-generator' },
  { name: 'Image Compressor', path: '/image-compressor' },
  { name: 'PDF Tools', path: '/pdf-tools' } // 添加 PDF 工具
];

// 添加工具描述对象
const descriptions = {
  '/': 'A collection of free online developer tools, including formatting, conversion, and generator tools, to enhance your work efficiency.',
  '/password-generator': 'Generate secure, random passwords with customizable length and character types.',
  '/json-formatter': 'Format and validate JSON data to make it easier to read and edit.',
  '/hmac-calculator': 'Calculate HMAC values using various hash algorithms for security verification.',
  '/qrcode-generator': 'Create custom QR codes for URLs, text, or contact information.',
  '/url-encoder': 'Encode and decode URL strings, supporting special characters and Unicode.',
  '/base64-converter': 'Convert between text and Base64 encoding, with file upload support.',
  '/hash-calculator': 'Calculate hash values for text or files, supporting multiple hash algorithms.',
  '/color-converter': 'Convert between color formats such as HEX, RGB, and HSL.',
  '/ip-lookup': 'Query detailed information about IP addresses, including geolocation and ISP data.',
  '/jwt-decoder': 'Decode and verify JWT tokens to view the contained data.',
  '/date-calculator': 'Calculate date differences, add or subtract time units.',
  '/regex-tester': 'Test and validate regular expressions with real-time matching results.',
  '/timer': 'Online timer and countdown tool with reminder functionality.',
  '/code-formatter': 'Format and minify code, supporting multiple programming languages.',
  '/unit-converter': 'Convert between different units, including length, weight, temperature, and more.',
  '/CurrencyConverter': 'Real-time currency conversion supporting major global currencies.',
  '/mortgage-calculator': 'Calculate mortgage payments, total interest, and repayment schedules.',
  '/country-info': 'Find country information, including population, currency, time zones, and more.',
  '/fake-data-generator': 'Generate mock personal data for testing and development purposes.',
  '/cron-generator': 'Create and parse Cron expressions for task scheduling.',
  '/image-compressor': 'Compress and convert images to reduce file size while maintaining quality.',
  '/pdf-tools': 'Merge multiple PDF files into one document or split a PDF into individual pages.' // 添加 PDF 工具描述
};

// --- Main Layout Component ---
// Assume `toggleDarkMode` function is passed as a prop or obtained from context
export default function MainLayout({ toggleDarkMode, currentMode = 'light' }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // 从本地存储中获取侧边栏状态
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const location = useLocation();
  const navigate = useNavigate();

  // 确定当前工具以设置标题/描述
  const currentTool = toolData.find(t => t.path === location.pathname) || { name: 'Web Tools', path: '/' };

  // SEO 元数据
  const siteName = 'CDTools - Free Online Developer Utilities';
  const title = currentTool.path === '/' ? siteName : `${currentTool.name} | ${siteName}`;
  const description = descriptions[currentTool.path] || `A collection of free online web tools like ${currentTool.name ? currentTool.name + ', ' : ''}formatters, converters, and generators for developers and designers.`;
  const canonicalUrl = `https://cdtools.org${location.pathname}`;

  // --- 抽屉宽度状态和调整逻辑 ---
  const [drawerWidth, setDrawerWidth] = useState(() => {
    if (sidebarCollapsed) return minDrawerWidth;
    const savedWidth = localStorage.getItem('drawerWidth');
    const parsedWidth = savedWidth ? parseInt(savedWidth, 10) : defaultDrawerWidth;
    return Math.min(Math.max(parsedWidth, minDrawerWidth), maxDrawerWidth);
  });
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  // 当宽度变化时保存到localStorage
  useEffect(() => {
    localStorage.setItem('drawerWidth', drawerWidth.toString());
  }, [drawerWidth]);

  // 保存侧边栏折叠状态
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // 鼠标移动处理器用于调整大小
  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    
    // 计算新宽度，确保在限制范围内
    const newWidth = Math.min(
      Math.max(e.clientX, minDrawerWidth),
      maxDrawerWidth
    );
    
    setDrawerWidth(newWidth);
    
    // 防止文本选择
    e.preventDefault();
  }, [isResizing]);

  // 鼠标抬起处理器停止调整大小
  const handleMouseUp = useCallback(() => {
    if (!isResizing) return;
    
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    // 移除全局事件监听器
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, isResizing]);

  // 鼠标按下处理器开始调整大小
  const startResizing = useCallback((e) => {
    if (sidebarCollapsed) return; // 折叠时不允许调整大小
    
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    
    // 添加全局事件监听器
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp, sidebarCollapsed]);

  // --- 抽屉切换和导航 ---
  const handleDrawerToggle = () => setMobileOpen(prev => !prev);
  
  // 侧边栏折叠/展开功能
  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(prev => {
      const newState = !prev;
      if (newState) {
        // 如果要折叠，保存当前宽度并设置为最小宽度
        localStorage.setItem('previousDrawerWidth', drawerWidth.toString());
        setDrawerWidth(minDrawerWidth);
      } else {
        // 如果要展开，恢复之前的宽度
        const previousWidth = localStorage.getItem('previousDrawerWidth');
        setDrawerWidth(previousWidth ? parseInt(previousWidth, 10) : defaultDrawerWidth);
      }
      return newState;
    });
  };

  const handleNavigate = useCallback((path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [navigate, isMobile]);

  // --- 抽屉内容 ---
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        minHeight: '64px' // 确保工具栏高度一致
      }}>
        <Typography variant="h6" noWrap component="div" sx={{ 
          fontWeight: 'bold',
          fontSize: sidebarCollapsed ? '0.8rem' : '1.25rem',
          transition: 'font-size 0.2s'
        }}>
          {sidebarCollapsed ? 'T.B' : 'Tool.blog'}
        </Typography>
        <IconButton 
          size="small" 
          onClick={toggleSidebarCollapse}
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          {sidebarCollapsed ? <MenuIcon fontSize="small" /> : <DragHandleIcon fontSize="small" />}
        </IconButton>
      </Toolbar>
      <Divider />
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '3px',
        }
      }}>
        <CategorizedSidebar 
          location={location} 
          onNavigate={handleNavigate} 
          collapsed={sidebarCollapsed}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <CssBaseline />
      
      {/* 应用栏 */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          boxShadow: 2,
          bgcolor: 'background.paper',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {currentTool.name}
          </Typography>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {currentMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* 移动端抽屉 */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRadius: 0
            },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* 桌面端抽屉 */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              transition: 'width 0.2s ease-in-out',
              overflowX: 'hidden'
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      
      {/* 调整大小的手柄 */}
      {!sidebarCollapsed && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: drawerWidth - 3,
            width: 6,
            height: '100%',
            cursor: 'col-resize',
            zIndex: 1201,
            display: { xs: 'none', md: 'block' }
          }}
          onMouseDown={startResizing}
        />
      )}
      
      {/* 主要内容 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          transition: 'width 0.2s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}
      >
        <Toolbar /> {/* 为应用栏腾出空间 */}
        <Container 
          maxWidth="lg" 
          sx={{ 
            flexGrow: 1, 
            py: { xs: 2, sm: 3 },
            px: { xs: 1, sm: 2, md: 3 },
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Outlet />
        </Container>
        <Footer />
      </Box>
    </Box>
  );
}