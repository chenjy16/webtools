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
  IconButton,
  Fade
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AdBanner from '../../components/AdBanner'; // 导入广告组件
import { adConfig } from '../../config/adConfig'; // 导入广告配置


export default function FakeDataGenerator() {
  const [quantity, setQuantity] = useState(5);
  const [generatedData, setGeneratedData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [locale, setLocale] = useState('en_US');
  const [showPostActionAd, setShowPostActionAd] = useState(false); // 修改变量名以保持一致性

  // 在组件卸载时清除定时器
  useEffect(() => {
    let adTimer;
    
    return () => {
      if (adTimer) clearTimeout(adTimer);
    };
  }, []);

  // Locale options
  const locales = [
    { value: 'en_US', label: 'United States' },
    { value: 'zh_HK', label: 'Hong Kong' },
  ];

  // Data fields with categories
  const dataFields = [
    // Personal Info
    { key: 'firstName', label: 'First Name', category: 'personal' },
    { key: 'lastName', label: 'Last Name', category: 'personal' },
    { key: 'fullName', label: 'Full Name', category: 'personal' },
    { key: 'gender', label: 'Gender', category: 'personal' },
    { key: 'email', label: 'Email', category: 'personal' },
    { key: 'avatar', label: 'Avatar', category: 'personal' },
    { key: 'dateOfBirth', label: 'Date of Birth', category: 'personal' },
    { key: 'jobTitle', label: 'Job Title', category: 'personal' },
    // Address
    { key: 'street', label: 'Street', category: 'address' },
    { key: 'city', label: 'City', category: 'address' },
    { key: 'state', label: 'State', category: 'address' },
    { key: 'country', label: 'Country/Area', category: 'address' },
    { key: 'zipCode', label: 'Zip Code', category: 'address' },
    // Phone
    { key: 'phoneNumber', label: 'Phone Number', category: 'phone' },
    { key: 'phoneType', label: 'Phone Type', category: 'phone' },
    { key: 'countryCode', label: 'Country Code', category: 'phone' },
    // Credit Card
    { key: 'cardNumber', label: 'Card Number', category: 'creditCard' },
    { key: 'cardType', label: 'Card Type', category: 'creditCard' },
    { key: 'cvv', label: 'CVV', category: 'creditCard' },
    { key: 'expiryDate', label: 'Expiry Date', category: 'creditCard' },
    { key: 'cardholderName', label: 'Cardholder Name', category: 'creditCard' },
  ];

  // Set Faker locale
  useEffect(() => {
    faker.locale = locale;
  }, [locale]);

  // 显示广告的函数
  const displayAd = () => {
    setShowPostActionAd(true);
    
    // 8秒后自动关闭广告
    const adTimer = setTimeout(() => {
      setShowPostActionAd(false);
    }, 8000);
  };

  // Generate fake data
  const generateData = () => {
    const data = [];
    for (let i = 0; i < quantity; i++) {
      const gender = faker.person.sex();
      const fullName = faker.person.fullName({ sex: gender });
      const phoneFormats = {
        en_US: '###-###-####',
        zh_HK: '+852 #### ####',
      };
      const phoneNumber = faker.phone.number(phoneFormats[locale]);

      const item = {
        firstName: faker.person.firstName(gender),
        lastName: faker.person.lastName(),
        fullName: fullName,
        gender: gender,
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        dateOfBirth: faker.date.birthdate().toISOString().split('T')[0],
        jobTitle: faker.person.jobTitle(),
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: locale === 'en_US' ? 'United States' : 'Hong Kong',
        zipCode: faker.location.zipCode(),
        phoneNumber: phoneNumber,
        phoneType: faker.helpers.arrayElement(['Mobile', 'Home', 'Work', 'Other']),
        countryCode: locale === 'en_US' ? '+1' : '+852',
        cardNumber: faker.finance.creditCardNumber(),
        cardType: faker.finance.creditCardIssuer(),
        cvv: faker.finance.creditCardCVV(),
        expiryDate: `${String(faker.date.future().getMonth() + 1).padStart(2, '0')}/${faker.date.future().getFullYear()}`,
        cardholderName: fullName,
      };
      data.push(item);
    }
    setGeneratedData(data);
    
    // 生成数据后显示广告
    displayAd();
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('Copied to clipboard', 'success');
  };

  // Copy all data as JSON
  const copyAllAsJson = () => {
    const jsonData = JSON.stringify(generatedData, null, 2);
    copyToClipboard(jsonData);
    
    // 复制JSON后显示广告
    displayAd();
  };

  // Copy all data as CSV
  const copyAllAsCsv = () => {
    if (generatedData.length === 0) return;
    const fields = dataFields.map((field) => field.key);
    const headers = dataFields.map((field) => field.label).join(',');
    const rows = generatedData.map((item) =>
      fields
        .map((field) => {
          let value = item[field];
          if (typeof value === 'string' && value.includes(',')) {
            value = `"${value}"`;
          }
          return value;
        })
        .join(',')
    );
    const csv = [headers, ...rows].join('\n');
    copyToClipboard(csv);
    
    // 复制CSV后显示广告
    displayAd();
  };

  // Clear generated data
  const clearData = () => {
    setGeneratedData([]);
    
    // 清除数据后显示广告
    displayAd();
  };

  // 关闭广告的处理函数
  const handleCloseAd = () => {
    setShowPostActionAd(false);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Show snackbar notification
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Generate initial data
  useEffect(() => {
    generateData();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: '#1976d2', fontWeight: 'bold', textAlign: 'center' }}
      >
        Personal Address Information Data Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ textAlign: 'center' }}>
        Generate various types of fake data for testing and development. All data is generated locally in the browser with no external API calls.
      </Typography>

      {/* 操作完成后显示的广告 */}
      {showPostActionAd && (
        <Fade in={showPostActionAd} timeout={500}>
          <Paper 
            elevation={3} 
            sx={{ 
              mt: 3, 
              p: 2, 
              position: 'relative',
              borderRadius: 2,
              border: '1px solid #e0e0e0',
              backgroundColor: '#f9f9f9'
            }}
          >
            <Box sx={{ position: 'absolute', top: 5, right: 5, zIndex: 2 }}>
              <IconButton size="small" onClick={handleCloseAd} aria-label="关闭广告">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontSize: '0.7rem' }}>
             Advertisement
            </Typography>
            
            <AdBanner
              slot={adConfig.postAction ? adConfig.postAction.slot : adConfig.inContent.slot}
              format="rectangle"
              responsive={true}
              lazyLoad={false}
            />
          </Paper>
        </Fade>
      )}

      {/* Input Card */}
      <Card sx={{ mb: 4, mt: 3, boxShadow: 3, borderRadius: 2 }}>
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
                  sx={{ borderRadius: 1 }}
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
                sx={{ borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={generateData}
                startIcon={<RefreshIcon />}
                sx={{
                  borderRadius: 1,
                  py: 1.5,
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  },
                }}
              >
                Generate Data
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Generated Data Card */}
      {generatedData.length > 0 && (
        <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                Generated Data
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={copyAllAsJson}
                  sx={{
                    mr: 1,
                    borderRadius: 1,
                    '&:hover': { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                  }}
                >
                  Copy as JSON
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={copyAllAsCsv}
                  sx={{
                    mr: 1,
                    borderRadius: 1,
                    '&:hover': { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                  }}
                >
                  Copy as CSV
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearData}
                  startIcon={<DeleteIcon />}
                  sx={{
                    borderRadius: 1,
                    '&:hover': { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Box>

            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
              <Tab label="Table View" sx={{ fontWeight: 'bold' }} />
              <Tab label="JSON View" sx={{ fontWeight: 'bold' }} />
            </Tabs>

            {/* Table View */}
            {activeTab === 0 && (
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: 600,
                  overflow: 'auto',
                  boxShadow: 3,
                  borderRadius: 2,
                  '&::-webkit-scrollbar': { width: '8px' },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '4px',
                  },
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>#</TableCell>
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
                          <Box
                            component="img"
                            src={item.avatar}
                            alt="Avatar"
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              mt: 1,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            }}
                          />
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

            {/* JSON View */}
            {activeTab === 1 && (
              <Box
                component="pre"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  maxHeight: 440,
                  overflow: 'auto',
                  boxShadow: 3,
                  '&::-webkit-scrollbar': { width: '8px' },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '4px',
                  },
                }}
              >
                {JSON.stringify(generatedData, null, 2)}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}