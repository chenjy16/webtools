import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, CircularProgress, Alert, Card, CardMedia, CardContent, Divider, Slider, FormControl, InputLabel, Select, MenuItem, Grid, Tooltip, IconButton, Tabs, Tab, Chip, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Switch } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import HistoryIcon from '@mui/icons-material/History';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import { useImageGeneration } from './context/ImageGenerationContext';
import { generateImageFromText, saveGeneratedImage, getImageHistory } from './ImageGenerationService';
import SettingsDialog from './components/SettingsDialog';

/**
 * Image Generation Panel Component
 * Allows users to generate images from text descriptions using the FLUX.1-dev model
 */
const ImageGenerationPanel = () => {
  // 从上下文获取状态和函数
  const context = useImageGeneration() || {};
  const {
    apiKey,
    useDefaultKey,
    defaultApiKey,
    setSnackbarMessage,
    setSnackbarSeverity,
    setSnackbarOpen
  } = context;
  
  // 本地状态
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [imageHistory, setImageHistory] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedHistoryImage, setSelectedHistoryImage] = useState(null);
  
  // 图像生成选项
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [guidanceScale, setGuidanceScale] = useState(3.5);
  const [numInferenceSteps, setNumInferenceSteps] = useState(50);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000));
  const [useRandomSeed, setUseRandomSeed] = useState(true);
  
  // 加载历史记录
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getImageHistory();
        setImageHistory(history);
      } catch (error) {
        console.error('加载历史记录失败:', error);
      }
    };
    
    loadHistory();
  }, []);
  
  // Get current API key
  const getCurrentApiKey = () => {
    return useDefaultKey ? defaultApiKey : apiKey;
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Open settings dialog
  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };
  
  // Close settings dialog
  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };
  
  // Open history dialog
  const handleOpenHistory = () => {
    setHistoryDialogOpen(true);
  };
  
  // Close history dialog
  const handleCloseHistory = () => {
    setHistoryDialogOpen(false);
    setSelectedHistoryImage(null);
  };
  
  // Select image from history
  const handleSelectHistoryImage = (image) => {
    setSelectedHistoryImage(image);
    setPrompt(image.prompt);
  };
  
  // Load image from history
  const handleLoadFromHistory = () => {
    if (selectedHistoryImage) {
      setGeneratedImage(selectedHistoryImage.imageUrl);
      setPrompt(selectedHistoryImage.prompt);
      // Load generation parameters
      if (selectedHistoryImage.options) {
        if (selectedHistoryImage.options.width) setWidth(selectedHistoryImage.options.width);
        if (selectedHistoryImage.options.height) setHeight(selectedHistoryImage.options.height);
        if (selectedHistoryImage.options.guidanceScale) setGuidanceScale(selectedHistoryImage.options.guidanceScale);
        if (selectedHistoryImage.options.numInferenceSteps) setNumInferenceSteps(selectedHistoryImage.options.numInferenceSteps);
        if (selectedHistoryImage.options.seed) {
          setSeed(selectedHistoryImage.options.seed);
          setUseRandomSeed(false);
        }
      }
      handleCloseHistory();
    }
  };
  
  // Regenerate image (using new random seed)
  const handleRegenerateImage = () => {
    if (useRandomSeed) {
      setSeed(Math.floor(Math.random() * 1000000));
    }
    handleGenerateImage();
  };
  
  // Save generated image to history
  const handleSaveImage = async () => {
    if (generatedImage) {
      try {
        const options = {
          width,
          height,
          guidanceScale,
          numInferenceSteps,
          seed
        };
        
        await saveGeneratedImage(prompt, generatedImage, options);
        
        // Update history
        const history = await getImageHistory();
        setImageHistory(history);
        
        setSnackbarMessage('Image saved to history');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Failed to save image:', error);
        setSnackbarMessage('Failed to save image');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };
  
  // Share generated image
  const handleShareImage = () => {
    if (generatedImage && navigator.share) {
      navigator.share({
        title: 'FLUX.1-dev Generated Image',
        text: prompt,
        url: generatedImage
      }).then(() => {
        setSnackbarMessage('Shared successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }).catch((error) => {
        console.error('Share failed:', error);
        setSnackbarMessage('Share failed');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
    } else {
      handleCopyImageUrl();
    }
  };
  
  // Handle text to image generation
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter an image description');
      return;
    }
    
    const currentApiKey = getCurrentApiKey();
    if (!currentApiKey) {
      setError('Please set a valid API key');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // If using random seed, generate a new seed
      const currentSeed = useRandomSeed ? Math.floor(Math.random() * 1000000) : seed;
      if (useRandomSeed) {
        setSeed(currentSeed);
      }
      
      const result = await generateImageFromText(prompt, currentApiKey, {
        width,
        height,
        guidanceScale,
        numInferenceSteps,
        seed: currentSeed
      });
      
      setGeneratedImage(result.imageUrl);
      setSnackbarMessage('Image generated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Image generation failed:', error);
      setError(error.message || 'Image generation failed, please try again later');
      setSnackbarMessage(error.message || 'Image generation failed');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // This function has been removed as part of the website image generation feature removal
  
  // Copy image URL
  const handleCopyImageUrl = () => {
    if (generatedImage) {
      navigator.clipboard.writeText(generatedImage)
        .then(() => {
          setSnackbarMessage('图像URL已复制到剪贴板');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        })
        .catch(() => {
          setSnackbarMessage('复制失败，请手动复制');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        });
    }
  };
  
  // Download generated image
  const handleDownloadImage = () => {
    if (generatedImage) {
      const a = document.createElement('a');
      a.href = generatedImage;
      a.download = `flux-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  
  return (
    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={0} sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          FLUX.1-dev Image Generation
        </Typography>
        <Box>
          <Tooltip title="History">
            <IconButton onClick={handleOpenHistory}>
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton onClick={handleOpenSettings}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
      
      <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Text to Image" />
        <Tab label="Advanced Options" />
      </Tabs>
      
      <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {activeTab === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Image Description"
                multiline
                rows={3}
                fullWidth
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a detailed image description, e.g.: A modern corporate website homepage with navigation bar, hero section and product showcase"
                disabled={isGenerating}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleGenerateImage}
                  disabled={isGenerating || !prompt.trim()}
                  sx={{ flex: 1 }}
                  startIcon={isGenerating ? <CircularProgress size={20} /> : null}
                >
                  {isGenerating ? 'Generating...' : 'Generate Image'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleRegenerateImage}
                  disabled={isGenerating || !prompt.trim() || !generatedImage}
                  startIcon={<RefreshIcon />}
                >
                  Regenerate
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
        
        {activeTab === 1 && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Image Width: {width}px</Typography>
              <Slider
                value={width}
                onChange={(e, newValue) => setWidth(newValue)}
                min={512}
                max={1536}
                step={64}
                marks={[
                  { value: 512, label: '512' },
                  { value: 1024, label: '1024' },
                  { value: 1536, label: '1536' }
                ]}
                disabled={isGenerating}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Image Height: {height}px</Typography>
              <Slider
                value={height}
                onChange={(e, newValue) => setHeight(newValue)}
                min={512}
                max={1536}
                step={64}
                marks={[
                  { value: 512, label: '512' },
                  { value: 1024, label: '1024' },
                  { value: 1536, label: '1536' }
                ]}
                disabled={isGenerating}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Guidance Scale: {guidanceScale.toFixed(1)}</Typography>
              <Slider
                value={guidanceScale}
                onChange={(e, newValue) => setGuidanceScale(newValue)}
                min={1}
                max={10}
                step={0.1}
                marks={[
                  { value: 1, label: '1' },
                  { value: 5, label: '5' },
                  { value: 10, label: '10' }
                ]}
                disabled={isGenerating}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Inference Steps: {numInferenceSteps}</Typography>
              <Slider
                value={numInferenceSteps}
                onChange={(e, newValue) => setNumInferenceSteps(newValue)}
                min={10}
                max={100}
                step={1}
                marks={[
                  { value: 10, label: '10' },
                  { value: 50, label: '50' },
                  { value: 100, label: '100' }
                ]}
                disabled={isGenerating}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useRandomSeed}
                    onChange={(e) => setUseRandomSeed(e.target.checked)}
                    disabled={isGenerating}
                  />
                }
                label="Use Random Seed"
              />
            </Grid>
            
            {!useRandomSeed && (
              <Grid item xs={12}>
                <TextField
                  label="Seed Value"
                  type="number"
                  fullWidth
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                  disabled={isGenerating || useRandomSeed}
                  helperText="Using the same seed value can generate similar images"
                />
              </Grid>
            )}
          </Grid>
        )}
        
        {generatedImage && (
          <Card sx={{ mt: 3 }}>
            <CardMedia
              component="img"
              image={generatedImage}
              alt="Generated Image"
              sx={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, maxWidth: '100%', wordBreak: 'break-word' }}>
                  {prompt}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={`${width}x${height}`} 
                    size="small" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={`Steps: ${numInferenceSteps}`} 
                    size="small" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={`Seed: ${seed}`} 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Tooltip title="Save to History">
                    <IconButton onClick={handleSaveImage}>
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share Image">
                    <IconButton onClick={handleShareImage}>
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box>
                  <Tooltip title="Copy Image URL">
                    <IconButton onClick={handleCopyImageUrl}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download Image">
                    <IconButton onClick={handleDownloadImage}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
      
      {/* 设置对话框 */}
      <SettingsDialog 
        open={settingsOpen} 
        onClose={handleCloseSettings} 
      />
      
      {/* 历史记录对话框 */}
      <Dialog 
        open={historyDialogOpen} 
        onClose={handleCloseHistory}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Image History</DialogTitle>
        <DialogContent>
          {imageHistory.length === 0 ? (
            <Typography variant="body1" sx={{ py: 2 }}>
              No history records
            </Typography>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {imageHistory.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedHistoryImage === image ? '2px solid #3f51b5' : 'none',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onClick={() => handleSelectHistoryImage(image)}
                  >
                    <CardMedia
                      component="img"
                      image={image.imageUrl}
                      alt={`History image ${index + 1}`}
                      sx={{ height: 140, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" noWrap title={image.prompt}>
                        {image.prompt}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(image.timestamp).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistory}>Cancel</Button>
          <Button 
            onClick={handleLoadFromHistory} 
            disabled={!selectedHistoryImage}
            variant="contained"
          >
            Load Selected Image
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageGenerationPanel;