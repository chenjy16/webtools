import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import NetworkPingIcon from '@mui/icons-material/NetworkPing';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function SpeedTest() {
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [ping, setPing] = useState(null);
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const abortControllerRef = useRef(null);

  // Test file size (bytes)
  const downloadTestSize = 5 * 1024 * 1024; // 5MB
  const uploadTestSize = 2 * 1024 * 1024; // 2MB

  // Create test data
  const createTestData = (size) => {
    const data = new Uint8Array(size);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.floor(Math.random() * 256);
    }
    return data;
  };

  // Test download speed
  const testDownloadSpeed = async () => {
    setCurrentTest('download');
    setProgress(0);
    
    try {
      const startTime = performance.now();
      abortControllerRef.current = new AbortController();
      
      // Add random parameter to avoid cache
      const url = `https://speed.cloudflare.com/__down?bytes=${downloadTestSize}&cachebust=${Date.now()}`;
      
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`Download test failed: ${response.status} ${response.statusText}`);
      }
      
      const reader = response.body.getReader();
      let receivedLength = 0;
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        receivedLength += value.length;
        setProgress(Math.floor((receivedLength / downloadTestSize) * 100));
      }
      
      const endTime = performance.now();
      const durationInSeconds = (endTime - startTime) / 1000;
      const speedMbps = ((downloadTestSize * 8) / durationInSeconds) / (1024 * 1024);
      
      setDownloadSpeed(speedMbps);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Download test error:', err);
        setError(`Download test failed: ${err.message}`);
      }
    }
  };

  // Test upload speed
  const testUploadSpeed = async () => {
    setCurrentTest('upload');
    setProgress(0);
    
    try {
      const testData = createTestData(uploadTestSize);
      const blob = new Blob([testData]);
      
      abortControllerRef.current = new AbortController();
      const startTime = performance.now();
      
      // Use XMLHttpRequest to track upload progress
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.floor((event.loaded / event.total) * 100);
            setProgress(percentComplete);
          }
        };
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
          }
        };
        
        xhr.onerror = () => {
          reject(new Error('Network error'));
        };
        
        xhr.onabort = () => {
          reject(new Error('Upload cancelled'));
        };
        
        xhr.open('POST', 'https://httpbin.org/post');
        xhr.send(blob);
        
        // Save xhr to abort if needed
        abortControllerRef.current.signal.addEventListener('abort', () => {
          xhr.abort();
        });
      });
      
      const endTime = performance.now();
      const durationInSeconds = (endTime - startTime) / 1000;
      const speedMbps = ((uploadTestSize * 8) / durationInSeconds) / (1024 * 1024);
      
      setUploadSpeed(speedMbps);
    } catch (err) {
      if (err.name !== 'AbortError' && err.message !== 'Upload cancelled') {
        console.error('Upload test error:', err);
        setError(`Upload test failed: ${err.message}`);
      }
    }
  };

  // Test network latency
  const testPing = async () => {
    setCurrentTest('ping');
    setProgress(50);
    
    try {
      const pingUrl = 'https://www.cloudflare.com/cdn-cgi/trace';
      const iterations = 5;
      let totalTime = 0;
      
      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        
        const response = await fetch(`${pingUrl}?cachebust=${Date.now()}`, {
          method: 'GET',
          cache: 'no-store',
          signal: abortControllerRef.current.signal
        });
        
        if (!response.ok) {
          throw new Error(`Ping test failed: ${response.status}`);
        }
        
        await response.text();
        const endTime = performance.now();
        totalTime += (endTime - startTime);
        
        setProgress(50 + Math.floor(((i + 1) / iterations) * 50));
      }
      
      const averagePing = Math.round(totalTime / iterations);
      setPing(averagePing);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Ping test error:', err);
        setError(`Ping test failed: ${err.message}`);
      }
    }
  };

  // Run complete test
  const runSpeedTest = async () => {
    setTesting(true);
    setError('');
    abortControllerRef.current = new AbortController();
    
    try {
      await testPing();
      await testDownloadSpeed();
      await testUploadSpeed();
    } catch (err) {
      console.error('Error during test:', err);
      setError(`Test failed: ${err.message}`);
    } finally {
      setTesting(false);
      setCurrentTest('');
      setProgress(0);
    }
  };

  // Stop test
  const stopTest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setTesting(false);
    setCurrentTest('');
    setProgress(0);
  };

  // Copy results to clipboard
  const copyResults = () => {
    const results = `Network Speed Test Results:
Latency: ${ping ? `${ping} ms` : 'Not tested'}
Download Speed: ${downloadSpeed ? `${downloadSpeed.toFixed(2)} Mbps` : 'Not tested'}
Upload Speed: ${uploadSpeed ? `${uploadSpeed.toFixed(2)} Mbps` : 'Not tested'}`;
    
    navigator.clipboard.writeText(results);
  };

  // Format speed display
  const formatSpeed = (speed) => {
    if (speed === null) return '-- Mbps';
    if (speed < 1) return `${(speed * 1000).toFixed(0)} Kbps`;
    return `${speed.toFixed(2)} Mbps`;
  };

  // Get speed rating
  const getSpeedRating = (speed, type) => {
    if (speed === null) return { text: 'Not tested', color: 'text.secondary' };
    
    if (type === 'download') {
      if (speed >= 100) return { text: 'Excellent', color: '#4caf50' };
      if (speed >= 50) return { text: 'Very Fast', color: '#8bc34a' };
      if (speed >= 25) return { text: 'Fast', color: '#cddc39' };
      if (speed >= 10) return { text: 'Good', color: '#ffeb3b' };
      if (speed >= 5) return { text: 'Average', color: '#ffc107' };
      return { text: 'Slow', color: '#ff9800' };
    } else if (type === 'upload') {
      if (speed >= 50) return { text: 'Excellent', color: '#4caf50' };
      if (speed >= 25) return { text: 'Very Fast', color: '#8bc34a' };
      if (speed >= 10) return { text: 'Fast', color: '#cddc39' };
      if (speed >= 5) return { text: 'Good', color: '#ffeb3b' };
      if (speed >= 2) return { text: 'Average', color: '#ffc107' };
      return { text: 'Slow', color: '#ff9800' };
    } else if (type === 'ping') {
      if (speed < 20) return { text: 'Excellent', color: '#4caf50' };
      if (speed < 50) return { text: 'Very Good', color: '#8bc34a' };
      if (speed < 100) return { text: 'Good', color: '#cddc39' };
      if (speed < 150) return { text: 'Average', color: '#ffc107' };
      return { text: 'High', color: '#ff9800' };
    }
    
    return { text: 'Unknown', color: 'text.secondary' };
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Network Speed Test
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Test your network download speed, upload speed, and latency. For more accurate results, please don't close the page or perform other network activities during the test.
      </Typography>

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={testing ? <CircularProgress size={20} color="inherit" /> : <SpeedIcon />}
              onClick={testing ? stopTest : runSpeedTest}
              sx={{ px: 4, py: 1.5 }}
            >
              {testing ? 'Stop Test' : 'Start Test'}
            </Button>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          {testing && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Testing: {currentTest === 'download' ? 'Download Speed' : currentTest === 'upload' ? 'Upload Speed' : 'Network Latency'}
              </Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          )}

          <Grid container spacing={3}>
            {/* Latency */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  height: '100%',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  bgcolor: ping ? 'background.paper' : 'background.default'
                }}
              >
                <NetworkPingIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Latency
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {ping ? `${ping} ms` : '--'}
                </Typography>
                {ping && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: getSpeedRating(ping, 'ping').color,
                      fontWeight: 'bold'
                    }}
                  >
                    {getSpeedRating(ping, 'ping').text}
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Download Speed */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  height: '100%',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  bgcolor: downloadSpeed ? 'background.paper' : 'background.default'
                }}
              >
                <CloudDownloadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Download Speed
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {formatSpeed(downloadSpeed)}
                </Typography>
                {downloadSpeed && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: getSpeedRating(downloadSpeed, 'download').color,
                      fontWeight: 'bold'
                    }}
                  >
                    {getSpeedRating(downloadSpeed, 'download').text}
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Upload Speed */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  height: '100%',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  bgcolor: uploadSpeed ? 'background.paper' : 'background.default'
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Upload Speed
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {formatSpeed(uploadSpeed)}
                </Typography>
                {uploadSpeed && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: getSpeedRating(uploadSpeed, 'upload').color,
                      fontWeight: 'bold'
                    }}
                  >
                    {getSpeedRating(uploadSpeed, 'upload').text}
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>

          {(downloadSpeed || uploadSpeed || ping) && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={runSpeedTest}
                sx={{ mr: 2 }}
                disabled={testing}
              >
                Test Again
              </Button>
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={copyResults}
                disabled={testing}
              >
                Copy Results
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            About Network Speed Test
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" paragraph>
            <strong>Latency (Ping):</strong> Measures the round-trip time for data packets from your device to the server, measured in milliseconds (ms). Lower latency means faster network response, which is especially important for real-time applications like online gaming and video calls.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Download Speed:</strong> Measures how quickly data can be downloaded from the internet to your device, measured in megabits per second (Mbps). Download speed affects webpage loading, video streaming, and file downloading.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Upload Speed:</strong> Measures how quickly data can be uploaded from your device to the internet, measured in megabits per second (Mbps). Upload speed affects video conferencing, file uploading, and online gaming performance.
          </Typography>
          <Typography variant="body2">
            <strong>Note:</strong> Test results may be affected by various factors, including your connection type, ISP, network congestion, device performance, and distance to the test server. For the most accurate results, it's recommended to run multiple tests when network activity is low.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}