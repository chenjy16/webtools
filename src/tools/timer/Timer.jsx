import { useState, useEffect, useRef } from 'react';
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
  MenuItem,
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AlarmIcon from '@mui/icons-material/Alarm';
import TimerIcon from '@mui/icons-material/Timer';
import FlagIcon from '@mui/icons-material/Flag';
import AdBanner from '../../components/AdBanner';
import { LinearProgress } from '@mui/material';

export default function Timer() {
  const [activeTab, setActiveTab] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const stopwatchIntervalRef = useRef(null);

  useEffect(() => {
    // 创建音频元素
    audioRef.current = new Audio('/alarm.mp3');
    audioRef.current.loop = true;
    
    return () => {
      // 清理定时器和音频
      clearInterval(intervalRef.current);
      clearInterval(stopwatchIntervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 倒计时相关函数
  const startTimer = () => {
    if (totalSeconds <= 0) return;
    
    setIsRunning(true);
    setAlarmTriggered(false);
    
    const startTime = Date.now() - (timeElapsed * 1000);
    
    intervalRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      setTimeElapsed(elapsedSeconds);
      
      if (elapsedSeconds >= totalSeconds) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setAlarmTriggered(true);
        playAlarm();
      }
    }, 100);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeElapsed(0);
    setAlarmTriggered(false);
    stopAlarm();
  };

  const calculateTotalSeconds = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    setTotalSeconds(total);
  };

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error('播放音频失败:', e));
    }
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // 秒表相关函数
  const startStopwatch = () => {
    setStopwatchRunning(true);
    const startTime = Date.now() - (stopwatchTime * 1000);
    
    stopwatchIntervalRef.current = setInterval(() => {
      setStopwatchTime(Math.floor((Date.now() - startTime) / 1000));
    }, 100);
  };

  const pauseStopwatch = () => {
    clearInterval(stopwatchIntervalRef.current);
    setStopwatchRunning(false);
  };

  const resetStopwatch = () => {
    clearInterval(stopwatchIntervalRef.current);
    setStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };

  const addLap = () => {
    const lapTime = formatTime(stopwatchTime);
    const lapNumber = laps.length + 1;
    const previousLapTime = laps.length > 0 ? laps[laps.length - 1].totalSeconds : 0;
    const lapDuration = stopwatchTime - previousLapTime;
    
    setLaps([
      ...laps,
      {
        number: lapNumber,
        time: lapTime,
        totalSeconds: stopwatchTime,
        duration: formatTime(lapDuration)
      }
    ]);
  };

  // 格式化时间
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 计算倒计时剩余时间
  const getRemainingTime = () => {
    const remaining = Math.max(0, totalSeconds - timeElapsed);
    return formatTime(remaining);
  };

  // 计算倒计时进度百分比
  const getProgress = () => {
    if (totalSeconds === 0) return 0;
    const progress = (timeElapsed / totalSeconds) * 100;
    return Math.min(100, progress);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnackbar('已复制到剪贴板', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    calculateTotalSeconds();
  }, [hours, minutes, seconds]);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        计时器工具
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        倒计时和秒表功能，帮助您精确计时。
      </Typography>

      {/* 工具上方广告 */}
      <AdBanner slot="7788990011" />

      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab icon={<AlarmIcon />} label="倒计时" />
            <Tab icon={<TimerIcon />} label="秒表" />
          </Tabs>

          {activeTab === 0 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="小时"
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                    InputProps={{ inputProps: { min: 0, max: 23 } }}
                    disabled={isRunning}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="分钟"
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    InputProps={{ inputProps: { min: 0, max: 59 } }}
                    disabled={isRunning}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="秒"
                    type="number"
                    value={seconds}
                    onChange={(e) => setSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                    InputProps={{ inputProps: { min: 0, max: 59 } }}
                    disabled={isRunning}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                    {!isRunning ? (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PlayArrowIcon />}
                        onClick={startTimer}
                        disabled={totalSeconds <= 0}
                        sx={{ minWidth: '120px' }}
                      >
                        开始
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<PauseIcon />}
                        onClick={pauseTimer}
                        sx={{ minWidth: '120px' }}
                      >
                        暂停
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      startIcon={<RestartAltIcon />}
                      onClick={resetTimer}
                      sx={{ minWidth: '120px' }}
                    >
                      重置
                    </Button>
                    {alarmTriggered && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={stopAlarm}
                        sx={{ minWidth: '120px' }}
                      >
                        停止闹铃
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  mt: 3, 
                  borderRadius: 2, 
                  backgroundColor: '#fafafa',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h1" sx={{ fontFamily: 'monospace', fontSize: '4rem' }}>
                  {getRemainingTime()}
                </Typography>
                
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={getProgress()} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: alarmTriggered ? '#f44336' : '#1976d2'
                      }
                    }}
                  />
                </Box>
                
                {alarmTriggered && (
                  <Typography variant="h6" color="error" sx={{ mt: 2 }}>
                    时间到！
                  </Typography>
                )}
              </Paper>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  borderRadius: 2, 
                  backgroundColor: '#fafafa',
                  textAlign: 'center'
                }}
              >
                <Typography variant="h1" sx={{ fontFamily: 'monospace', fontSize: '4rem' }}>
                  {formatTime(stopwatchTime)}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                  {!stopwatchRunning ? (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PlayArrowIcon />}
                      onClick={startStopwatch}
                      sx={{ minWidth: '120px' }}
                    >
                      开始
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<PauseIcon />}
                      onClick={pauseStopwatch}
                      sx={{ minWidth: '120px' }}
                    >
                      暂停
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    startIcon={<RestartAltIcon />}
                    onClick={resetStopwatch}
                    sx={{ minWidth: '120px' }}
                  >
                    重置
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<FlagIcon />}
                    onClick={addLap}
                    disabled={!stopwatchRunning}
                    sx={{ minWidth: '120px' }}
                  >
                    记录分段
                  </Button>
                </Box>
              </Paper>
              
              {laps.length > 0 && (
                <Paper elevation={2} sx={{ mt: 3, borderRadius: 2 }}>
                  <List dense>
                    <ListItem sx={{ backgroundColor: '#f5f5f5' }}>
                      <Grid container>
                        <Grid item xs={2}>
                          <Typography variant="subtitle2" color="text.secondary">分段</Typography>
                        </Grid>
                        <Grid item xs={5}>
                          <Typography variant="subtitle2" color="text.secondary">分段时间</Typography>
                        </Grid>
                        <Grid item xs={5}>
                          <Typography variant="subtitle2" color="text.secondary">总时间</Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                    <Divider />
                    {laps.map((lap, index) => (
                      <ListItem key={index} divider={index < laps.length - 1}>
                        <Grid container>
                          <Grid item xs={2}>
                            <Typography variant="body2">#{lap.number}</Typography>
                          </Grid>
                          <Grid item xs={5}>
                            <Typography variant="body2">{lap.duration}</Typography>
                          </Grid>
                          <Grid item xs={5}>
                            <Typography variant="body2">{lap.time}</Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 工具下方广告 */}
      <AdBanner slot="7788990011" />

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