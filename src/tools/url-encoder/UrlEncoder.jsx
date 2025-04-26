import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      // 清除输出，但保留输入
      setOutput('');
      setError('');
    }
  };

  const processData = () => {
    if (!input.trim()) {
      setError('请输入要处理的数据');
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        // URL编码
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
        setError('');
      } else {
        // URL解码
        const decoded = decodeURIComponent(input);
        setOutput(decoded);
        setError('');
      }
    } catch (err) {
      setError(`${mode === 'encode' ? 'URL编码' : 'URL解码'}错误: ${err.message}`);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      showSnackbar('已复制到剪贴板', 'success');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const swapInputOutput = () => {
    if (output) {
      setInput(output);
      setOutput('');
      setError('');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setInput(e.target.result);
    };
    reader.readAsText(file);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        URL 编码/解码工具
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        在线进行URL编码和解码，支持特殊字符和Unicode字符处理。
      </Typography>

      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="编码或解码模式"
          color="primary"
        >
          <ToggleButton value="encode" aria-label="编码">
            编码
          </ToggleButton>
          <ToggleButton value="decode" aria-label="解码">
            解码
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  {mode === 'encode' ? '输入文本' : '输入URL编码'}
                </Typography>
                <Button
                  component="label"
                  size="small"
                  startIcon={<UploadFileIcon />}
                >
                  上传文件
                  <input
                    type="file"
                    hidden
                    onChange={handleFileUpload}
                  />
                </Button>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={12}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? '输入要编码的文本...' : '输入要解码的URL编码...'}
                error={!!error}
                helperText={error}
                sx={{ mb: 2, flexGrow: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearAll}
                  startIcon={<DeleteIcon />}
                >
                  清除
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={processData}
                >
                  {mode === 'encode' ? '编码' : '解码'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  {mode === 'encode' ? 'URL编码结果' : '解码结果'}
                </Typography>
                <Box>
                  <IconButton onClick={swapInputOutput} disabled={!output} sx={{ mr: 1 }}>
                    <SwapHorizIcon />
                  </IconButton>
                  <IconButton onClick={copyToClipboard} disabled={!output}>
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={12}
                value={output}
                InputProps={{ readOnly: true }}
                placeholder={mode === 'encode' ? 'URL编码结果将显示在这里...' : '解码结果将显示在这里...'}
                sx={{ 
                  mb: 2, 
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  '& .MuiInputBase-input': { fontFamily: 'monospace' }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={copyToClipboard}
                startIcon={<ContentCopyIcon />}
                disabled={!output}
                fullWidth
              >
                复制结果
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}