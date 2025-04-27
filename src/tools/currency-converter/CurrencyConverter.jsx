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
  IconButton
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AdBanner from '../../components/AdBanner';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('CNY');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

  const convertCurrency = async () => {
    try {
      setLoading(true);
      // 这里调用汇率API
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();
      const rate = data.rates[toCurrency];
      setResult((amount * rate).toFixed(4));
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

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Currency Converter
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Convert between world currencies using up-to-date exchange rates.
      </Typography>

      <AdBanner slot="1122334455" />

      <Card sx={{ mt: 3 }}>
        <CardContent>
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
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
}