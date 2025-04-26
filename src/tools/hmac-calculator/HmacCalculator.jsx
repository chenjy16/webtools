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

export default function HmacCalculator() {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const calculateHmac = async () => {
    if (!message.trim()) {
      setError('请输入消息内容');
      setOutput('');
      return;
    }

    if (!key.trim()) {
      setError('请输入密钥');
      setOutput('');
      return;
    }

    try {
      // 使用Web Crypto API计算HMAC
      const encoder = new TextEncoder();
      const keyData = encoder.encode(key);
      const messageData = encoder.encode(message);
      
      // 导入密钥
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        {
          name: 'HMAC',
          hash: algorithm
        },
        false,
        ['sign']
      );
      
      // 计算HMAC
      const signature = await crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        messageData
      );
      
      // 将ArrayBuffer转换为十六进制字符串
      const hashArray = Array.from(new Uint8Array(signature));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setOutput(hashHex);
      setError('');
    } catch (err) {
      setError(`HMAC计算错误: ${err.message}`);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      showSnackbar('HMAC值已复制到剪贴板', 'success');
    }
  };

  const clearAll = () => {
    setMessage('');
    setKey('');
    setOutput('');
    setError('');
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        HMAC 计算器
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        使用不同的哈希算法计算消息认证码(HMAC)，用于验证消息的完整性和真实性。
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                输入
              </Typography>
              
              <TextField
                label="消息"
                multiline
                fullWidth
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="输入要计算HMAC的消息..."
                margin="normal"
                error={!!error && !message.trim()}
              />
              
              <TextField
                label="密钥"
                fullWidth
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="输入密钥..."
                margin="normal"
                error={!!error && !key.trim()}
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>哈希算法</InputLabel>
                <Select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  label="哈希算法"
                >
                  <MenuItem value="SHA-1">SHA-1</MenuItem>
                  <MenuItem value="SHA-256">SHA-256</MenuItem>
                  <MenuItem value="SHA-384">SHA-384</MenuItem>
                  <MenuItem value="SHA-512">SHA-512</MenuItem>
                </Select>
              </FormControl>
              
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              
              <Box sx={{ mt: 'auto', pt: 2, display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  onClick={calculateHmac}
                  fullWidth
                >
                  计算 HMAC
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={clearAll}
                  color="secondary"
                >
                  清除
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">HMAC 结果</Typography>
                {output && (
                  <IconButton onClick={copyToClipboard} size="small">
                    <ContentCopyIcon />
                  </IconButton>
                )}
              </Box>
              
              <TextField
                multiline
                fullWidth
                rows={6}
                value={output}
                InputProps={{
                  readOnly: true,
                }}
                placeholder="HMAC结果将显示在这里..."
                sx={{ fontFamily: 'monospace' }}
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                使用 {algorithm} 算法计算的HMAC值
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}