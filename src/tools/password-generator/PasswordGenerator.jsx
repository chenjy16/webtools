import { useState, useEffect } from 'react';
import AdBanner from '../../components/AdBanner';
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
      setPassword('请至少选择一个字符类型');
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
    if (password && password !== '请至少选择一个字符类型') {
      navigator.clipboard.writeText(password);
      setSnackbarOpen(true);
    }
  };

  // 组件加载时生成一个密码
  useEffect(() => {
    generatePassword();
  }, []);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        密码生成器
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        生成安全、随机的密码，可自定义长度和字符类型。
      </Typography>

      {/* 工具上方广告 */}
      <AdBanner slot="1122334455" />

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
            密码长度: {length}
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
            包含字符:
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
                label="大写字母"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.lowercase}
                    onChange={handleOptionChange}
                    name="lowercase"
                  />
                }
                label="小写字母"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.numbers}
                    onChange={handleOptionChange}
                    name="numbers"
                  />
                }
                label="数字"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.symbols}
                    onChange={handleOptionChange}
                    name="symbols"
                  />
                }
                label="特殊符号"
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
            生成新密码
          </Button>
        </CardContent>
      </Card>

      {/* 工具下方广告 */}
      <AdBanner slot="5544332211" />

      <Typography variant="h6" gutterBottom>
        密码安全提示
      </Typography>
      <Typography variant="body2" paragraph>
        • 使用至少12个字符的密码以增强安全性
      </Typography>
      <Typography variant="body2" paragraph>
        • 混合使用大小写字母、数字和特殊符号
      </Typography>
      <Typography variant="body2" paragraph>
        • 避免使用个人信息作为密码
      </Typography>
      <Typography variant="body2" paragraph>
        • 不要在多个网站使用相同的密码
      </Typography>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          密码已复制到剪贴板
        </Alert>
      </Snackbar>
    </Box>
  );
}