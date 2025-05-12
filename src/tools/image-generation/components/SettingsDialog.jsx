import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  InputAdornment,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useImageGeneration } from '../context/ImageGenerationContext';

/**
 * Image Generation Settings Dialog Component
 * Allows users to configure API key and other settings
 */
function SettingsDialog({ open, onClose }) {
  // 从上下文获取状态和函数
  const context = useImageGeneration() || {};
  const {
    provider = 'novita',
    apiKey = '',
    useDefaultKey = false,
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
  
  // 处理保存API Key
  const onSaveClick = () => {
    if (typeof handleSaveApiKey === 'function') {
      handleSaveApiKey(localApiKey);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>FLUX.1-dev Image Generation Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200, mt: 2, mb: 2 }}>
            <InputLabel>AI Provider</InputLabel>
            <Select
              value={provider || 'novita'}
              label="AI 提供商"
              onChange={handleProviderChange}
            >
              <MenuItem value="novita">NovitaAI</MenuItem>
              <MenuItem value="fireworks-ai">Fireworks AI</MenuItem>
              <MenuItem value="nebius">Nebius AI Studio</MenuItem>
              <MenuItem value="sambanova">SambaNova</MenuItem>
              <MenuItem value="auto">Auto Select</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
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
          margin="dense"
          label="Hugging Face API Key"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          variant="outlined"
          value={localApiKey} 
          onChange={(e) => setLocalApiKey(e.target.value)}
          disabled={localUseDefaultKey}
          placeholder={localUseDefaultKey ? "Using default Hugging Face API Key" : "Please enter your Hugging Face API Key"}
          helperText={
            localUseDefaultKey 
              ? "To use your own key, uncheck 'Use Default API Key'." 
              : "Please enter your Hugging Face API Key."
          }
          InputProps={{
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
            )
          }}
        />
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            About FLUX.1-dev Model
          </Typography>
          <Typography variant="body2" color="text.secondary">
            FLUX.1-dev is a powerful text-to-image generation model developed by Black Forest Labs. This model can generate high-quality images based on text descriptions, supporting various styles and themes.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            To use this feature, you need a valid Hugging Face API Key. You can choose to use the system default API Key or provide your own key.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={onSaveClick} 
          disabled={!localUseDefaultKey && !localApiKey.trim()}
          variant="contained"
        > 
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SettingsDialog;