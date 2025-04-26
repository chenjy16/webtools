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
      setError('请输入JSON数据');
      setOutput('');
      return;
    }

    try {
      // 尝试解析JSON
      const parsedJson = JSON.parse(input);
      // 格式化JSON
      const formattedJson = JSON.stringify(parsedJson, null, indentSize);
      setOutput(formattedJson);
      setError('');
    } catch (err) {
      setError(`JSON解析错误: ${err.message}`);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      showSnackbar('JSON已复制到剪贴板', 'success');
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
      name: "JSON格式化工具",
      version: "1.0.0",
      features: ["格式化", "压缩", "验证"],
      settings: {
        indentSize: 2,
        theme: "light"
      },
      isActive: true,
      downloads: 1234
    };
    setInput(JSON.stringify(sampleJson));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        JSON格式化工具
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        格式化、美化和验证JSON数据，使其更易于阅读和编辑。
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">输入JSON</Typography>
                <Button 
                  size="small" 
                  onClick={handleSampleData}
                  startIcon={<FormatColorFillIcon />}
                >
                  示例数据
                </Button>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={15}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="在此粘贴您的JSON数据..."
                error={!!error}
                helperText={error}
                sx={{ mb: 2, flexGrow: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel id="indent-size-label">缩进大小</InputLabel>
                  <Select
                    labelId="indent-size-label"
                    value={indentSize}
                    label="缩进大小"
                    onChange={(e) => setIndentSize(e.target.value)}
                  >
                    <MenuItem value={2}>2空格</MenuItem>
                    <MenuItem value={4}>4空格</MenuItem>
                    <MenuItem value={8}>8空格</MenuItem>
                  </Select>
                </FormControl>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={formatJson}
                    sx={{ mr: 1 }}
                  >
                    格式化
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={clearAll}
                    startIcon={<DeleteIcon />}
                  >
                    清除
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
                <Typography variant="h6">格式化结果</Typography>
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
                placeholder="格式化后的JSON将显示在这里..."
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