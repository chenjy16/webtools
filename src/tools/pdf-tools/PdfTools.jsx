import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import MergeIcon from '@mui/icons-material/Merge';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import DownloadIcon from '@mui/icons-material/Download';
import { PDFDocument } from 'pdf-lib';


// PDF Merger Component
function PdfMerger() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files).filter(file => file.type === 'application/pdf');
    
    if (newFiles.length === 0) {
      setError('Please select valid PDF files');
      return;
    }
    
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    setError('');
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const moveFile = (index, direction) => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === files.length - 1)) {
      return;
    }

    const newFiles = [...files];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError('Please upload at least two PDF files to merge');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const fileArrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileArrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }
      
      const mergedPdfBytes = await mergedPdf.save();
      
      // Create download link
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged_document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess(true);
    } catch (err) {
      console.error('Error merging PDFs:', err);
      setError(`Failed to merge PDFs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Merge Multiple PDF Files
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Upload multiple PDF files, arrange them in the desired order, and combine them into a single PDF document.
      </Typography>

      <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<FileUploadIcon />}
          sx={{ mb: 2 }}
        >
          Upload PDF Files
          <input
            type="file"
            hidden
            multiple
            accept="application/pdf"
            onChange={handleFileUpload}
          />
        </Button>

        {files.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Files to Merge ({files.length})
            </Typography>
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
              {files.map((file, index) => (
                <Box key={`${file.name}-${index}`}>
                  {index > 0 && <Divider />}
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton 
                          edge="end" 
                          aria-label="move up" 
                          onClick={() => moveFile(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUpwardIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="move down" 
                          onClick={() => moveFile(index, 'down')}
                          disabled={index === files.length - 1}
                        >
                          <ArrowDownwardIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={() => removeFile(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={`${index + 1}. ${file.name}`}
                      secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            PDFs merged successfully!
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <MergeIcon />}
          onClick={mergePDFs}
          disabled={files.length < 2 || loading}
          sx={{ mt: 3 }}
          fullWidth
        >
          {loading ? 'Merging...' : 'Merge PDFs'}
        </Button>
      </Paper>
    </Box>
  );
}

// PDF Splitter Component
function PdfSplitter() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [splitMethod, setSplitMethod] = useState('all'); // 'all', 'range'
  const [pageRange, setPageRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setError('');
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPageCount(pdfDoc.getPageCount());
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError(`Failed to load PDF: ${err.message}`);
      setFile(null);
    }
  };

  const validatePageRange = (range) => {
    if (!range.trim()) return false;
    
    // Check if the range format is valid (e.g., "1-3,5,7-9")
    const rangePattern = /^(\d+(-\d+)?)(,\d+(-\d+)?)*$/;
    if (!rangePattern.test(range)) return false;
    
    // Check if the page numbers are valid
    const parts = range.split(',');
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (start < 1 || end > pageCount || start > end) return false;
      } else {
        const page = Number(part);
        if (page < 1 || page > pageCount) return false;
      }
    }
    
    return true;
  };

  const splitPDF = async () => {
    if (!file) {
      setError('Please upload a PDF file');
      return;
    }

    if (splitMethod === 'range' && !validatePageRange(pageRange)) {
      setError(`Please enter a valid page range (e.g., "1-3,5,7-9"). Pages must be between 1 and ${pageCount}.`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      if (splitMethod === 'all') {
        // Split into individual pages
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
          newPdf.addPage(copiedPage);
          
          const newPdfBytes = await newPdf.save();
          const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = `page_${i + 1}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        // Split by range
        const ranges = pageRange.split(',');
        let extractionIndex = 1;
        
        for (const range of ranges) {
          const newPdf = await PDFDocument.create();
          
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            for (let i = start - 1; i < end; i++) {
              const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
              newPdf.addPage(copiedPage);
            }
          } else {
            const pageIndex = Number(range) - 1;
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
            newPdf.addPage(copiedPage);
          }
          
          const newPdfBytes = await newPdf.save();
          const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = `extract_${extractionIndex}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          extractionIndex++;
        }
      }
      
      setSuccess(true);
    } catch (err) {
      console.error('Error splitting PDF:', err);
      setError(`Failed to split PDF: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Split PDF File
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Upload a PDF file and split it into individual pages or extract specific page ranges.
      </Typography>

      <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<FileUploadIcon />}
          sx={{ mb: 2 }}
        >
          Upload PDF File
          <input
            type="file"
            hidden
            accept="application/pdf"
            onChange={handleFileUpload}
          />
        </Button>

        {file && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              File: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB, {pageCount} pages)
            </Typography>
            
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Split Method:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button
                variant={splitMethod === 'all' ? 'contained' : 'outlined'}
                onClick={() => setSplitMethod('all')}
              >
                Split All Pages
              </Button>
              <Button
                variant={splitMethod === 'range' ? 'contained' : 'outlined'}
                onClick={() => setSplitMethod('range')}
              >
                Extract Page Range
              </Button>
            </Box>
            
            {splitMethod === 'range' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Enter page numbers or ranges (e.g., "1-3,5,7-9"):
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Paper
                      component="input"
                      sx={{
                        p: 1,
                        width: '100%',
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        '&:focus': { outline: 'none', border: '1px solid #1976d2' }
                      }}
                      placeholder="e.g., 1-3,5,7-9"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      (Total: {pageCount} pages)
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            PDF split successfully!
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <ContentCutIcon />}
          onClick={splitPDF}
          disabled={!file || loading}
          sx={{ mt: 3 }}
          fullWidth
        >
          {loading ? 'Processing...' : 'Split PDF'}
        </Button>
      </Paper>
    </Box>
  );
}

// Main PDF Tools Component
export default function PdfTools() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        PDF Tools
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Powerful tools to merge multiple PDF files into one document or split a PDF into individual pages.
      </Typography>

 

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab label="Merge PDFs" icon={<MergeIcon />} iconPosition="start" />
            <Tab label="Split PDF" icon={<ContentCutIcon />} iconPosition="start" />
          </Tabs>

          {activeTab === 0 && <PdfMerger />}
          {activeTab === 1 && <PdfSplitter />}
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          About PDF Tools
        </Typography>
        <Typography variant="body2" paragraph>
          Our PDF tools allow you to easily manipulate PDF files directly in your browser. No need to install any software - all processing happens locally on your device, ensuring your files remain private and secure.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Merge PDFs:</strong> Combine multiple PDF files into a single document. Arrange the files in any order before merging.
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Split PDF:</strong> Extract individual pages or specific page ranges from a PDF document.
        </Typography>
      </Box>
    </Box>
  );
}