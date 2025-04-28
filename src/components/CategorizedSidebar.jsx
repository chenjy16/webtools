import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
  Box
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// 导入所有需要的图标
import PasswordIcon from '@mui/icons-material/Password';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SecurityIcon from '@mui/icons-material/Security';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ImageIcon from '@mui/icons-material/Image';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TimerIcon from '@mui/icons-material/Timer';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PublicIcon from '@mui/icons-material/Public';
import HomeIcon from '@mui/icons-material/Home';
import DataArrayIcon from '@mui/icons-material/DataArray';
import DescriptionIcon from '@mui/icons-material/Description'; // 添加 PDF 图标

// 图标映射表
const iconMap = {
  'Password': PasswordIcon,
  'Code': CodeIcon,
  'Link': LinkIcon,
  'VpnKey': VpnKeyIcon,
  'Fingerprint': FingerprintIcon,
  'Security': SecurityIcon,
  'FormatIndentIncrease': FormatIndentIncreaseIcon,
  'CodeOff': CodeOffIcon,
  'QrCode': QrCodeIcon,
  'Image': ImageIcon,
  'ColorLens': ColorLensIcon,
  'DateRange': DateRangeIcon,
  'Timer': TimerIcon,
  'Schedule': ScheduleIcon,
  'SwapHoriz': SwapHorizIcon,
  'AttachMoney': AttachMoneyIcon,
  'Public': PublicIcon,
  'Home': HomeIcon,
  'DataArray': DataArrayIcon,
  'Description': DescriptionIcon // 添加 PDF 图标映射
};

const toolCategories = [
  {
    id: 'encoding',
    name: 'Encoding & Decoding Tools',
    tools: [
      { name: 'Password Generator', path: '/password-generator', icon: 'Password' },
      { name: 'Base64 Encoder/Decoder', path: '/base64-converter', icon: 'Code' },
      { name: 'URL Encoder/Decoder', path: '/url-encoder', icon: 'Link' },
      { name: 'JWT Decoder', path: '/jwt-decoder', icon: 'VpnKey' },
      { name: 'Hash Calculator', path: '/hash-calculator', icon: 'Fingerprint' },
      { name: 'HMAC Calculator', path: '/hmac-calculator', icon: 'Security' }
    ]
  },
  {
    id: 'formatting',
    name: 'Data Formatting & Processing',
    tools: [
      { name: 'JSON Formatter', path: '/json-formatter', icon: 'Code' },
      { name: 'Code Formatter & Minifier', path: '/code-formatter', icon: 'FormatIndentIncrease' },
      { name: 'Regex Tester', path: '/regex-tester', icon: 'CodeOff' }
    ]
  },
  {
    id: 'media',
    name: 'Image & Media Tools',
    tools: [
      { name: 'PDF Tools', path: '/pdf-tools', icon: 'Description' },
      { name: 'QR Code Generator', path: '/qrcode-generator', icon: 'QrCode' },
      { name: 'Image Compressor & Converter', path: '/image-compressor', icon: 'Image' },
      { name: 'Color Code Converter', path: '/color-converter', icon: 'ColorLens' }
    ]
  },
  {
    id: 'datetime',
    name: 'Date & Time Tools',
    tools: [
      { name: 'Date Calculator', path: '/date-calculator', icon: 'DateRange' },
      { name: 'Online Timer', path: '/timer', icon: 'Timer' },
      { name: 'Cron Expression Generator', path: '/cron-generator', icon: 'Schedule' }
    ]
  },
  {
    id: 'conversion',
    name: 'Unit & Value Converters',
    tools: [
      { name: 'Unit Converter', path: '/unit-converter', icon: 'SwapHoriz' },
      { name: 'Currency Converter', path: '/CurrencyConverter', icon: 'AttachMoney' }
    ]
  },
  {
    id: 'network',
    name: 'Network & Info Tools',
    tools: [
      { name: 'IP Lookup', path: '/ip-lookup', icon: 'Public' },
      { name: 'Country Info Finder', path: '/country-info', icon: 'Public' }
    ]
  },
  {
    id: 'finance',
    name: 'Finance & Calculation Tools',
    tools: [
      { name: 'Mortgage Calculator', path: '/mortgage-calculator', icon: 'Home' }
    ]
  },
  {
    id: 'generators',
    name: 'Data Generators',
    tools: [
      { name: 'Fake Personal Data Generator', path: '/fake-data-generator', icon: 'DataArray' }
    ]
  }
];


// 分类侧边栏组件
function CategorizedSidebar({ location, onNavigate, collapsed = false }) {
  // 控制每个分类的展开/折叠状态，从本地存储中获取初始状态
  const [openCategories, setOpenCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebarOpenCategories');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // 保存展开/折叠状态到本地存储
  useEffect(() => {
    localStorage.setItem('sidebarOpenCategories', JSON.stringify(openCategories));
  }, [openCategories]);

  const toggleCategory = (categoryId) => {
    setOpenCategories({
      ...openCategories,
      [categoryId]: !openCategories[categoryId]
    });
  };

  return (
    <List sx={{ 
      width: '100%', 
      padding: 0,
      '& .MuiListItemButton-root': {
        transition: 'all 0.2s ease-in-out'
      }
    }}>
      {toolCategories.map((category) => (
        <Box key={category.id} sx={{ width: '100%' }}>
          <ListItem 
            button 
            onClick={() => toggleCategory(category.id)}
            sx={{ 
              py: 1.5,
              px: collapsed ? 1 : 2,
              justifyContent: collapsed ? 'center' : 'flex-start',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
            }}
          >
            {!collapsed && (
              <ListItemText 
                primary={
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word'
                    }}
                  >
                    {category.name}
                  </Typography>
                } 
              />
            )}
            {collapsed ? (
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {category.name.charAt(0)}
              </Typography>
            ) : (
              openCategories[category.id] ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItem>
          {!collapsed && (
            <Collapse in={openCategories[category.id] ?? false} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ 
                maxHeight: '300px', 
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: '2px',
                }
              }}>
                {category.tools.map((tool) => (
                  <ListItemButton
                    key={tool.path}
                    sx={{ 
                      pl: 4,
                      pr: 2,
                      py: 1,
                      whiteSpace: 'normal',
                      height: 'auto',
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        '&:hover': {
                          bgcolor: 'primary.light',
                        }
                      }
                    }}
                    selected={location.pathname === tool.path}
                    onClick={() => onNavigate(tool.path)}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {React.createElement(iconMap[tool.icon])}
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            whiteSpace: 'normal',
                            wordBreak: 'break-word'
                          }}
                        >
                          {tool.name}
                        </Typography>
                      } 
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
          {collapsed && (
            <List component="div" disablePadding>
              {category.tools.map((tool) => (
                <ListItemButton
                  key={tool.path}
                  sx={{ 
                    py: 1,
                    px: 1,
                    justifyContent: 'center',
                    '&.Mui-selected': {
                      bgcolor: 'primary.light',
                    }
                  }}
                  selected={location.pathname === tool.path}
                  onClick={() => onNavigate(tool.path)}
                  title={tool.name}
                >
                  <ListItemIcon sx={{ minWidth: 'auto', justifyContent: 'center' }}>
                    {React.createElement(iconMap[tool.icon])}
                  </ListItemIcon>
                </ListItemButton>
              ))}
            </List>
          )}
          <Divider />
        </Box>
      ))}
    </List>
  );
}

export default CategorizedSidebar;