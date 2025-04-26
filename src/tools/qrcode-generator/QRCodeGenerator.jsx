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
  Typography,
  Stack
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import QRCode from 'qrcode';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('M');
  const [size, setSize] = useState(200);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const generateQRCode = async () => {
    if (!text.trim()) {
      setError('请输入要转换为二维码的文本');
      setQrCodeUrl('');
      return;
    }

    try {
      const url = await QRCode.toDataURL(text, {
        errorCorrectionLevel,
        width: size,
        margin: 1,
      });
      setQrCodeUrl(url);
      setError('');
    } catch (err) {
      setError(`生成二维码错误: ${err.message}`);
      setQrCodeUrl('');
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSnackbar('二维码已下载', 'success');
    }
  };

  const copyQRCodeUrl = () => {
    if (qrCodeUrl) {
      navigator.clipboard.writeText(qrCodeUrl);
      showSnackbar('二维码URL已复制到剪贴板', 'success');
    }
  };

  const clearAll = () => {
    setText('');
    setQrCodeUrl('');
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
        二维码生成器
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        生成自定义二维码，可用于网址、联系方式、Wi-Fi连接等信息分享。
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                输入内容
              </Typography>
              <TextField
                multiline
                fullWidth
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="输入文本、URL或其他信息..."
                error={!!error}
                helperText={error}
                sx={{ mb: 2, flexGrow: 1 }}
              />
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>纠错级别:</Typography>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="error-correction-level-label">纠错级别</InputLabel>
                    <Select
                      labelId="error-correction-level-label"
                      value={errorCorrectionLevel}
                      label="纠错级别"
                      onChange={(e) => setErrorCorrectionLevel(e.target.value)}
                    >
                      <MenuItem value="L">低 (7%)</MenuItem>
                      <MenuItem value="M">中 (15%)</MenuItem>
                      <MenuItem value="Q">高 (25%)</MenuItem>
                      <MenuItem value="H">最高 (30%)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>尺寸 (像素):</Typography>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="size-label">尺寸</InputLabel>
                    <Select
                      labelId="size-label"
                      value={size}
                      label="尺寸"
                      onChange={(e) => setSize(e.target.value)}
                    >
                      <MenuItem value={128}>128 x 128</MenuItem>
                      <MenuItem value={200}>200 x 200</MenuItem>
                      <MenuItem value={256}>256 x 256</MenuItem>
                      <MenuItem value={320}>320 x 320</MenuItem>
                      <MenuItem value={400}>400 x 400</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
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
                  onClick={generateQRCode}
                >
                  生成二维码
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                <Typography variant="h6">二维码预览</Typography>
                <Box>
                  <IconButton onClick={copyQRCodeUrl} disabled={!qrCodeUrl} sx={{ mr: 1 }}>
                    <ContentCopyIcon />
                  </IconButton>
                  <IconButton onClick={downloadQRCode} disabled={!qrCodeUrl}>
                    <DownloadIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Box 
                sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  width: '100%',
                  minHeight: 250,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  p: 2
                }}
              >
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="生成的二维码" 
                    style={{ maxWidth: '100%', maxHeight: '100%' }} 
                  />
                ) : (
                  <Typography color="text.secondary">
                    二维码将显示在这里...
                  </Typography>
                )}
              </Box>
              
              {qrCodeUrl && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={downloadQRCode}
                  startIcon={<DownloadIcon />}
                  sx={{ mt: 2 }}
                >
                  下载二维码
                </Button>
              )}
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