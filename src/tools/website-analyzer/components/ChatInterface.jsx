import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, TextField, Button, CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useWebsiteBuilder } from '../context/WebsiteBuilderContext';

function ChatInterface() {
  // 确保从 context 中解构的值有默认值，防止 undefined 错误
  const { 
    chatMessages = [],
    handleSendMessage = () => {}, 
    isChatLoading = false,
  } = useWebsiteBuilder() || {};
  
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 当消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // 处理消息发送 - 重命名为 sendMessage 避免冲突
  const sendMessage = async (messageText = input) => {
    if (messageText.trim() && !isChatLoading && typeof handleSendMessage === 'function') {
      await handleSendMessage(messageText);
      setInput('');
      // 聚焦回输入框
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // 处理按键事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      width: '100%',
      position: 'relative' 
    }}>
      {/* Chat header */}
  
      
      {/* Input area */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <TextField
          fullWidth
          placeholder="Describe the website you want..."
          variant="outlined"
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isChatLoading}
          inputRef={inputRef}
          multiline
          maxRows={4}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={isChatLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          onClick={() => sendMessage()}
          disabled={!input.trim() || isChatLoading}
        >
          Generate
        </Button>
      </Box>
    </Box>
  );
}

export default ChatInterface;