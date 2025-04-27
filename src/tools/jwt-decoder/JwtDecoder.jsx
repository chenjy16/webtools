import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Paper,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import AdBanner from '../../components/AdBanner';

export default function JwtDecoder() {
  const [jwtToken, setJwtToken] = useState('');
  const [header, setHeader] = useState({});
  const [payload, setPayload] = useState({});
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const decodeJwt = () => {
    if (!jwtToken.trim()) {
      setError('请输入JWT令牌');
      setHeader({});
      setPayload({});
      return;
    }

    try {
      const parts = jwtToken.split('.');
      if (parts.length !== 3) {
        throw new Error('无效的JWT格式，应包含三个部分');
      }

      // 解码头部
      const decodedHeader = JSON.parse(atob(parts[0]));
      setHeader(decodedHeader);

      // 解码载荷
      const decodedPayload = JSON.parse(atob(parts[1]));
      setPayload(decodedPayload);

      setError('');
    } catch (err) {
      setError(`JWT解析错误: ${err.message}`);
      setHeader({});
      setPayload({});
    }
  };

  const clearAll = () => {
    setJwtToken('');
    setHeader({});
    setPayload({});
    setError('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('已复制到剪贴板', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // 格式化日期时间
  const formatDateTime = (timestamp) => {
    if (!timestamp) return '无效日期';
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString();
    } catch {
      return '无效日期';
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        JWT 解码器
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        解析和验证 JSON Web Token (JWT)，查看头部和载荷信息。
      </Typography>

      {/* 工具上方广告 */}
      <AdBanner slot="4455667788" />

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="输入JWT令牌"
                variant="outlined"
                multiline
                rows={4}
                value={jwtToken}
                onChange={(e) => setJwtToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={decodeJwt}
                sx={{ height: '56px' }}
              >
                解码
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={clearAll}
                startIcon={<DeleteIcon />}
                sx={{ height: '56px' }}
              >
                清除
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {(Object.keys(header).length > 0 || Object.keys(payload).length > 0) && (
            <Box sx={{ mt: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="头部 (Header)" />
                <Tab label="载荷 (Payload)" />
              </Tabs>

              {activeTab === 0 && (
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#fafafa' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="primary">头部信息</Typography>
                    <IconButton 
                      onClick={() => copyToClipboard(JSON.stringify(header, null, 2))}
                      color="primary"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {JSON.stringify(header, null, 2)}
                  </pre>
                </Paper>
              )}

              {activeTab === 1 && (
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#fafafa' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="primary">载荷信息</Typography>
                    <IconButton 
                      onClick={() => copyToClipboard(JSON.stringify(payload, null, 2))}
                      color="primary"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  {/* 特殊处理常见的JWT字段 */}
                  {payload.exp && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">过期时间 (exp)</Typography>
                      <Typography>{formatDateTime(payload.exp)}</Typography>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  )}
                  
                  {payload.iat && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">签发时间 (iat)</Typography>
                      <Typography>{formatDateTime(payload.iat)}</Typography>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  )}
                  
                  {payload.nbf && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">生效时间 (nbf)</Typography>
                      <Typography>{formatDateTime(payload.nbf)}</Typography>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  )}
                  
                  <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {JSON.stringify(payload, null, 2)}
                  </pre>
                </Paper>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 工具下方广告 */}
      <AdBanner slot="4455667788" />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}