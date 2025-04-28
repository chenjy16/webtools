import { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import AdBanner from '../../components/AdBanner';
import cronstrue from 'cronstrue';

export default function CronGenerator() {
  // State variables
  const [cronExpression, setCronExpression] = useState('0 0 * * *');
  const [humanReadable, setHumanReadable] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [platform, setPlatform] = useState('standard');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [nextExecutions, setNextExecutions] = useState([]);
  
  // Preset Cron expressions
  const presets = [
    { label: 'Every Minute', value: '* * * * *', description: 'Runs every minute' },
    { label: 'Every Hour', value: '0 * * * *', description: 'Runs at minute 0 of every hour' },
    { label: 'Daily at Midnight', value: '0 0 * * *', description: 'Runs at 00:00 every day' },
    { label: 'Daily at 8 AM', value: '0 8 * * *', description: 'Runs at 08:00 every day' },
    { label: 'Monday at 8 AM', value: '0 8 * * 1', description: 'Runs at 08:00 every Monday' },
    { label: 'Monthly at Midnight', value: '0 0 1 * *', description: 'Runs at 00:00 on the 1st of every month' },
    { label: 'First Day of Quarter', value: '0 0 1 1,4,7,10 *', description: 'Runs at 00:00 on the first day of each quarter' },
    { label: 'January 1st', value: '0 0 1 1 *', description: 'Runs at 00:00 on January 1st every year' },
    { label: 'Weekdays at 9 AM', value: '0 9 * * 1-5', description: 'Runs at 09:00 Monday through Friday' },
    { label: 'Weekends at Noon', value: '0 12 * * 0,6', description: 'Runs at 12:00 on Saturday and Sunday' }
  ];

  // Platform-specific information
  const platforms = [
    { value: 'standard', label: 'Standard Cron', description: 'Standard Cron expression format (minute hour day month weekday)' },
    { value: 'aws', label: 'AWS CloudWatch', description: 'Supports year field and more precise time control (minute hour day month weekday year)' },
    { value: 'gcp', label: 'Google Cloud Scheduler', description: 'Uses standard Cron format but supports timezone settings' },
    { value: 'azure', label: 'Azure Functions', description: 'Uses NCRONTAB format with seconds control (second minute hour day month weekday)' }
  ];

  // Cron expression field descriptions
  const cronFields = [
    { name: 'Minute', standard: '0-59', aws: '0-59', gcp: '0-59', azure: '0-59' },
    { name: 'Hour', standard: '0-23', aws: '0-23', gcp: '0-23', azure: '0-23' },
    { name: 'Day', standard: '1-31', aws: '1-31', gcp: '1-31', azure: '1-31' },
    { name: 'Month', standard: '1-12 or JAN-DEC', aws: '1-12 or JAN-DEC', gcp: '1-12 or JAN-DEC', azure: '1-12 or JAN-DEC' },
    { name: 'Weekday', standard: '0-6 or SUN-SAT', aws: '1-7 or SUN-SAT', gcp: '0-6 or SUN-SAT', azure: '0-6 or SUN-SAT' },
    { name: 'Year', standard: 'Not supported', aws: '1970-2199', gcp: 'Not supported', azure: 'Not supported' },
    { name: 'Second', standard: 'Not supported', aws: 'Not supported', gcp: 'Not supported', azure: '0-59' }
  ];

  // Special character descriptions
  const specialChars = [
    { char: '*', description: 'Represents all possible values' },
    { char: ',', description: 'Used to list multiple values, e.g., "1,3,5"' },
    { char: '-', description: 'Represents a range, e.g., "1-5" means 1 through 5' },
    { char: '/', description: 'Specifies increments, e.g., "*/5" means every 5 units' },
    { char: '?', description: 'Used for day and weekday fields, means no specific value (supported by AWS and some systems)' },
    { char: 'L', description: 'Used for day and weekday fields, means the last day (supported by AWS and some systems)' },
    { char: 'W', description: 'Used for day field, means the nearest weekday (supported by AWS and some systems)' },
    { char: '#', description: 'Used for weekday field, specifies the nth weekday of the month, e.g., "1#3" means the third Monday (supported by AWS and some systems)' }
  ];

  // Parse Cron expression
  useEffect(() => {
    try {
      // Adjust expression format based on platform
      let expressionToUse = cronExpression;
      
      // For Azure, add default seconds field if not present
      if (platform === 'azure' && !expressionToUse.split(' ').some((part, index) => index > 4)) {
        expressionToUse = `0 ${expressionToUse}`;
      }
      
      // For AWS, no special handling needed, cronstrue will adapt automatically
      
      const options = {};
      if (platform === 'azure') {
        options.use24HourTimeFormat = true;
        options.includeSeconds = true;
      }
      
      const readable = cronstrue.toString(expressionToUse, options);
      setHumanReadable(readable);
      
      // Calculate future execution times
      calculateNextExecutions(expressionToUse);
    } catch (error) {
      setHumanReadable(`Parsing error: ${error.message}`);
      setNextExecutions([]);
    }
  }, [cronExpression, platform]);

  // Calculate future execution times
  const calculateNextExecutions = (expression) => {
    try {
      const executions = [];
      let date = new Date();
      
      // Simple Cron parser, for demonstration only
      // In a real project, use a more complete library like cron-parser
      for (let i = 0; i < 5; i++) {
        // Simplified handling, should actually calculate next execution time based on Cron expression
        date = new Date(date.getTime() + 24 * 60 * 60 * 1000); // Simply add one day
        executions.push(date.toLocaleString());
      }
      
      setNextExecutions(executions);
    } catch (error) {
      setNextExecutions([]);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('Copied to clipboard', 'success');
  };

  // Show notification message
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Apply preset
  const applyPreset = (preset) => {
    setCronExpression(preset.value);
  };

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', p: { xs: 1, sm: 2 } }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Cron Expression Generator & Parser
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Quickly generate and validate Cron expressions, supporting multiple cloud platform formats. Cron expressions are used to define scheduled task execution plans.
      </Typography>

      <AdBanner slot="1122334455" />

      <Card sx={{ mb: 3, mt: 3, boxShadow: 2, borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="platform-label">Platform</InputLabel>
                <Select
                  labelId="platform-label"
                  value={platform}
                  label="Platform"
                  onChange={(e) => setPlatform(e.target.value)}
                >
                  {platforms.map((p) => (
                    <MenuItem key={p.value} value={p.value}>
                      {p.label}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  {platforms.find(p => p.value === platform)?.description}
                </Typography>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cron Expression"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => copyToClipboard(cronExpression)} size="small">
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  ),
                }}
              />
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                {humanReadable || 'Parsing...'}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab label="Preset Expressions" />
              <Tab label="Field Descriptions" />
              <Tab label="Special Characters" />
              <Tab label="Execution Preview" />
            </Tabs>

            {activeTab === 0 && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  {presets.slice(0, 6).map((preset) => (
                    <Grid item xs={12} sm={6} md={4} key={preset.value}>
                      <Paper 
                        elevation={1} 
                        sx={{ 
                          p: 2, 
                          cursor: 'pointer', 
                          '&:hover': { bgcolor: 'action.hover' },
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                        onClick={() => applyPreset(preset)}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">{preset.label}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{preset.description}</Typography>
                        <Chip 
                          label={preset.value} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                          sx={{ alignSelf: 'flex-start', mt: 'auto' }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                {presets.length > 6 && (
                  <Button 
                    variant="text" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    onClick={() => setActiveTab(4)} // 添加一个新的 tab 索引用于显示所有预设
                  >
                    View All Presets
                  </Button>
                )}
              </Box>
            )}

            {activeTab === 1 && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Field Name</TableCell>
                      <TableCell>Standard Cron</TableCell>
                      <TableCell>AWS CloudWatch</TableCell>
                      <TableCell>Google Cloud</TableCell>
                      <TableCell>Azure Functions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cronFields.map((field) => (
                      <TableRow key={field.name}>
                        <TableCell component="th" scope="row">{field.name}</TableCell>
                        <TableCell>{field.standard}</TableCell>
                        <TableCell>{field.aws}</TableCell>
                        <TableCell>{field.gcp}</TableCell>
                        <TableCell>{field.azure}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {activeTab === 2 && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  {specialChars.map((char) => (
                    <Grid item xs={12} sm={6} md={4} key={char.char}>
                      <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h5" fontWeight="bold" color="primary">{char.char}</Typography>
                        <Typography variant="body2">{char.description}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {activeTab === 3 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Future Execution Time Preview:</Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  {nextExecutions.length > 0 ? (
                    <Box component="ul" sx={{ pl: 2, m: 0 }}>
                      {nextExecutions.map((time, index) => (
                        <Box component="li" key={index} sx={{ mb: 1 }}>
                          <Typography>{time}</Typography>
                        </Box>
                      )).slice(0, 5)}
                    </Box>
                  ) : (
                    <Typography color="text.secondary">Unable to calculate execution times, please check expression format.</Typography>
                  )}
                </Paper>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* 将常用预设表格改为卡片网格布局，避免滚动条 */}
      <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Common Cron Expression Presets</Typography>
          <Grid container spacing={2}>
            {presets.map((preset) => (
              <Grid item xs={12} sm={6} key={preset.value}>
                <Paper elevation={1} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2">{preset.label}</Typography>
                    <Typography variant="body2" color="text.secondary">{preset.description}</Typography>
                    <Typography variant="caption" component="code" sx={{ display: 'block', mt: 1 }}>{preset.value}</Typography>
                  </Box>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                    onClick={() => applyPreset(preset)}
                  >
                    Apply
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}