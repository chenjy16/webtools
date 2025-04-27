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
  Typography,
  Stack
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import QRCode from 'qrcode';

export default function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('M');
  const [size, setSize] = useState(200);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const generateQRCode = async () => {
    if (!text.trim()) {
      setError('Please enter text to convert to QR code');
      setQrCodeUrl('');
      return;
    }

    try {
      const url = await QRCode.toDataURL(text, {
        errorCorrectionLevel,
        width: size,
        margin: 1,
      });
      setQrCodeUrl(url);
      setError('');
    } catch (err) {
      setError(`QR code generation error: ${err.message}`);
      setQrCodeUrl('');
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSnackbar('QR code downloaded', 'success');
    }
  };

  const copyQRCodeUrl = () => {
    if (qrCodeUrl) {
      navigator.clipboard.writeText(qrCodeUrl);
      showSnackbar('QR code URL copied to clipboard', 'success');
    }
  };

  const clearAll = () => {
    setText('');
    setQrCodeUrl('');
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
        QR Code Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate custom QR codes for sharing URLs, contact information, Wi-Fi connections, and more.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Input Content
              </Typography>
              <TextField
                multiline
                fullWidth
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text, URL, or other information..."
                error={!!error}
                helperText={error}
                sx={{ mb: 2, flexGrow: 1 }}
              />

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Error Correction Level:</Typography>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="error-correction-level-label">Error Correction</InputLabel>
                    <Select
                      labelId="error-correction-level-label"
                      value={errorCorrectionLevel}
                      label="Error Correction"
                      onChange={(e) => setErrorCorrectionLevel(e.target.value)}
                    >
                      <MenuItem value="L">Low (7%)</MenuItem>
                      <MenuItem value="M">Medium (15%)</MenuItem>
                      <MenuItem value="Q">Quartile (25%)</MenuItem>
                      <MenuItem value="H">High (30%)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Size (pixels):</Typography>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="size-label">Size</InputLabel>
                    <Select
                      labelId="size-label"
                      value={size}
                      label="Size"
                      onChange={(e) => setSize(e.target.value)}
                    >
                      <MenuItem value={128}>128 x 128</MenuItem>
                      <MenuItem value={200}>200 x 200</MenuItem>
                      <MenuItem value={256}>256 x 256</MenuItem>
                      <MenuItem value={320}>320 x 320</MenuItem>
                      <MenuItem value={400}>400 x 400</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
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
                  onClick={generateQRCode}
                >
                  Generate QR Code
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                <Typography variant="h6">QR Code Preview</Typography>
                <Box>
                  <IconButton onClick={copyQRCodeUrl} disabled={!qrCodeUrl} sx={{ mr: 1 }}>
                    <ContentCopyIcon />
                  </IconButton>
                  <IconButton onClick={downloadQRCode} disabled={!qrCodeUrl}>
                    <DownloadIcon />
                  </IconButton>
                </Box>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  minHeight: 250,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  p: 2
                }}
              >
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Generated QR Code"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                ) : (
                  <Typography color="text.secondary">
                    QR code will be displayed here...
                  </Typography>
                )}
              </Box>

              {qrCodeUrl && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={downloadQRCode}
                  startIcon={<DownloadIcon />}
                  sx={{ mt: 2 }}
                >
                  Download QR Code
                </Button>
              )}
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