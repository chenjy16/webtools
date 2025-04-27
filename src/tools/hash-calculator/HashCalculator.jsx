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
  const [hashType, setHashType] = useState('sha256'); // Default to SHA-256 as MD5 is not directly supported
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const calculateHash = async () => {
    if (!input.trim()) {
      setError('Please enter the text to calculate the hash value');
      setOutput('');
      return;
    }

    try {
      // Calculate hash value using Web Crypto API
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      let hashBuffer;

      switch (hashType) {
        case 'md5':
          // Note: Web Crypto API does not directly support MD5.
          // Consider using a third-party library like crypto-js for MD5.
          setError('Web Crypto API does not directly support MD5. Please use SHA-1 or SHA-256.');
          setOutput('');
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

      // Convert ArrayBuffer to hexadecimal string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setOutput(hashHex);
      setError('');
    } catch (err) {
      setError(`Hash calculation error: ${err.message}`);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      showSnackbar('Hash value copied to clipboard', 'success');
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
        Hash Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Calculate the hash value of text, supporting SHA-1, SHA-256, SHA-384, and SHA-512 algorithms.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Input Text</Typography>
                <Button
                  component="label"
                  size="small"
                  startIcon={<UploadFileIcon />}
                >
                  Upload File
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
                placeholder="Enter text to calculate hash value..."
                error={!!error}
                helperText={error}
                sx={{ mb: 2, flexGrow: 1 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="hash-type-label">Hash Algorithm</InputLabel>
                  <Select
                    labelId="hash-type-label"
                    value={hashType}
                    label="Hash Algorithm"
                    onChange={(e) => setHashType(e.target.value)}
                  >
                    <MenuItem value="md5">MD5 (Not Recommended)</MenuItem>
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
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={calculateHash}
                  >
                    Calculate Hash
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
                <Typography variant="h6">Hash Result</Typography>
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
                placeholder="Hash calculation result will be displayed here..."
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
                Copy Hash Value
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