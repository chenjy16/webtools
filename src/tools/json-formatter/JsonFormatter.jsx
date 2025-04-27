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
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import DeleteIcon from '@mui/icons-material/Delete';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const formatJson = () => {
    if (!input.trim()) {
      setError('Please enter JSON data');
      setOutput('');
      return;
    }

    try {
      // Try parsing JSON
      const parsedJson = JSON.parse(input);
      // Format JSON
      const formattedJson = JSON.stringify(parsedJson, null, indentSize);
      setOutput(formattedJson);
      setError('');
    } catch (err) {
      setError(`JSON parsing error: ${err.message}`);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      showSnackbar('JSON copied to clipboard', 'success');
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSampleData = () => {
    const sampleJson = {
      name: "JSON Formatter Tool",
      version: "1.0.0",
      features: ["Format", "Minify", "Validate"],
      settings: {
        indentSize: 2,
        theme: "light"
      },
      isActive: true,
      downloads: 1234
    };
    // Use JSON.stringify with indentation for readability in the input field
    setInput(JSON.stringify(sampleJson, null, 2));
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: 'auto',
        p: { xs: 1, sm: 3 },
        mt: { xs: 1, sm: 4 },
        mb: { xs: 2, sm: 4 },
        background: { xs: 'none', sm: '#f7f9fa' },
        borderRadius: { xs: 0, sm: 3 },
        boxShadow: { xs: 'none', sm: '0 4px 24px 0 rgba(0,0,0,0.06)' },
        minHeight: '70vh'
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        JSON Formatter Tool
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Format, beautify, and validate JSON data to make it easier to read and edit.
      </Typography>

      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 3,
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Input JSON</Typography>
                <Button
                  size="small"
                  onClick={handleSampleData}
                  startIcon={<FormatColorFillIcon />}
                >
                  Sample Data
                </Button>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={15}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your JSON data here..."
                error={!!error}
                helperText={error}
                sx={{ mb: 2, flexGrow: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="indent-size-label">Indent Size</InputLabel>
                  <Select
                    labelId="indent-size-label"
                    value={indentSize}
                    label="Indent Size"
                    onChange={(e) => setIndentSize(e.target.value)}
                  >
                    <MenuItem value={2}>2 Spaces</MenuItem>
                    <MenuItem value={4}>4 Spaces</MenuItem>
                    <MenuItem value={8}>8 Spaces</MenuItem>
                  </Select>
                </FormControl>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={formatJson}
                    sx={{ mr: 1 }}
                  >
                    Format
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={clearAll}
                    startIcon={<DeleteIcon />}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 3,
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
              background: '#fafbfc',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Formatted Result</Typography>
                <IconButton onClick={copyToClipboard} disabled={!output}>
                  <ContentCopyIcon />
                </IconButton>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={15}
                value={output}
                InputProps={{ readOnly: true }}
                placeholder="Formatted JSON will be displayed here..."
                sx={{
                  mb: 2,
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  '& .MuiInputBase-input': { fontFamily: 'monospace' }
                }}
              />
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