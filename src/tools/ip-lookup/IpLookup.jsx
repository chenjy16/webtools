import { useState, useEffect } from 'react';
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
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import AdBanner from '../../components/AdBanner';

export default function IpLookup() {
  const [userIp, setUserIp] = useState('');
  const [lookupIp, setLookupIp] = useState('');
  const [ipInfo, setIpInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // 获取用户当前IP
  useEffect(() => {
    fetchUserIp();
  }, []);

  const fetchUserIp = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setUserIp(data.ip);
      setLookupIp(data.ip);
      lookupIpInfo(data.ip);
    } catch (err) {
      setError('获取IP地址失败，请稍后再试');
      setLoading(false);
    }
  };

  const lookupIpInfo = async (ip) => {
    if (!ip) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || '查询失败');
      }
      
      setIpInfo(data);
    } catch (err) {
      setError(`IP信息查询失败: ${err.message}`);
      setIpInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    lookupIpInfo(lookupIp);
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

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        IP 地址查询
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        查询任意 IP 地址的详细信息，包括地理位置、ISP 和网络信息。
      </Typography>

      {/* 工具上方广告 */}
      <AdBanner slot="3344556677" />

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="输入IP地址"
                  variant="outlined"
                  value={lookupIp}
                  onChange={(e) => setLookupIp(e.target.value)}
                  placeholder="例如: 8.8.8.8"
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                  disabled={loading}
                  sx={{ height: '56px' }}
                >
                  {loading ? <CircularProgress size={24} /> : '查询'}
                </Button>
              </Grid>
            </Grid>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {ipInfo && (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                mt: 3, 
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                backgroundColor: '#fafafa'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2,
                pb: 1,
                borderBottom: '2px solid #1976d2'
              }}>
                <Typography variant="h6" color="primary">IP 信息</Typography>
                <Tooltip title="复制全部信息">
                  <IconButton 
                    onClick={() => copyToClipboard(JSON.stringify(ipInfo, null, 2))}
                    color="primary"
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
                <Table>
                  <TableBody>
                    <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.03)' } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '30%' }}>
                        IP 地址
                      </TableCell>
                      <TableCell sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography>{ipInfo.ip}</Typography>
                        <Tooltip title="复制IP地址">
                          <IconButton size="small" onClick={() => copyToClipboard(ipInfo.ip)}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        位置
                      </TableCell>
                      <TableCell>
                        {ipInfo.city || '未知'}, {ipInfo.region || '未知'}, {ipInfo.country_name || '未知'}
                      </TableCell>
                    </TableRow>
                    
                    <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.03)' } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        ISP
                      </TableCell>
                      <TableCell>{ipInfo.org || '未知'}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        时区
                      </TableCell>
                      <TableCell>{ipInfo.timezone || '未知'}</TableCell>
                    </TableRow>
                    
                    <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.03)' } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        邮政编码
                      </TableCell>
                      <TableCell>{ipInfo.postal || '未知'}</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        经纬度
                      </TableCell>
                      <TableCell>
                        {ipInfo.latitude || '未知'}, {ipInfo.longitude || '未知'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* 工具下方广告 */}
      <AdBanner slot="3344556677" />

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