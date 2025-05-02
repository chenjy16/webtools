import { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../components/AdBanner';
import Footer from '../components/Footer';
import TopNavigation from '../components/TopNavigation';
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { adConfig } from '../config/adConfig';

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
  { name: 'Personal Address Information Generator', path: '/fake-data-generator' },
  { name: 'Cron Expression Generator', path: '/cron-generator' },
  { name: 'Image Compressor', path: '/image-compressor' },
  { name: 'PDF Tools', path: '/pdf-tools' },
  { name: 'Temporary Email Generator', path: '/temp-mail' },
  { name: 'Public Holidays', path: '/public-holidays' },
  { name: 'Pomodoro Timer', path: '/pomodoro' } // 添加番茄钟工具
];

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
  '/pdf-tools': 'Merge multiple PDF files into one document or split a PDF into individual pages.',
  '/temp-mail': 'Create a temporary email address to receive emails and protect your privacy. Powered by the mail.tm API.',
  '/public-holidays': 'Check public holiday information for countries and regions around the world. Supports multiple countries and regions.'
};

// --- Main Layout Component ---
export default function MainLayout({ toggleDarkMode, currentMode = 'light' }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const location = useLocation();
  const navigate = useNavigate();

  const currentTool = toolData.find(t => t.path === location.pathname) || { name: 'Web Tools', path: '/' };
  const siteName = 'CDTools - Free Online Developer Utilities';
  const title = currentTool.path === '/' ? siteName : `${currentTool.name} | ${siteName}`;
  const description = descriptions[currentTool.path] || `A collection of free online web tools like ${currentTool.name ? currentTool.name + ', ' : ''}formatters, converters, and generators for developers and designers.`;
  const canonicalUrl = `https://cdtools.org${location.pathname}`;

  const handleNavigate = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <CssBaseline />
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>

      {/* 顶部导航 */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(to right, #1e1e1e, #2c2c2c)'
            : 'linear-gradient(to right, #ffffff, #f8f9fa)',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              mr: 2,
              letterSpacing: 1.2,
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}
          >
            CDTools
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title={`Switch to ${currentMode === 'light' ? 'Dark' : 'Light'} mode`}>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {currentMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* 顶部广告位 */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 1 }}>
        <AdBanner slot={adConfig.header.slot} format="horizontal" responsive={true} />
      </Box>

      {/* 主内容区域 */}
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1,
        maxWidth: '100%',  // 修改为100%而不是固定的1920px
        width: '100%',     // 添加宽度100%
        mx: 'auto',
        position: 'relative'
      }}>
        {/* 左侧广告 */}
        {!isMobile && (
          <Box 
            sx={{ 
              width: '160px', 
              position: 'sticky',
              top: '80px',
              height: 'calc(100vh - 100px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <AdBanner slot={adConfig.sidebar.leftSidebar.slot} format="vertical" responsive={false} style={{ height: '600px' }} />
          </Box>
        )}
        
        {/* 中间内容区域 */}
        <Container
          maxWidth={false}
          sx={{
            flexGrow: 1,
            py: { xs: 1, sm: 2, md: 3 },
            px: { xs: 1, sm: 2, md: 3 },
            maxWidth: '100%' // 确保容器可以占用全部可用宽度
          }}
        >
          <Box sx={{ mb: isMobile ? 1 : 3 }}>
            <TopNavigation location={location} onNavigate={handleNavigate} />
          </Box>
      
          <Outlet />
        </Container>
        
        {/* 右侧广告 */}
        {!isMobile && (
          <Box 
            sx={{ 
              width: '160px', 
              position: 'sticky',
              top: '80px',
              height: 'calc(100vh - 100px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <AdBanner slot={adConfig.sidebar.rightSidebar.slot} format="vertical" responsive={false} style={{ height: '600px' }} />
          </Box>
        )}
      </Box>

      {/* 底部广告位 */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 1 }}>
        <AdBanner slot={adConfig.footer.slot} format="horizontal" responsive={true} />
      </Box>

      {/* 页脚 */}
      <Footer />
    </Box>
  );
}
