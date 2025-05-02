import { useState, useEffect } from 'react';
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
  FormControlLabel,
  Checkbox,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


export default function RegexTester() {
  const [regexPattern, setRegexPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  });
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [highlightedText, setHighlightedText] = useState('');

  // Common regex examples
  const regexExamples = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { name: 'Phone Number', pattern: '1[3-9]\\d{9}' },
    { name: 'URL', pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)' },
    { name: 'IP Address', pattern: '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])' }
  ];

  // Execute match when regex or test string changes
  useEffect(() => {
    testRegex();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regexPattern, testString, flags]);

  const handleFlagChange = (flag) => {
    setFlags({
      ...flags,
      [flag]: !flags[flag]
    });
  };

  const testRegex = () => {
    setMatches([]);
    setError('');
    setHighlightedText('');

    if (!regexPattern || !testString) return;

    try {
      // Build flags string
      let flagsStr = '';
      if (flags.global) flagsStr += 'g';
      if (flags.ignoreCase) flagsStr += 'i';
      if (flags.multiline) flagsStr += 'm';
      if (flags.dotAll) flagsStr += 's';
      if (flags.unicode) flagsStr += 'u';
      if (flags.sticky) flagsStr += 'y';

      // Create regex object
      const regex = new RegExp(regexPattern, flagsStr);

      // Execute match
      const matchResults = [];
      let match;

      if (flags.global) {
        while ((match = regex.exec(testString)) !== null) {
          matchResults.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
            length: match[0].length
          });
          // Prevent infinite loops with zero-width matches
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          matchResults.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
            length: match[0].length
          });
        }
      }

      setMatches(matchResults);

      // Generate highlighted text
      generateHighlightedText(testString, matchResults);

    } catch (err) {
      setError(`Regex error: ${err.message}`);
    }
  };

  const generateHighlightedText = (text, matchResults) => {
    if (matchResults.length === 0) {
      setHighlightedText(text);
      return;
    }

    // Sort matches by position
    const sortedMatches = [...matchResults].sort((a, b) => a.index - b.index);

    let result = '';
    let lastIndex = 0;

    sortedMatches.forEach((match) => {
      // Add text before the match
      result += text.substring(lastIndex, match.index);

      // Add highlighted match text
      result += `<mark style="background-color: #ffeb3b; padding: 0;">${text.substr(match.index, match.length)}</mark>`;

      lastIndex = match.index + match.length;
    });

    // Add text after the last match
    result += text.substring(lastIndex);

    setHighlightedText(result);
  };

  const applyExample = (pattern) => {
    setRegexPattern(pattern);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('Copied to clipboard', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Regex Tester
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Test and validate regular expressions, view match results and capture groups.
      </Typography>

      {/* 移除 AdBanner 组件 */}
      {/* <AdBanner slot="6677889900" /> */}

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ mr: 1 }}>Regular Expression</Typography>
                <Tooltip title="Enter the regular expression, without slashes or flags">
                  <HelpOutlineIcon fontSize="small" color="action" />
                </Tooltip>
              </Box>
              <TextField
                fullWidth
                variant="outlined"
                value={regexPattern}
                onChange={(e) => setRegexPattern(e.target.value)}
                placeholder="e.g., [a-z]+\d+"
                error={!!error}
                helperText={error}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Flags</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={<Checkbox checked={flags.global} onChange={() => handleFlagChange('global')} />}
                  label={
                    <Tooltip title="Global match - find all matches">
                      <Typography>g (Global)</Typography>
                    </Tooltip>
                  }
                />
                <FormControlLabel
                  control={<Checkbox checked={flags.ignoreCase} onChange={() => handleFlagChange('ignoreCase')} />}
                  label={
                    <Tooltip title="Ignore case">
                      <Typography>i (Ignore Case)</Typography>
                    </Tooltip>
                  }
                />
                <FormControlLabel
                  control={<Checkbox checked={flags.multiline} onChange={() => handleFlagChange('multiline')} />}
                  label={
                    <Tooltip title="Multiline mode - ^ and $ match the start and end of each line">
                      <Typography>m (Multiline)</Typography>
                    </Tooltip>
                  }
                />
                <FormControlLabel
                  control={<Checkbox checked={flags.dotAll} onChange={() => handleFlagChange('dotAll')} />}
                  label={
                    <Tooltip title="Dot matches all characters, including newlines">
                      <Typography>s (Dot All)</Typography>
                    </Tooltip>
                  }
                />
                <FormControlLabel
                  control={<Checkbox checked={flags.unicode} onChange={() => handleFlagChange('unicode')} />}
                  label={
                    <Tooltip title="Enable Unicode matching">
                      <Typography>u (Unicode)</Typography>
                    </Tooltip>
                  }
                />
                <FormControlLabel
                  control={<Checkbox checked={flags.sticky} onChange={() => handleFlagChange('sticky')} />}
                  label={
                    <Tooltip title="Sticky match - only match from the regex's lastIndex position">
                      <Typography>y (Sticky)</Typography>
                    </Tooltip>
                  }
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Test String</Typography>
              <TextField
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter the text to test against..."
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Common Regex Patterns</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {regexExamples.map((example, index) => (
                  <Chip
                    key={index}
                    label={example.name}
                    onClick={() => applyExample(example.pattern)}
                    color="primary"
                    variant="outlined"
                    clickable
                  />
                ))}
              </Box>
            </Grid>

            {highlightedText && (
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: 2, backgroundColor: '#fafafa' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="primary">Match Results</Typography>
                    <IconButton
                      onClick={() => copyToClipboard(matches.map(m => m.value).join('\n'))}
                      color="primary"
                      disabled={matches.length === 0}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Found {matches.length} match(es)
                  </Typography>

                  <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: 'white', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    <div dangerouslySetInnerHTML={{ __html: highlightedText }} />
                  </Paper>

                  {matches.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Match Details
                      </Typography>
                      <List dense>
                        {matches.map((match, index) => (
                          <ListItem key={index} divider={index < matches.length - 1}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body2">
                                    Match #{index + 1}: <strong>{match.value}</strong>
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Index: {match.index}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                match.groups.length > 0 ? (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      Capture Groups:
                                    </Typography>
                                    {match.groups.map((group, groupIndex) => (
                                      <Typography key={groupIndex} variant="body2">
                                        Group {groupIndex + 1}: {group || '(empty)'}
                                      </Typography>
                                    ))}
                                  </Box>
                                ) : null
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>



      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}