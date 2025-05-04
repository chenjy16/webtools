import React from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import ParamsTab from './ParamsTab';
import HeadersTab from './HeadersTab';
import BodyTab from './BodyTab';
import { HTTP_METHODS } from '../utils/constants';

const RequestForm = ({
  url,
  method,
  activeTab,
  params,
  headers,
  body,
  bodyFormat,
  loading,
  onUrlChange,
  onMethodChange,
  onTabChange,
  onParamChange,
  onHeaderChange,
  onBodyChange,
  onBodyFormatChange,
  onRemoveParam,
  onRemoveHeader,
  onSendRequest,
  onSaveToFavorites
}) => {
  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id="http-method-label">Method</InputLabel>
            <Select
              labelId="http-method-label"
              value={method}
              label="Method"
              onChange={onMethodChange}
            >
              {HTTP_METHODS.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={7}>
          <TextField
            fullWidth
            label="URL"
            variant="outlined"
            value={url}
            onChange={onUrlChange}
            placeholder="https://api.example.com/endpoint"
            InputProps={{
              style: { fontSize: '15px' }
            }}
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={onSendRequest}
              disabled={loading || !url}
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            >
              Send
            </Button>
            <IconButton 
              color="primary" 
              onClick={onSaveToFavorites}
              disabled={!url}
              title="Save to favorites"
            >
              <SaveIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3 }}>
        <Tabs value={activeTab} onChange={onTabChange} aria-label="request options tabs">
          <Tab label="Params" />
          <Tab label="Headers" />
          <Tab label="Body" />
        </Tabs>
        
        <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderTop: 0 }}>
          {activeTab === 0 && (
            <ParamsTab 
              params={params} 
              onParamChange={onParamChange} 
              onRemoveParam={onRemoveParam} 
            />
          )}
          
          {activeTab === 1 && (
            <HeadersTab 
              headers={headers} 
              onHeaderChange={onHeaderChange} 
              onRemoveHeader={onRemoveHeader} 
            />
          )}
          
          {activeTab === 2 && (
            <BodyTab 
              body={body}
              bodyFormat={bodyFormat}
              onBodyChange={onBodyChange}
              onBodyFormatChange={onBodyFormatChange}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RequestForm;