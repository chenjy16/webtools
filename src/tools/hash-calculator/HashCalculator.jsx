import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  TextField,
  Typography
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function HashCalculator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [hashType, setHashType] = useState('md5');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const calculateHash = async () => {
    if (!input.trim()) {
      setError('请输入要计算哈希值的文本');
      setOutput('');
      return;
    }

    try {
      // 使用Web Crypto API计算哈希值
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      let hashBuffer;
      
      switch (hashType) {
        case 'md5':
          // 注意：Web Crypto API不直接支持MD5，这里使用一个模拟实现
          // 在实际应用中，可以使用第三方库如crypto-js
          setOutput('Web Crypto API不直接支持MD5，请使用SHA-1或SHA-256');
          return;
        case 'sha1':
          hashBuffer = await crypto.subtle.digest('SHA-1', data);
          break;
        case 'sha256':
          hashBuffer = await crypto.subtle.digest('SHA-256', data);
          break;
        case 'sha384':
          hashBuffer = await crypto.subtle.digest('SHA-384', data);
          break;
        case 'sha512':
          hashBuffer = await crypto.subtle.digest('SHA-512', data);
          break;
        default:
          hashBuffer = await crypto.subtle.digest('SHA-256', data);
      }

      // 将ArrayBuffer转换为十六进制字符串
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setOutput(hashHex);
      setError('');
    } catch (err) {
      setError(`哈希计算错误: ${err.message}`);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      showSnackbar('哈希值已复制到剪贴板', 'success');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
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
        哈希计算器
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        计算文本的哈希值，支持SHA-1、SHA-256、SHA-384和SHA-512算法。
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">输入文本</Typography>
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
                rows={10}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入要计算哈希值的文本..."
                error={!!error}
                helperText={error}
                sx={{ mb: 2, flexGrow: 1 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="hash-type-label">哈希算法</InputLabel>
                  <Select
                    labelId="hash-type-label"
                    value={hashType}
                    label="哈希算法"
                    onChange={(e) => setHashType(e.target.value)}
                  >
                    <MenuItem value="md5">MD5 (不推荐)</MenuItem>
                    <MenuItem value="sha1">SHA-1</MenuItem>
                    <MenuItem value="sha256">SHA-256</MenuItem>
                    <MenuItem value="sha384">SHA-384</MenuItem>
                    <MenuItem value="sha512">SHA-512</MenuItem>
                  </Select>
                </FormControl>
                
                <Box>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={clearAll}
                    startIcon={<DeleteIcon />}
                    sx={{ mr: 1 }}
                  >
                    清除
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={calculateHash}
                  >
                    计算哈希值
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">哈希结果</Typography>
                <IconButton onClick={copyToClipboard} disabled={!output}>
                  <ContentCopyIcon />
                </IconButton>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={10}
                value={output}
                InputProps={{ readOnly: true }}
                placeholder="哈希计算结果将显示在这里..."
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
                复制哈希值
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