import { useState } from 'react';
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
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { js as beautifyJs, css as beautifyCss, html as beautifyHtml } from 'js-beautify';
import CleanCSS from 'clean-css';
// Import custom simple HTML minifier function
import { minifyHtml } from '../../utils/simple-html-minifier.js'; // Assuming this util exists
import { minify as minifyJs } from 'terser';

export default function CodeFormatter() {
  const [activeTab, setActiveTab] = useState(0);
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [formatType, setFormatType] = useState('js'); // Default to JavaScript
  const [operation, setOperation] = useState('beautify'); // Default to beautify
  const [options, setOptions] = useState({
    // js-beautify options
    js: {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 2,
      preserve_newlines: true,
      keep_array_indentation: false,
      break_chained_methods: false,
      indent_scripts: 'normal',
      brace_style: 'collapse',
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: false,
      wrap_line_length: 0,
      indent_inner_html: false,
      comma_first: false,
      e4x: false,
      indent_empty_lines: false
    },
    css: {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 2,
      preserve_newlines: true,
      indent_inner_html: false, // Relevant for HTML beautify, but kept for consistency
      end_with_newline: false,
      wrap_line_length: 0,
      indent_empty_lines: false
    },
    html: {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 2,
      preserve_newlines: true,
      indent_inner_html: false,
      end_with_newline: false,
      wrap_line_length: 0,
      indent_empty_lines: false,
      unformatted: ['a', 'span', 'img', 'code', 'pre', 'sub', 'sup', 'em', 'strong', 'b', 'i', 'u', 'strike', 'big', 'small', 'pre'],
      content_unformatted: ['pre', 'code'],
      extra_liners: ['head', 'body', '/html']
    },
    // Minification options (simplified for browser environment)
    minifyJs: {
      compress: {
        dead_code: true,
        drop_console: false, // Usually configurable by user, default false
        drop_debugger: true,
        keep_classnames: false,
        keep_fargs: true, // Often needed to avoid breaking code relying on Function.length
        keep_fnames: false,
        keep_infinity: false,
      },
      mangle: true, // Enable name mangling
      output: {
        comments: false // Remove comments
      }
    },
    minifyCss: {
      level: 1 // Use level 1 for broader compatibility and fewer potential issues in browser
      // level: 2 // Level 2 is more aggressive
    },
    // Simple HTML minifier doesn't use options in this example
    minifyHtml: {}
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Automatically switch operation type based on tab
    setOperation(newValue === 0 ? 'beautify' : 'minify');
    setOutputCode(''); // Clear output when switching tabs/operations
  };

  const handleFormatTypeChange = (event) => {
    setFormatType(event.target.value);
    setOutputCode(''); // Clear output when changing format type
  };

  const handleInputChange = (event) => {
    setInputCode(event.target.value);
  };

  const clearAll = () => {
    setInputCode('');
    setOutputCode('');
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          showSnackbar('Copied to clipboard', 'success');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          showSnackbar('Failed to copy to clipboard', 'error');
        });
    } else {
       showSnackbar('Clipboard not available or nothing to copy', 'warning');
    }
  };

  const insertExample = () => {
    let example = '';
    if (formatType === 'js') {
      example = `function greeting(name) {\n  console.log("Hello, " + name + "!");\n  var obj = { message: \`Hello, \${name}!\`, id:123 }; return obj;\n}\n\ngreeting("World"); var x=1; if(x>0){ console.log('positive'); } else { console.log('non-positive'); }`;
    } else if (formatType === 'css') {
      example = `body{margin:0;padding:0;font-family:Arial,sans-serif; background: #eee;} /* comment */ .container{width:100%;max-width:1200px;margin:0 auto;padding:20px;} .header { background-color: #f0f0f0; padding: 10px; border-bottom: 1px solid #ddd; }`;
    } else if (formatType === 'html') {
      example = `<!DOCTYPE html><html> <head> <title>Example Page</title> <style>body{margin:0;padding:0;} .c { color: red; } </style><!-- comment --> </head> <body> <div class="container"> <h1>Hello World</h1> <p>This is an example paragraph.</p> </div> <script> function hello(){ console.log("Hello from script!"); } hello(); </script> </body></html>`;
    }
    setInputCode(example);
    setOutputCode(''); // Clear previous output
  };

  const handleProcess = async () => {
    if (!inputCode.trim()) {
      showSnackbar('Please enter code', 'error');
      return;
    }

    setOutputCode(''); // Clear previous output before processing

    try {
      if (operation === 'beautify') {
        // Beautify Code
        let beautified = '';
        if (formatType === 'js') {
           try {
            // Basic syntax check attempt (not foolproof)
             // eslint-disable-next-line no-new-func
             new Function(inputCode);
             beautified = beautifyJs(inputCode, options.js);
           } catch (jsError) {
             console.warn('Potential JavaScript syntax error, attempting beautification anyway:', jsError);
             // Attempt beautification even with syntax errors, as js-beautify might still work partially
             beautified = beautifyJs(inputCode, options.js);
           }
        } else if (formatType === 'css') {
          beautified = beautifyCss(inputCode, options.css);
        } else if (formatType === 'html') {
          beautified = beautifyHtml(inputCode, options.html);
        }
        setOutputCode(beautified);
        showSnackbar('Code beautified successfully', 'success');

      } else {
        // Minify Code
        if (formatType === 'js') {
          try {
            // Ensure Terser options are safe for browser env
            const minifyOptions = { ...options.minifyJs };
             // Remove options potentially causing issues if process is not defined
            if (minifyOptions.compress && minifyOptions.compress.global_defs) {
                delete minifyOptions.compress.global_defs;
            }

            const result = await minifyJs(inputCode, minifyOptions);
            if (result && typeof result.code === 'string') {
              setOutputCode(result.code);
              showSnackbar('Code minified successfully', 'success');
            } else {
               // Handle cases where Terser might return an error object instead
               if (result && result.error) {
                   throw result.error;
               }
              throw new Error('JavaScript minification failed to produce code.');
            }
          } catch (jsError) {
            console.error('JavaScript Minification Error:', jsError);
            showSnackbar(`JavaScript minification failed: ${jsError.message}`, 'error');
          }
        } else if (formatType === 'css') {
          try {
            const minifier = new CleanCSS(options.minifyCss);
            const result = minifier.minify(inputCode);
             if (result.errors && result.errors.length > 0) {
                console.error('CleanCSS Errors:', result.errors);
                showSnackbar(`CSS minification failed: ${result.errors.join(', ')}`, 'error');
             } else if (result.warnings && result.warnings.length > 0) {
                console.warn('CleanCSS Warnings:', result.warnings);
                setOutputCode(result.styles);
                showSnackbar('CSS minified with warnings.', 'warning');
             } else if (result.styles !== undefined) {
               setOutputCode(result.styles);
               showSnackbar('Code minified successfully', 'success');
             } else {
               throw new Error('CSS minification failed to produce styles.');
             }
          } catch (cssError) {
            console.error('CSS Minification Error:', cssError);
            showSnackbar(`CSS minification failed: ${cssError.message}`, 'error');
          }
        } else if (formatType === 'html') {
          try {
            // Using the simple custom HTML minifier
            const result = minifyHtml(inputCode); // No options needed for this simple version
            setOutputCode(result);
            showSnackbar('Code minified successfully', 'success');
          } catch (htmlError) {
            console.error('HTML Minification Error:', htmlError);
            showSnackbar(`HTML minification failed: ${htmlError.message}`, 'error');
          }
        }
      }
    } catch (error) {
      console.error('Error processing code:', error);
      showSnackbar(`Processing failed: ${error.message}`, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1, sm: 2 } }}> {/* Responsive padding */}
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Code Formatter Tool
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph align="center" sx={{ mb: 3 }}>
        Beautify or minify your JavaScript, CSS, and HTML code.
      </Typography>


      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth" // Makes tabs take full width
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Beautify Code" />
            <Tab label="Minify Code" />
          </Tabs>

          <Grid container spacing={2}> {/* Reduced spacing */}
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 2 }}> {/* Reduced margin */}
                <InputLabel id="format-type-label">Code Type</InputLabel>
                <Select
                  labelId="format-type-label"
                  value={formatType}
                  label="Code Type"
                  onChange={handleFormatTypeChange}
                >
                  <MenuItem value="js">JavaScript</MenuItem>
                  <MenuItem value="css">CSS</MenuItem>
                  <MenuItem value="html">HTML</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Input Code"
                multiline
                rows={10} // Increased rows for better usability
                value={inputCode}
                onChange={handleInputChange}
                placeholder={`Please enter your ${formatType.toUpperCase()} code here...`}
                variant="outlined" // Standard outlined variant
                InputProps={{ sx: { fontFamily: 'monospace', fontSize: '0.9rem' } }} // Monospace font
              />
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}> {/* Flex wrap and gap */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleProcess}
                disabled={!inputCode.trim()} // Disable if input is empty
                size="large" // Larger main button
              >
                {operation === 'beautify' ? 'Beautify Code' : 'Minify Code'}
              </Button>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}> {/* Gap between buttons */}
                <Button
                  variant="outlined"
                  color="info"
                  onClick={insertExample}
                >
                  Insert Example
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={clearAll}
                  startIcon={<DeleteIcon />}
                >
                  Clear All
                </Button>
              </Box>
            </Grid>

            {outputCode && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Output:</Typography>
                <Paper
                  elevation={1} // Subtle elevation
                  sx={{
                    p: 1.5, // Padding
                    position: 'relative',
                    backgroundColor: 'grey.100', // Light background for contrast
                    maxHeight: '500px', // Increased max height
                    overflow: 'auto',
                    border: '1px solid', // Add a border
                    borderColor: 'divider',
                  }}
                >
                  <IconButton
                    onClick={() => copyToClipboard(outputCode)}
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'white', // Background for visibility
                      '&:hover': { backgroundColor: 'grey.200' }
                    }}
                    title="Copy output code" // Tooltip
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>

                  <Typography
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap', // Wrap long lines
                      wordBreak: 'break-all', // Break words if necessary
                      mt: 0, // No top margin needed now
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      lineHeight: 1.5 // Improved line spacing
                    }}
                  >
                    {outputCode}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Ad banner below the tool */}
      {/* <AdBanner slot="YOUR_AD_SLOT_ID_2" /> */}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000} // Slightly longer duration
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Center snackbar
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled" // Filled variant for better visibility
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}