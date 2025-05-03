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
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';
import DnsIcon from '@mui/icons-material/Dns';

export default function DnsLookup() {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [dnsRecords, setDnsRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // DNS record type options
  const recordTypes = [
    { value: 'A', label: 'A (IPv4 Address)' },
    { value: 'AAAA', label: 'AAAA (IPv6 Address)' },
    { value: 'MX', label: 'MX (Mail Exchange)' },
    { value: 'TXT', label: 'TXT (Text Record)' },
    { value: 'NS', label: 'NS (Name Server)' },
    { value: 'CNAME', label: 'CNAME (Canonical Name)' },
    { value: 'SOA', label: 'SOA (Start of Authority)' },
    { value: 'CAA', label: 'CAA (Certificate Authority Authorization)' }
  ];

  const lookupDns = async () => {
    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    setLoading(true);
    setError('');
    setDnsRecords([]);

    try {
      // Use Google DNS API for DNS lookup
      const url = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${recordType}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.Status === 0) { // 0 means success
        if (data.Answer && data.Answer.length > 0) {
          setDnsRecords(data.Answer);
        } else {
          setError(`No DNS records found for type ${recordType}`);
        }
      } else {
        setError(`DNS lookup failed, status code: ${data.Status}`);
      }
    } catch (err) {
      setError(`Query error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      lookupDns();
    }
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

  // Format DNS record data
  const formatDnsData = (record) => {
    switch (recordType) {
      case 'A':
      case 'AAAA':
        return record.data; // IP address
      case 'MX':
        // MX record format is usually: priority mail server
        const parts = record.data.split(' ');
        return `Priority: ${parts[0]}, Server: ${parts.slice(1).join(' ')}`;
      case 'TXT':
        // Remove quotes
        return record.data.replace(/"/g, '');
      case 'NS':
      case 'CNAME':
        // Domain name, usually ends with a dot
        return record.data.endsWith('.') ? record.data.slice(0, -1) : record.data;
      case 'SOA':
        // SOA record contains multiple parts
        const soaParts = record.data.split(' ');
        return `Primary nameserver: ${soaParts[0]}, Admin email: ${soaParts[1]}, Serial: ${soaParts[2]}, Refresh: ${soaParts[3]}, Retry: ${soaParts[4]}, Expire: ${soaParts[5]}, Minimum TTL: ${soaParts[6]}`;
      default:
        return record.data;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        DNS Lookup Tool
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Query DNS records for a domain, including A, AAAA, MX, TXT, NS and other record types.
      </Typography>

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Enter Domain"
                variant="outlined"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Example: google.com"
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: <DnsIcon color="action" sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="record-type-label">Record Type</InputLabel>
                <Select
                  labelId="record-type-label"
                  value={recordType}
                  label="Record Type"
                  onChange={(e) => setRecordType(e.target.value)}
                >
                  {recordTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={lookupDns}
                disabled={loading}
                sx={{ height: '56px' }}
                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
              >
                {loading ? 'Searching...' : 'Lookup'}
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {dnsRecords.length > 0 && (
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
                <Typography variant="h6" color="primary">DNS Record Results</Typography>
                <Chip 
                  label={`${domain} (${recordType})`} 
                  color="primary" 
                  variant="outlined" 
                />
              </Box>

              <TableContainer component={Paper} sx={{ boxShadow: 'none', mb: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>TTL</TableCell>
                      <TableCell>Data</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dnsRecords.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={recordType} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{record.TTL} seconds</TableCell>
                        <TableCell sx={{ maxWidth: 300, wordBreak: 'break-all' }}>
                          {formatDnsData(record)}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Copy">
                            <IconButton 
                              size="small" 
                              onClick={() => copyToClipboard(formatDnsData(record))}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="body2" color="text.secondary">
                Query time: {new Date().toLocaleString()}
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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