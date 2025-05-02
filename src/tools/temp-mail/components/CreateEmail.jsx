import React from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { generateRandomString, copyToClipboard } from '../utils/helpers';

export default function CreateEmail({ 
  account, 
  username, 
  setUsername, 
  domains, 
  selectedDomain, 
  setSelectedDomain, 
  loading, 
  rateLimitUntil, 
  onCreateAccount, 
  onDeleteAccount,
  showSnackbar
}) {
  // 当domains数组有值时，自动设置第一个域名为选中域名
  React.useEffect(() => {
    if (domains.length > 0 && !selectedDomain) {
      setSelectedDomain(domains[0].domain);
    }
  }, [domains, selectedDomain, setSelectedDomain]);

  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        Create Temporary Email
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph align="center">
        Temporary email can be used for website registration, receiving verification codes, etc. No registration required. Valid for 24 hours.
      </Typography>

      {account ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Temporary Email Address
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              value={account.address}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => copyToClipboard(account.address, showSnackbar)}>
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDeleteAccount}
            sx={{ mt: 2 }}
          >
            Delete This Email
          </Button>
        </Box>
      ) : (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setUsername(generateRandomString(10))}>
                        <RefreshIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  // 添加域名作为后缀
                  sx: { '& input': { paddingRight: '150px' } },
                }}
              />
     
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onCreateAccount}
            disabled={loading || domains.length === 0 || rateLimitUntil > Date.now()}
            startIcon={loading ? <CircularProgress size={20} /> : <LockOpenIcon />}
            sx={{ mt: 3 }}
          >
            {loading ? 'Creating...' : rateLimitUntil > Date.now() ? `Please wait ${Math.ceil((rateLimitUntil - Date.now()) / 1000)} seconds` : 'Create Email'}
          </Button>
        </Box>
      )}
    </Paper>
  );
}