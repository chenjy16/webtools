import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdBanner from '../components/AdBanner';
import Footer from '../components/Footer';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Switch
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const drawerWidth = 240;

const toolData = [
  { name: 'Password Generator', path: '/password-generator', icon: lazy(() => import('@mui/icons-material/Password')) },
  { name: 'JSON Formatter', path: '/json-formatter', icon: lazy(() => import('@mui/icons-material/Code')) },
  { name: 'HMAC Calculator', path: '/hmac-calculator', icon: lazy(() => import('@mui/icons-material/Security')) },
  { name: 'QR Code Generator', path: '/qrcode-generator', icon: lazy(() => import('@mui/icons-material/QrCode')) },
  { name: 'URL Encoder/Decoder', path: '/url-encoder', icon: lazy(() => import('@mui/icons-material/Link')) },
  { name: 'Base64 Converter', path: '/base64-converter', icon: lazy(() => import('@mui/icons-material/Code')) },
  { name: 'Hash Calculator', path: '/hash-calculator', icon: lazy(() => import('@mui/icons-material/Fingerprint')) },
  { name: 'Color Converter', path: '/color-converter', icon: lazy(() => import('@mui/icons-material/ColorLens')) },
  { name: 'IP Address Lookup', path: '/ip-lookup', icon: lazy(() => import('@mui/icons-material/Public')) },
  { name: 'JWT Decoder', path: '/jwt-decoder', icon: lazy(() => import('@mui/icons-material/VpnKey')) },
  { name: 'Date Calculator', path: '/date-calculator', icon: lazy(() => import('@mui/icons-material/DateRange')) },
  { name: 'Regex Tester', path: '/regex-tester', icon: lazy(() => import('@mui/icons-material/CodeOff')) },
  { name: 'Timer Tool', path: '/timer', icon: lazy(() => import('@mui/icons-material/Timer')) },
  { name: 'Code Formatter/Minifier', path: '/code-formatter', icon: lazy(() => import('@mui/icons-material/FormatIndentIncrease')) },
  { name: 'Unit Converter', path: '/unit-converter', icon: lazy(() => import('@mui/icons-material/SwapHoriz')) },
];

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const currentTool = toolData.find(t => t.path === location.pathname) || { name: 'Web Tools', path: '/' };
  const firstFocusableElement = useRef(null);

  useEffect(() => {
    if (mobileOpen && firstFocusableElement.current) {
      firstFocusableElement.current.focus();
    }
  }, [mobileOpen]);

  const baseName = 'Web Tools - Free Online Developer Utilities';
  const title = currentTool.path === '/' ? baseName : `${currentTool.name} | ${baseName}`;
  const descriptions = {
    '/password-generator': 'Generate secure, random passwords with customizable options.',
    '/json-formatter': 'Format, beautify, and validate JSON data easily.',
    '/jwt-decoder': 'Decode and inspect JSON Web Tokens quickly.',
  };
  const description = descriptions[currentTool.path] || 'Collection of free online web tools for developers and designers.';

  const handleDrawerToggle = () => setMobileOpen(prev => !prev);
  const handleThemeToggle = () => setDarkMode(prev => !prev);

  const drawer = (
    <Box sx={{ width: drawerWidth, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Typography variant="h6">Web Tools</Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List>
          {toolData.map((tool, index) => (
            <ListItem key={tool.path} disablePadding>
              <ListItemButton
                component={Link}
                to={tool.path}
                selected={location.pathname === tool.path}
                ref={index === 0 ? firstFocusableElement : null}
              >
                <ListItemIcon>
                  <Suspense fallback={<div />}>{<tool.icon />}</Suspense>
                </ListItemIcon>
                <ListItemText primary={tool.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: darkMode ? 'grey.900' : 'background.default', color: darkMode ? 'grey.100' : 'text.primary' }}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      <CssBaseline />

      {!isMobile && (
        <Drawer
          variant="permanent"
          open
          role="navigation"
          aria-label="Tool navigation"
          sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
      )}

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="fixed">
          <Toolbar>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>{currentTool.name}</Typography>
            <IconButton color="inherit" onClick={handleThemeToggle}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            role="navigation"
            aria-label="Tool navigation"
            sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
          >
            {drawer}
          </Drawer>
        )}

        <Box sx={{ pt: 8, p: 2, overflowY: 'auto', flexGrow: 1 }}>
          <AdBanner slot="1234567890" format={isMobile ? 'vertical' : 'horizontal'} />
          <Box sx={{ mt: 2 }}><Outlet /></Box>
          <Box sx={{ mt: 2 }}><AdBanner slot="0987654321" format={isMobile ? 'vertical' : 'horizontal'} /></Box>
        </Box>

        <Box component="footer">
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
