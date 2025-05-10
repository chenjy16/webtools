import React from 'react';
import { 
  Box, Button, FormControl, InputLabel, Select, MenuItem, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, FormControlLabel, Switch
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useWebsiteBuilder } from '../context/WebsiteBuilderContext';

function SettingsDialog() {
  const {
    provider,
    apiKey,
    useDefaultKey,
    apiKeyDialogOpen,
    livePreviewEnabled,
    setProvider,
    setApiKey,
    setUseDefaultKey,
    setApiKeyDialogOpen,
    setLivePreviewEnabled,
    handleSaveApiKey,
    handleProviderChange
  } = useWebsiteBuilder() || {};  // 添加默认空对象，防止解构 undefined

  // 修改这里，添加类型检查
  const onSaveClick = () => {
    if (typeof handleSaveApiKey === 'function') {
      handleSaveApiKey(apiKey); // 修改：传递当前的 apiKey 参数
    }
    if (typeof setApiKeyDialogOpen === 'function') {
      setApiKeyDialogOpen(false); // 保存后关闭对话框
    }
  };

  // 添加类型检查的打开对话框函数
  const openApiKeyDialog = () => {
    if (typeof setApiKeyDialogOpen === 'function') {
      setApiKeyDialogOpen(true);
    }
  };

  // 添加类型检查的关闭对话框函数
  const closeApiKeyDialog = () => {
    if (typeof setApiKeyDialogOpen === 'function') {
      setApiKeyDialogOpen(false);
    }
  };

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
                checked={!!useDefaultKey}
                onChange={(e) => typeof setUseDefaultKey === 'function' && setUseDefaultKey(e.target.checked)}
              />
            }
            label="Use Default API Key"
            sx={{ mb: 2, display: 'block' }}
          />
          {!useDefaultKey && (
            <TextField
              autoFocus
              margin="dense"
              label="Hugging Face API Key"
              type="password"
              fullWidth
              variant="outlined"
              value={apiKey || ''}
              onChange={(e) => typeof setApiKey === 'function' && setApiKey(e.target.value)}
              disabled={!!useDefaultKey}
              helperText="Please enter your Hugging Face API Key"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeApiKeyDialog}>Cancel</Button>
          <Button onClick={onSaveClick} disabled={!useDefaultKey && !(apiKey || '').trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SettingsDialog;