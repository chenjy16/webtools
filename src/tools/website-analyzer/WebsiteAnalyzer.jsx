import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, ToggleButtonGroup, ToggleButton, Tooltip } from '@mui/material';
import { WebsiteBuilderProvider } from './context/WebsiteBuilderContext';
import ChatInterface from './components/ChatInterface';
import PreviewDialog from './components/PreviewDialog';
import SettingsDialog from './components/SettingsDialog';
import ProjectDialog from './components/ProjectDialog'; // Import ProjectDialog component
import { useWebsiteBuilder } from './context/WebsiteBuilderContext';
// Import syntax highlighting components
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import html from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import tomorrow from 'react-syntax-highlighter/dist/esm/styles/hljs/tomorrow';
// Import icons
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import TabletIcon from '@mui/icons-material/Tablet';
import LaptopIcon from '@mui/icons-material/Laptop';

// Register HTML language
SyntaxHighlighter.registerLanguage('html', html);

// Create code display component
const CodeDisplay = () => {
  const { generatedHtml, isStreaming, streamedHtml } = useWebsiteBuilder();
  
  // Use streaming response or final generated HTML
  const displayHtml = isStreaming ? streamedHtml : generatedHtml;
  
  // Add reference and auto-scroll effect
  const codeContainerRef = useRef(null);
  
  // Monitor displayHtml changes, auto-scroll to bottom
  useEffect(() => {
    if (codeContainerRef.current && isStreaming) {
      const container = codeContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [displayHtml, isStreaming]);
  
  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Paper elevation={0} 
        sx={{ 
          p: 2, 
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6" component="h2">
          Code Generation
        </Typography>
      </Paper>
      
      <Box 
        ref={codeContainerRef}
        sx={{ 
          flex: '1 1 auto',
          overflow: 'auto',
          p: 1,
          height: 'calc(100% - 56px)', // Subtract header height
          minHeight: '600px' // Increase minimum height to ensure enough display space on PC
        }}
      >
        <SyntaxHighlighter
          language="html"
          style={tomorrow}
          customStyle={{
            margin: 0,
            padding: '12px',
            fontSize: '14px', // Slightly increase font size
            borderRadius: '4px',
            height: 'auto',
            minHeight: '100%',
            overflow: 'visible'
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {displayHtml || '<!-- Waiting for code generation... -->'}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
};

// Create preview component
const PreviewComponent = () => {
  const { generatedHtml, isStreaming, streamedHtml } = useWebsiteBuilder();
  const [viewportSize, setViewportSize] = useState('desktop'); // Add viewport size state
  
  // Use streaming response or final generated HTML
  const displayHtml = isStreaming ? streamedHtml : generatedHtml;
  
  // Set preview container style based on viewport size
  const getPreviewContainerStyle = () => {
    switch (viewportSize) {
      case 'mobile':
        return {
          width: '375px',
          height: '100%',
          margin: '0 auto',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          transition: 'width 0.3s ease'
        };
      case 'tablet':
        return {
          width: '768px',
          height: '100%',
          margin: '0 auto',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          transition: 'width 0.3s ease'
        };
      default: // desktop
        return {
          width: '100%',
          height: '100%',
          transition: 'width 0.3s ease'
        };
    }
  };
  
  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Paper elevation={0} 
        sx={{ 
          p: 2, 
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6" component="h2">
          Preview
        </Typography>
        
        {/* Add viewport toggle buttons */}
        <ToggleButtonGroup
          value={viewportSize}
          exclusive
          onChange={(e, newSize) => newSize && setViewportSize(newSize)}
          aria-label="Preview Device"
          size="small"
        >
          <ToggleButton value="mobile" aria-label="Mobile">
            <Tooltip title="Mobile View">
              <SmartphoneIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="tablet" aria-label="Tablet">
            <Tooltip title="Tablet View">
              <TabletIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="desktop" aria-label="Desktop">
            <Tooltip title="Desktop View">
              <LaptopIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>
      
      <Box sx={{ 
        flex: '1 1 auto',
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        padding: '16px',
        minHeight: '600px' // Increase minimum height to ensure enough display space on PC
      }}>
        <Box sx={getPreviewContainerStyle()}>
          <iframe
            srcDoc={displayHtml || '<!DOCTYPE html><html><body><div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;color:#666;">Waiting for website content generation...</div></body></html>'}
            title="Website Preview"
            style={{ border: 'none', width: '100%', height: '100%', backgroundColor: '#fff' }}
            sandbox="allow-scripts allow-same-origin"
          />
        </Box>
      </Box>
    </Box>
  );
};

// WebsiteContent component needs to be used inside WebsiteBuilderProvider
const WebsiteContent = () => {
  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%', 
      mx: 'auto', 
      p: { xs: 1, sm: 2 },
      boxSizing: 'border-box'
    }}>
      <Typography variant="h4" gutterBottom>
        AI Website Builder
      </Typography>
      
      <Typography variant="body1" paragraph>
        Quickly build a static website through conversation. Tell the AI what you need, and it will generate HTML code with real-time preview.
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <SettingsDialog />
      </Box>
      
      {/* Two-column layout */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        height: { xs: 'auto', md: 'calc(100vh - 200px)' },
        minHeight: { xs: '80vh', md: 'auto' },
        width: '100%',
        gap: 2
      }}>
        {/* Left column - Adjust to responsive width */}
        <Box sx={{ 
          width: { xs: '100%', md: '60%' }, 
          height: { xs: 'auto', md: '100%' },
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {/* Top section: Code generation area */}
          <Box sx={{ 
            height: { xs: '400px', md: '60%' },
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            <CodeDisplay />
          </Box>
          
          {/* Bottom section: Chat interface */}
          <Box sx={{ 
            height: { xs: '300px', md: '40%' },
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            <ChatInterface />
          </Box>
        </Box>
        
        {/* Right column - Adjust to responsive width */}
        <Box sx={{ 
          width: { xs: '100%', md: '40%' }, 
          height: { xs: '500px', md: '100%' },
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: 1,
          overflow: 'hidden'
        }}>
          <PreviewComponent />
        </Box>
      </Box>
      
      {/* Dialog components */}
      <PreviewDialog />
      <ProjectDialog />
    </Box>
  );
};

function WebsiteAnalyzer() {
  return (
    <WebsiteBuilderProvider>
      <WebsiteContent />
    </WebsiteBuilderProvider>
  );
}
export default WebsiteAnalyzer;
