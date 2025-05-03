import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Tooltip,
  Chip
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NetworkPingIcon from '@mui/icons-material/NetworkPing';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

export default function NetworkLatency() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Preset server list
  const servers = [
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'Baidu', url: 'https://www.baidu.com' },
    { name: 'Cloudflare', url: 'https://www.cloudflare.com' },
    { name: 'Amazon AWS', url: 'https://aws.amazon.com' },
    { name: 'Microsoft Azure', url: 'https://azure.microsoft.com' },
    { name: 'Alibaba Cloud', url: 'https://www.alibabacloud.com' },
    { name: 'Tencent Cloud', url: 'https://cloud.tencent.com' },
    { name: 'GitHub', url: 'https://github.com' }
  ];

  // Test latency for a single server
  const testServerLatency = async (server) => {
    const iterations = 3; // Test 3 times and take the average
    const results = [];
    
    for (let i = 0; i < iterations; i++) {
      try {
        const startTime = performance.now();
        const response = await fetch(`${server.url}/favicon.ico`, {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const endTime = performance.now();
        results.push(endTime - startTime);
      } catch (err) {
        // If request fails, record a large latency value
        results.push(5000);
      }
    }
    
    // Calculate average, minimum and maximum latency
    const validResults = results.filter(r => r < 5000);
    if (validResults.length === 0) {
      return {
        name: server.name,
        url: server.url,
        avgLatency: null,
        minLatency: null,
        maxLatency: null,
        status: 'error'
      };
    }
    
    const avgLatency = Math.round(validResults.reduce((a, b) => a + b, 0) / validResults.length);
    const minLatency = Math.round(Math.min(...validResults));
    const maxLatency = Math.round(Math.max(...validResults));
    
    return {
      name: server.name,
      url: server.url,
      avgLatency,
      minLatency,
      maxLatency,
      status: 'success'
    };
  };

  // Test latency for all servers
  const testAllServers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const allResults = [];
      
      for (const server of servers) {
        const result = await testServerLatency(server);
        allResults.push(result);
        // Update results so users can see progress
        setResults([...allResults]);
      }
      
      // Sort by average latency (servers that can't connect are placed at the end)
      const sortedResults = [...allResults].sort((a, b) => {
        if (a.status === 'error' && b.status === 'error') return 0;
        if (a.status === 'error') return 1;
        if (b.status === 'error') return -1;
        return a.avgLatency - b.avgLatency;
      });
      
      setResults(sortedResults);
    } catch (err) {
      setError(`Error during test: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Automatically start testing when component loads
  useEffect(() => {
    testAllServers();
  }, []);

  // Get latency level
  const getLatencyLevel = (latency) => {
    if (latency === null) return { color: 'error', text: 'Connection Failed' };
    if (latency < 100) return { color: 'success', text: 'Excellent' };
    if (latency < 200) return { color: 'success', text: 'Good' };
    if (latency < 500) return { color: 'warning', text: 'Fair' };
    return { color: 'error', text: 'Poor' };
  };

  // Copy results to clipboard
  const copyResultsToClipboard = () => {
    const text = results.map(r => 
      `${r.name} (${r.url}): ${r.status === 'success' 
        ? `Average Latency: ${r.avgLatency}ms, Min Latency: ${r.minLatency}ms, Max Latency: ${r.maxLatency}ms` 
        : 'Connection Failed'}`
    ).join('\n');
    
    navigator.clipboard.writeText(text);
    showSnackbar('Results copied to clipboard', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Network Latency Test
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Test your network latency to different servers to help diagnose connection issues and choose the best server.
      </Typography>

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <NetworkPingIcon sx={{ mr: 1 }} />
              Server Latency Test Results
            </Typography>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
              onClick={testAllServers}
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Test Again'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Server</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Average Latency</TableCell>
                  <TableCell align="right">Min Latency</TableCell>
                  <TableCell align="right">Max Latency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result) => {
                  const latencyLevel = getLatencyLevel(result.avgLatency);
                  return (
                    <TableRow key={result.name}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {result.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {result.url}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={result.status === 'success' ? latencyLevel.text : 'Connection Failed'}
                          color={result.status === 'success' ? latencyLevel.color : 'error'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {result.avgLatency !== null ? `${result.avgLatency} ms` : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {result.minLatency !== null ? `${result.minLatency} ms` : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {result.maxLatency !== null ? `${result.maxLatency} ms` : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {results.length === 0 && loading && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={40} />
                      <Typography sx={{ mt: 2 }}>Testing server latency...</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {results.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Tooltip title="Copy Results">
                <IconButton onClick={copyResultsToClipboard}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </CardContent>
      </Card>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          About Network Latency
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Latency Level Explanation
            </Typography>
            <Box sx={{ ml: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip size="small" label="Excellent" color="success" sx={{ mr: 1, minWidth: '80px' }} />
                &lt; 100ms - Excellent connection, suitable for real-time gaming and video conferencing
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip size="small" label="Good" color="success" sx={{ mr: 1, minWidth: '80px' }} />
                100-200ms - Good connection, suitable for most online activities
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip size="small" label="Fair" color="warning" sx={{ mr: 1, minWidth: '80px' }} />
                200-500ms - Acceptable connection, but may affect some real-time applications
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip size="small" label="Poor" color="error" sx={{ mr: 1, minWidth: '80px' }} />
                &gt; 500ms - Poor connection, may cause noticeable delay
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              How to Improve Network Latency
            </Typography>
            <Box component="ul" sx={{ ml: 2 }}>
              <li>
                <Typography variant="body2">
                  Use wired network connection instead of wireless
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Close background download and upload tasks
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Use servers that are geographically closer to you
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Contact your ISP to upgrade your network service
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Use network acceleration services or CDN
                </Typography>
              </li>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}