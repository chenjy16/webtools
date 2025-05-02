import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme // Import useTheme for styling if needed later
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';



// Game Constants
const GRID_SIZE = 4; // 4x4 Grid
const CELL_SIZE = 80; // Cell size in pixels
const CELL_GAP = 10; // Gap between cells in pixels

export default function Game2048() {
  // Game State
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOverDialogOpen, setGameOverDialogOpen] = useState(false);
  const [gameWonDialogOpen, setGameWonDialogOpen] = useState(false);

  // Color Mapping
  const tileColors = {
    0: { background: '#cdc1b4', text: '#776e65' },
    2: { background: '#eee4da', text: '#776e65' },
    4: { background: '#ede0c8', text: '#776e65' },
    8: { background: '#f2b179', text: '#f9f6f2' },
    16: { background: '#f59563', text: '#f9f6f2' },
    32: { background: '#f67c5f', text: '#f9f6f2' },
    64: { background: '#f65e3b', text: '#f9f6f2' },
    128: { background: '#edcf72', text: '#f9f6f2' },
    256: { background: '#edcc61', text: '#f9f6f2' },
    512: { background: '#edc850', text: '#f9f6f2' },
    1024: { background: '#edc53f', text: '#f9f6f2' },
    2048: { background: '#edc22e', text: '#f9f6f2' },
    4096: { background: '#3c3a32', text: '#f9f6f2' },
    8192: { background: '#3c3a32', text: '#f9f6f2' }
    // Add more styles if needed
  };

  // Initialize Game
  const initializeGame = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(true);
    setGameOverDialogOpen(false); // Close dialogs on restart
    setGameWonDialogOpen(false);
  }, []); // Empty dependency array as it has no external dependencies

  // Load High Score from Local Storage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('2048HighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10) || 0); // Ensure parsing is valid
    }
    // Initialize the game on first load if not already started
    // This could be triggered by a button instead if preferred
    if (!gameStarted) {
        initializeGame();
    }
  }, [initializeGame, gameStarted]); // Add initializeGame and gameStarted as dependencies

  // Add Random Tile to the Grid
  const addRandomTile = (currentGrid) => {
    const emptyCells = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (currentGrid[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentGrid[row][col] = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4
    }
    return currentGrid; // Return the modified grid (mutated in place)
  };

  // Check if Game Over
  const checkGameOver = (currentGrid) => {
    // Check for empty cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (currentGrid[i][j] === 0) return false;
      }
    }
    // Check for possible merges
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const value = currentGrid[i][j];
        // Check right neighbor
        if (j < GRID_SIZE - 1 && value === currentGrid[i][j + 1]) return false;
        // Check bottom neighbor
        if (i < GRID_SIZE - 1 && value === currentGrid[i + 1][j]) return false;
      }
    }
    // If no empty cells and no merges possible, game is over
    return true;
  };

  // Check if Game Won (Reached 2048)
  const checkGameWon = (currentGrid) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (currentGrid[i][j] === 2048) {
          return true;
        }
      }
    }
    return false;
  };

  // Move and Merge Tiles
  const moveTiles = useCallback((direction) => {
    if (gameOver || !gameStarted) return;

    let moved = false;
    let currentScore = 0; // Score added in this move
    const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy

    // Helper function to compress and merge a single row/column
    const compressAndMerge = (line) => {
        // 1. Filter out zeros
        let filteredLine = line.filter(val => val !== 0);
        let newLine = [];
        let merged = false; // Track merges within this line processing

        // 2. Merge adjacent equal tiles
        for (let i = 0; i < filteredLine.length; i++) {
            if (i + 1 < filteredLine.length && filteredLine[i] === filteredLine[i + 1]) {
                const mergedValue = filteredLine[i] * 2;
                newLine.push(mergedValue);
                currentScore += mergedValue; // Add merged value to score for this move
                i++; // Skip the next tile as it has been merged
                moved = true; // Mark that a merge happened
                merged = true;
            } else {
                newLine.push(filteredLine[i]);
            }
        }

        // 3. Check if only filtering/shifting happened (moved without merging)
        if (!merged && filteredLine.length !== line.filter(v=>v!==0).length) {
            moved = true;
        }
         if (!moved && filteredLine.length !== line.length && filteredLine.length > 0) {
             // This addresses the case where zeros were filtered out but no merge happened
             // e.g. [0, 2, 0, 4] -> [2, 4] should count as moved
             moved = true;
         }


        // 4. Pad with zeros to the correct length
        while (newLine.length < GRID_SIZE) {
            newLine.push(0);
        }
        return newLine;
    };

    // Process grid based on direction
    if (direction === 'left') {
      for (let i = 0; i < GRID_SIZE; i++) {
        const originalRow = [...newGrid[i]]; // Copy original row for comparison
        newGrid[i] = compressAndMerge(newGrid[i]);
        if (JSON.stringify(originalRow) !== JSON.stringify(newGrid[i])) {
            moved = true;
        }
      }
    } else if (direction === 'right') {
      for (let i = 0; i < GRID_SIZE; i++) {
        const originalRow = [...newGrid[i]];
        const reversedRow = [...newGrid[i]].reverse();
        const processedReversed = compressAndMerge(reversedRow);
        newGrid[i] = processedReversed.reverse();
        if (JSON.stringify(originalRow) !== JSON.stringify(newGrid[i])) {
            moved = true;
        }
      }
    } else if (direction === 'up') {
      for (let j = 0; j < GRID_SIZE; j++) {
        let column = [];
        for (let i = 0; i < GRID_SIZE; i++) column.push(newGrid[i][j]);
        const originalColumn = [...column];
        const newColumn = compressAndMerge(column);
        for (let i = 0; i < GRID_SIZE; i++) newGrid[i][j] = newColumn[i];
         if (JSON.stringify(originalColumn) !== JSON.stringify(newColumn)) {
             moved = true;
         }
      }
    } else if (direction === 'down') {
      for (let j = 0; j < GRID_SIZE; j++) {
        let column = [];
        for (let i = 0; i < GRID_SIZE; i++) column.push(newGrid[i][j]);
        const originalColumn = [...column];
        const reversedColumn = [...column].reverse();
        const processedReversed = compressAndMerge(reversedColumn);
        const newColumn = processedReversed.reverse();
        for (let i = 0; i < GRID_SIZE; i++) newGrid[i][j] = newColumn[i];
         if (JSON.stringify(originalColumn) !== JSON.stringify(newColumn)) {
             moved = true;
         }
      }
    }

    // If tiles actually moved or merged
    if (moved) {
      addRandomTile(newGrid); // Add a new tile
      setGrid(newGrid); // Update the grid state
      setScore(prevScore => { // Update score
          const newTotalScore = prevScore + currentScore;
          if (newTotalScore > highScore) { // Update high score if needed
              setHighScore(newTotalScore);
              localStorage.setItem('2048HighScore', newTotalScore.toString());
          }
          return newTotalScore;
      });

      // Check win/loss conditions
      if (checkGameWon(newGrid) && !gameWon) {
        setGameWon(true);
        setGameWonDialogOpen(true);
      } else if (checkGameOver(newGrid)) {
        setGameOver(true);
        setGameOverDialogOpen(true);
      }
    }
  }, [gameOver, gameStarted, grid, score, highScore, gameWon]); // Include all relevant state dependencies

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted || gameOver || gameOverDialogOpen || gameWonDialogOpen) return; // Ignore input if inactive

      let direction = null;
      switch (e.key) {
        case 'ArrowUp':
        case 'w': // Optional WASD support
          direction = 'up';
          break;
        case 'ArrowDown':
        case 's':
          direction = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
          direction = 'left';
          break;
        case 'ArrowRight':
        case 'd':
          direction = 'right';
          break;
        default:
          return;
      }
      e.preventDefault(); // Prevent page scroll
      moveTiles(direction);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // Rerun if dependencies change, especially moveTiles
  }, [gameStarted, gameOver, gameOverDialogOpen, gameWonDialogOpen, moveTiles]);

  // Render Cell
  const renderCell = (value, row, col) => {
    const { background, text } = tileColors[value] || tileColors[0]; // Get color info
    const fontSize = value >= 1024 ? '1.5rem' : value >= 128 ? '1.8rem' : '2rem'; // Adjust font size dynamically

    return (
      <Box
        key={`cell-${row}-${col}`}
        sx={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          backgroundColor: background,
          color: text,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 1, // Slightly rounded corners
          fontWeight: 'bold',
          fontSize: fontSize,
          userSelect: 'none', // Prevent text selection
          // Add transitions for smooth appearance (optional)
          transition: 'background-color 0.1s ease-in-out, color 0.1s ease-in-out, transform 0.1s ease-in-out',
          // Example animation hint (needs more state tracking for merge/appear)
          // transform: 'scale(1)',
          // '&.tile-new': { transform: 'scale(1.1)' },
          // '&.tile-merged': { animation: 'pop 0.2s ease' }
        }}
      >
        {value !== 0 ? value : ''}
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: { xs: 1, sm: 2 } }}> {/* Constrained width */}
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        2048 Game
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph align="center">
        Use arrow keys or buttons to move the tiles. Tiles with the same number merge. Try to reach the 2048 tile!
      </Typography>



      <Card sx={{ mb: 4, mt: 1, boxShadow: 3, borderRadius: 2 }}> {/* Use Card for better grouping */}
        <CardContent>
          {/* Score and Controls */}
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'baseline' }}>
                <Box textAlign="center">
                    <Typography variant="button" display="block" color="text.secondary">Score</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{score}</Typography>
                </Box>
                <Box textAlign="center">
                     <Typography variant="button" display="block" color="text.secondary">High Score</Typography>
                     <Typography variant="h5" sx={{ fontWeight: 'medium' }}>{highScore}</Typography>
                 </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', justifyContent: {xs: 'center', sm:'flex-end'}, gap: 1 }}>
                <Button
                  variant="contained"
                  color={!gameStarted || gameOver || gameWon ? "primary" : "secondary"} // Primary for Start, Secondary for Restart
                  size="large"
                  startIcon={!gameStarted || gameOver || gameWon ? <PlayArrowIcon /> : <ReplayIcon />}
                  onClick={initializeGame}
                >
                  {!gameStarted || gameOver || gameWon ? 'Start Game' : 'Restart Game'}
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Game Grid Area */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column', // Stack grid and controls
              my: 2
            }}
          >
            {/* Grid Background */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                gap: `${CELL_GAP}px`,
                backgroundColor: '#bbada0', // Grid background color
                p: `${CELL_GAP}px`, // Padding around cells
                borderRadius: '6px', // Rounded corners for the grid
                position: 'relative', // For potential future animations/overlays
                mb: 3 // Margin below grid
              }}
            >
              {/* Render Grid Cells */}
              {grid.length > 0 ? grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
              ) : // Render empty grid initially or if state is empty
                Array(GRID_SIZE).fill().map((_, rowIndex) =>
                   Array(GRID_SIZE).fill().map((_, colIndex) => renderCell(0, rowIndex, colIndex))
                 )
              }
            </Box>

            {/* On-Screen Direction Controls (More compact) */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', mt: 2 }}> {/* Show only on small screens */}
              <IconButton color="primary" onClick={() => moveTiles('up')} disabled={!gameStarted || gameOver}>
                <KeyboardArrowUpIcon fontSize="large" />
              </IconButton>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <IconButton color="primary" onClick={() => moveTiles('left')} disabled={!gameStarted || gameOver}>
                  <KeyboardArrowLeftIcon fontSize="large" />
                </IconButton>
                <IconButton color="primary" onClick={() => moveTiles('down')} disabled={!gameStarted || gameOver}>
                  <KeyboardArrowDownIcon fontSize="large" />
                </IconButton>
                <IconButton color="primary" onClick={() => moveTiles('right')} disabled={!gameStarted || gameOver}>
                  <KeyboardArrowRightIcon fontSize="large" />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Instructions */}
          <Typography variant="body2" color="text.secondary">
            <strong>Tip:</strong> Use the keyboard arrow keys (or WASD) or the on-screen buttons to move the tiles. Tiles with the same number merge into their sum. Try to reach the <strong>2048</strong> tile to win the game!
          </Typography>
        </CardContent>
      </Card>

      {/* Game Over Dialog */}
      <Dialog
        open={gameOverDialogOpen}
        onClose={() => setGameOverDialogOpen(false)}
        aria-labelledby="game-over-dialog-title"
      >
        <DialogTitle id="game-over-dialog-title" sx={{ textAlign: 'center', fontWeight: 'bold' }}>Game Over!</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText>
            Your final score is: <Typography component="span" variant="h6" color="primary">{score}</Typography>
          </DialogContentText>
          {score >= highScore && score > 0 && // Check if score is actually the high score
            <DialogContentText sx={{ color: 'secondary.main', fontWeight: 'medium', mt: 1 }}>
              New High Score!
            </DialogContentText>
          }
           <DialogContentText sx={{ mt: 1, fontSize: '0.9rem' }}>
             Current High Score: {highScore}
           </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
          <Button onClick={() => setGameOverDialogOpen(false)} variant="outlined">Close</Button>
          <Button onClick={initializeGame} color="primary" variant="contained" autoFocus startIcon={<ReplayIcon />}>
            Play Again
          </Button>
        </DialogActions>
      </Dialog>

      {/* Game Won Dialog */}
      <Dialog
        open={gameWonDialogOpen}
        onClose={() => setGameWonDialogOpen(false)}
        aria-labelledby="game-won-dialog-title"
      >
        <DialogTitle id="game-won-dialog-title" sx={{ textAlign: 'center', fontWeight: 'bold', color: 'success.dark' }}>Congratulations, You Won!</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <DialogContentText>
            You successfully created the 2048 tile! Your score is: <Typography component="span" variant="h6" color="primary">{score}</Typography>
          </DialogContentText>
          {score > highScore && // Show only if it's a *new* high score
            <DialogContentText sx={{ color: 'secondary.main', fontWeight: 'medium', mt: 1 }}>
              New High Score!
            </DialogContentText>
          }
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 1 }}>
          <Button onClick={() => setGameWonDialogOpen(false)} variant="outlined">Keep Playing</Button>
          <Button onClick={initializeGame} color="primary" variant="contained" startIcon={<ReplayIcon />}>
            Restart Game
          </Button>
        </DialogActions>
      </Dialog>

  
    </Box>
  );
}