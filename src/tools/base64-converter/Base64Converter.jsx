import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      setOutput('');
      setError('');
    }
  };

  const processData = () => {
    if (!input.trim()) {
      setError('Please enter data to process');
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
        setError('');
      } else {
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
        setError('');
      }
    } catch (err) {
      setError(`${mode === 'encode' ? 'Encoding error' : 'Decoding error'}: ${err.message}`);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      showSnackbar('Copied to clipboard', 'success');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const swapInputOutput = () => {
    if (output) {
      setInput(output);
      setOutput('');
      setError('');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setInput(e.target.result);
    reader.readAsText(file);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ maxWidth: '100%', p: { xs: 2, md: 4 }, background: 'linear-gradient(to right, #eef2f3, #8e9eab)' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Base64 Encoder / Decoder
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Encode or decode Base64 easily. Supports text and file inputs.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="Mode Selection"
          color="primary"
        >
          <ToggleButton value="encode">Encode</ToggleButton>
          <ToggleButton value="decode">Decode</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        {/* Input Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">{mode === 'encode' ? 'Input Text' : 'Input Base64'}</Typography>
                <Button
                  component="label"
                  size="small"
                  startIcon={<UploadFileIcon />}
                  variant="outlined"
                >
                  Upload File
                  <input hidden type="file" onChange={handleFileUpload} />
                </Button>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={12}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string...'}
                error={!!error}
                helperText={error}
                sx={{ mb: 2, flexGrow: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={clearAll}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={processData}
                >
                  {mode === 'encode' ? 'Encode' : 'Decode'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Output Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">{mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}</Typography>
                <Box>
                  <IconButton onClick={swapInputOutput} disabled={!output} sx={{ mr: 1 }}>
                    <SwapHorizIcon />
                  </IconButton>
                  <IconButton onClick={copyToClipboard} disabled={!output}>
                    <ContentCopyIcon />
                  </IconButton>
                </Box>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={12}
                value={output}
                InputProps={{ readOnly: true }}
                placeholder="Output will appear here..."
                sx={{
                  mb: 2,
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  '& .MuiInputBase-input': { fontFamily: 'monospace' },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<ContentCopyIcon />}
                onClick={copyToClipboard}
                disabled={!output}
                fullWidth
              >
                Copy Result
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
