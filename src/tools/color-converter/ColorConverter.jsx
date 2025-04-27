import { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ColorLensIcon from '@mui/icons-material/ColorLens';

export default function ColorConverter() {
  const [colorInput, setColorInput] = useState('#1976d2');
  const [hexValue, setHexValue] = useState('#1976d2');
  const [rgbValue, setRgbValue] = useState('rgb(25, 118, 210)');
  const [hslValue, setHslValue] = useState('hsl(210, 79%, 46%)');
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Handle color input change
  const handleColorInputChange = (e) => {
    const value = e.target.value;
    setColorInput(value);
    convertColor(value, activeTab);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    convertColor(colorInput, newValue);
  };

  // Color conversion function
  const convertColor = (value, format) => {
    try {
      setError('');
      let hex, rgb, hsl;

      // Parse color based on the currently selected format
      if (format === 0) { // HEX
        if (!value.startsWith('#')) {
          value = '#' + value;
        }
        if (!/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(value)) {
          throw new Error('Invalid HEX color format');
        }
        hex = value;
        rgb = hexToRgb(hex);
        hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      } else if (format === 1) { // RGB
        const rgbMatch = value.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
        if (!rgbMatch) {
          throw new Error('Invalid RGB color format, please use rgb(r, g, b)');
        }
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);
        if (r > 255 || g > 255 || b > 255) {
          throw new Error('RGB values must be between 0-255');
        }
        rgb = { r, g, b };
        hex = rgbToHex(r, g, b);
        hsl = rgbToHsl(r, g, b);
      } else if (format === 2) { // HSL
        const hslMatch = value.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/);
        if (!hslMatch) {
          throw new Error('Invalid HSL color format, please use hsl(h, s%, l%)');
        }
        const h = parseInt(hslMatch[1], 10);
        const s = parseInt(hslMatch[2], 10);
        const l = parseInt(hslMatch[3], 10);
        if (h > 360 || s > 100 || l > 100) {
          throw new Error('HSL values are out of range');
        }
        hsl = { h, s, l };
        rgb = hslToRgb(h, s, l);
        hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      }

      // Update all color values
      setHexValue(hex);
      setRgbValue(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      setHslValue(`hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`);
    } catch (err) {
      setError(err.message);
    }
  };

  // HEX to RGB
  const hexToRgb = (hex) => {
    // Remove # sign
    hex = hex.replace('#', '');

    // Handle 3-digit HEX
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    // Parse RGB values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
  };

  // RGB to HEX
  const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // grayscale
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // HSL to RGB
  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // grayscale
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('Copied to clipboard', 'success');
  };

  // Clear all
  const clearAll = () => {
    setColorInput('');
    setHexValue('');
    setRgbValue('');
    setHslValue('');
    setError('');
  };

  // Show snackbar message
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Use example color
  const useExampleColor = () => {
    const examples = [
      '#1976d2', // Blue
      '#f44336', // Red
      '#4caf50', // Green
      '#ff9800', // Orange
      '#9c27b0'  // Purple
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setColorInput(randomExample);
    convertColor(randomExample, activeTab);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Color Converter Tool
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Convert between HEX, RGB, and HSL color formats with live preview.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="Color format tabs">
                  <Tab label="HEX" />
                  <Tab label="RGB" />
                  <Tab label="HSL" />
                </Tabs>
              </Box>
              
              <TextField
                fullWidth
                value={colorInput}
                onChange={handleColorInputChange}
                placeholder={activeTab === 0 ? '#RRGGBB' : activeTab === 1 ? 'rgb(r, g, b)' : 'hsl(h, s%, l%)'}
                error={!!error}
                helperText={error || 'Enter color value, format depends on the selected tab'}
                sx={{ mb: 3 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<ColorLensIcon />}
                  onClick={useExampleColor}
                >
                  Use Example Color
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={clearAll}
                >
                  Clear
                </Button>
              </Box>
              
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    height: 150, 
                    bgcolor: hexValue || '#ffffff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#ffffff', textShadow: '0px 0px 2px rgba(0,0,0,0.7)' }}>
                    Color Preview
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Conversion Results
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">HEX:</Typography>
                  <IconButton size="small" onClick={() => copyToClipboard(hexValue)} disabled={!hexValue}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  value={hexValue}
                  InputProps={{ readOnly: true }}
                  sx={{ 
                    fontFamily: 'monospace',
                    '& .MuiInputBase-input': { fontFamily: 'monospace' }
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">RGB:</Typography>
                  <IconButton size="small" onClick={() => copyToClipboard(rgbValue)} disabled={!rgbValue}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  value={rgbValue}
                  InputProps={{ readOnly: true }}
                  sx={{ 
                    fontFamily: 'monospace',
                    '& .MuiInputBase-input': { fontFamily: 'monospace' }
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1">HSL:</Typography>
                  <IconButton size="small" onClick={() => copyToClipboard(hslValue)} disabled={!hslValue}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  value={hslValue}
                  InputProps={{ readOnly: true }}
                  sx={{ 
                    fontFamily: 'monospace',
                    '& .MuiInputBase-input': { fontFamily: 'monospace' }
                  }}
                />
              </Box>
              
              <Box sx={{ flexGrow: 1 }} />
              
              <Button
                variant="contained"
                startIcon={<ContentCopyIcon />}
                onClick={() => copyToClipboard(`HEX: ${hexValue}\nRGB: ${rgbValue}\nHSL: ${hslValue}`)}
                disabled={!hexValue}
                fullWidth
              >
                Copy All Formats
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