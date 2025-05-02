import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  IconButton,
  Slider,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';


// Game Constants
const GRID_SIZE = 20; // Grid size
const INITIAL_SPEED = 150; // Initial speed (ms)
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
]; // Initial snake position
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

export default function SnakeGame() {
  // Game states
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [gridVisible, setGridVisible] = useState(true);
  const [gameOverDialogOpen, setGameOverDialogOpen] = useState(false);

  // References
  const gameLoopRef = useRef(null);
  const canvasRef = useRef(null);
  const lastDirectionRef = useRef(direction);

  // Load high score from local storage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Generate food position
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };

    // Ensure food is not on the snake
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (isOnSnake) {
      return generateFood();
    }

    return newFood;
  }, [snake]);

  // Check collision
  const checkCollision = useCallback((head) => {
    // Check wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }

    // Check self-collision (except tail, which will move)
    for (let i = 0; i < snake.length - 1; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }

    return false;
  }, [snake]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (paused || gameOver) return;

    setSnake(prevSnake => {
      // Create new head
      const head = { ...prevSnake[0] };
      const currentDirection = lastDirectionRef.current;

      head.x += currentDirection.x;
      head.y += currentDirection.y;

      // Check collision
      if (checkCollision(head)) {
        setGameOver(true);
        setGameOverDialogOpen(true);

        // Update high score
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snakeHighScore', score.toString());
        }

        return prevSnake;
      }

      // Create new snake body
      const newSnake = [head, ...prevSnake];

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(prevScore => prevScore + 10);
        setFood(generateFood());
      } else {
        // Remove tail if no food is eaten
        newSnake.pop();
      }

      return newSnake;
    });
  }, [paused, gameOver, checkCollision, food, generateFood, score, highScore]);

  // Set game loop interval
  useEffect(() => {
    if (!paused && !gameOver) {
      gameLoopRef.current = setInterval(gameLoop, speed);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [paused, gameOver, gameLoop, speed]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (lastDirectionRef.current !== DIRECTIONS.DOWN) {
            setDirection(DIRECTIONS.UP);
            lastDirectionRef.current = DIRECTIONS.UP;
          }
          break;
        case 'ArrowDown':
          if (lastDirectionRef.current !== DIRECTIONS.UP) {
            setDirection(DIRECTIONS.DOWN);
            lastDirectionRef.current = DIRECTIONS.DOWN;
          }
          break;
        case 'ArrowLeft':
          if (lastDirectionRef.current !== DIRECTIONS.RIGHT) {
            setDirection(DIRECTIONS.LEFT);
            lastDirectionRef.current = DIRECTIONS.LEFT;
          }
          break;
        case 'ArrowRight':
          if (lastDirectionRef.current !== DIRECTIONS.LEFT) {
            setDirection(DIRECTIONS.RIGHT);
            lastDirectionRef.current = DIRECTIONS.RIGHT;
          }
          break;
        case ' ':
          // Space key to pause/resume game
          setPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    if (gridVisible) {
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 0.5;

      for (let i = 0; i <= GRID_SIZE; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
      }
    }

    // Draw food
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(
      (food.x + 0.5) * cellSize,
      (food.y + 0.5) * cellSize,
      (cellSize / 2) * 0.8,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    snake.forEach((segment, index) => {
      // Head with different color
      if (index === 0) {
        ctx.fillStyle = '#2ecc71';
      } else {
        // Gradient body color
        const greenValue = Math.floor(180 - (index * 5));
        ctx.fillStyle = `rgb(46, ${Math.max(greenValue, 100)}, 113)`;
      }

      ctx.fillRect(
        segment.x * cellSize,
        segment.y * cellSize,
        cellSize,
        cellSize
      );

      // Add border to snake segments
      ctx.strokeStyle = '#27ae60';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        segment.x * cellSize,
        segment.y * cellSize,
        cellSize,
        cellSize
      );

      // Draw eyes on head
      if (index === 0) {
        ctx.fillStyle = '#000';
        const eyeSize = cellSize / 6;
        const eyeOffset = cellSize / 3;

        if (lastDirectionRef.current === DIRECTIONS.RIGHT) {
          ctx.beginPath();
          ctx.arc((segment.x + 0.8) * cellSize, (segment.y + 0.3) * cellSize, eyeSize, 0, Math.PI * 2);
          ctx.arc((segment.x + 0.8) * cellSize, (segment.y + 0.7) * cellSize, eyeSize, 0, Math.PI * 2);
          ctx.fill();
        } else if (lastDirectionRef.current === DIRECTIONS.LEFT) {
          ctx.beginPath();
          ctx.arc((segment.x + 0.2) * cellSize, (segment.y + 0.3) * cellSize, eyeSize, 0, Math.PI * 2);
          ctx.arc((segment.x + 0.2) * cellSize, (segment.y + 0.7) * cellSize, eyeSize, 0, Math.PI * 2);
          ctx.fill();
        } else if (lastDirectionRef.current === DIRECTIONS.UP) {
          ctx.beginPath();
          ctx.arc((segment.x + 0.3) * cellSize, (segment.y + 0.2) * cellSize, eyeSize, 0, Math.PI * 2);
          ctx.arc((segment.x + 0.7) * cellSize, (segment.y + 0.2) * cellSize, eyeSize, 0, Math.PI * 2);
          ctx.fill();
        } else if (lastDirectionRef.current === DIRECTIONS.DOWN) {
          ctx.beginPath();
          ctx.arc((segment.x + 0.3) * cellSize, (segment.y + 0.8) * cellSize, eyeSize, 0, Math.PI * 2);
          ctx.arc((segment.x + 0.7) * cellSize, (segment.y + 0.8) * cellSize, eyeSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
  }, [snake, food, gridVisible]);

  // Reset game
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(DIRECTIONS.RIGHT);
    lastDirectionRef.current = DIRECTIONS.RIGHT;
    setGameOver(false);
    setScore(0);
    setPaused(true);
    setGameOverDialogOpen(false);
  };

  // Handle direction button clicks
  const handleDirectionClick = (newDirection) => {
    if (gameOver) return;

    // Prevent reverse movement
    if (
      (newDirection === DIRECTIONS.UP && lastDirectionRef.current === DIRECTIONS.DOWN) ||
      (newDirection === DIRECTIONS.DOWN && lastDirectionRef.current === DIRECTIONS.UP) ||
      (newDirection === DIRECTIONS.LEFT && lastDirectionRef.current === DIRECTIONS.RIGHT) ||
      (newDirection === DIRECTIONS.RIGHT && lastDirectionRef.current === DIRECTIONS.LEFT)
    ) {
      return;
    }

    setDirection(newDirection);
    lastDirectionRef.current = newDirection;
  };

  // Handle speed change
  const handleSpeedChange = (event, newValue) => {
    setSpeed(400 - newValue); // Invert value to increase speed as slider moves right
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Snake Game
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Classic Snake game. Use arrow keys to control the snake's movement and eat food to increase length and score.
      </Typography>

  

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2,
                  position: 'relative'
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  style={{
                    border: '2px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa'
                  }}
                />

                {/* Pause Overlay */}
                {paused && !gameOver && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      borderRadius: '4px',
                      color: 'white'
                    }}
                  >
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Game Paused
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => setPaused(false)}
                    >
                      Start Game
                    </Button>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Button
                  variant="contained"
                  color={paused ? 'primary' : 'secondary'}
                  startIcon={paused ? <PlayArrowIcon /> : <PauseIcon />}
                  onClick={() => setPaused(prev => !prev)}
                  sx={{ mr: 1 }}
                  disabled={gameOver}
                >
                  {paused ? 'Start' : 'Pause'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ReplayIcon />}
                  onClick={resetGame}
                >
                  Restart
                </Button>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mt: 2
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleDirectionClick(DIRECTIONS.UP)}
                    disabled={gameOver || paused}
                  >
                    <KeyboardArrowUpIcon fontSize="large" />
                  </IconButton>
                </Box>
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => handleDirectionClick(DIRECTIONS.LEFT)}
                    disabled={gameOver || paused}
                  >
                    <KeyboardArrowLeftIcon fontSize="large" />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleDirectionClick(DIRECTIONS.DOWN)}
                    disabled={gameOver || paused}
                    sx={{ mx: 2 }}
                  >
                    <KeyboardArrowDownIcon fontSize="large" />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleDirectionClick(DIRECTIONS.RIGHT)}
                    disabled={gameOver || paused}
                  >
                    <KeyboardArrowRightIcon fontSize="large" />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Game Info
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  Current Score: <strong>{score}</strong>
                </Typography>
                <Typography variant="subtitle1">
                  High Score: <strong>{highScore}</strong>
                </Typography>
                <Typography variant="subtitle1">
                  Snake Length: <strong>{snake.length}</strong>
                </Typography>
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                Game Speed:
              </Typography>
              <Slider
                value={400 - speed}
                min={50}
                max={350}
                onChange={handleSpeedChange}
                aria-labelledby="speed-slider"
                valueLabelDisplay="auto"
                valueLabelFormat={value => `${Math.round(400 - value)}ms`}
                disabled={!paused}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={gridVisible}
                    onChange={() => setGridVisible(prev => !prev)}
                  />
                }
                label="Show Grid"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Game Instructions
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Typography variant="body2" paragraph>
                • Use arrow keys to control the snake's direction
              </Typography>
              <Typography variant="body2" paragraph>
                • You can also use the on-screen direction buttons
              </Typography>
              <Typography variant="body2" paragraph>
                • Eating red food increases score and snake length
              </Typography>
              <Typography variant="body2" paragraph>
                • Colliding with walls or yourself ends the game
              </Typography>
              <Typography variant="body2" paragraph>
                • Press space to pause/resume the game
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Game Over Dialog */}
      <Dialog
        open={gameOverDialogOpen}
        onClose={() => setGameOverDialogOpen(false)}
        aria-labelledby="game-over-dialog-title"
      >
        <DialogTitle id="game-over-dialog-title">
          Game Over!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your Score: {score}
            {score > highScore && " (New High Score!)"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGameOverDialogOpen(false)} color="primary">
            Close
          </Button>
          <Button onClick={resetGame} color="primary" autoFocus>
            Play Again
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
