import React, { useState, useEffect } from 'react';
import { 
  Box, Button, FormControl, InputLabel, Select, MenuItem, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, FormControlLabel, Switch, IconButton, InputAdornment
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useWebsiteBuilder } from '../context/WebsiteBuilderContext';

function SettingsDialog() {
  // 从上下文获取状态和函数
  const context = useWebsiteBuilder() || {};
  const {
    provider = 'novita',
    apiKey = '',
    useDefaultKey = false,
    apiKeyDialogOpen = false,
    livePreviewEnabled = true,
    handleSaveApiKey,
    handleProviderChange
  } = context;
  
  // 创建本地状态，避免完全依赖上下文
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localUseDefaultKey, setLocalUseDefaultKey] = useState(useDefaultKey);
  // 添加密码可见性状态
  const [showPassword, setShowPassword] = useState(false);
  
  // 当上下文中的值变化时，更新本地状态
  useEffect(() => {
    setLocalApiKey(apiKey);
    setLocalUseDefaultKey(useDefaultKey);
  }, [apiKey, useDefaultKey]);
  
  // 安全地调用上下文函数
  const setApiKey = (value) => {
    if (typeof context.setApiKey === 'function') {
      context.setApiKey(value);
    }
    // 总是更新本地状态，确保UI响应
    setLocalApiKey(value);
  };
  
  const setUseDefaultKey = (value) => {
    if (typeof context.setUseDefaultKey === 'function') {
      context.setUseDefaultKey(value);
    }
    // 总是更新本地状态，确保UI响应
    setLocalUseDefaultKey(value);
  };
  
  const setApiKeyDialogOpen = (value) => {
    if (typeof context.setApiKeyDialogOpen === 'function') {
      context.setApiKeyDialogOpen(value);
    }
  };

  // 处理保存API Key
  const onSaveClick = () => {
    if (typeof handleSaveApiKey === 'function') {
      handleSaveApiKey(localApiKey);
    }
    setApiKeyDialogOpen(false);
  };

  // 打开和关闭对话框的函数
  const openApiKeyDialog = () => setApiKeyDialogOpen(true);
  const closeApiKeyDialog = () => setApiKeyDialogOpen(false);

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>AI Provider</InputLabel>
          <Select
            value={provider || 'novita'}
            label="AI Provider"
            onChange={handleProviderChange}
          >
            <MenuItem value="novita">NovitaAI</MenuItem>
            <MenuItem value="fireworks-ai">Fireworks AI</MenuItem>
            <MenuItem value="nebius">Nebius AI Studio</MenuItem>
            <MenuItem value="sambanova">SambaNova</MenuItem>
            <MenuItem value="auto">Auto Select</MenuItem>
          </Select>
        </FormControl>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={openApiKeyDialog}  // 使用安全的函数
          sx={{ ml: 1 }}
        >
          Set API Key
        </Button>
      </Box>

      <Dialog open={!!apiKeyDialogOpen} onClose={closeApiKeyDialog}>  {/* 添加双感叹号确保布尔值 */}
        <DialogTitle>Set API Key</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={localUseDefaultKey}
                onChange={(e) => setUseDefaultKey(e.target.checked)}
              />
            }
            label="Use Default API Key"
            sx={{ mb: 2, display: 'block' }}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Hugging Face API Key"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            value={localApiKey} 
            onChange={(e) => setLocalApiKey(e.target.value)}
            disabled={localUseDefaultKey}
            placeholder={localUseDefaultKey ? "正在使用默认 Hugging Face API Key" : "请输入您的 Hugging Face API Key"}
            helperText={
              localUseDefaultKey 
                ? "要使用您自己的密钥，请取消勾选 'Use Default API Key'." 
                : "请输入您的 Hugging Face API Key."
            }
            InputProps={{
              // 移除任何可能影响输入的额外属性
              readOnly: false,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    disabled={localUseDefaultKey}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                // 确保没有妨碍输入的样式
                '& .MuiOutlinedInput-input': {
                  padding: '14px'
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeApiKeyDialog}>Cancel</Button>
          <Button 
            onClick={onSaveClick} 
            disabled={!localUseDefaultKey && !localApiKey.trim()}
          > 
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SettingsDialog;