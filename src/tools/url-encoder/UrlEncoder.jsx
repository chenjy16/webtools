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
  ToggleButton
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import UploadFileIcon from '@mui/icons-material/UploadFile';


export default function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
      // Clear output, but keep input
      setOutput('');
      setError('');
    }
  };

  const processData = () => {
    if (!input.trim()) {
      setError('Please enter the data to process');
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        // URL encode
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
        setError('');
      } else {
        // URL decode
        const decoded = decodeURIComponent(input);
        setOutput(decoded);
        setError('');
      }
    } catch (err) {
      setError(`${mode === 'encode' ? 'URL Encoding' : 'URL Decoding'} error: ${err.message}`);
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
        URL Encoder/Decoder Tool
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Online URL encoding and decoding, supports special characters and Unicode characters.
      </Typography>

      {/* 移除 AdBanner 组件 */}
      {/* <AdBanner slot="8899001122" /> */}

      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="Encode or Decode mode"
          color="primary"
        >
          <ToggleButton value="encode" aria-label="Encode">
            Encode
          </ToggleButton>
          <ToggleButton value="decode" aria-label="Decode">
            Decode
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  {mode === 'encode' ? 'Input Text' : 'Input URL Encoded String'}
                </Typography>
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
                rows={12}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter URL encoded string to decode...'}
                error={!!error}
                helperText={error}
                sx={{ mb: 2, flexGrow: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearAll}
                  startIcon={<DeleteIcon />}
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

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  {mode === 'encode' ? 'URL Encoded Result' : 'Decoded Result'}
                </Typography>
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
                placeholder={mode === 'encode' ? 'URL encoded result will appear here...' : 'Decoded result will appear here...'}
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
                Copy Result
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