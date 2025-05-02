import { useState, useEffect } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Stack,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleOptionChange = (event) => {
    setOptions({
      ...options,
      [event.target.name]: event.target.checked
    });
  };

  const generatePassword = () => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let chars = '';
    if (options.uppercase) chars += uppercaseChars;
    if (options.lowercase) chars += lowercaseChars;
    if (options.numbers) chars += numberChars;
    if (options.symbols) chars += symbolChars;

    if (chars === '') {
      setPassword('Please select at least one character type');
      return;
    }

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      generatedPassword += chars[randomIndex];
    }

    setPassword(generatedPassword);
  };

  const copyToClipboard = () => {
    if (password && password !== 'Please select at least one character type') {
      navigator.clipboard.writeText(password);
      setSnackbarOpen(true);
    }
  };

  // Generate a password when the component loads
  useEffect(() => {
    generatePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Added dependency array to run only once on mount

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Password Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate secure, random passwords with customizable length and character types.
      </Typography>


      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              value={password}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={copyToClipboard} edge="end">
                    <ContentCopyIcon />
                  </IconButton>
                ),
              }}
              sx={{ fontFamily: 'monospace' }}
            />
            <IconButton onClick={generatePassword} sx={{ ml: 1 }}>
              <RefreshIcon />
            </IconButton>
          </Box>

          <Typography id="password-length-slider" gutterBottom>
            Password Length: {length}
          </Typography>
          <Slider
            value={length}
            onChange={(e, newValue) => setLength(newValue)}
            aria-labelledby="password-length-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={4}
            max={32}
          />

          <Typography gutterBottom sx={{ mt: 2 }}>
            Include Characters:
          </Typography>
          <FormGroup>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.uppercase}
                    onChange={handleOptionChange}
                    name="uppercase"
                  />
                }
                label="Uppercase Letters"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.lowercase}
                    onChange={handleOptionChange}
                    name="lowercase"
                  />
                }
                label="Lowercase Letters"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.numbers}
                    onChange={handleOptionChange}
                    name="numbers"
                  />
                }
                label="Numbers"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.symbols}
                    onChange={handleOptionChange}
                    name="symbols"
                  />
                }
                label="Special Symbols"
              />
            </Stack>
          </FormGroup>

          <Button
            variant="contained"
            color="primary"
            onClick={generatePassword}
            fullWidth
            sx={{ mt: 3 }}
          >
            Generate New Password
          </Button>
        </CardContent>
      </Card>

      {/* 移除 AdBanner 组件 */}
      {/* <AdBanner slot="5544332211" /> */}

      <Typography variant="h6" gutterBottom>
        Password Security Tips
      </Typography>
      <Typography variant="body2" paragraph>
        • Use passwords with at least 12 characters for enhanced security
      </Typography>
      <Typography variant="body2" paragraph>
        • Mix uppercase and lowercase letters, numbers, and special symbols
      </Typography>
      <Typography variant="body2" paragraph>
        • Avoid using personal information as passwords
      </Typography>
      <Typography variant="body2" paragraph>
        • Do not use the same password on multiple websites
      </Typography>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Password copied to clipboard
        </Alert>
      </Snackbar>
    </Box>
  );
}