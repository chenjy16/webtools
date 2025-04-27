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
// Removed UploadFileIcon as it's not used in the translated version's logic below
// import UploadFileIcon from '@mui/icons-material/UploadFile';

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
      setError('Please enter the message content');
      setOutput('');
      return;
    }

    if (!key.trim()) {
      setError('Please enter the key');
      setOutput('');
      return;
    }

    try {
      // Calculate HMAC using Web Crypto API
      const encoder = new TextEncoder();
      const keyData = encoder.encode(key);
      const messageData = encoder.encode(message);

      // Import the key
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

      // Calculate the HMAC
      const signature = await crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        messageData
      );

      // Convert ArrayBuffer to hexadecimal string
      const hashArray = Array.from(new Uint8Array(signature));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setOutput(hashHex);
      setError('');
    } catch (err) {
      setError(`HMAC calculation error: ${err.message}`);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      showSnackbar('HMAC value copied to clipboard', 'success');
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
        HMAC Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Calculate the Hash-based Message Authentication Code (HMAC) using different hash algorithms to verify message integrity and authenticity.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Input
              </Typography>

              <TextField
                label="Message"
                multiline
                fullWidth
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter the message to calculate HMAC..."
                margin="normal"
                error={!!error && !message.trim()}
              />

              <TextField
                label="Key"
                fullWidth
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter the key..."
                margin="normal"
                error={!!error && !key.trim()}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Hash Algorithm</InputLabel>
                <Select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  label="Hash Algorithm"
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
                  Calculate HMAC
                </Button>
                <Button
                  variant="outlined"
                  onClick={clearAll}
                  color="secondary"
                  startIcon={<DeleteIcon />}
                >
                  Clear
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">HMAC Result</Typography>
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
                placeholder="HMAC result will be displayed here..."
                sx={{ fontFamily: 'monospace', '& .MuiInputBase-input': { fontFamily: 'monospace' } }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                HMAC value calculated using {algorithm} algorithm
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
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}