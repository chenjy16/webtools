import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Paper,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Switch,
  FormControlLabel
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CompareIcon from '@mui/icons-material/Compare';
import AdBanner from '../../components/AdBanner';

export default function ImageCompressor() {
  // File-related states
  const [sourceFile, setSourceFile] = useState(null);
  const [sourceImage, setSourceImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [error, setError] = useState('');
  
  // Compression parameters
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState('image/jpeg');
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [resizeImage, setResizeImage] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [comparing, setComparing] = useState(false);
  
  // References
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Mapping of formats to file extensions
  const formatExtensions = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/bmp': 'bmp'
  };
  
  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    setSourceFile(file);
    setOriginalSize(file.size);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setSourceImage(img);
        setPreviewUrl(e.target.result);
        setMaxWidth(img.width);
        setMaxHeight(img.height);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    
    setResultUrl('');
    setCompressedSize(0);
    setError('');
  };
  
  // Handle compression
  const handleCompress = () => {
    if (!sourceImage) {
      setError('Please upload an image first');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      let newWidth = sourceImage.width;
      let newHeight = sourceImage.height;
      
      if (resizeImage) {
        if (maintainRatio) {
          const ratio = Math.min(maxWidth / sourceImage.width, maxHeight / sourceImage.height);
          newWidth = sourceImage.width * ratio;
          newHeight = sourceImage.height * ratio;
        } else {
          newWidth = Math.min(maxWidth, sourceImage.width);
          newHeight = Math.min(maxHeight, sourceImage.height);
        }
      }
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(sourceImage, 0, 0, newWidth, newHeight);
      
      canvas.toBlob((blob) => {
        if (!blob) {
          setError('Image compression failed');
          setLoading(false);
          return;
        }
        
        const url = URL.createObjectURL(blob);
        setResultUrl(url);
        setCompressedSize(blob.size);
        setLoading(false);
        
        showSnackbar('Image compressed successfully', 'success');
      }, format, quality / 100);
    } catch (err) {
      setError(`Error during compression: ${err.message}`);
      setLoading(false);
    }
  };
  
  // Download compressed image
  const handleDownload = () => {
    if (!resultUrl) return;
    
    const link = document.createElement('a');
    link.href = resultUrl;
    
    const extension = formatExtensions[format] || 'jpg';
    
    const originalName = sourceFile.name.split('.')[0] || 'compressed';
    link.download = `${originalName}_compressed.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSnackbar('Image downloaded', 'success');
  };
  
  // Clear all
  const handleClear = () => {
    setSourceFile(null);
    setSourceImage(null);
    setPreviewUrl('');
    setResultUrl('');
    setOriginalSize(0);
    setCompressedSize(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Show snackbar notification
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Calculate compression ratio
  const getCompressionRatio = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
  };
  
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Image Compression and Format Conversion
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Compress image size, convert image format, adjust image dimensions, and improve website loading speed.
      </Typography>
      
      <AdBanner slot="1122334455" />
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Upload Image
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 3,
                mb: 3,
                minHeight: 200,
                bgcolor: 'background.paper'
              }}>
                {previewUrl ? (
                  <Box sx={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                    <img 
                      src={comparing ? resultUrl || previewUrl : previewUrl} 
                      alt="Preview Image" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px', 
                        objectFit: 'contain' 
                      }} 
                      onMouseDown={() => setComparing(true)}
                      onMouseUp={() => setComparing(false)}
                      onMouseLeave={() => setComparing(false)}
                    />
                    {resultUrl && (
                      <Button
                        size="small"
                        startIcon={<CompareIcon />}
                        sx={{ mt: 1 }}
                        onMouseDown={() => setComparing(true)}
                        onMouseUp={() => setComparing(false)}
                        onMouseLeave={() => setComparing(false)}
                      >
                        Hold to Compare Effect
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<UploadFileIcon />}
                  >
                    Select Image
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </Button>
                )}
              </Box>
              
              {previewUrl && (
                <Box sx={{ mb: 2 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    startIcon={<UploadFileIcon />}
                    sx={{ mr: 1 }}
                  >
                    Replace Image
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                </Box>
              )}
              
              {sourceFile && (
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Original Image Information
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        File Name:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {sourceFile.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        File Type:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {sourceFile.type}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        File Size:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {formatFileSize(originalSize)}
                      </Typography>
                    </Grid>
                    {sourceImage && (
                      <>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">
                            Dimensions:
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {sourceImage.width} x {sourceImage.height} Pixels
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Paper>
              )}
              
              <Box sx={{ mt: 'auto' }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCompress}
                  disabled={!sourceImage || loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Processing...' : 'Compress Image'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Compression Settings
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Output Format</InputLabel>
                <Select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  label="Output Format"
                >
                  <MenuItem value="image/jpeg">JPEG (.jpg)</MenuItem>
                  <MenuItem value="image/png">PNG (.png)</MenuItem>
                  <MenuItem value="image/webp">WebP (.webp)</MenuItem>
                  <MenuItem value="image/bmp">BMP (.bmp)</MenuItem>
                </Select>
              </FormControl>
              
              <Typography gutterBottom>
                Compression Quality: {quality}%
              </Typography>
              <Slider
                value={quality}
                onChange={(e, newValue) => setQuality(newValue)}
                aria-labelledby="quality-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={5}
                max={100}
                sx={{ mb: 3 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={resizeImage}
                    onChange={(e) => setResizeImage(e.target.checked)}
                  />
                }
                label="Adjust Image Size"
                sx={{ mb: 2 }}
              />
              
              {resizeImage && (
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={maintainRatio}
                        onChange={(e) => setMaintainRatio(e.target.checked)}
                      />
                    }
                    label="Maintain Aspect Ratio"
                    sx={{ mb: 2 }}
                  />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Maximum Width"
                        type="number"
                        fullWidth
                        value={maxWidth}
                        onChange={(e) => setMaxWidth(parseInt(e.target.value) || 0)}
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Maximum Height"
                        type="number"
                        fullWidth
                        value={maxHeight}
                        onChange={(e) => setMaxHeight(parseInt(e.target.value) || 0)}
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              {resultUrl && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Compression Result
                  </Typography>
                  
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Original Size:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {formatFileSize(originalSize)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Compressed Size:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {formatFileSize(compressedSize)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Compression Ratio:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color={getCompressionRatio() > 0 ? 'success.main' : 'error.main'}>
                          {getCompressionRatio()}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownload}
                    >
                      Download Compressed Image
                    </Button>
                  </Box>
                </Box>
              )}
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Box sx={{ display: 'none' }}>
                <canvas ref={canvasRef}></canvas>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}