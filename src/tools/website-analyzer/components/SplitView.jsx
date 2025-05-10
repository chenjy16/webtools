import React from 'react';
import { Box } from '@mui/material';

function SplitView({ children }) {
  // 将子元素转换为数组
  const childrenArray = React.Children.toArray(children);
  
  return (
    <Box sx={{ 
      display: 'flex', 
      height: '70vh', 
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      overflow: 'hidden',
      width: '100%' // 确保容器占满宽度
    }}>
      {/* 移除步骤面板部分，直接显示聊天界面和预览区域 */}
      
      {/* 聊天界面 */}
      {childrenArray[0] && (
        <Box sx={{ flex: '0 0 40%', borderRight: '1px solid', borderColor: 'divider' }}>
          {childrenArray[0]}
        </Box>
      )}
      
      {/* 预览区域 */}
      {childrenArray[1] && (
        <Box sx={{ flex: '1 1 auto' }}>
          {childrenArray[1]}
        </Box>
      )}
    </Box>
  );
}

export default SplitView;