import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, IconButton, Box, Tabs, Tab, 
  ToggleButtonGroup, ToggleButton, Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TabletIcon from '@mui/icons-material/Tablet';
import LaptopIcon from '@mui/icons-material/Laptop';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import html from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import tomorrow from 'react-syntax-highlighter/dist/esm/styles/hljs/tomorrow';
import { useWebsiteBuilder } from '../context/WebsiteBuilderContext';

SyntaxHighlighter.registerLanguage('html', html);

function PreviewDialog() {
  const {
    previewOpen,
    generatedHtml,
    isStreaming,
    streamedHtml,
    handlePreviewClose,
    handleCopyHtml,
    handleDownloadHtml
  } = useWebsiteBuilder();
  
  const [activeTab, setActiveTab] = useState(0);
  const [viewportSize, setViewportSize] = useState('desktop');
  
  // 使用流式响应或最终生成的 HTML
  const displayHtml = isStreaming ? streamedHtml : generatedHtml;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleViewportChange = (event, newSize) => {
    if (newSize !== null) {
      setViewportSize(newSize);
    }
  };
  
  // 根据视口大小设置预览容器样式
  const getPreviewContainerStyle = () => {
    switch (viewportSize) {
      case 'mobile':
        return {
          width: '375px',
          height: '100%',
          margin: '0 auto',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          transition: 'width 0.3s ease',
          overflow: 'hidden' // 防止内容溢出
        };
      case 'tablet':
        return {
          width: '768px',
          height: '100%',
          margin: '0 auto',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          transition: 'width 0.3s ease',
          overflow: 'hidden' // 防止内容溢出
        };
      default: // desktop
        return {
          width: '100%',
          height: '100%',
          transition: 'width 0.3s ease',
          overflow: 'hidden' // 防止内容溢出
        };
    }
  };

  return (
    <Dialog
      open={previewOpen}
      onClose={handlePreviewClose}
      fullWidth
      maxWidth="lg"
      sx={{ '& .MuiDialog-paper': { height: '90vh' } }}
    >
      <DialogTitle>
        网站预览
        {isStreaming && " (实时生成中...)"}
        <IconButton
          aria-label="close"
          onClick={handlePreviewClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="预览" />
            <Tab label="HTML 代码" />
          </Tabs>
          
          {activeTab === 0 && (
            <ToggleButtonGroup
              value={viewportSize}
              exclusive
              onChange={handleViewportChange}
              aria-label="预览设备"
              size="small"
              sx={{ my: 1 }}
            >
              <ToggleButton value="mobile" aria-label="手机">
                <Tooltip title="手机视图">
                  <SmartphoneIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="tablet" aria-label="平板">
                <Tooltip title="平板视图">
                  <TabletIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="desktop" aria-label="桌面">
                <Tooltip title="桌面视图">
                  <LaptopIcon />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Box>
        <Box sx={{ height: 'calc(100% - 48px)', overflow: 'auto' }}>
          {activeTab === 0 ? (
            <Box sx={{ height: '100%', width: '100%', overflow: 'auto', display: 'flex', justifyContent: 'center', p: 2 }}>
              <Box sx={getPreviewContainerStyle()}>
                <iframe
                  srcDoc={displayHtml || '<!DOCTYPE html><html><body><div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;color:#666;">等待生成网站内容...</div></body></html>'}
                  title="网站预览"
                  style={{ border: 'none', width: '100%', height: '100%', backgroundColor: '#fff' }}
                  sandbox="allow-scripts allow-same-origin"
                />
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
              <SyntaxHighlighter
                language="html"
                style={tomorrow}
                customStyle={{
                  margin: 0,
                  borderRadius: '4px',
                  fontSize: '14px',
                  height: '100%'
                }}
                showLineNumbers={true}
              >
                {displayHtml || '<!-- 等待 AI 生成 HTML 代码 -->'}
              </SyntaxHighlighter>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          startIcon={<ContentCopyIcon />} 
          onClick={handleCopyHtml}
          disabled={!displayHtml}
        >
          复制代码
        </Button>
        <Button 
          startIcon={<DownloadIcon />} 
          onClick={handleDownloadHtml}
          disabled={!displayHtml}
        >
          下载HTML
        </Button>
        <Button onClick={handlePreviewClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PreviewDialog;