import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  Fade
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CloseIcon from '@mui/icons-material/Close';
import ToolLayout from '../../components/ToolLayout';
import AdBanner from '../../components/AdBanner';
import { adConfig } from '../../config/adConfig';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('CNY');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // 添加状态控制操作后广告显示
  const [showPostActionAd, setShowPostActionAd] = useState(false);

  // 货币列表（增加更多常用货币）
  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'ZAR', name: 'South African Rand' },
    // 可继续补充
  ];

  // 在组件卸载时清除定时器
  useEffect(() => {
    let adTimer;
    
    return () => {
      if (adTimer) clearTimeout(adTimer);
    };
  }, []);

  const convertCurrency = async () => {
    try {
      setLoading(true);
      // 这里调用汇率API
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();
      const rate = data.rates[toCurrency];
      setResult((amount * rate).toFixed(4));
      
      // 转换完成后显示广告
      setShowPostActionAd(true);
      
      // 设置定时器，10秒后自动关闭广告
      const adTimer = setTimeout(() => {
        setShowPostActionAd(false);
      }, 10000);
      
    } catch (err) {
      setError('Failed to fetch exchange rates');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };
  
  // 关闭广告的处理函数
  const handleCloseAd = () => {
    setShowPostActionAd(false);
  };

  return (
    <ToolLayout 
      title="Currency Converter" 
      description="Convert between world currencies using up-to-date exchange rates."
      toolType="finance"
    >
      <Card sx={{ mt: 3 }}>
        <CardContent>
          {/* 原有的货币转换器内容 */}
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputProps={{ min: 0, style: { textAlign: 'center' } }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>From</InputLabel>
                <Select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  label="From"
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconButton onClick={swapCurrencies} sx={{ mx: 'auto' }}>
                <SwapHorizIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>To</InputLabel>
                <Select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  label="To"
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={convertCurrency}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Convert'}
          </Button>
          {result && (
            <Typography variant="h5" sx={{ mt: 3, textAlign: 'center' }}>
              {amount} {fromCurrency} = {result} {toCurrency}
            </Typography>
          )}
          
          {/* 操作完成后显示的广告 */}
          {showPostActionAd && result && (
            <Fade in={showPostActionAd} timeout={500}>
              <Paper 
                elevation={3} 
                sx={{ 
                  mt: 3, 
                  p: 2, 
                  position: 'relative',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <Box sx={{ position: 'absolute', top: 5, right: 5, zIndex: 2 }}>
                  <IconButton size="small" onClick={handleCloseAd} aria-label="关闭广告">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontSize: '0.7rem' }}>
                  赞助内容
                </Typography>
                
                <AdBanner
                  slot={adConfig.postAction ? adConfig.postAction.slot : adConfig.inContent.slot}
                  format="horizontal"
                  responsive={true}
                  lazyLoad={false}
                />
              </Paper>
            </Fade>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </ToolLayout>
  );
}