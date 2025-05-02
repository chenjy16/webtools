import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Typography,
  Paper,
  IconButton
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CloseIcon from '@mui/icons-material/Close';

// 导入拆分出的组件
import CreateEmail from './components/CreateEmail';
import EmailInbox from './components/EmailInbox';

// 导入API和辅助函数
import {
  API_BASE_URL,
  SESSION_ACCOUNT_KEY,
  SESSION_TOKEN_KEY,
  LAST_CREATE_TIME_KEY,
  CREATE_RATE_LIMIT,
  fetchDomains,
  createAccount,
  getToken,
  fetchMessages,
  fetchMessageDetails,
  markMessageAsRead,
  deleteMessage
} from './utils/api';

import { generateRandomString } from './utils/helpers';

export default function TempMail() {
  // State variables
  const [username, setUsername] = useState(() => generateRandomString(10));
  const [account, setAccount] = useState(null);
  const [token, setToken] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [activeTab, setActiveTab] = useState(0);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [rateLimitUntil, setRateLimitUntil] = useState(0); // Timestamp for rate limit

  // Ref for the refresh interval and rate limit timer
  const refreshIntervalRef = useRef(null);
  const rateLimitTimerRef = useRef(null);
  const [autoRefreshActive, setAutoRefreshActive] = useState(false);
  const [nextRefreshTime, setNextRefreshTime] = useState(0);
  const autoRefreshTimerRef = useRef(null);

  // --- Effects ---

  useEffect(() => {
    const savedAccount = sessionStorage.getItem(SESSION_ACCOUNT_KEY);
    const savedToken = sessionStorage.getItem(SESSION_TOKEN_KEY);

    if (savedAccount && savedToken) {
      try {
        const accountData = JSON.parse(savedAccount);
        if (accountData && accountData.id && accountData.address && savedToken) {
          setAccount(accountData);
          setToken(savedToken);
          setActiveTab(1);
          setLoading(true);
          (async () => {
            await handleFetchMessages(savedToken);
            setLoading(false);
          })();
          setError('');
          return;
        } else {
          console.warn("Stored session data is incomplete or invalid.");
          sessionStorage.removeItem(SESSION_ACCOUNT_KEY);
          sessionStorage.removeItem(SESSION_TOKEN_KEY);
        }
      } catch (e) {
        console.error("Failed to parse stored session data:", e);
        sessionStorage.removeItem(SESSION_ACCOUNT_KEY);
        sessionStorage.removeItem(SESSION_TOKEN_KEY);
        setError('Failed to load saved email session. It may have expired or is corrupted. Please create a new one.');
        showSnackbar('Failed to load saved email session.', 'error');
      }
    }

    handleFetchDomains();
  }, []);

  useEffect(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
      setAutoRefreshActive(false);
    }

    if (token && activeTab === 1 && !currentMessage && !listLoading) {
      setAutoRefreshActive(true);
      setNextRefreshTime(Date.now() + 10000);
      
      const refreshTimer = setInterval(() => {
        setNextRefreshTime(Date.now() + 10000);
      }, 1000);
      autoRefreshTimerRef.current = refreshTimer;
      
      const interval = setInterval(() => {
        console.log("Auto-refreshing messages...");
        handleFetchMessages();
      }, 10000);
      refreshIntervalRef.current = interval;
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
        autoRefreshTimerRef.current = null;
        setAutoRefreshActive(false);
      }
    };
  }, [token, activeTab, currentMessage, listLoading]);

  useEffect(() => {
    if (rateLimitUntil > Date.now()) {
      rateLimitTimerRef.current = setInterval(() => {
        if (rateLimitUntil <= Date.now()) {
          setRateLimitUntil(0);
          clearInterval(rateLimitTimerRef.current);
          rateLimitTimerRef.current = null;
        }
      }, 1000);
    }

    return () => {
      if (rateLimitTimerRef.current) {
        clearInterval(rateLimitTimerRef.current);
        rateLimitTimerRef.current = null;
      }
    };
  }, [rateLimitUntil]);

  // --- Handler Functions ---

  const handleFetchDomains = async () => {
    setError('');
    try {
      setLoading(true);
      const domainList = await fetchDomains();
      console.log("Fetched domains:", domainList);
      if (domainList && domainList.length > 0) {
        setDomains(domainList);
        setSelectedDomain(domainList[0].domain);
      } else {
        setDomains([]);
        setSelectedDomain('');
        setError('No domains available. Please try again later.');
        showSnackbar('No domains available. Cannot create email.', 'error');
      }
    } catch (err) {
      setError(`Failed to fetch domains: ${err.message}`);
      showSnackbar(`Failed to fetch domains: ${err.message}`, 'error');
      setDomains([]);
      setSelectedDomain('');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (account) {
      showSnackbar('Please delete the current email before creating a new one.', 'warning');
      return;
    }

    const lastCreateTime = parseInt(localStorage.getItem(LAST_CREATE_TIME_KEY) || '0', 10);
    const now = Date.now();
    const timeSinceLastCreate = now - lastCreateTime;

    if (timeSinceLastCreate < CREATE_RATE_LIMIT) {
      const waitTime = CREATE_RATE_LIMIT - timeSinceLastCreate;
      setRateLimitUntil(now + waitTime);
      showSnackbar(`Rate limit: Please wait ${Math.ceil(waitTime / 1000)} seconds before creating a new email.`, 'warning');
      return;
    }

    if (!username || !selectedDomain) {
      showSnackbar('Please enter a username and select a domain.', 'error');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Generate a random password
      const password = generateRandomString(12);
      const email = `${username}@${selectedDomain}`;

      // Create account
      const accountData = await createAccount(username, selectedDomain, password);
      console.log("Account created:", accountData);

      // Get token
      const tokenData = await getToken(email, password);
      console.log("Token received:", tokenData);

      // Save to state and session storage
      setAccount(accountData);
      setToken(tokenData.token);
      setActiveTab(1);

      try {
        sessionStorage.setItem(SESSION_ACCOUNT_KEY, JSON.stringify(accountData));
        sessionStorage.setItem(SESSION_TOKEN_KEY, tokenData.token);
        localStorage.setItem(LAST_CREATE_TIME_KEY, now.toString());
      } catch (storageErr) {
        console.warn("Failed to save to session storage:", storageErr);
      }

      showSnackbar('Temporary email created successfully!', 'success');
    } catch (err) {
      console.error("Error creating account:", err);
      setError(`Failed to create email: ${err.message}`);
      showSnackbar(`Failed to create email: ${err.message}`, 'error');

      if (err.message.includes('rate limit')) {
        const waitTimeMatch = err.message.match(/wait (\d+) seconds/);
        if (waitTimeMatch && waitTimeMatch[1]) {
          const waitTime = parseInt(waitTimeMatch[1], 10) * 1000;
          setRateLimitUntil(Date.now() + waitTime);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFetchMessages = async (authToken = token, isManualRefresh = false) => {
    if (!authToken) return;
    
    if (isManualRefresh) {
      setListLoading(true);
    }

    if (currentMessage) {
      console.log("Message detail is open, skipping auto-refresh list fetch.");
      return;
    }

    try {
      setError('');
      const sortedMessages = await fetchMessages(authToken);
      setMessages(sortedMessages);
    } catch (err) {
      if (err.message === 'Session expired or invalid' && err.status === 401) {
        console.error("Authentication failed fetching messages. Clearing session.");
        handleDeleteSession();
        setError('Session expired or invalid. Please create a new email.');
        showSnackbar('Session expired. Please create a new email.', 'error');
        return;
      }
      
      setError(`Failed to fetch messages: ${err.message}`);
      setMessages([]);
    } finally {
      if (isManualRefresh) {
        setListLoading(false);
      }
    }
  };

  const handleFetchMessageDetails = async (messageId) => {
    if (!token || !messageId) return;
    setCurrentMessage(null);

    try {
      setMessageLoading(true);
      setError('');
      
      const messageData = await fetchMessageDetails(token, messageId);
      setCurrentMessage(messageData);
      handleMarkMessageAsRead(messageData.id);
    } catch (err) {
      if (err.message === 'Session expired or invalid' && err.status === 401) {
        console.error("Authentication failed getting message details. Clearing session.");
        handleDeleteSession();
        setError('Session expired or invalid. Please create a new email.');
        showSnackbar('Session expired. Please create a new email.', 'error');
        return;
      }
      
      setError(`Failed to fetch message details: ${err.message}`);
      showSnackbar(`Failed to fetch message details: ${err.message}`, 'error');
      setCurrentMessage(null);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleMarkMessageAsRead = async (messageId) => {
    if (!token || !messageId) return;

    try {
      await markMessageAsRead(token, messageId);
      setMessages(prevMessages => prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, seen: true } : msg
      ));
    } catch (err) {
      if (err.message === 'Session expired or invalid' && err.status === 401) {
        console.error("Authentication failed marking message read. Clearing session.");
        handleDeleteSession();
        setError('Session expired or invalid. Please create a new email.');
        showSnackbar('Session expired. Please create a new email.', 'error');
        return;
      }
      
      console.error('Error marking message as read:', err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!token || !messageId) return;

    try {
      const deletedMessageWasCurrent = currentMessage && currentMessage.id === messageId;
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
      if (deletedMessageWasCurrent) {
        setCurrentMessage(null);
      }
      showSnackbar('Deleting message...', 'info');

      await deleteMessage(token, messageId);
      showSnackbar('Message deleted successfully.', 'success');
    } catch (err) {
      if (err.message === 'Session expired or invalid' && err.status === 401) {
        console.error("Authentication failed deleting message. Clearing session.");
        handleDeleteSession();
        setError('Session expired or invalid. Please create a new email.');
        showSnackbar('Session expired. Please create a new email.', 'error');
        return;
      }
      
      setError(`Failed to delete message: ${err.message}`);
      showSnackbar(`Failed to delete message: ${err.message}`, 'error');
    }
  };

  const handleDeleteSession = (switchTab = true) => {
    setAccount(null);
    setToken('');
    setMessages([]);
    setCurrentMessage(null);
    setUsername(generateRandomString(10));
    if (switchTab) {
      setActiveTab(0);
    }

    try {
      sessionStorage.removeItem(SESSION_ACCOUNT_KEY);
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
    } catch (storageErr) {
      console.warn("Failed to clear session storage:", storageErr);
    }

    showSnackbar('Temporary email deleted. You can now create a new email.', 'info');
  };

  const handleManualRefresh = () => {
    if (!token || loading || messageLoading || listLoading) {
      return;
    }
    handleFetchMessages(token, true);
  };

  const handleTabChange = (event, newValue) => {
    if (loading || messageLoading || listLoading) {
      return;
    }
    setActiveTab(newValue);
    setCurrentMessage(null);
    if (newValue === 1 && token && messages.length === 0 && !listLoading) {
      handleFetchMessages();
    }
  };

  const handleMessageBack = () => {
    setCurrentMessage(null);
  };

  // --- Helper Functions ---

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // --- Render ---

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Temporary Email Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Create a temporary email address to receive emails and protect your privacy. Based on mail.tm API, not recommended for important use.
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError('')}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }} aria-label="Temporary Email Tabs">
        <Tab
          label="Create Email"
          icon={<LockOpenIcon />}
          iconPosition="start"
          id="tab-create-mail"
          aria-controls="panel-create-mail"
          disabled={!!account && !loading}
        />
        <Tab
          label="Inbox"
          icon={<EmailIcon />}
          iconPosition="start"
          id="tab-inbox"
          aria-controls="panel-inbox"
          disabled={!account || loading}
        />
      </Tabs>

      <Paper sx={{ p: 0, mb: 3, overflow: 'hidden' }}>
        {activeTab === 0 && (
          <CreateEmail
            account={account}
            username={username}
            setUsername={setUsername}
            domains={domains}
            selectedDomain={selectedDomain}
            setSelectedDomain={setSelectedDomain}
            loading={loading}
            rateLimitUntil={rateLimitUntil}
            onCreateAccount={handleCreateAccount}
            onDeleteAccount={() => handleDeleteSession(true)}
            showSnackbar={showSnackbar}
          />
        )}

  
        {activeTab === 1 && (
        <EmailInbox
          account={account}
          messages={messages}
          currentMessage={currentMessage}
          messageLoading={messageLoading}
          listLoading={listLoading}
          autoRefreshActive={autoRefreshActive}
          nextRefreshTime={nextRefreshTime}
          onRefresh={handleManualRefresh}
          onDeleteAccount={() => handleDeleteSession(true)}
          onMessageClick={handleFetchMessageDetails}
          onMessageBack={handleMessageBack}
          onMessageDelete={handleDeleteMessage}
          showSnackbar={showSnackbar}
        />
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}