import { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import AdBanner from '../../components/AdBanner';

export default function FakeDataGenerator() {
  const [quantity, setQuantity] = useState(5);
  const [generatedData, setGeneratedData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [locale, setLocale] = useState('en_US');

  // Locale options
  const locales = [
    { value: 'en_US', label: 'United States' },
    { value: 'zh_HK', label: 'Hong Kong' }
  ];

  // 直接定义所有数据字段 - 使用英文标签
  const dataFields = [
    // 个人信息
    { key: 'firstName', label: 'First Name', category: 'personal' },
    { key: 'lastName', label: 'Last Name', category: 'personal' },
    { key: 'fullName', label: 'Full Name', category: 'personal' },
    { key: 'gender', label: 'Gender', category: 'personal' },
    { key: 'email', label: 'Email', category: 'personal' },
    { key: 'avatar', label: 'Avatar', category: 'personal' },
    { key: 'dateOfBirth', label: 'Date of Birth', category: 'personal' },
    { key: 'jobTitle', label: 'Job Title', category: 'personal' },
    
    // 地址信息
    { key: 'street', label: 'Street', category: 'address' },
    { key: 'city', label: 'City', category: 'address' },
    { key: 'state', label: 'State', category: 'address' },
    { key: 'country', label: 'Country/Area', category: 'address' },
    { key: 'zipCode', label: 'Zip Code', category: 'address' },
    
    // 电话信息
    { key: 'phoneNumber', label: 'Phone Number', category: 'phone' },
    { key: 'phoneType', label: 'Phone Type', category: 'phone' },
    { key: 'countryCode', label: 'Country Code', category: 'phone' },
    
    // 信用卡信息
    { key: 'cardNumber', label: 'Card Number', category: 'creditCard' },
    { key: 'cardType', label: 'Card Type', category: 'creditCard' },
    { key: 'cvv', label: 'CVV', category: 'creditCard' },
    { key: 'expiryDate', label: 'Expiry Date', category: 'creditCard' },
    { key: 'cardholderName', label: 'Cardholder Name', category: 'creditCard' }
  ];

  // 设置 faker 语言环境
  useEffect(() => {
    faker.locale = locale;
  }, [locale]);

  // 生成假数据
  const generateData = () => {
    const data = [];
    
    for (let i = 0; i < quantity; i++) {
      const gender = faker.person.sex();
      const fullName = faker.person.fullName({ sex: gender });
      const phoneFormats = {
        en_US: '###-###-####',
        zh_HK: '+852 #### ####'
      };
      const phoneNumber = faker.phone.number(phoneFormats[locale]);
      
      // 创建包含所有类别数据的单一对象
      const item = {
        // 个人信息
        firstName: faker.person.firstName(gender),
        lastName: faker.person.lastName(),
        fullName: fullName,
        gender: gender,
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        dateOfBirth: faker.date.birthdate().toISOString().split('T')[0],
        jobTitle: faker.person.jobTitle(),
        
        // 地址信息
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: locale === 'en_US' ? 'United States' : 'Hong Kong',
        zipCode: faker.location.zipCode(),
        
        // 电话信息
        phoneNumber: phoneNumber,
        phoneType: faker.helpers.arrayElement(['Mobile', 'Home', 'Work', 'Other']),
        countryCode: locale === 'en_US' ? '+1' : '+852',
        
        // 信用卡信息
        cardNumber: faker.finance.creditCardNumber(),
        cardType: faker.finance.creditCardIssuer(),
        cvv: faker.finance.creditCardCVV(),
        expiryDate: `${String(faker.date.future().getMonth() + 1).padStart(2, '0')}/${faker.date.future().getFullYear()}`,
        cardholderName: fullName
      };
      
      data.push(item);
    }
    
    setGeneratedData(data);
  };

  // 复制到剪贴板
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('Copied to clipboard', 'success');
  };

  // 复制所有数据为 JSON
  const copyAllAsJson = () => {
    const jsonData = JSON.stringify(generatedData, null, 2);
    copyToClipboard(jsonData);
  };

  // 复制所有数据为 CSV
  const copyAllAsCsv = () => {
    if (generatedData.length === 0) return;
    
    const fields = dataFields.map(field => field.key);
    const headers = dataFields.map(field => field.label).join(',');
    
    const rows = generatedData.map(item => {
      return fields.map(field => {
        let value = item[field.key];
        // 处理包含逗号的值，用引号包裹
        if (typeof value === 'string' && value.includes(',')) {
          value = `"${value}"`;
        }
        return value;
      }).join(',');
    });
    
    const csv = [headers, ...rows].join('\n');
    copyToClipboard(csv);
  };

  // 清除生成的数据
  const clearData = () => {
    setGeneratedData([]);
  };

  // 处理标签页变化
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 显示提示消息
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // 初始生成一些数据
  useEffect(() => {
    generateData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 获取所有字段
  const getAllFields = () => {
    return [
      ...dataFields.filter(field => field.category === 'personal'),
      ...dataFields.filter(field => field.category === 'address'),
      ...dataFields.filter(field => field.category === 'phone'),
      ...dataFields.filter(field => field.category === 'creditCard')
    ];
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Personal Address Information Data Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Generate various types of fake data for testing and development. All data is generated locally in the browser with no external API calls.
      </Typography>

      <AdBanner slot="1122334455" />

      <Card sx={{ mb: 4, mt: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="locale-label">Region</InputLabel>
                <Select
                  labelId="locale-label"
                  value={locale}
                  label="Region"
                  onChange={(e) => setLocale(e.target.value)}
                >
                  {locales.map((loc) => (
                    <MenuItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                InputProps={{ inputProps: { min: 1, max: 100 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={generateData}
                startIcon={<RefreshIcon />}
              >
                Generate Data
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {generatedData.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Generated Data</Typography>
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={copyAllAsJson}
                  sx={{ mr: 1 }}
                >
                  Copy as JSON
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={copyAllAsCsv}
                  sx={{ mr: 1 }}
                >
                  Copy as CSV
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearData}
                  startIcon={<DeleteIcon />}
                >
                  Clear
                </Button>
              </Box>
            </Box>

            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Table View" />
              <Tab label="JSON View" />
            </Tabs>

            {activeTab === 0 && (
              <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0f8ff' }}>Personal Info</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f0fff0' }}>Address</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fff0f5' }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#fffaf0' }}>Credit Card</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {generatedData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <strong>Name:</strong> {item.fullName}<br />
                          <strong>Gender:</strong> {item.gender}<br />
                          <strong>Email:</strong> {item.email}<br />
                          <strong>DOB:</strong> {item.dateOfBirth}<br />
                          <strong>Job:</strong> {item.jobTitle}<br />
                          <Box component="img" src={item.avatar} alt="Avatar" sx={{ width: 50, height: 50, borderRadius: '50%', mt: 1 }} />
                        </TableCell>
                        <TableCell>
                          <strong>Street:</strong> {item.street}<br />
                          <strong>City:</strong> {item.city}<br />
                          <strong>State:</strong> {item.state}<br />
                          <strong>Country/Area:</strong> {item.country}<br />
                          <strong>Zip:</strong> {item.zipCode}
                        </TableCell>
                        <TableCell>
                          <strong>Number:</strong> {item.phoneNumber}<br />
                          <strong>Type:</strong> {item.phoneType}<br />
                          <strong>Country Code:</strong> {item.countryCode}
                        </TableCell>
                        <TableCell>
                          <strong>Number:</strong> {item.cardNumber}<br />
                          <strong>Type:</strong> {item.cardType}<br />
                          <strong>CVV:</strong> {item.cvv}<br />
                          <strong>Expires:</strong> {item.expiryDate}<br />
                          <strong>Name:</strong> {item.cardholderName}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {activeTab === 1 && (
              <Box
                component="pre"
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  maxHeight: 440,
                  overflow: 'auto'
                }}
              >
                {JSON.stringify(generatedData, null, 2)}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}