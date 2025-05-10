import React from 'react';
import { Box, Typography } from '@mui/material';

function SplitView({ children }) {
  // 将子元素转换为数组
  const childrenArray = React.Children.toArray(children);
  
  return (
    <Box sx={{
      display: 'flex',
      height: '80vh', // 保证与右侧Preview一致
      width: '100%',
      gap: 2
    }}>
      {/* 左侧区域 45% */}
      <Box sx={{
        width: { xs: '100%', md: '45%' },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        background: '#181A20', // 深色风格更像IDE，可根据需要调整
        borderRadius: 2,
        boxShadow: 1
      }}>
        {/* 代码编辑区 */}
        <Box sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          borderBottom: '1px solid #23262F',
          p: 0
        }}>
          {childrenArray[0]}
        </Box>
        {/* 输入栏 */}
        <Box sx={{
          flexShrink: 0,
          minHeight: '48px',
          maxHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderTop: '1px solid #23262F',
          background: '#181A20',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8
        }}>
          {childrenArray[1]}
        </Box>
      </Box>
      {/* 右侧区域 55% */}
      <Box sx={{
        width: { xs: '100%', md: '55%' },
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        borderRadius: 2,
        boxShadow: 1,
        overflow: 'hidden'
      }}>
        {childrenArray[2]}
      </Box>
    </Box>
  );
}

export default SplitView;