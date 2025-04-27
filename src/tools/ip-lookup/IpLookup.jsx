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

  // Get user's current IP
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
      setError('Failed to get IP address, please try again later');
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
        throw new Error(data.reason || 'Query failed');
      }

      setIpInfo(data);
    } catch (err) {
      setError(`IP information query failed: ${err.message}`);
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
    showSnackbar('Copied to clipboard', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        IP Address Lookup
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Query detailed information for any IP address, including geolocation, ISP, and network information.
      </Typography>

      {/* Ad above the tool */}
      <AdBanner slot="3344556677" />

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Enter IP Address"
                  variant="outlined"
                  value={lookupIp}
                  onChange={(e) => setLookupIp(e.target.value)}
                  placeholder="e.g., 8.8.8.8"
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
                  {loading ? <CircularProgress size={24} /> : 'Lookup'}
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
                <Typography variant="h6" color="primary">IP Information</Typography>
                <Tooltip title="Copy All Information">
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
                        IP Address
                      </TableCell>
                      <TableCell sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography>{ipInfo.ip}</Typography>
                        <Tooltip title="Copy IP Address">
                          <IconButton size="small" onClick={() => copyToClipboard(ipInfo.ip)}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        Location
                      </TableCell>
                      <TableCell>
                        {ipInfo.city || 'Unknown'}, {ipInfo.region || 'Unknown'}, {ipInfo.country_name || 'Unknown'}
                      </TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.03)' } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        ISP
                      </TableCell>
                      <TableCell>{ipInfo.org || 'Unknown'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        Timezone
                      </TableCell>
                      <TableCell>{ipInfo.timezone || 'Unknown'}</TableCell>
                    </TableRow>

                    <TableRow sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.03)' } }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        Postal Code
                      </TableCell>
                      <TableCell>{ipInfo.postal || 'Unknown'}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                        Coordinates
                      </TableCell>
                      <TableCell>
                        {ipInfo.latitude || 'Unknown'}, {ipInfo.longitude || 'Unknown'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* Ad below the tool */}
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