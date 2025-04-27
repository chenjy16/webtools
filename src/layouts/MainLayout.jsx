import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AdBanner from '../components/AdBanner';
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
  useTheme 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PasswordIcon from '@mui/icons-material/Password';
import CodeIcon from '@mui/icons-material/Code';
// 移除 ImageIcon 导入
// import ImageIcon from '@mui/icons-material/Image';
import SecurityIcon from '@mui/icons-material/Security';
// 移除 InsertDriveFileIcon 导入
// import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LinkIcon from '@mui/icons-material/Link';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import PublicIcon from '@mui/icons-material/Public';
// 新增图标导入
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import TimerIcon from '@mui/icons-material/Timer';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const drawerWidth = 240;

const tools = [
  { name: '密码生成器', path: '/password-generator', icon: <PasswordIcon /> },
  { name: 'JSON格式化', path: '/json-formatter', icon: <CodeIcon /> },
  // 移除图片转换菜单项
  // { name: '图片转换', path: '/image-converter', icon: <ImageIcon /> },
  { name: 'HMAC计算器', path: '/hmac-calculator', icon: <SecurityIcon /> },
  // 移除文件转换菜单项
  // { name: '文件转换', path: '/file-converter', icon: <InsertDriveFileIcon /> },
  { name: '二维码生成器', path: '/qrcode-generator', icon: <QrCodeIcon /> },
  { name: 'URL编码/解码', path: '/url-encoder', icon: <LinkIcon /> },
  { name: 'Base64转换', path: '/base64-converter', icon: <CodeIcon /> },
  { name: '哈希计算器', path: '/hash-calculator', icon: <FingerprintIcon /> },
  { name: '颜色转换', path: '/color-converter', icon: <ColorLensIcon /> },
  { name: 'IP 地址查询', path: '/ip-lookup', icon: <PublicIcon /> },
  // 新增工具菜单项
  { name: 'JWT 解码器', path: '/jwt-decoder', icon: <VpnKeyIcon /> },
  { name: '日期计算器', path: '/date-calculator', icon: <DateRangeIcon /> },
  { name: '正则表达式测试', path: '/regex-tester', icon: <CodeOffIcon /> },
  { name: '计时器工具', path: '/timer', icon: <TimerIcon /> },
  { name: '代码美化/压缩', path: '/code-formatter', icon: <FormatIndentIncreaseIcon /> },
  { name: '单位换算工具', path: '/unit-converter', icon: <SwapHorizIcon /> },
];

export default function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          网页小工具
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {tools.map((tool) => (
          <ListItem key={tool.path} disablePadding>
            <ListItemButton 
              component={Link} 
              to={tool.path}
              selected={location.pathname === tool.path}
            >
              <ListItemIcon>
                {tool.icon}
              </ListItemIcon>
              <ListItemText primary={tool.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
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
          <Typography variant="h6" noWrap component="div">
            {tools.find(tool => tool.path === location.pathname)?.name || '网页小工具'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        
        {/* 顶部横幅广告 */}
        <AdBanner slot="1234567890" format="horizontal" />
        
        {/* 页面内容 */}
        <Outlet />
        
        {/* 底部横幅广告 */}
        <AdBanner slot="0987654321" format="horizontal" />
      </Box>
    </Box>
  );
}